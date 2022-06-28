type T_addr = string;
type T_txid = string;

type T_profile = {
  handleName: string;
  avatar?: T_txid;
  name?: string;
  bio?: string;
  links: {
    twitter?: string;
    instagram?: string;
    github?: string;
    facebook?: string;
    discord?: string;
  }
};

type T_account = {
  txid: T_txid;
  addr: T_addr;
  handle?: string;
  profile?: T_profile;
};

type T_accountEncoded = {
  handle: string;
  avatar: string;
  name?: string;
  bio?: string;
  links?: {
    twitter?: string;
    instagram?: string;
    github?: string;
    facebook?: string;
    discord?: string;
  };
}

type T_item = {
  timestamp: number;
  addr: T_addr;
  account: T_account | null;
};

export type { T_addr, T_txid, T_profile, T_account, T_item, T_accountEncoded };
