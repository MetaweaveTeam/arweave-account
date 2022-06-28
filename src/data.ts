import { T_account, T_accountEncoded, T_addr, T_profile, T_txid } from "./types"

const encode = (account: T_account): string | void => {

}

const isEncodedAccount = (obj: any): obj is T_accountEncoded => {
  return obj.handle !== undefined
      && obj.handle.length > 0
}

/*
 *  return null if data are corrupted 
 */
const decode = (txid: T_txid, addr: T_addr, data: T_accountEncoded): T_account | null => {
  // Create a minimal account
  let account: T_account = {
    txid,
    addr
  }

  // Populate account from data
  if(isEncodedAccount(data)) {
    let profile: T_profile = {
      handleName: data.handle,
      links: {}
    };
    
    if(data.name) profile = {...profile, name: data.name};
    if(data.bio) profile = { ...profile, bio: data.bio };
    if(data.avatar) profile = { ...profile, avatar: data.avatar };
    if(data.links) profile = { ...profile, links: data.links };

    account = {
      ...account,
      handle: `${data.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`,
      profile
    };

    return account;
  }
  return null;
}

const isProfile = (obj: any): obj is T_profile => {
  return obj.handleName !== undefined 
      && obj.handleName.length > 0 
      && obj.links !== undefined
}

export {
  encode,
  isEncodedAccount,
  decode,
  isProfile
}