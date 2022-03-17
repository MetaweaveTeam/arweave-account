import Arweave from 'arweave';
import ArDB from 'ardb';
import { T_account, T_addr, T_profile, T_txid } from './types';
import transaction from 'ardb/lib/models/transaction';
import block from 'ardb/lib/models/block';

export default class Account {
  private arweave: Arweave;
  private ardb: ArDB;

  constructor() {
    this.arweave = Arweave.init({
      host: 'arweave.net',// Hostname or IP address for a Arweave host
      port: 443,          // Port
      protocol: 'https',  // Network protocol http or https
      timeout: 20000,     // Network request timeouts in milliseconds
      logging: false,
    });
    this.ardb = new ArDB(this.arweave);
  }

  async get(addr: T_addr): Promise<any | null> {
    const tx: transaction[] | block[] = await this.ardb.search('transactions')
    .tag('Protocol-Name', 'Account-0.2')
    .from(addr)
    .limit(1).find();
  
    const data = tx[0]?.id 
      ? await this.arweave.transactions.getData(tx[0].id, { decode: true, string: true })
      : null;

    if(typeof data === "string"){
      let profile = JSON.parse(data);
      profile ={
        ...profile,
        handle: `${profile.handle}#${addr.slice(0,3)}${addr.slice(addr.length-3)}`,
        addr: addr
      }
      return {
        txid: tx[0].id,
        profile
      }
    }
    else{
      return {
        txid: null,
        profile: null
      }
    }
  }

  async search(handle: string): Promise<any | null> {
    const txs: transaction[] | block[] = await this.ardb.search('transactions')
    .tag('Protocol-Name', 'Account-0.2')
    .tag('handle', handle)
    .limit(100).find();

    const formattedAccounts = txs.map(async tx => {
      const txid: T_txid = tx.id;
      const data = await this.arweave.transactions.getData(txid, { decode: true, string: true });
      const addr = 'owner' in tx ? tx.owner.address : 'anonymous';
      if(typeof data === "string"){
        let profile: T_profile = JSON.parse(data);
        profile = {
          ...profile,
          handle: `${profile.handle}#${addr.slice(0,3)}${addr.slice(addr.length-3)}`,
          addr: addr
        }
        return {
          txid: txid,
          profile
        }
      }
    });

    const accounts = await Promise.all(formattedAccounts);

    // remove address duplicates: https://stackoverflow.com/a/56757215
    return accounts.filter((v,i,a)=>a.findIndex(t =>(t?.profile.addr===v?.profile.addr))===i);
  }
}
