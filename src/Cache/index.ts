import { ArAccount, T_addr, T_item } from '../types';
import LocalStorage from './LocalStorage';
import Memory from './Memory';

export interface ICache {
  expirationTime: number;
  size: number;

  get(addr: T_addr): ArAccount | undefined;
  find(uniqueHandle: string): ArAccount | null | undefined;
  hydrate(account: ArAccount): void;

  // dev/debug purpose only
  reset(): void;
  dump(): string;
}

export default class Cache {
  static create(size: number, expirationTime: number): ICache {
    return typeof window !== 'undefined'
      ? new LocalStorage(size, expirationTime)  // web browser runtime environment
      : new Memory(size, expirationTime);       // nodejs runtime environment
  }
}