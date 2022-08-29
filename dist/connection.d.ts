import { Connection as SolanaConnection } from "@solana/web3.js";
import type { RpcNetwork } from "@lumeweb/dht-rpc-client";
export default class Connection extends SolanaConnection {
  private _network;
  private _bypassCache;
  constructor(network: RpcNetwork, bypassCache?: boolean);
  __rpcRequest(methodName: string, args: any[]): Promise<any>;
}
