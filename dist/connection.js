import { Connection as SolanaConnection } from "@solana/web3.js";
export default class Connection extends SolanaConnection {
    constructor(network, bypassCache = false) {
        super("http://0.0.0.0");
        this._bypassCache = bypassCache;
        // @ts-ignore
        this._network = network;
        // @ts-ignore
        this._rpcWebSocket.removeAllListeners();
        // @ts-ignore
        this._rpcRequest = this.__rpcRequest;
    }
    async __rpcRequest(methodName, args) {
        const req = this._network.wisdomQuery(methodName, "solana", args, this._bypassCache);
        const ret = await req.result;
        if (ret.error) {
            throw new Error(ret.error);
        }
        return ret.data;
    }
}
