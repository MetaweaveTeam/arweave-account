import Arweave from 'arweave';
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
import ArDB from 'ardb';
import { ArAccount, T_addr, T_profile, T_txid } from './types';
import transaction from 'ardb/lib/models/transaction';
import block from 'ardb/lib/models/block';
import Cache from './Cache';
import { JWKInterface } from 'arweave/node/lib/wallet';
import Data from './data';
import { PROTOCOL_NAME } from './config';

export { ArAccount, T_profile as ArProfile };

export default class Account {
  private arweave: Arweave;
  private ardb: ArDB;
  private data: Data;
  private cache: Cache | null;
  private walletAddr: string | null = null;

  constructor({
    cacheIsActivated = true,
    cacheSize = 100,
    cacheTime = 60000,
    gateway = <GatewayConfig>{
      host: 'arweave.net', // Hostname or IP address for a Arweave host
      port: 443, // Port
      protocol: 'https', // Network protocol http or https
      timeout: 20000, // Network request timeouts in milliseconds
      logging: false,
    },
  } = {}) {
    this.arweave = Arweave.init(gateway);
    this.ardb = new ArDB(this.arweave);
    this.data = new Data(gateway);

    if (cacheIsActivated) {
      if (typeof window !== 'undefined') {
        this.cache = new Cache('web', cacheSize, cacheTime, gateway);
      } else this.cache = new Cache('node', cacheSize, cacheTime, gateway);
    } else this.cache = null;
  }

  async connect(jwk: JWKInterface | 'use_wallet' = 'use_wallet') {
    this.walletAddr = await this.arweave.wallets.getAddress(jwk);
  }

  async updateProfile(profile: T_profile) {
    if (!this.walletAddr) throw Error('Method connect() should be called before updateProfile().');
    if (!this.data.isProfile(profile))
      throw Error(
        `Object "${JSON.stringify(
          profile,
        )}" doesn't match with the shape of a T_profile object.\nTypescript tip: import { T_profile } from 'arweave-account'`,
      );

    const encodedAccount = this.data.encode(profile);
    const data = JSON.stringify(encodedAccount);

    const tx = await this.arweave.createTransaction({ data });
    tx.addTag('Protocol-Name', PROTOCOL_NAME[PROTOCOL_NAME.length - 1]);
    tx.addTag('handle', profile.handleName);

    let result = tx;
    try {
      if (window.arweaveWallet) {
        // @ts-ignore try bundlr first
        result = await window.arweaveWallet.dispatch(tx);
      } else throw 'no window.arweaveWallet';
    } catch (e) {
      try {
        await this.arweave.transactions.sign(tx);
        await this.arweave.transactions.post(tx);
      } catch (e) {
        throw e;
      }
    }

    if (encodedAccount) {
      const accountObj = this.data.decode(tx.id, this.walletAddr, encodedAccount);
      this.cache?.hydrate(this.walletAddr, accountObj);
    }

    return result;
  }

  async get(addr: T_addr): Promise<ArAccount> {
    addr = addr.trim();
    if (!/^[a-zA-Z0-9\-_]{43}$/.test(addr)) throw 'Invalid wallet address argument';
    const cacheResponse = this.cache?.get(addr);
    if (cacheResponse) return cacheResponse;
    else {
      const tx: transaction[] | block[] = await this.ardb
        .search('transactions')
        .exclude('anchor')
        .tag('Protocol-Name', PROTOCOL_NAME)
        .from(addr)
        .limit(1)
        .find();

      const txid: T_txid | null = tx[0] ? tx[0].id : null;
      const data = txid
        ? (
            await this.arweave.api.get(txid).catch(() => {
              return { data: null };
            })
          ).data
        : { data: null };

      try {
        const accountObj = this.data.decode(txid, addr, data);
        this.cache?.hydrate(addr, accountObj);
        return accountObj;
      } catch (e) {
        // if JSON.parse(data) throw an error because data is not a valid JSON
        return this.data.getDefaultAccount(addr);
      }
    }
  }

  async search(handle: string): Promise<ArAccount[]> {
    const txs: transaction[] | block[] = await this.ardb
      .search('transactions')
      .exclude('anchor')
      .tag('Protocol-Name', PROTOCOL_NAME)
      .tag('handle', handle)
      .limit(100)
      .find();

    const formattedAccounts = txs.map(async (tx) => {
      const txid: T_txid = tx.id;
      const addr = 'owner' in tx ? tx.owner.address : 'anonymous';
      const data = (
        await this.arweave.api.get(txid).catch(() => {
          return { data: null };
        })
      ).data;

      try {
        const accountObj = this.data.decode(txid, addr, JSON.parse(data));
        this.cache?.hydrate(addr, accountObj);
        return accountObj;
      } catch (e) {
        // if JSON.parse(data) throw an error because data is not a valid JSON
        return this.data.getDefaultAccount(addr);
      }
    });

    const accounts = await Promise.all(formattedAccounts);

    return accounts.filter(
      (v, i, a): v is ArAccount =>
        v !== null &&
        // remove address duplicates: https://stackoverflow.com/a/56757215
        a.findIndex((t) => t?.addr === v?.addr) === i,
    );
  }

  async find(uniqueHandle: string): Promise<ArAccount | null> {
    uniqueHandle = uniqueHandle.trim();
    // check if format is handle#xxxxxx
    if (!/^(.+)#[a-zA-Z0-9\-\_]{6}$/.test(uniqueHandle)) return null;

    const cacheResponse = this.cache?.find(uniqueHandle);
    if (cacheResponse !== undefined) return cacheResponse;
    else {
      const txs: transaction[] | block[] = await this.ardb
        .search('transactions')
        .exclude('anchor')
        .tag('Protocol-Name', PROTOCOL_NAME)
        .tag('handle', uniqueHandle.slice(0, -7))
        .limit(100)
        .find();

      const formattedAccounts = txs.map(async (tx) => {
        const txid: T_txid = tx.id;
        const addr = 'owner' in tx ? tx.owner.address : 'anonymous';
        const data = (
          await this.arweave.api.get(txid).catch(() => {
            return { data: null };
          })
        ).data;

        try {
          const accountObj = this.data.decode(txid, addr, JSON.parse(data));
          this.cache?.hydrate(addr, accountObj);
          return accountObj;
        } catch (e) {
          // if JSON.parse(data) throw an error because data is not a valid JSON
          return this.data.getDefaultAccount(addr);
        }
      });

      const a = await Promise.all(formattedAccounts);
      const accounts = a.filter((e): e is ArAccount => e !== undefined);
      accounts.forEach((ac) => {
        this.cache?.hydrate(ac.addr, ac);
      });
      const result = accounts.find((ac) => ac.handle.includes(uniqueHandle));
      return result || null;
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
}
