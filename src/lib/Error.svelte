<script>
    const {title, message, link = null, children = null} = $props();
</script>
<main>
    <div id="centerer">
        <div id="centered">
            <div id="topContainer">
                <p id="title">
                    {title}
                </p>
                <hr/>
            </div>
            <p id="subtitle">
                {message}
            </p>
            {@render children?.()}
            {#if link != null}
                <a href={link}>Learn more...</a>
            {/if}
        </div>
    </div>
</main>
<style>
    #centerer {
        position: fixed;
        z-index: 9999999;

        left: 0;
        top: 0;

        width: 100vw;
        height: 100vh;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        align-content: stretch;

        background: #202020;
    }
    #centered {
        background: #323232;
        padding: 10px 50px 10px 50px;
        border-radius: 8px;
        border: 2px red solid;
        box-shadow: 13px 13px 14px -7px black;
        max-width: 15%;

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
    }
    hr {
        color: #ffffff;
    }

    @media (prefers-color-scheme: light) {
        #centerer {
            background: #f0f0f0;
        }
        #centered {
            background: #ffffff;
        }
        hr {
            color: #000000;
        }
    }
</style>