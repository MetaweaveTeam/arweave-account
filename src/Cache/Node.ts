import { T_account, T_addr, T_item } from "../types";
import CacheAPI from "./CacheAPI";

export default class Memory implements CacheAPI {
  private store: Map<string, T_item> = new Map<string, T_item>();
  private expirationTime: number;
  private size: number;

  constructor(size: number, expirationTime: number) {
    this.expirationTime = expirationTime;
    this.size = size;
  };

  get(addr: T_addr) {
    return this.store.get(addr)?.account;
  };

  find(uniqueHandle: string) {
    console.log("Node.find()")
    for(const [addr, item] of this.store){
      const handle = item.account?.profile.handle;
      if(uniqueHandle === `${handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`)
        return item.account;
    }
  };

  hydrate(addr: T_addr, account?: T_account) {
    let item: T_item = {
      timestamp: Date.now(),
      addr: addr,
      account: account ? account : null,
    };

    // add or hydrate account data
    this.store.set(item.addr, item);

    if(this.store.size >= this.size)
      this.store.delete(this.store.keys().next().value);
  };
  reset() {
    this.store.clear();
  };
  dump() {
    return this.store;
  };
}