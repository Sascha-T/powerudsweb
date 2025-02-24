<script lang="ts">
    import Error from "./lib/Error.svelte";
    import Connection from "./lib/tools/connection/Connection.svelte";
    import Terminal from "./lib/tools/terminal/Terminal.svelte";

    /*import {BluetoothHandler} from "./uds/bluetoothHandler";
    const bt = new BluetoothHandler();*/
    const TOOLS = [
        {
            name: "Connection",
            tool: Connection
        },
        {
            name: "Terminal",
            tool: Terminal
        }
    ]
    const tool = $state({
        tool: TOOLS[0]
    });
    let classState = $state("")
    function sidebar() {
        console.log("A")
        if(classState != "")
            classState = "";
        else
            classState = "collapsed";
    }

    function selectTool(newTool: string) {
        return function() {
            tool.tool = newTool
            classState = "collapsed";
        }
    }


</script>

<main>
    <button id="sidebar-button" onclick={sidebar}>☰</button>
    <div id="main">
        <div id="sidebar" class={classState}>
            <p id="sidebarHeader">PowerUDS</p>
            <hr/>
            <div id="buttons">
                {#each TOOLS as toolX}
                    <button id={toolX.name === tool.tool.name ? "selected" : ""} class="tool" onclick={selectTool(toolX)}>{toolX.name}</button>
                {/each}
            </div>
        </div>
        <div id="selection">
            {#if tool.tool != null}
                {@const Data = tool.tool.tool}
                <Data />
            {/if}
        </div>
    </div>
</main>

<style>
    .tool {
        margin: 5px 0 5px 0;
        width: 80%;
    }

    #selected {
        background: #2e2e2e;
    }

    #buttons {
        padding: 0 0 10px 0;
    }

    #sidebar {
        z-index: 101;
        left: 0;
        padding: 20px;
        background: #3c3c3c;
        box-shadow: 5px 5px 6px 0px #000000;
    }

    #sidebarHeader {
        font-size: 48px;
        line-height: 48px;
        margin: 0;
    }

    #main {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: stretch;
        align-content: stretch;
    }

    #selection {
        flex: 1;
    }

    #sidebar-button {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
    }

    @media only screen and (max-width: 1000px) {
        #sidebar {
            position: fixed;
            z-index: 100;
            height: 100vh;

            transition: left 0.5s;
        }

        .collapsed {
            left: -100% !important;
        }

        #sidebar-button {
            display: block;
        }
    }
</style>