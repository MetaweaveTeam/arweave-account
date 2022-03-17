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

__Get user profile by handle name__
```
await account.search(handle);
```