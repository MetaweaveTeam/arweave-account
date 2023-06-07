import { ArAccount, T_addr, T_item } from '../types';
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
import CacheAPI from './CacheAPI';
export default class Memory implements CacheAPI {
    private store;
    private expirationTime;
    private size;
    private data;
    constructor(size: number, expirationTime: number, gatewayConfig: GatewayConfig);
    get(addr: T_addr): ArAccount | undefined;
    find(uniqueHandle: string): ArAccount | null | undefined;
    hydrate(addr: T_addr, account?: ArAccount): void;
    reset(): void;
    dump(): Map<string, T_item>;
}
