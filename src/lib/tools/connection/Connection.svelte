<script lang="ts">
    import {ConnectionManager} from "./ConnectionManager";
    import {getProfile} from "./bluetooth/Profile";

    const device: {device: BluetoothDevice | null } = $state({device: null});
    async function bluetoothChoose() {
        device.device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["0000fff0-0000-1000-8000-00805f9b34fb"]
        });
    }
    function format(str: string | undefined) {
        if(str == null)
            str = "Name unavailable."
        return str;
    }
    async function onclick() {
        ConnectionManager.CURRENT_CONNECTION = await getProfile(device.device as BluetoothDevice);
    }
</script>
<main id="connection">
    <div id="connBox">
        <button onclick={bluetoothChoose}>
            Pick a Bluetooth 4.0+ device...
        </button>
        <div id="connBoxHr">
            <hr>
        </div>
        <div id="connBoxContent">
            {#if device.device == null}
                No device selected
            {:else}
                <button onclick={onclick}>Use {format(device.device.name)}</button>
            {/if}
        </div>
    </div>
</main>
<style>
    #connBoxHr {
        padding: 10px 5px 10px 10px;
    }
    #connection {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        align-content: stretch;
    }

    #connBox {
        padding: 20px;
        background: #2c2c2c;
        box-shadow: 5px 5px 6px 0px #000000;
    }
</style>