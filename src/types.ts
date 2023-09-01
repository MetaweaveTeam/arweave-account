type T_addr = string;
type T_txid = string;

type ArAccount = {
  readonly txid: T_txid | null;
  readonly handle: string;
  readonly addr: T_addr;
  profile: T_profile;
  wallets?: {
    eth?: string;
  }
};

type T_profile = {
  handleName: string;
  avatar: string;
  readonly avatarURL: string;
  banner: string;
  readonly bannerURL: string;
  name: string;
  bio: string;
  email: string;
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
  wallets: {
    eth?: string;
  }
};

type ArAccountEncoded = {
  handle: string;
  avatar?: string;
  banner?: string;
  name?: string;
  bio?: string;
  email?: string;
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
  account: ArAccount | null;
};

type T_tags = {name: string, value: string}[];

export type { T_addr, T_txid, T_profile, ArAccount, T_item, ArAccountEncoded, T_tags };
