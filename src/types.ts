type T_addr = string;
type T_txid = string;

type T_profile = {
  handleName: string;
  avatar?: string;
  readonly avatarURL?: string;
  banner?: string;
  readonly bannerURL?: string;
  name?: string;
  bio?: string;
  links: {
    twitter?: string;
    github?: string;
    instagram?: string;
    discord?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitch?: string;
  };
  wallets?: {
    eth?: string;
  }
};

type T_account = {
  readonly txid: T_txid;
  readonly addr: T_addr;
  readonly handle: string;
  profile?: T_profile;
};

type T_accountEncoded = {
  handle: string;
  avatar?: string;
  banner?: string;
  name?: string;
  bio?: string;
  links?: {
    twitter?: string;
    github?: string;
    instagram?: string;
    discord?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    twitch?: string;
  };
  wallets?: {
    eth?: string;
  }
}

type T_item = {
  timestamp: number;
  addr: T_addr;
  account: T_account | null;
};

export type { T_addr, T_txid, T_profile, T_account, T_item, T_accountEncoded };
