export namespace ConnectionManager {
    export let CURRENT_CONNECTION: Connection | null | undefined = null;
    // @ts-ignore debug environment
    window.cm = ConnectionManager;
    export interface Connection {
        putUDS(data: string): Promise<string>
    }
}