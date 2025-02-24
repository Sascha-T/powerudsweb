<script module lang="ts">
    import Bluetooth from "./bluetooth/Bluetooth.svelte";
    import ECU from "./ECU.svelte";

    export const state = $state({connected: false})
</script>
<main id="connection">
    <div class="connBox">
        <Bluetooth/>
    </div>
    <div class="connBox">
        <ECU/>
    </div>
</main>
<style>
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

    @media only screen and (max-width: 1000px) {
        #connection {
            flex-direction: column !important;
        }
    }

    .connBox {
        margin: 10px;
        padding: 20px;
        background: #2c2c2c;
        box-shadow: 5px 5px 6px 0px #000000;
        border-radius: 10px;
    }
</style>