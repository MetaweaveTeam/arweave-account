import { T_item, ArAccount, T_addr } from '../types';
import Cache from './CacheAPI';
import Data from '../data';

export default class LocalStorage implements Cache {
  private expirationTime: number;
  private size: number;

  constructor(size: number, expirationTime: number) {
    this.expirationTime = expirationTime;
    this.size = size;

    if (!localStorage.getItem('arweave-account')) localStorage.setItem('arweave-account', '[]');
  }

  get(addr: T_addr) {
    // @ts-ignore localStorage is initialized in constructor
    const cache: T_item[] = JSON.parse(localStorage.getItem('arweave-account'));

    const result = cache.find((item: T_item) => item.addr === addr && Date.now() < item.timestamp + this.expirationTime)
    ?.account
    if(result)
      return result;
    else if(result === null)
      return Data.getDefaultAccount(addr);
  }

  find(uniqueHandle: string) {
    // @ts-ignore localStorage is initialized in constructor
    const cache: T_item[] = JSON.parse(localStorage.getItem('arweave-account'));

    return cache.find(
      (record: T_item) =>
        record.account?.handle === uniqueHandle && Date.now() < record.timestamp + this.expirationTime,
    )?.account;
  }

  /*
   *  add or update an account timestamp
   */
  hydrate(account: ArAccount): void {
    const item: T_item = {
      timestamp: Date.now(),
      addr: account.addr,
      account
    };

    // @ts-ignore localStorage is initialized in constructor
    const cache = JSON.parse(localStorage.getItem('arweave-account'));

    const itemIndex = cache.findIndex((record: T_item) => record.addr === item.addr);

    // hydrate account data
    if (itemIndex !== -1) cache.splice(itemIndex, 1, item);
    else {
      cache.unshift(item); // add account data
      if (cache.length > this.size) cache.pop();
    }

    localStorage.setItem('arweave-account', JSON.stringify(cache));
  }

  /*
   *  Debugging purpose only
   */
  reset() {
    localStorage.setItem('arweave-account', '[]');
  }
  dump(): string {
    // @ts-ignore localStorage is initialized in constructor
    return localStorage.getItem('arweave-account');
  }
}
