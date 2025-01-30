import type {BluetoothProfile} from "./Profile";
import by = $derived.by;

const MTU = 120; // magic value, i picked it because i like it
const READ_TIMEOUT = 5000;

export class EigenProfile implements BluetoothProfile {
    readCharacteristic?: BluetoothRemoteGATTCharacteristic
    writeCharacteristic?: BluetoothRemoteGATTCharacteristic

    promiseAcceptor?: (val: unknown) => void;
    message: string = "";
    queuedMessages: string[] = [];
    lastReceive: number = 0;

    async init(device: BluetoothDevice) {
        if (device.gatt == null || !device.gatt.connected) {
            return
        }
        let gatt = device.gatt;

        let svc = await gatt.getPrimaryService("0000fff0-0000-1000-8000-00805f9b34fb");
        this.readCharacteristic = await svc.getCharacteristic("0000fff1-0000-1000-8000-00805f9b34fb")
        this.writeCharacteristic = await svc.getCharacteristic("0000fff2-0000-1000-8000-00805f9b34fb")

        await this.readCharacteristic.startNotifications();
        this.readCharacteristic.addEventListener("characteristicvaluechanged", this.notifications)
    }

    async putUDS(data: string): Promise<string> {
        if (this.writeCharacteristic == null)
            throw "Write characteristic is null.";

        let enc = new TextEncoder();
        let encoded = enc.encode(data);
        let array = new Uint8Array(encoded.length + 1)
        array.set(encoded, 0);
        array[encoded.length] = 0x0d;

        let temp = new Uint8Array(0);
        do {
            temp = array.slice(0, MTU);
            array = array.slice(MTU);
            await this.writeCharacteristic.writeValueWithResponse(temp).catch(a => {throw ("Write failed: " + a)});
            console.log("Wrote " + [...temp])
        } while (array.length != 0)
        console.log("Write success, awaiting read...");
        let readData: string = await new Promise(async (acc1, rej1) => {
            let done = false;
            let prev = -1;

            let out = new Uint8Array(0);

            const timeoutFunc = () => {
                let storedReceive = this.lastReceive;
                return () => {
                    if (this.lastReceive != storedReceive) {
                        prev = setTimeout(timeoutFunc, READ_TIMEOUT);
                        return;
                    }
                    rej1("Read timeout")
                }
            }
            prev = setTimeout(timeoutFunc, READ_TIMEOUT);

            if (this.queuedMessages.length == 0)
                await new Promise((acc, rej) => {
                    this.promiseAcceptor = acc;
                })

            if (prev != -1) {
                clearTimeout(prev);
            }
            acc1(this.queuedMessages.splice(0, 1)[0]);
        });
        delete this.promiseAcceptor;
        // ok at this point we should have data or we're cooked.

        console.log(readData) // hi

        return readData
    }

    private notifications(ev: Event) {
        this.lastReceive++;
        // @ts-ignore
        let bytesRaw: Uint8Array = ev.target.value;
        let decoder = new TextDecoder();
        let string = decoder.decode(bytesRaw);

        this.message += string;
        if (string.endsWith(">")) {
            this.queuedMessages.push(this.message);
            this.message = "";
        }

        if (this.promiseAcceptor != null) {
            this.promiseAcceptor(null);
        }
    }
}