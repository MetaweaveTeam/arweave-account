import Arweave from 'arweave';
import ArDB from 'ardb';
import { T_account, T_addr, T_profile, T_txid } from './types';
import transaction from 'ardb/lib/models/transaction';
import block from 'ardb/lib/models/block';
import LSCache from './LSCache';

export default class Account {
  private arweave: Arweave;
  private ardb: ArDB;
  private cache: LSCache;

  constructor({
    cache = true,
    cacheSize = 100,
    cacheTime = 60000,
    gateway = {
      host: 'arweave.net',// Hostname or IP address for a Arweave host
      port: 443,          // Port
      protocol: 'https',  // Network protocol http or https
      timeout: 20000,     // Network request timeouts in milliseconds
      logging: false,
    }
  } = {}) {
    this.arweave = Arweave.init(gateway);
    this.ardb = new ArDB(this.arweave);
    this.cache = new LSCache(cache, cacheSize, cacheTime);
  }

  async get(addr: T_addr): Promise<T_account | null> {
    addr = addr.trim();
    let cacheResponse;
    if (cacheResponse = this.cache.get(addr))
      return cacheResponse;
    else {
      const tx: transaction[] | block[] = await this.ardb.search('transactions')
        .tag('Protocol-Name', 'Account-0.2')
        .from(addr)
        .limit(1).find();

      const data = tx[0]?.id
        ? await this.arweave.transactions.getData(tx[0].id, { decode: true, string: true })
        : null;

      if (typeof data === "string") {
        let profile = JSON.parse(data);
        profile = {
          ...profile,
          handle: `${profile.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`,
          addr: addr
        }
        const account = {
          txid: tx[0].id,
          profile
        };

        this.cache.hydrate(addr, account);
        return account;
      }
      else {
        this.cache.hydrate(addr);
        return null;
      }
    }
  }

  async search(handle: string): Promise<T_account[]> {
    const txs: transaction[] | block[] = await this.ardb.search('transactions')
      .tag('Protocol-Name', 'Account-0.2')
      .tag('handle', handle)
      .limit(100).find();

    const formattedAccounts = txs.map(async tx => {
      const txid: T_txid = tx.id;
      // @ts-ignore
      let profile = (await this.arweave.api.get(txid).catch(() => { data: null })).data;
      let addr = profile.addr ? profile.addr : tx.owner.address
      profile = {
        ...profile,
        addr,
        handle: `${profile.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`
      }
      return {
        txid: txid,
        profile
      }
    });

    const accounts = await Promise.all(formattedAccounts);

    return accounts.filter(
      (v, i, a): v is T_account =>
        v !== null &&
        // remove address duplicates: https://stackoverflow.com/a/56757215
        a.findIndex(t => (t?.profile.addr === v?.profile.addr)) === i
    );
  }

  async find(uniqueHandle: string): Promise<T_account | null> {
    let cacheResponse;
    uniqueHandle = uniqueHandle.trim();
    // check if format is handle#xxxxxx
    if (!/^(.+)#[a-zA-Z0-9\-\_]{6}$/.test(uniqueHandle))
      return null;

    if (cacheResponse = this.cache.find(uniqueHandle))
      return cacheResponse;
    else {
      const txs: transaction[] | block[] = await this.ardb.search('transactions')
        .tag('Protocol-Name', 'Account-0.2')
        .tag('handle', uniqueHandle.slice(0, -7))
        .limit(100).find();

      const formattedAccounts = txs.map(async tx => {
        const txid: T_txid = tx.id;
        // @ts-ignore
        let profile = (await this.arweave.api.get(txid).catch(() => { data: null })).data;
        let addr = profile.addr ? profile.addr : tx.owner.address
        profile = {
          ...profile,
          addr,
          handle: `${profile.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`
        }
        return {
          txid: txid,
          profile
        }
      });

      const a = await Promise.all(formattedAccounts);
      const accounts = a.filter((e): e is T_account => e !== null);

      if (accounts.length > 0) {
        this.cache.hydrate(accounts[0].profile.addr, accounts[0]);
        return accounts[0];
      }
      else
        return null;
    }
  }

  clearCache(): void {
    this.cache.reset();
  }
}
