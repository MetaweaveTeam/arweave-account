import { ArAccount, T_addr, T_item } from '../types';
export default interface Cache {
    get(addr: T_addr): ArAccount | undefined;
    find(uniqueHandle: string): ArAccount | null | undefined;
    hydrate(addr: T_addr, account?: ArAccount): void;
    reset(): void;
    dump(): string | Map<string, T_item>;
}
