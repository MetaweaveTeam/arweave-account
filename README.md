# Arweave Account

__This is under development, do not use it yet, it's not ready__

This npm package is paired with the permadapp [Account](https://github.com/MetaweaveTeam/Account).

```
npm install arweave-account
```

```
import Account from 'arweave-account'

const account = new Account();
const {profile, txid} = await account.get(walletAddr); // Get Account
const profiles = await account.search(handle); // return array of matching handle name accounts`}
```