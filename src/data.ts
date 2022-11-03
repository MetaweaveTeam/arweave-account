import { ArAccount, ArAccountEncoded, T_addr, T_profile, T_txid } from "./types";
import { ApiConfig as GatewayConfig } from 'arweave/node/lib/api';
import { DEFAULT_AVATAR_URI, DEFAULT_BANNER_URI } from "./config";

export default class Data {

  private gatewayConfig: GatewayConfig;

  constructor(gatewayConfig: GatewayConfig) {
    this.gatewayConfig = gatewayConfig;
  }

  private getURLfromURI(URI: string) {
    let ressource;
    const gc = this.gatewayConfig;
    // Look for simple txids to be compatible with arweave account protocol v0.2
    if(/^[a-zA-Z0-9\-_]{43}$/.test(URI))
      return `${gc.protocol}://${gc.host}:${gc.port}/${URI}`;
    // ar://<txid>
    else if(ressource = URI.match(/^ar:\/\/([a-zA-Z0-9\-_]{43})$/))
      return `${gc.protocol}://${gc.host}:${gc.port}/${ressource[1]}`;
    // http URLs
    else if(/^https?:\/\/.+$/.test(URI))
      return URI;
    // corrupted data (default avatar)
    else
      return `${gc.protocol}://${gc.host}:${gc.port}/${DEFAULT_AVATAR_URI}`;
  }

  private getUniqueHandle(addr: T_addr, handleName?: string) {
    if(handleName && typeof handleName === 'string')
      return `@${handleName}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`;
    else
      return `${addr.slice(0, 5)}...${addr.slice(addr.length - 5)}`;
  }

  private isEncodedAccount(obj: any): obj is ArAccountEncoded {
    return obj.handle !== undefined
    && obj.handle.length > 0
  }

  isProfile(obj: any): obj is T_profile {
    return obj.handleName !== undefined 
    && obj.handleName.length > 0 
    && obj.links !== undefined
  }

  getDefaultAccount(addr: T_addr): ArAccount {
    return {
      txid: null,
      addr,
      handle: this.getUniqueHandle(addr),
      profile: {
        handleName: "",
        avatar: DEFAULT_AVATAR_URI,
        avatarURL: this.getURLfromURI(DEFAULT_AVATAR_URI),
        banner: DEFAULT_BANNER_URI,
        bannerURL: this.getURLfromURI(DEFAULT_BANNER_URI),
        name: "",
        bio: "",
        email: "",
        links: {},
        wallets: {}
      }
    }
  }
  
  encode(profile: T_profile): ArAccountEncoded | null {
    
    let data: ArAccountEncoded = { handle: profile.handleName };
    if(profile.avatar) data = {...data, avatar: profile.avatar };
    if(profile.banner) data = {...data, banner: profile.banner };
    if(profile.name) data = {...data, name: profile.name };
    if(profile.bio) data = {...data, bio: profile.bio };
    if(profile.email) data = {...data, email: profile.email };
    if(profile.links) data = {...data, links: profile.links };
    if(profile.wallets) data = {...data, wallets: profile.wallets };
    
    return data;
  }
  
  /*
   *  return default account object if no account or corrupted data 
   */
  decode(txid: T_txid | null, addr: T_addr, data: ArAccountEncoded): ArAccount {
    /* default account data */
    return this.isEncodedAccount(data)
      ? 
      {
        txid,
        addr,
        handle: this.getUniqueHandle(addr, data.handle),
        profile: {
          handleName: data.handle ? data.handle : "",
          avatar: data.avatar ? data.avatar : DEFAULT_AVATAR_URI,
          avatarURL: data.avatar ? this.getURLfromURI(data.avatar) : this.getURLfromURI(DEFAULT_AVATAR_URI),
          banner: data.banner ? data.banner : DEFAULT_BANNER_URI,
          bannerURL: data.banner ? this.getURLfromURI(data.banner) : this.getURLfromURI(DEFAULT_BANNER_URI),
          name: data.name ? data.name : "",
          bio: data.bio ? data.bio : "",
          email: data.email ? data.email : "",
          links: data.links ? data.links : {},
          wallets: data.wallets ? data.wallets : {}
        }
      }
      : this.getDefaultAccount(addr);
  }
};