import {ConnectionManager} from "../connection/ConnectionManager";
import {lines} from "./Terminal.svelte";
import {getKey} from "../../external/seedkey";

async function handleData(cmd: string): Promise<string> {
    try {
        lines.push({
            text: "< " + cmd
        })
        return await new Promise((res, rej) => {
            ConnectionManager.getConnection()!!.execute(cmd).then((data) => {
                lines.push({
                    text: "> " + data
                })
                res(data);
            }).catch((err) => {
                lines.push({
                    text: "# " + err,
                    color: "red"
                })
                rej();
            })
        })
    } catch (e) {
        lines.push({
            text: "## " + e,
            color: "red"
        })
        throw "Failed";
    }
}

export const COMMANDS: { [t: string]: (text: string) => Promise<void> } = {
    "unlock": async function (text: string) {
        await handleData("1003");
        let unlockRequest = await handleData("2703");
        if(!unlockRequest.startsWith("6703")) {
            throw "No unlocking response...";
        }
        let data = getKey(unlockRequest.substring(4), text);
        let unlockReply = await handleData("2704" + data);
        if (!unlockReply.startsWith("6704")) {
            throw "Unlocking unsuccessful.";
        }
    }
}

async function handleCommand(cmd: string) {
    let data = cmd.substring(1).split(" ");
    let args = data.slice(1).join(" ");
    let command = data[0];

    if(COMMANDS[command] == null) {
        throw "Command not found";
    } else {
        await COMMANDS[command](args);
    }
}

export async function handleText(cmd: string) {
    try {
        if (cmd.startsWith(".")) {
            await handleCommand(cmd);
        } else {
            await handleData(cmd);
        }
    } catch (e) {
        lines.push({
            text: "## " + e,
            color: "red"
        })
    }
}