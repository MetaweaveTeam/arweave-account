import { ArAccount, T_addr } from '../types';
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
import Cache from './CacheAPI';
export default class LocalStorage implements Cache {
    private expirationTime;
    private size;
    private data;
    constructor(size: number, expirationTime: number, gatewayConfig: GatewayConfig);
    get(addr: T_addr): ArAccount | undefined;
    find(uniqueHandle: string): ArAccount | null | undefined;
    hydrate(addr: T_addr, account?: ArAccount): void;
    reset(): void;
    dump(): string;
}
