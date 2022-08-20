import { Connection as SolanaConnection } from "@solana/web3.js";
import pocketNetworks from "@lumeweb/pokt-rpc-endpoints";
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
        const req = this._network.query(methodName, pocketNetworks["solana-mainnet"], args, this._bypassCache);
        return req.result;
    }
}
