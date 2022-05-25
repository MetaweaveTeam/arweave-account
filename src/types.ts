type T_addr = string;
type T_txid = string;

type T_profile = {
  addr: T_addr;
  handle: string;
  name: string;
  bio: string;
  links: {
    twitter?: string;
    instagram?: string;
    github?: string;
    facebook?: string;
  };
  avatar: T_txid;
  apps: any;
};

type T_account = {
  txid: T_txid;
  profile: T_profile;
};

type T_item = {
  timestamp: number;
  addr: T_addr;
  account: T_account | null;
};

export type { T_addr, T_txid, T_profile, T_account, T_item };
