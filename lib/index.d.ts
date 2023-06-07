import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
import { ArAccount, T_addr, T_profile } from './types';
import { JWKInterface } from 'arweave/node/lib/wallet';
export { ArAccount, T_profile as ArProfile };
export default class Account {
    private arweave;
    private ardb;
    private data;
    private cache;
    private walletAddr;
    constructor({ cacheIsActivated, cacheSize, cacheTime, gateway, }?: {
        cacheIsActivated?: boolean | undefined;
        cacheSize?: number | undefined;
        cacheTime?: number | undefined;
        gateway?: GatewayConfig | undefined;
    });
    connect(jwk?: JWKInterface | 'use_wallet'): Promise<void>;
    updateProfile(profile: T_profile): Promise<import("arweave/node/lib/transaction").default>;
    get(addr: T_addr): Promise<ArAccount>;
    search(handle: string): Promise<ArAccount[]>;
    find(uniqueHandle: string): Promise<ArAccount | null>;
    debug: {
        resetCache: () => void;
        printCache: () => void;
    };
}
