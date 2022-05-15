import { T_item, T_account, T_addr } from '../types';
import Cache from './CacheAPI';

export default class LocalStorage implements Cache {
  private isActivated: boolean;
  private expirationTime: number;
  private size: number;

  constructor(isActivated: boolean, size: number, expirationTime: number) {
    console.debug(`arweave-account: caching ${isActivated ? 'activated' : 'deactivated'}`);

    this.isActivated = isActivated;
    this.expirationTime = expirationTime;
    this.size = size;

    if (!localStorage.getItem('arweave-account')) localStorage.setItem('arweave-account', '[]');
  }

  get(addr: T_addr): T_account | undefined {
    if (!this.isActivated) return undefined;
    // @ts-ignore localStorage is initialized in constructor
    const cache = JSON.parse(localStorage.getItem('arweave-account'));

    return cache.find((record: T_item) => record.addr === addr && Date.now() < record.timestamp + this.expirationTime)
      ?.account;
  }

  find(uniqueHandle: string): T_account | undefined {
    if (!this.isActivated) return undefined;
    // @ts-ignore localStorage is initialized in constructor
    const cache = JSON.parse(localStorage.getItem('arweave-account'));

    return cache.find(
      (record: T_item) =>
        record.account?.profile.handle === uniqueHandle && Date.now() < record.timestamp + this.expirationTime,
    )?.account;
  }

  /*
   *  add or update an account timestamp
   */
  hydrate(addr: T_addr, account?: T_account): void {
    const item: T_item = {
      timestamp: Date.now(),
      addr: addr,
      account: account ? account : null,
    };

    // @ts-ignore localStorage is initialized in constructor
    const cache = JSON.parse(localStorage.getItem('arweave-account'));

    const itemIndex = cache.findIndex((record: T_item) => record.addr === item.addr);

    // hydrate account data
    if (itemIndex !== -1) cache.splice(itemIndex, 1, item);
    // add account data
    else {
      cache.unshift(item);
      if (cache.length > this.size) cache.pop();
    }

    localStorage.setItem('arweave-account', JSON.stringify(cache));
  }

  /*
   *  Debugging purpose only
   */
  reset(): void {
    localStorage.setItem('arweave-account', '[]');
  }
}
