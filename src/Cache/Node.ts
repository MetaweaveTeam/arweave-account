import { ArAccount, T_addr, T_item } from '../types';
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
import CacheAPI from './CacheAPI';
import Data from '../data';

export default class Memory implements CacheAPI {
  private store: Map<string, T_item> = new Map<string, T_item>();
  private expirationTime: number;
  private size: number;
  private data: Data;

  constructor(size: number, expirationTime: number, gatewayConfig: GatewayConfig) {
    this.expirationTime = expirationTime;
    this.size = size;
    this.data = new Data(gatewayConfig);
  }

  get(addr: T_addr) {
    const item = this.store.get(addr);
    if (item && Date.now() < item.timestamp + this.expirationTime){
      const result = this.store.get(addr)?.account;
      if(result)
        return result;
      else if(result === null)
        return this.data.getDefaultAccount(addr);
    }
  }

  find(uniqueHandle: string) {
    for (const [addr, item] of this.store) {
      const handle = item.account?.profile?.handleName;
      if (uniqueHandle === handle && Date.now() < item.timestamp + this.expirationTime) return item.account;
    }
  }

  hydrate(addr: T_addr, account?: ArAccount) {
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
