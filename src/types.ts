type T_addr = string;
type T_txid = string;

type T_profile = {
  addr: T_addr,
  handle: string,
  username: string,
  name: string,
  bio: string,
  links: {
    twitter?: string,
    instagram?: string,
    github?: string,
    facebook?: string
  },
  image: T_txid
}

export type {T_addr, T_txid, T_profile}