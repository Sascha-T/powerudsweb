import type {BluetoothProfile} from "./Profile";
import by = $derived.by;

const MTU = 120; // magic value, i picked it because i like it
const READ_TIMEOUT = 5000;

export class EigenProfile implements BluetoothProfile {
    readCharacteristic?: BluetoothRemoteGATTCharacteristic
    writeCharacteristic?: BluetoothRemoteGATTCharacteristic

    promiseAcceptor?: (value: Uint8Array) => void;

    async init(device: BluetoothDevice) {
        if(device.gatt == null || !device.gatt.connected) {
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
        if(this.writeCharacteristic == null)
            throw "Why?";

        let enc = new TextEncoder();
        let encoded = enc.encode(data);
        let array = new Uint8Array(encoded.length + 1)
        array.set(encoded, 0);
        array[encoded.length] = 0x0d;

        let temp = new Uint8Array(0);
        do {
            temp = array.slice(0, MTU);
            array = array.slice(MTU);
            await this.writeCharacteristic.writeValueWithResponse(temp);
            console.log("Wrote " + [...temp])
        } while (array.length != 0)
        console.log("Write success, awaiting read...");
        let readData: Uint8Array = await new Promise(async (acc1, rej1) => {
            let done = false;
            let prev = -1;

            let out = new Uint8Array(0);

            while(!done) {
                console.log("New cycle")
                if(prev != -1) {
                    clearTimeout(prev);
                }
                setTimeout(() => {
                    console.log("Read timeout")
                    rej1()
                }, READ_TIMEOUT);

                let thiz = this;
                // await one instance of read
                let ret: Uint8Array = await new Promise((acc, rej) => {
                    console.log("The thing?")
                    thiz.promiseAcceptor = acc;
                    console.log(thiz);
                })

                console.log("Got: ")
                console.log(ret)

                let length = ret.length
                // parse it yuh
                if(ret[ret.length - 1] == 0x3E) { // prompt character
                    done = true;
                    length--;
                }

                let newOut = new Uint8Array(out.length + length);
                newOut.set(out, 0);
                for (let i = 0; i < length; i++) {
                    newOut[out.length + i] = ret[i];
                }
                // big shitcode moment but whatever
            }
            if(prev != -1) {
                clearTimeout(prev);
            }
            acc1(out);
        });
        delete this.promiseAcceptor;
        // ok at this point we should have data or we're cooked.

        console.log([...readData]) // hi

        return ""
    }

    private notifications(ev: Event) {
        // @ts-ignore
        let bytesRaw: Uint8Array = ev.target.value;

        // data
        console.log("debug1: ")
        console.log(bytesRaw)
        let decoder = new TextDecoder();
        let string = decoder.decode(bytesRaw);
        console.log("debug: " + string)
        // to data
        console.log("A: " + this.promiseAcceptor)
        console.log(this)

        if(this.promiseAcceptor != null) {
            this.promiseAcceptor(new Uint8Array(bytesRaw.buffer));
        }
    }
}