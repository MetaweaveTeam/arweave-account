import { T_account, T_addr, T_item } from "../types";

export default class Memory {
  private store: Map<string, T_item> = new Map<string, T_item>();
  private isActivated: boolean;
  private expirationTime: number;
  private size: number;

  constructor(isActivated: boolean, size: number, expirationTime: number) {
    this.isActivated = isActivated;
    this.expirationTime = expirationTime;
    this.size = size;
  };

  // private keys(): string[] {
  //   let array: string[] = [];
  //   this.store.forEach((value, key, map) => {
  //     array.push(key)
  //   });
  //   return array;
  // }

  get(addr: T_addr) {

  };

  find(uniqueHandle: string) {};
  hydrate(addr: T_addr, account?: T_account) {
    console.log(`'${addr} is hydrated'`);
    let item: T_item = {
      timestamp: Date.now(),
      addr: addr,
      account: account ? account : null,
    };

    // hydrate account data
    this.store.set(item.addr, item);

    if(this.store.size >= this.size){
      this.store.delete(this.store.keys().next().value)
    }
  };
  reset() {
    this.store.clear();
  };
  dump() {
    return this.store;
  };
}