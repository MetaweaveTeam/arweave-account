import { ArAccount, T_addr, T_item } from '../types';
import LocalStorage from './LocalStorage';
import Data from '../data';

export default class Memory extends LocalStorage {
  private store: Map<string, T_item> = new Map<string, T_item>();

  constructor(size: number, expirationTime: number) {
    super(size, expirationTime);
  }

  get(addr: T_addr) {
    const item = this.store.get(addr);
    if (item && Date.now() < item.timestamp + this.expirationTime){
      const result = this.store.get(addr)?.account;
      if(result)
        return result;
      else if(result === null)
        return Data.getDefaultAccount(addr);
    }
  }

  find(uniqueHandle: string) {
    for (const [addr, item] of this.store) {
      const handle = item.account?.profile?.handleName;
      if (uniqueHandle === handle && Date.now() < item.timestamp + this.expirationTime) return item.account;
    }
  }

  hydrate(account: ArAccount) {
    const item: T_item = {
      timestamp: Date.now(),
      addr: account.addr,
      account
    };

    // add or hydrate account data
    this.store.set(item.addr, item);

    if (this.store.size >= this.size) this.store.delete(this.store.keys().next().value);
  }

  reset() {
    this.store.clear();
  }
  dump() {
    return JSON.stringify(this.store);
  }
}
