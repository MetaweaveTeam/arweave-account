import Arweave from 'arweave';
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
import ArDB from 'ardb';
import { ArAccount, T_addr, T_profile, T_tags, T_txid } from './types';
import transaction from 'ardb/lib/models/transaction';
import block from 'ardb/lib/models/block';
import Cache from './Cache';
import { JWKInterface } from 'arweave/node/lib/wallet';
import Data from './data';
import Config from './config';
import { PROTOCOL_NAMES } from './constants';

export { ArAccount, T_profile as ArProfile };

export default class Account {
  private arweave: Arweave;
  private ardb: ArDB;
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
    defaultAvatarUri = "ar://OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA",
    defaultBannerUri = "ar://a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k"
  } = {}) {
    new Config(gateway, defaultAvatarUri, defaultBannerUri);
    this.arweave = Arweave.init(gateway);
    this.ardb = new ArDB(this.arweave);

    if (cacheIsActivated) {
      if (typeof window !== 'undefined') {
        this.cache = new Cache('web', cacheSize, cacheTime);
      } else this.cache = new Cache('node', cacheSize, cacheTime);
    } else this.cache = null;
  }

  async connect(jwk: JWKInterface | 'use_wallet' = 'use_wallet') {
    this.walletAddr = await this.arweave.wallets.getAddress(jwk);
  }

  async updateProfile(profile: T_profile, tags?: T_tags) {
    if (!this.walletAddr) throw Error('Method connect() should be called before updateProfile().');
    if (!Data.isProfile(profile))
      throw Error(
        `Object "${JSON.stringify(
          profile,
        )}" doesn't match with the shape of a T_profile object.\nTypescript tip: import { T_profile } from 'arweave-account'`,
      );

    const encodedAccount = Data.encodeForStorage(profile);
    const data = JSON.stringify(encodedAccount);

    const tx = await this.arweave.createTransaction({ data });
    tx.addTag('Protocol-Name', PROTOCOL_NAMES[PROTOCOL_NAMES.length - 1]);
    tx.addTag('handle', profile.handleName);
    if(tags)
      tags.filter((tag) => tag.name !== 'Protocol-Name' && tag.name !== 'handle').map((tag) => tx.addTag(tag.name, tag.value));

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
      const account = Data.decode(result.id, this.walletAddr, encodedAccount);
      this.cache?.hydrate(account);
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
        .tag('Protocol-Name', PROTOCOL_NAMES)
        .from(addr)
        .limit(1)
        .find();

      const txid: T_txid | null = tx[0] ? tx[0].id : null;

      try {
        const { data } = txid ? await this.arweave.api.get(txid) : { data: null };
        const account = Data.decode(txid, addr, data);
        this.cache?.hydrate(account);
        return account;
      } catch (e) {
        // if JSON.parse(data) throw an error because data is not a valid JSON
        return Data.getDefaultAccount(addr);
      }
    }
  }

  async search(handle: string): Promise<ArAccount[]> {
    const txs: transaction[] | block[] = await this.ardb
      .search('transactions')
      .exclude('anchor')
      .tag('Protocol-Name', PROTOCOL_NAMES)
      .tag('handle', handle)
      .limit(100)
      .find();

    const formattedAccounts = await Promise.all(txs.map(async (tx) => {
      const txid: T_txid = tx.id;
      const addr = 'owner' in tx ? tx.owner.address : 'anonymous';

      try {
        const { data } = await this.arweave.api.get(txid);
        const accountObj = Data.decode(txid, addr, data);
        return accountObj;
      } catch (e) {
        // if uploaded JSON data is not a valid JSON
        return Data.getDefaultAccount(addr);
      }
    }));

    const accounts = formattedAccounts.filter(
      (v, i, a): v is ArAccount =>
        v !== null &&
        // remove address duplicates: https://stackoverflow.com/a/56757215
        a.findIndex((t) => t?.addr === v?.addr) === i,
    );

    /*
     * It appears that some accounts found are not the latest txid related to it.
     * Until this bug is solved the caching hydration is disabled.
     */
    // accounts.forEach((ac) => this.cache?.hydrate(ac.addr, ac));

    return accounts;
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
        .tag('Protocol-Name', PROTOCOL_NAMES)
        .tag('handle', uniqueHandle.slice(0, -7))
        .limit(100)
        .find();

      const formattedAccounts = await Promise.all(txs.map(async (tx) => {
        const txid: T_txid = tx.id;
        const addr = 'owner' in tx ? tx.owner.address : 'anonymous';

        try {
          const { data } = await this.arweave.api.get(txid);
          return Data.decode(txid, addr, data);
        } catch (e) {
          // if JSON.parse(data) throw an error because data is not a valid JSON
          return Data.getDefaultAccount(addr);
        }
      }));

      const accounts = formattedAccounts.filter((e): e is ArAccount => e !== undefined);

      const account = accounts.find((ac) => ac.handle.includes(uniqueHandle));

      if(account){
        this.cache?.hydrate(account)
        return account;
      }
      else
        return null;
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
