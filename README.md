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

## appData methods

Using arweave-account, you can set and get profile config data for your decentralized application.

The first thing you need to do is pass an arweave object and an `AppIdentifier` which is a string that identifies your application.

``` js
const account = new Account({arweave, AppIdentifier: 'myapp'})
```

### set item for your app

``` js
await account.appData.set('key', value)
```

### get item for your app

``` js
await account.appData.get('key')
```

### remove item from your app

``` js
await account.appData.remove('key')
```
