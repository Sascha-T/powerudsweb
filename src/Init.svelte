<script lang="ts">
    import Error from "./lib/Error.svelte";
    import App from "./App.svelte";

    let http = location.protocol === "http:";
    let available = navigator.serial !== undefined;

</script>

<main>
    {#if !available}
        {#if http}
            <Error title="Serial API unavailable." message="You are not accessing this page over HTTPS, which is why the Web Serial API is unavailable." link="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API"/>
        {:else}
            <Error title="Serial API unavailable." message="Your browser does not support the Web Serial API." link="https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility"  />
        {/if}
    {:else}
        <App />
    {/if}
</main>

<style>

</style>
