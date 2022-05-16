import { T_account, T_addr, T_item } from "../types";

export default interface Cache {
  get(addr: T_addr): T_account | undefined;
  find(uniqueHandle: string): T_account | undefined;
  hydrate(addr: T_addr, account?: T_account): void;
  
  // dev/debug purpose only
  reset(): void;  
  dump(): string | Map<string, T_item>;
}