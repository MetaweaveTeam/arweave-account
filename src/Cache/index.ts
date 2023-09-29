import CacheAPI from './CacheAPI';
import { ArAccount, T_addr } from '../types';
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
import LocalStorage from './Web';
import Memory from './Node';

export default class Cache implements CacheAPI {
  private cacheObj: { [K: string]: () => any } | CacheAPI;
  private size: number;
  private expirationTime: number;

  constructor(env: string | CacheAPI, size: number, expirationTime: number) {
    this.size = size;
    this.expirationTime = expirationTime;

    if (typeof env === 'object') this.cacheObj = env;
    else if (this.select[env]) this.cacheObj = this.select[env]();
    else throw new Error(`Cache for the '${env}' environment is not implemented.`);
  }

  // Environments list
  private select: { [K: string]: () => any } = {
    web: () => new LocalStorage(this.size, this.expirationTime),
    node: () => new Memory(this.size, this.expirationTime),
  };

  public get = (addr: string): ArAccount | undefined => this.cacheObj.get(addr);
  public find = (uniqueHandle: string): ArAccount | null | undefined => this.cacheObj.find(uniqueHandle);
  public hydrate = (addr: T_addr, account?: ArAccount) => this.cacheObj.hydrate(addr, account);
  public reset = () => this.cacheObj.reset();
  public dump = () => this.cacheObj.dump();
}
