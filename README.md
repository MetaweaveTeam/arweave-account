# Arweave Account

This npm package is paired with the permadapp [Account](https://github.com/MetaweaveTeam/Account).

Arweave accounts rely on the native gateways operations to write and retrieve users data.

# Migrate from 1.2.5 to 1.3.x

1. The unique handle (name#xxxxxx) is at the Account level

`account.profile.handle` -> `account.handle`

The unique handle derived from the user chosen handle name and their wallet address is now accessible at the `account` level.

In the `account.profile` object, a new property `handleName` is available which constitutes the name part only of the user handle.

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

## Account object

When getting account information, the library request the relevant transaction through the gateway, decode the information stored and return an account object formatted the following way:

| Property name | req. | description |
| ------------- | yes  | ------------- |
| `txid`        | yes  | Current transaction associated with the arweave account |
| `addr`        | yes  | Wallet address of the arweave account |
| `handle`      | no   | Unique handle derived from `profile.handleName` and the wallet address |
| `profile`     | no   | Profile object |
| `apps`        | no   | WIP from [this discussion](https://github.com/MetaweaveTeam/Account/issues/1): maybe named `storage`?  |


## typescript imports

```
import { T_profile } from 'arweave-account';
```

# How does it works

## Exemple

### Encoded arweave account data (written on-chain)

```
{
  "handle":"cromatikap",
  "avatar":"xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI"
  "name":"Axel",
  "bio":"Founder of Metaweave.xyz\nI love dogs",
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
  "addr": "aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog",
  "handle": "cromatikap#aIUdog",
  "profile": {
    "avatar": "xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI",
    "handleName": "cromatikap"
    "name": "Axel",
    "bio": "Founder of Metaweave.xyz\nI love dogs",
    "links": {
      "twitter": "cromatikap",
      "github": "cromatikap",
      "instagram": "cromatikap",
      "discord": "cromatikap#6039"
    },
  }
}
```

For convenience, the related `txid` and wallet `addr` is added. As well, you have access to the full unique `handle` derived from the user chosen handle and their wallet address