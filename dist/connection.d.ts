import { Connection as SolanaConnection } from "@solana/web3.js";
import { RpcNetwork } from "@lumeweb/kernel-libresolver";
export default class Connection extends SolanaConnection {
  private _network;
  private _bypassCache;
  constructor(network: RpcNetwork, bypassCache?: boolean);
  __rpcRequest(methodName: string, args: any[]): Promise<any>;
}
