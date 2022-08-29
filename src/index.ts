import {
  getHashedName,
  getIpfsRecord,
  getNameAccountKey,
  getRecord,
  NameRegistryState,
} from "@bonfida/spl-name-service";
import { PublicKey } from "@solana/web3.js";
import Connection from "./connection.js";
import { deserializeUnchecked } from "borsh";
import {
  AbstractResolverModule,
  DNS_RECORD_TYPE,
  DNSRecord,
  getSld,
  resolverEmptyResponse,
  resolverError,
  resolveSuccess,
  ensureUniqueRecords,
} from "@lumeweb/libresolver";
import { DNSResult, ResolverOptions } from "@lumeweb/libresolver/src/types.js";
import { getDomainKey } from "@bonfida/spl-name-service";

export default class Solana extends AbstractResolverModule {
  async resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult> {
    if (!this.isTldSupported(domain)) {
      return resolverEmptyResponse();
    }
    const connection = new Connection(
      this.resolver.rpcNetwork as any,
      bypassCache
    );

    let records: DNSRecord[] = [];

    if (
      [DNS_RECORD_TYPE.CONTENT, DNS_RECORD_TYPE.TEXT].includes(options.type)
    ) {
      let ipfs: NameRegistryState;

      try {
        ipfs = await getIpfsRecord(connection, getSld(domain));
      } catch (e: any) {
        return resolverError(e);
      }

      let data = (ipfs as any).data.toString("utf-8");

      if (ipfs.data?.length) {
        records.push({ type: DNS_RECORD_TYPE.CONTENT, value: data });
      }

      let content: NameRegistryState;

      try {
        const { pubkey } = await getDomainKey(domain);
        let { registry } = await NameRegistryState.retrieve(connection, pubkey);
        const idx = registry.data?.indexOf(0x00);
        registry.data = registry.data?.slice(0, idx);
        content = registry;
      } catch (e: any) {
        return resolverError(e);
      }

      data = (ipfs as any).data.toString("utf-8");

      if (ipfs.data?.length) {
        records.push({ type: DNS_RECORD_TYPE.CONTENT, value: data });
      }
    }

    records = ensureUniqueRecords(records);

    if (0 < records.length) {
      return resolveSuccess(records);
    }

    return resolverEmptyResponse();
  }

  getSupportedTlds(): string[] {
    return ["sol"];
  }
}
