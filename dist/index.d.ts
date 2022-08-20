import { AbstractResolverModule } from "@lumeweb/libresolver";
import { DNSResult, ResolverOptions } from "@lumeweb/libresolver/src/types.js";
export default class Solana extends AbstractResolverModule {
  resolve(
    domain: string,
    options: ResolverOptions,
    bypassCache: boolean
  ): Promise<DNSResult>;
  getSupportedTlds(): string[];
}
