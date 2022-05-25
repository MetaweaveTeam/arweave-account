import Arweave from 'arweave';
import ArDB from 'ardb';
import { T_account, T_addr, T_txid } from './types';
import transaction from 'ardb/lib/models/transaction';
import block from 'ardb/lib/models/block';
import Cache from './Cache';
import AppData from './app-data';
import type { AccountMgr } from './app-data'

interface AccountConstructorArgs {
  cacheIsActivated: boolean,
  cacheSize: number,
  cacheTime: number,
  arweave: Arweave,
  AppIdentifier: string | null
}

export default class Account {
  private arweave: Arweave;
  private ardb: ArDB;
  private cache: Cache | null;
  private appIdentifier: string | null;

  constructor({
    cacheIsActivated = true,
    cacheSize = 100,
    cacheTime = 60000,
    arweave = Arweave.init({
      host: 'arweave.net', // Hostname or IP address for a Arweave host
      port: 443, // Port
      protocol: 'https', // Network protocol http or https
      timeout: 20000, // Network request timeouts in milliseconds
      logging: false,
    }),
    AppIdentifier = null

  }: AccountConstructorArgs) {
    this.arweave = arweave;
    this.ardb = new ArDB(this.arweave);
    this.appIdentifier = AppIdentifier;

    if (cacheIsActivated) {
      if (typeof window !== 'undefined') {
        this.cache = new Cache('web', cacheSize, cacheTime);
      } else this.cache = new Cache('node', cacheSize, cacheTime);
    } else this.cache = null;
  }

  async get(addr: T_addr): Promise<T_account | null> {
    addr = addr.trim();
    const cacheResponse = this.cache?.get(addr);
    if (cacheResponse !== undefined) return cacheResponse;
    else {
      const tx: transaction[] | block[] = await this.ardb
        .search('transactions')
        .tag('Protocol-Name', 'Account-0.2')
        .from(addr)
        .limit(1)
        .find();

      const txid: T_txid | null = tx[0] ? tx[0].id : null;

      if (txid) {
        let profile = (
          await this.arweave.api.get(txid).catch(() => {
            this.cache?.hydrate(addr);
            return { data: null };
          })
        ).data;
        profile = {
          ...profile,
          handle: `${profile.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`,
          addr,
        };
        const account = {
          txid,
          profile,
        };

        this.cache?.hydrate(addr, account);
        //
        const accountMgr: AccountMgr = { arweave: this.arweave, ardb: this.ardb, appIdentifier: this.appIdentifier as string }
        this.appData = AppData(accountMgr, addr)
        return account;
      } else return null;
    }
  }

  async search(handle: string): Promise<T_account[]> {
    const txs: transaction[] | block[] = await this.ardb
      .search('transactions')
      .tag('Protocol-Name', 'Account-0.2')
      .tag('handle', handle)
      .limit(100)
      .find();

    const formattedAccounts = txs.map(async (tx) => {
      const txid: T_txid = tx.id;
      let profile = (
        await this.arweave.api.get(txid).catch(() => {
          return { data: null };
        })
      ).data;
      const addr = 'owner' in tx ? tx.owner.address : 'anonymous';
      profile = {
        ...profile,
        addr,
        handle: `${profile.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`,
      };
      return {
        txid,
        profile,
      } as T_account;
    });

    const accounts = await Promise.all(formattedAccounts);

    return accounts.filter(
      (v, i, a): v is T_account =>
        v !== null &&
        // remove address duplicates: https://stackoverflow.com/a/56757215
        a.findIndex((t) => t?.profile.addr === v?.profile.addr) === i,
    );
  }

  async find(uniqueHandle: string): Promise<T_account | null> {
    uniqueHandle = uniqueHandle.trim();
    // check if format is handle#xxxxxx
    if (!/^(.+)#[a-zA-Z0-9\-\_]{6}$/.test(uniqueHandle)) return null;

    const cacheResponse = this.cache?.find(uniqueHandle);
    if (cacheResponse !== undefined) return cacheResponse;
    else {
      const txs: transaction[] | block[] = await this.ardb
        .search('transactions')
        .tag('Protocol-Name', 'Account-0.2')
        .tag('handle', uniqueHandle.slice(0, -7))
        .limit(100)
        .find();

      const formattedAccounts = txs.map(async (tx) => {
        const txid: T_txid = tx.id;
        let profile = (
          await this.arweave.api.get(txid).catch(() => {
            return { data: null };
          })
        ).data;
        const addr = 'owner' in tx ? tx.owner.address : 'anonymous';

        if (uniqueHandle === `${profile.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`) {
          profile = {
            ...profile,
            addr,
            handle: `${profile.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`,
          };
          return {
            txid,
            profile,
          } as T_account;
        }
      });

      const a = await Promise.all(formattedAccounts);
      const accounts = a.filter((e): e is T_account => e !== undefined);

      if (accounts.length > 0) {
        this.cache?.hydrate(accounts[0].profile.addr, accounts[0]);
        return accounts[0];
      } else return null;
    }
  }

  public debug = {
    resetCache: (): void => {
      this.cache?.reset();
    },
    printCache: (): void => {
      const now = new Date();
      // tslint:disable-next-line
      console.log(` > Cache content at ${now.toISOString().replace(/T/, ' ').replace(/\..+/, '')}\n`);
      // tslint:disable-next-line
      console.log(this.cache?.dump());
    },
  };

  public appData = {}
}
