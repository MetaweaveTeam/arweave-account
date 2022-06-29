import Arweave from 'arweave';
import ArDB from 'ardb';
import { T_account, T_addr, T_profile, T_txid } from './types';
import transaction from 'ardb/lib/models/transaction';
import block from 'ardb/lib/models/block';
import Cache from './Cache';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { decode, encode, isProfile} from './data';

const PROTOCOL_NAME = "Account-0.2";

export { T_account as ArAccount, T_profile as ArProfile }

export default class Account {
  private arweave: Arweave;
  private ardb: ArDB;
  private cache: Cache | null;
  private walletAddr: string | null = null;

  constructor({
    cacheIsActivated = true,
    cacheSize = 100,
    cacheTime = 60000,
    gateway = {
      host: 'arweave.net', // Hostname or IP address for a Arweave host
      port: 443, // Port
      protocol: 'https', // Network protocol http or https
      timeout: 20000, // Network request timeouts in milliseconds
      logging: false,
    },
  } = {}) {
    this.arweave = Arweave.init(gateway);
    this.ardb = new ArDB(this.arweave);

    if (cacheIsActivated) {
      if (typeof window !== 'undefined') {
        this.cache = new Cache('web', cacheSize, cacheTime);
      } else this.cache = new Cache('node', cacheSize, cacheTime);
    } else this.cache = null;
  }

  async connect(jwk: JWKInterface | "use_wallet" = "use_wallet") {
    this.walletAddr = await this.arweave.wallets.getAddress(jwk);
  }

  async updateProfile(profile: T_profile) {
    if(!this.walletAddr) throw Error("Method connect() should be called before updateProfile().");
    if(!isProfile(profile)) throw Error(`Object "${JSON.stringify(profile)}" doesn't match with the shape of a T_profile object.\nTypescript tip: import { T_profile } from 'arweave-account'`);

    const data = JSON.stringify(encode(profile));
    console.log(data);

    const tx = await this.arweave.createTransaction({data});
    tx.addTag("Protocol-Name", PROTOCOL_NAME);
    tx.addTag("handle", profile.handleName);

    // @ts-ignore
    const result = await arweaveWallet.dispatch(tx);
    console.log(result);
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
        const data = (
          await this.arweave.api.get(txid).catch(() => {
            this.cache?.hydrate(addr);
            return { data: null };
          })
        ).data;

        return decode(txid, addr, data); // return null if corrupted data 
      } else return null; // no Account
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
      const addr = 'owner' in tx ? tx.owner.address : 'anonymous';
      const data = (
        await this.arweave.api.get(txid).catch(() => {
          return { data: null };
        })
      ).data;
      return decode(txid, addr, data);
    });

    const accounts = await Promise.all(formattedAccounts);

    return accounts.filter(
      (v, i, a): v is T_account =>
        v !== null &&
        // remove address duplicates: https://stackoverflow.com/a/56757215
        a.findIndex((t) => t?.addr === v?.addr) === i,
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
        const addr = 'owner' in tx ? tx.owner.address : 'anonymous';
        const data = (
          await this.arweave.api.get(txid).catch(() => {
            return { data: null };
          })
        ).data;
        return decode(txid, addr, data);
      });

      const a = await Promise.all(formattedAccounts);
      const accounts = a.filter((e): e is T_account => e !== undefined);

      if (accounts.length > 0) {
        this.cache?.hydrate(accounts[0].addr, accounts[0]);
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
}
