# Arweave Account

This npm package is paired with the permadapp [Account](https://github.com/MetaweaveTeam/Account).

# Documentation

[Example and interactive documentation](https://account.metaweave.xyz)

__Installation__
```
npm install arweave-account
```

__Usage__
```
import Account from 'arweave-account'

const account = new Account();
```

__Get user profile by wallet address__
```
await account.get(walletAddr);
```

__Search user profile by handle name__
```
await account.search(handle);
```

__Find user profile by wallet address & handle name__
```
await account.find(handle#uniqID);
```

## typescript imports

```
import { T_addr, T_txid, T_profile, T_account } from 'arweave-account/lib/types';
```

# How does it works

## Exemple

### Encoded arweave account data

```
{
  "handle":"cromatikap",
  "name":"Axel",
  "bio":"Founder of Metaweave.xyz\nI love dogs",
  "avatar":"xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI"
  "links": {
    "twitter":"cromatikap",
    "github":"cromatikap",
    "instagram":"cromatikap",
    "discord":"cromatikap#6039"
  },
  "addr":"aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog", // TO REMOVE
}
```

### Decoded arweave account data

Here is the dataset you get by using the library

```
{
  "txid": "NPJJoq-9EwUeAce_bSbSyqICaGs4_7Hg6VxCyoCY8UQ",
  "profile": {
    "addr": "aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog",
    "links": {
      "twitter": "cromatikap",
      "github": "cromatikap",
      "instagram": "cromatikap",
      "discord": "cromatikap#6039"
    },
    "handle": "cromatikap#aIUdog",
    "name": "Axel",
    "bio": "Founder of Metaweave.xyz\nI love dogs",
    "avatar": "xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI"
  }
}
```

For convenience, the related `txid` and wallet `addr` is added. As well, you have access to the full unique `handle` derived from the user chosen handle and their wallet address