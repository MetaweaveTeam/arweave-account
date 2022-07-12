import { T_account, T_accountEncoded, T_addr, T_profile, T_txid } from "./types";
import { DEFAULT_AVATAR_TXID } from "./config";

export default class Data {

  private gatewayHost: string;

  constructor(gatewayHost: string) {
    this.gatewayHost = gatewayHost;
  }

  private getURLfromURI(URI: string) {
    let ressource;
    // Look for simple txids to be compatible with arweave account protocol v0.2
    if(/^[a-zA-Z0-9\-_]{43}$/.test(URI))
      return "https://" + this.gatewayHost + "/" + URI;
    // ar://<txid>
    else if(ressource = URI.match(/^ar:\/\/([a-zA-Z0-9\-_]{43})$/))
      return "https://" + this.gatewayHost + "/" + ressource[1];
    // http URLs
    else if(/^https?:\/\/.+$/.test(URI))
      return URI;
    // corrupted data (default avatar)
    else
      return "https://" + this.gatewayHost + "/" + DEFAULT_AVATAR_TXID;
  }
  
  encode(profile: T_profile): T_accountEncoded | null {
    
    let data: T_accountEncoded = { handle: profile.handleName };
    if(profile.avatar) data = {...data, avatar: profile.avatar };
    if(profile.banner) data = {...data, banner: profile.banner };
    if(profile.name) data = {...data, name: profile.name };
    if(profile.bio) data = {...data, bio: profile.bio };
    if(profile.links) data = {...data, links: profile.links };
    if(profile.wallets) data = {...data, wallets: profile.wallets };
    
    return data;
  }
  
  isEncodedAccount(obj: any): obj is T_accountEncoded {
    return obj.handle !== undefined
    && obj.handle.length > 0
  }
  
  /*
   *  return null if data are corrupted 
   */
  decode(txid: T_txid, addr: T_addr, data: T_accountEncoded): T_account | null {
    if(!this.isEncodedAccount(data))
      return null;

    // Create a minimal account
    let account: T_account = {
      txid,
      addr,
      handle: `${data.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`
    }

    // Populate account from data
    let profile: T_profile = {
      handleName: data.handle,
      links: {}
    };
    
    if(data.avatar) profile = { 
      ...profile,
      avatar: data.avatar,
      avatarURL: this.getURLfromURI(data.avatar)
    };
    if(data.banner) profile = { 
      ...profile,
      banner: data.banner,
      bannerURL: this.getURLfromURI(data.banner)
    };
    if(data.name) profile = {...profile, name: data.name};
    if(data.bio) profile = { ...profile, bio: data.bio };
    if(data.links) profile = { ...profile, links: data.links };
    if(data.wallets) profile = { ...profile, wallets: data.wallets };
    
    account = {
      ...account,
      profile
    };
    
    return account;
  }
  
  isProfile(obj: any): obj is T_profile {
    return obj.handleName !== undefined 
    && obj.handleName.length > 0 
    && obj.links !== undefined
  }
};