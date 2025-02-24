<script lang="ts">
    import {ConnectionManager} from "../ConnectionManager";
    import {getProfile} from "./Profile";

    const device: { device: BluetoothDevice | null } = $state({device: null});

    async function bluetoothChoose() {
        device.device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["0000fff0-0000-1000-8000-00805f9b34fb"]
        });
    }

    function format(str: string | undefined) {
        if (str == null)
            str = "Name unavailable."
        return str;
    }

    async function onclick() {
        ConnectionManager.setConnection(await getProfile(device.device as BluetoothDevice));
    }
</script>
<main>
    <button onclick={bluetoothChoose}>
        Pick a Bluetooth 4.0+ device...
    </button>
    <div id="connBoxHr">
        <hr>
    </div>
    <div class="connBoxContent">
        {#if device.device == null}
            No device selected
        {:else}
            <button onclick={onclick}>Use {format(device.device.name)}</button>
        {/if}
    </div>
</main>
<style>
    #connBoxHr {
        padding: 10px 5px 10px 10px;
    }
</style>