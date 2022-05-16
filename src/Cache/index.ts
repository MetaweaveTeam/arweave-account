import CacheAPI from './CacheAPI';
import Web from './Web';
import { T_account, T_addr } from '../types';
import LocalStorage from './Web';
import Memory from './node';

export default class Cache implements CacheAPI {
  private cacheObj: { [K: string]: Function } | CacheAPI;
  private size: number;
  private expirationTime: number;
  
  constructor(env: string | CacheAPI, size: number, expirationTime: number) {
    console.log("env", env);
    this.size = size;
    this.expirationTime = expirationTime;
    
    if(typeof env === "object") this.cacheObj = env;
    else if(this.select[env]) this.cacheObj = this.select[env]();
    else throw new Error(`Cache for the '${env}' environment is not implemented.`);
  }

  // Environments list
  private select: { [K: string]: Function } = {
    "web": () => new LocalStorage(true, this.size, this.expirationTime),
    "node": () => new Memory(true, this.size, this.expirationTime)
  };

  public get = (addr: string) => this.cacheObj.get(addr);
  public find = (uniqueHandle: string) => this.cacheObj.find(uniqueHandle);
  public hydrate = (addr: T_addr, account?: T_account) => this.cacheObj.hydrate(addr, account);
  public reset = () => this.cacheObj.reset();
  public dump = () => this.cacheObj.dump();
}
