import Arweave from 'arweave';
import ArDB from 'ardb';
import { T_jwk } from './types';

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

  get(jwk: T_jwk): T_jwk {
    return "hello from arweave-account";
  }
}
