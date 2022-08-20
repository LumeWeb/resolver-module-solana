import { getIpfsRecord, NameRegistryState, } from "@bonfida/spl-name-service";
import Connection from "./connection.js";
import { AbstractResolverModule, DNS_RECORD_TYPE, getSld, resolverEmptyResponse, resolverError, resolveSuccess, } from "@lumeweb/libresolver";
import { getDomainKey } from "@bonfida/spl-name-service";
export default class Solana extends AbstractResolverModule {
    async resolve(domain, options, bypassCache) {
        if (!this.isTldSupported(domain)) {
            return resolverEmptyResponse();
        }
        const connection = new Connection(this.resolver.rpcNetwork, bypassCache);
        const records = [];
        if ([DNS_RECORD_TYPE.CONTENT, DNS_RECORD_TYPE.TEXT].includes(options.type)) {
            let ipfs;
            try {
                ipfs = await getIpfsRecord(connection, getSld(domain));
            }
            catch (e) {
                return resolverError(e);
            }
            let data = ipfs.data.toString("utf-8");
            if (ipfs.data?.length) {
                records.push({ type: DNS_RECORD_TYPE.CONTENT, value: data });
            }
            let content;
            try {
                const { pubkey } = await getDomainKey(domain);
                let { registry } = await NameRegistryState.retrieve(connection, pubkey);
                const idx = registry.data?.indexOf(0x00);
                registry.data = registry.data?.slice(0, idx);
                content = registry;
            }
            catch (e) {
                return resolverError(e);
            }
            data = ipfs.data.toString("utf-8");
            if (ipfs.data?.length) {
                records.push({ type: DNS_RECORD_TYPE.CONTENT, value: data });
            }
        }
        if (0 < records.length) {
            return resolveSuccess(records);
        }
        return resolverEmptyResponse();
    }
    getSupportedTlds() {
        return ["sol"];
    }
}
