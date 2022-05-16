import { T_account, T_addr, T_item } from '../types';
import CacheAPI from './CacheAPI';

export default class Memory implements CacheAPI {
  private store: Map<string, T_item> = new Map<string, T_item>();
  private expirationTime: number;
  private size: number;

  constructor(size: number, expirationTime: number) {
    this.expirationTime = expirationTime;
    this.size = size;
  }

  get(addr: T_addr) {
    const item = this.store.get(addr);
    if (item && Date.now() < item.timestamp + this.expirationTime) return this.store.get(addr)?.account;
  }

  find(uniqueHandle: string) {
    for (const [addr, item] of this.store) {
      const handle = item.account?.profile.handle;
      if (uniqueHandle === handle && Date.now() < item.timestamp + this.expirationTime) return item.account;
    }
  }

  hydrate(addr: T_addr, account?: T_account) {
    const item: T_item = {
      timestamp: Date.now(),
      addr,
      account: account ? account : null,
    };

    // add or hydrate account data
    this.store.set(item.addr, item);

    if (this.store.size >= this.size) this.store.delete(this.store.keys().next().value);
  }

  reset() {
    this.store.clear();
  }
  dump() {
    return this.store;
  }
}
