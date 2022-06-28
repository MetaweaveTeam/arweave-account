import { T_account, T_addr, T_txid } from "./types"

const encode = (account: T_account): string | void => {

}

const decode = (txid: T_txid, addr: T_addr, data: any): T_account | null => {
  // Create a minimal account
  const account: T_account = {
    txid,
    profile: {
      addr,
      links: {}
    }
  }

  if(data.handle) account.profile.handle = `${data.handle}#${addr.slice(0, 3)}${addr.slice(addr.length - 3)}`
  if(data.name) account.profile.name = data.name;
  if(data.bio) account.profile.bio = data.bio;
  if(data.avatar) account.profile.avatar = data.avatar;
  if(data.links) account.profile.links = data.links;
  
  return account;
}

export {
  encode,
  decode
}