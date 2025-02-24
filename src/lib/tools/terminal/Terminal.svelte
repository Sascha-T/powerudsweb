<script module lang="ts">
    import {ConnectionManager} from "../connection/ConnectionManager";
    import {handleText} from "./CommandHandler";

    interface Line {
        color?: string,
        text: string
    }

    let inputValue = $state("");
    export let lines: Line[] = $state([{
        color: "yellow",
        text: ">> This is the beginning of your communication with an ECU"
    }])

    function keypress(ev: KeyboardEvent) {
        if (ev.key == "Enter") {
            ev.preventDefault();
            enter();
        }
    }

    function enter() {
        let command = $state.snapshot(inputValue);
        inputValue = "";

        if (ConnectionManager.getConnection() != null) {
            handleText(command);
        } else {
            lines.push({
                text: "# No device connected",
                color: "red"
            })
        }
    }

</script>
<main id="terminal">
    <div id="terminalContent">
        {#each lines as line}
            <div class="line">
                <div class={"color-" + line.color}>{line.text}</div>
            </div>
        {/each}
    </div>
    <div id="inputBox">
        <input id="inputTerm" bind:value={inputValue} onkeypress={keypress}/>
        <button onclick={enter}>Send</button>
    </div>
</main>
<style>
    .color-yellow {
        color: #ffea00;
    }

    .color-red {
        color: #ff0000
    }

    .line {
        text-align: left;
        margin: 0 !important;
        margin-block-start: 0;
        margin-block-end: 0;
        line-height: 16px;
    }

    #inputTerm {
        width: 70%;
    }

    #terminal {
        width: 100%;
        height: 100%;

        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
    }

    @media only screen and (max-width: 1000px) {
        #terminal {
            flex-direction: column-reverse;
        }
    }

    #terminalContent {
        flex: 1;
        margin: 10px 0 0 20px;
    }
</style>