import Arweave from 'arweave';
import ArDB from 'ardb';

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

  getSomething(jwk: string): string {
    return "hello from arweave-account";
  }
}
