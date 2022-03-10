import Arweave from 'arweave';
import ArDB from 'ardb';
import { T_addr } from './types';
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
}
