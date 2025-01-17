<script lang="ts">
    import Error from "./lib/Error.svelte";
    import App from "./App.svelte";

    // support navigator.serial later maybe, and xs evo over local application or usb
    let http = location.protocol === "http:";
    let available = navigator.bluetooth !== undefined;

</script>

<main>
    {#if !available}
        {#if http}
            <Error title="Bluetooth API unavailable." message="You are not accessing this page over HTTPS, which is why the Web Bluetooth API is unavailable." link="https://developer.mozilla.org/de/docs/Web/API/Web_Bluetooth_API"/>
        {:else}
            <Error title="Bluetooth API unavailable." message="Your browser does not support the Web Bluetooth API." link="https://developer.mozilla.org/de/docs/Web/API/Web_Bluetooth_API#browser_compatibility"  />
        {/if}
    {:else}
        <App />
    {/if}
</main>

<style>

</style>
