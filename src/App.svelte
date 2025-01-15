<script lang="ts">
    import Error from "./lib/Error.svelte";

    const PORTS: SerialPort[] = $state([]);
    {
        navigator.serial.addEventListener("connect", (e) => {
            PORTS.push(e.target as SerialPort);
        })
        navigator.serial.addEventListener("disconnect", (e) => {
            for (let a in PORTS) {
                if (PORTS[a] == e.target)
                    delete PORTS[a];
            }
        })
        navigator.serial.getPorts().then(a => PORTS.push(...a));
    }
    // get us all porst
    const active = $state(false);

    async function onclick() {
        await navigator.serial.requestPort()
        alert("Requested ports...")
    }
</script>

<main>
    {#if !active && PORTS.length === 0}
        <Error title="No port found."
               message="No available serial ports have been detected on your system. Please connect a compatible device.">
            <button {onclick}> Detect devices... </button>
        </Error>
    {:else}

    {/if}
</main>