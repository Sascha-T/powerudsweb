import {EigenProfile} from "./bluetooth/EigenProfile";

export namespace ConnectionManager {
    let CURRENT_CONNECTION: Connection | null = null;
    export async function setConnection(c: Connection) {
        window.localStorage.setItem("lastConnection", await c.save());
    }
    export function getConnection(): Connection | null {
        return CURRENT_CONNECTION;
    }
    // @ts-ignore debug environment
    window.cm = ConnectionManager;
    export interface Connection {
        putUDS(data: string): Promise<string>

        save(): Promise<string>
        load(text: string): Promise<void>
    }

    let loading: {[a: string]: () => Connection} = {
        "eigen": () => new EigenProfile()
    }
    async function load(item: string): Promise<Connection> {
        let key = item.split(":")[0];
        let type = (loading[key])();
        type.load(item);
        return type;
    }
    export async function init() {
        if(window.localStorage.getItem("lastConnection") != null)
            await setConnection(await load(window.localStorage.getItem("lastConnection") as string));
    }
}