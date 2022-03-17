type T_addr = string;
type T_txid = string;

type T_profile = {
  addr: T_addr,
  handle: string,
  name: string,
  bio: string,
  links: {
    twitter?: string,
    instagram?: string,
    github?: string,
    facebook?: string
  },
  avatar: T_txid
}

type T_account = {
  txid: T_txid,
  profile: T_profile
}

export type {T_addr, T_txid, T_profile, T_account}