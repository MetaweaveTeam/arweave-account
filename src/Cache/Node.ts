import { T_account, T_addr } from "../types";

export default class Memory {
  constructor() {};
  get(addr: T_addr) {};
  find(uniqueHandle: string) {};
  hydrate(addr: T_addr, account?: T_account) {};
  reset() {};
}