import Arweave from 'arweave';
import ArDB from 'ardb';
import { T_jwk } from './types';
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

  async get(jwk: T_jwk): Promise<any | null> {
    const tx: transaction[] | block[] = await this.ardb.search('transactions')
    .tag('Protocol-Name', 'Account-0.1')
    .from(jwk)
    .limit(1).find();
  
    const data = tx[0]?.id 
      ? await this.arweave.transactions.getData(tx[0].id, { decode: true, string: true })
      : null;

    if(typeof data === "string"){
      let profile = JSON.parse(data);
      profile ={
        ...profile,
        handle: `${profile.username}#${jwk.slice(0,3)}${jwk.slice(jwk.length-3)}`,
        jwk: jwk
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
