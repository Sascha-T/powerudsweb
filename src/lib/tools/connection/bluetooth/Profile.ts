import {EigenProfile} from "./EigenProfile";
import {ConnectionManager} from "../ConnectionManager";

export interface BluetoothProfile extends ConnectionManager.Connection {
    init(device: BluetoothDevice): Promise<void>;
    putUDS(data: string): Promise<string>
}

export async function getProfile(device: BluetoothDevice): Promise<BluetoothProfile> {
    // we do not support anything but the eigenprofile at this moment, so...
    let eigen = new EigenProfile();
    await eigen.init(device);
    return eigen;
}