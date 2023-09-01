# Arweave Account
[中文版](README_ZH.md)
> ℹ️ This npm package is paired with the permadapp [Account](https://github.com/MetaweaveTeam/Account).

Arweave Account is a composible and customizable profile protocol (DID) on Arweave. It relies on the native gateways operations to write and retrieve users data.

## Who uses it?

Here is some example of the same profile displayed by different applications in the ecosystem:

| PermaDapp | visual |
|---|---|
| [now](https://now.arweave.dev) | <img width="321" alt="Screenshot 2022-10-06 at 20 31 25" src="https://user-images.githubusercontent.com/7074019/194403612-a3da8a4a-b580-41d8-8c8a-125725b9225b.png"> |
| [Permanotes](https://permanotes.app) | <img width="378" alt="Screenshot 2022-10-06 at 20 30 00" src="https://user-images.githubusercontent.com/7074019/194403578-a12132f6-2a22-4e60-8333-2e737b34be0f.png"> |
| [Metaweave](https://r.metaweave.xyz/u/aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog) | <img width="606" alt="Screenshot 2022-10-06 at 20 32 08" src="https://user-images.githubusercontent.com/7074019/194403544-a473f181-32c4-4723-8cbc-67051b9cc819.png"> |

> ℹ️ ❕
>
> __Do you know an application using Arweave Account? Feel free to add it to the list via a PR ❤️__

-----

# Documentation

> ℹ️ If it's your first time trying `arweave-account`, __we recommend to try the [interactive documentation](https://account.metaweave.xyz)__.

If you're in for a deeper look at arweave account, you are at the right place

- [Arweave Account](#arweave-account)
  - [Who uses it?](#who-uses-it)
- [Documentation](#documentation)
  - [Installation & Import](#installation--import)
  - [Basic usages](#basic-usages)
  - [Creation/update flow](#creationupdate-flow)
  - [Advanced usages](#advanced-usages)
  - [References](#references)
    - [Typescript imports](#typescript-imports)
    - [ArAccount object](#araccount-object)
    - [ArProfile object](#arprofile-object)
    - [`avatar` and `banner` properties](#avatar-and-banner-properties)
- [Data protocol](#data-protocol)
- [Data architecture](#data-architecture)
- [Migrate from 1.2.5 to 1.3.x](#migrate-from-125-to-13x)

## Installation & Import

__Installation__
```typescript
npm install arweave-account
```

__Usage__
```typescript
import Account from 'arweave-account'

const account = new Account();
```

If you are using Typescript, see [_typescript imports_](#typescript-imports) section.

## Basic usages

__Get user profile by wallet address__
```typescript
await account.get(walletAddr);
```

__Search user profile by handle name__
```typescript
await account.search(handle);
```

__Find user profile by wallet address & handle name__
```typescript
await account.find(handle#uniqID);
```

## Example: Display user's avatar, handle name and bio

```typescript
import Account from 'arweave-account'

const account = new Account()

(async () => {
  const user = await account.get(await arweaveWallet.getActiveAddress())

  setHandle(user.handle);
  setAvatar(user.profile.avatarURL);
  setbio(user.profile.bio);
})()
```

## Creation/update flow

With the 3 methods above, you are able to display any arweave account without requiring your user to even have an Arweave wallet. A [permanent application](https://github.com/MetaweaveTeam/Account) is available for your users to create and update their arweave account profile. Further more, we have made available a [redirection link](https://account.metaweave.xyz) that will bring your users to the latest deployed version of the permadapp. 

> ℹ️ [What is a permanent application?](https://www.youtube.com/watch?v=ZduvXKxSgkQ)

Feel free to make your own redirection link with your own branding or create an issue to enhance the onboarding flow so everyone can benefit from it.

Although, if you want to implement your own onboarding flow right inside your app, the `arweave-account`, see the following _Advanced usages_ section.

## Advanced usages

__Connect the user wallet__
```typescript
await account.connect(jwk?);
```
If no argument is passed, account will use the injected `arweaveWallet` object. In that case, make sure you have handled the wallet connection flow with the right permissions before calling this method to avoid any unexpected behavior. 

__Create/update arweave account profile__
```typescript
await account.updateProfile(profileObj, tags?);
```
Make sure `connect()` is called before.

> ℹ️ Optionaly you can pass an array of `tags` to be added to the transaction. This is useful if you want to attach [Asset Discoverability (ANS-110)](https://specs.g8way.io/?tx=SYHBhGAmBo6fgAkINNoRtumOzxNB8-JFv2tPhBuNk5c) or even a [Stampable Asset](https://specs.g8way.io/#/view/y_ykD1T51BAM1Q2PrJK5bjZt9gf53EFMBW8nv3ooHj4).

## Example: Update user's handle name and bio

If the user doesn't have an account, it will create it.

```typescript
import Account, {ArAccount} from 'arweave-account'

const account = new Account()

(async () => {
  const user: ArAccount = await account.get(await arweaveWallet.getActiveAddress())

  displayProfile(user.profile);

  await account.connect();
  user.profile.handleName = "DMac"
  user.profile.bio = "Accelerating the worlds transition to decentralized messaging"
  await account.updateProfile(user.profile)
})()
```

### Note

The advanced usages are only compatible with wallets injecting the `arweaveWallet` object with [`dispatch()`](https://github.com/th8ta/ArConnect#dispatchtransaction-promisedispatchresult).

> ℹ️ If you wish having more wallets compatible, feel free to open a discussion here (issue) or DM me on discord: cromatikap#6039

## References

### Typescript imports

```
import { ArAccount, ArProfile } from 'arweave-account';
```

### ArAccount object

When getting account information, the library request the relevant transaction through the gateway, decode the information stored and return an account object formatted the following way:

| Property name | No account default value                     | description |
| ------------- | -------------------------------------------- | ------------- |
| `txid`        | `null`                                       | Current transaction associated with the arweave account |
| `addr`        | `tx.owner.address`                           | Wallet address of the arweave account |
| `handle`      | truncated wallet address (ex: `aIUm...zdog`) | Unique handle derived from `profile.handleName` and the wallet address (ex: `cromatikap#aIUdog`) |
| `profile`     | -                                            | [ArProfile object](#arprofile-object) |
| `apps`        | -                                            | WIP from [this discussion](https://github.com/MetaweaveTeam/Account/issues/1): maybe named `storage`?  |

### ArProfile object

| Property name | No account default value                     | description |
| ------------- |-------------------------------------------- | ------------- |
| `avatar`      | `"ar://OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA"` | picture URI of the user avatar [supporting multiple protocols](#avatar-and-banner-properties) |
| `avatarURL`   | `"https://arweave.net/OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA"` | Out of the box URL picture of the user avatar |
| `banner`      | `"ar://a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k"`  | picture URI of the user banner [supporting multiple protocols](#avatar-and-banner-properties) |
| `bannerURL`   | `"https://arweave.net/a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k"`  | Out of the box URL picture of the user banner |
| `handleName`  | `""` | The handle name chosen by the user, this is a required constituent to generate account unique handle |
| `name`        | `""` | A secondary name |
| `bio`         | `""` | Biography information |
| `links`       | {}   | user social links |
| `wallets`     | {}   | Other wallet addresses for crosschain identification |

## `avatar` and `banner` properties

Image properties such as `avatar` and `banner` can refer to an NFT from different chains. The following protocols are supported:

- http://
- https://
- ar://

> ℹ️ If you wish to add other protocol, we would be happy to do so. Please feel free to reach out! 

> ❣️ Also, the Metaweave team gives grants for merged Pull Requests.

For each image property, an `https` URL is generated according to the original URI provided. You can access it with the suffix `URL`.

For example:

| Property name       | value                 |
| ------------------  | --------------------------------------------------------------- |
| `profile.avatar`    | ar://xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI                |
| `profile.avatarURL` | https://arweave.net/xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI |

# Data protocol

Account is a simple native data protocol on Arweave. It consists of a simple transaction containing the latest data state. A wallet key is attached to its own latest write with the tag `Protocol-Name: 'Account-<version>'`

__Exemple__: 

Request the latest updated account profile using [ArQL](https://www.npmjs.com/package/ar-gql)
```gql
{
  transactions(
    first: 1
    tags: [{name:"Protocol-Name",values:"Account-0.2"}]
  ) {
    edges {
      node {
        id
        owner {
          key
          address
        }
        tags {
          name
          value
        }
        block {
          timestamp
        }
      }
    }
  }
}
```

# Data architecture

In the arweave account protocol, a set of data representing the user profile is encoded to be stored in a transaction and decoded to a `ArAccount` type object.

Here is an exemple of an encoded and decoded account dataset for the wallet `aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog`:

## Encoded arweave account data (written on-chain)

```json
{
  "handle":"cromatikap",
  "avatar": "ar://xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI",
  "banner": "ar://a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k",
  "name":"Axel",
  "bio":"Founder of Metaweave.xyz\nI love dogs",
  "links": {
    "twitter":"cromatikap",
    "github":"cromatikap",
    "instagram":"cromatikap",
    "discord":"cromatikap#6039",
    "linkedin": "",
    "facebook": "",
    "youtube": "",
    "twitch": ""
  },
  "wallets": {
    "eth": "0xeEEe8f7922E99ce6CEd5Cb2DaEdA5FE80Df7C95e"
  }
}
```

## Decoded arweave account data

Here is the dataset you get by using the library

```json
{
  "txid": "NPJJoq-9EwUeAce_bSbSyqICaGs4_7Hg6VxCyoCY8UQ",
  "addr": "aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog",
  "handle": "cromatikap#aIUdog",
  "profile": {
    "avatar": "ar://xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI",
    "avatarURL": "https://arweave.net/xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI",
    "banner": "ar://a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k",
    "bannerURL": "https://arweave.net/a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k",
    "handleName": "cromatikap",
    "name": "Axel",
    "bio": "Founder of Metaweave.xyz\nI love dogs",
    "links": {
      "twitter": "cromatikap",
      "github": "cromatikap",
      "instagram": "cromatikap",
      "discord": "cromatikap#6039",
      "linkedin": "",
      "facebook": "",
      "youtube": "",
      "twitch": ""
    },
    "wallets": {
      "eth": "0xeEEe8f7922E99ce6CEd5Cb2DaEdA5FE80Df7C95e",
    }
  }
}
```

For convenience, the related `txid` and wallet `addr` is added. As well, you have access to the full unique `handle` derived from the user chosen handle and their wallet address

# Migrate from 1.2.5 to 1.3.x

1. The unique handle (name#xxxxxx) is at the Account level

`account.profile.handle` -> `account.handle`

The unique handle derived from the user chosen handle name and their wallet address is now accessible at the `account` level.

In the `account.profile` object, a new property `handleName` is available which constitutes the name part only of the user handle.

2. URL ressources comes auto generated

You no longer need to craft an URL from the `avatar` property. The library now delivers an URL ready to use in any standard <img /> tag
