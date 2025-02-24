<script lang="ts">
    import {ConnectionManager} from "./ConnectionManager";
    import { state as state2 } from "./Connection.svelte";

    const getConnection = ConnectionManager.getConnection;

    let options = [
        ["PSA BMF", "752:652"],
        ["PSA INJ", "6A8:688"]
    ]

    let txh = $state("752");
    let rxh = $state("652");

    function getInitial() {
        if (getConnection() != null) {
            let sel = getConnection()!!.getSelected();
            let tx = sel[0] + ":" + sel[1];
            for (let option of options) {
                if (option[1] == tx) {
                    return option[0];
                }
            }
            txh = sel[0];
            rxh = sel[1];
        }
        return "custom";
    }

    let selected = $state(getInitial());

    function changeSelect() {
        if (getConnection() != null) {
            if(selected != "custom") {
                let sel = selected.split(":");
                getConnection()!!.select(sel[0], sel[1]);
            } else {
                getConnection()!!.select(txh, rxh);
            }
        }
    }
</script>
<main>
    Select the ECU
    <hr>
    <select disabled={!state2.connected} bind:value={selected} onchange={changeSelect} id="ecuSel">
        <option value="custom">Custom</option>
        {#each options as opt}
            <option value={opt[1]}>{opt[0]}</option>
        {/each}
    </select>
    {#if selected === "custom" && state2.connected}
        <br/>
        RXh
        <input id="txh" bind:value={txh}/> <br/>
        TXh
        <input id="rxh" bind:value={rxh}/> <br/>
        <button onclick={changeSelect}>Select</button>
    {/if}
</main>