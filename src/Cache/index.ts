import CacheAPI from './CacheAPI';
import { ArAccount } from '../types';
import LocalStorage from './Web';
import Memory from './Node';

export default class Cache implements CacheAPI {
  private cacheObj: CacheAPI;
  private size: number;
  private expirationTime: number;

  constructor(size: number, expirationTime: number) {
    this.size = size;
    this.expirationTime = expirationTime;

    if (typeof window !== 'undefined')
      this.cacheObj = new LocalStorage(this.size, this.expirationTime);
    else
      this.cacheObj = new Memory(this.size, this.expirationTime);
  }

  public get = (addr: string): ArAccount | undefined => this.cacheObj.get(addr);
  public find = (uniqueHandle: string): ArAccount | null | undefined => this.cacheObj.find(uniqueHandle);
  public hydrate = (account: ArAccount) => this.cacheObj.hydrate(account);
  public reset = () => this.cacheObj.reset();
  public dump = () => this.cacheObj.dump();
}
