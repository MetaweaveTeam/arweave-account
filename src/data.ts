import { ArAccount, ArAccountEncoded, T_addr, T_profile, T_txid } from "./types";
import Config from "./config";
import { NO_AVATAR_FLAG, NO_BANNER_FLAG } from "./constants";

export default class Data {
  private static getURLfromURI(URI: string) {
    let ressource;
    const gc = Config.gateway;
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
      return `${gc.protocol}://${gc.host}:${gc.port}/${Config.defaultAvatarURI}`;
  }

  private static getUniqueHandle(addr: T_addr, handleName?: string) {
    if(handleName && typeof handleName === 'string')
      return `@${handleName}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`;
    else
      return `${addr.slice(0, 5)}...${addr.slice(addr.length - 5)}`;
  }

  private static isEncodedAccount(obj: any): obj is ArAccountEncoded {
    return obj.handle !== undefined
    && obj.handle.length > 0
  }

  private static getAvatarURI(avatar: string | undefined) {
    return avatar && avatar !== NO_AVATAR_FLAG ? avatar : Config.defaultAvatarURI;
  }

  private static setAvatarURI(avatar: string | undefined) {
    return avatar && avatar !== Config.defaultAvatarURI ? avatar : NO_AVATAR_FLAG;
  }

  private static getBannerURI(banner: string | undefined) {
    return banner && banner !== NO_BANNER_FLAG ? banner : Config.defaultBannerURI;
  }

  private static setBannerURI(banner: string | undefined) {
    return banner && banner !== Config.defaultBannerURI ? banner : NO_BANNER_FLAG;
  }

  static isProfile(obj: any): obj is T_profile {
    return obj.handleName !== undefined 
    && obj.handleName.length > 0 
    && obj.links !== undefined
  }

  static getDefaultAccount(addr: T_addr): ArAccount {
    return {
      txid: null,
      addr,
      handle: this.getUniqueHandle(addr),
      profile: {
        handleName: "",
        avatar: Config.defaultAvatarURI,
        avatarURL: this.getURLfromURI(Config.defaultAvatarURI),
        banner: Config.defaultBannerURI,
        bannerURL: this.getURLfromURI(Config.defaultBannerURI),
        name: "",
        bio: "",
        email: "",
        links: {},
        wallets: {}
      }
    }
  }
  
  static encodeForStorage(profile: T_profile): ArAccountEncoded | null {
    
    let data: ArAccountEncoded = { handle: profile.handleName };
    if(profile.avatar) data = {...data, avatar: this.setAvatarURI(profile.avatar) };
    if(profile.banner) data = {...data, banner: this.setBannerURI(profile.banner) };
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
  static decode(txid: T_txid | null, addr: T_addr, data: ArAccountEncoded): ArAccount {
    /* default account data */
    return this.isEncodedAccount(data)
      ? 
      {
        txid,
        addr,
        handle: this.getUniqueHandle(addr, data.handle),
        profile: {
          handleName: data.handle ? data.handle : "",
          avatar: this.getAvatarURI(data.avatar),
          avatarURL: this.getURLfromURI(this.getAvatarURI(data.avatar)),
          banner: this.getBannerURI(data.banner),
          bannerURL: this.getURLfromURI(this.getBannerURI(data.banner)),
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