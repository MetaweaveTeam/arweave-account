type T_jwk = string;
type T_txid = string;

type T_profile = {
  jwk: T_jwk,
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

export type {T_jwk, T_txid, T_profile}