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
