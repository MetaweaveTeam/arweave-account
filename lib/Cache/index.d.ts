import CacheAPI from './CacheAPI';
import { ArAccount, T_addr } from '../types';
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
export default class Cache implements CacheAPI {
    private cacheObj;
    private size;
    private expirationTime;
    private gatewayConfig;
    constructor(env: string | CacheAPI, size: number, expirationTime: number, gatewayConfig: GatewayConfig);
    private select;
    get: (addr: string) => ArAccount | undefined;
    find: (uniqueHandle: string) => ArAccount | null | undefined;
    hydrate: (addr: T_addr, account?: ArAccount) => any;
    reset: () => any;
    dump: () => any;
}
