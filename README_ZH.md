# Arweave账户
> ℹ️ 此 npm 包与 permadapp [帐户](https://github.com/MetaweaveTeam/Account) 配对

Arweave 帐户是 Arweave 上一个可组合和可定制的配置文件协议（DID）。它依赖于本地网关的操作来写入和检索用户数据。

## 谁使用它?
以下是生态系统中不同应用程序显示的相同配置文件的一些示例：

| PermaDapp | visual |
|---|---|
| [now](https://now.arweave.dev) | <img width="321" alt="Screenshot 2022-10-06 at 20 31 25" src="https://user-images.githubusercontent.com/7074019/194403612-a3da8a4a-b580-41d8-8c8a-125725b9225b.png"> |
| [Permanotes](https://permanotes.app) | <img width="378" alt="Screenshot 2022-10-06 at 20 30 00" src="https://user-images.githubusercontent.com/7074019/194403578-a12132f6-2a22-4e60-8333-2e737b34be0f.png"> |
| [Metaweave](https://r.metaweave.xyz/u/aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog) | <img width="606" alt="Screenshot 2022-10-06 at 20 32 08" src="https://user-images.githubusercontent.com/7074019/194403544-a473f181-32c4-4723-8cbc-67051b9cc819.png"> |

> ℹ️ ❕
>
> __您知道使用 Arweave 帐户的应用程序吗？可以通过 PR 将其添加到列表中 ❤️__

## 文档

> ℹ️ 如果您是第一次尝试`arweave-account`，__我们建议您尝试交互式[文档](https://account.metaweave.xyz)__

如果您想更深入地了解 arweave 帐户，那么您来对地方了
- [Arweave 账户](#Arweave账户)
    - [谁使用它?](#谁使用它?)
- [文档](#文档)
    - [安装和导入](#安装和导入)
    - [基本用法](#基本用法)
    - [创建/更新流程](#创建/更新流程)
    - [高级用法](#高级用法)
    - [参考](#参考)
        - [Typescript导入](#Typescript导入)
        - [Ar账户对象](#Ar账户对象)
        - [Ar资料对象](#Ar资料对象)
        - [avatar 和 banner 属性](#avatar和banner属性)
- [数据协议](#数据协议)
- [数据架构](#数据架构)
- [从1.2.5迁移到1.3.x](#从1.2.5迁移到1.3.x)

## 安装和导入
**安装**    
`npm install arweave-account`

**用法**
```typescript
import Account from 'arweave-account'
const account = new Account();
```
如果您使用的是 Typescript，请参阅 Typescript 导入部分。

## 基本用法

**通过钱包地址获取用户资料**

```typescript
await account.get(walletAddr);
```

**按用户名搜索用户资料**

```typescript
await account.search(handle);
```

**通过钱包地址和用户名查找用户资料**

`await account.find(handle#uniqID);`

## **示例：显示用户的头像、用户名和简介**

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
##

## 创建/更新流程

使用上述 3 种方法，您可以显示任何 arweave 帐户，甚至不需要您的用户拥有 Arweave 的钱包。
您的用户可以使用[永久应用程序](https://github.com/MetaweaveTeam/Account) 来创建和更新他们的 arweave 帐户资料。
此外，我们还提供了一个[重定向链接](https://account.metaweave.xyz/) 可以将您的用户带到最新部署的 permadapp 版本。

> ℹ️ [什么是永久申请？](https://www.youtube.com/watch?v=ZduvXKxSgkQ)

请随意将您自己的重定向链接与您自己的品牌联系起来，或创建一个问题来增强入职流程，以便每个人都能从中受益。

不过，如果您想在您的应用程序`arweave-account`中实施自己的加入流程，请参阅以下*高级用法*部分。

## 高级用法

**连接用户钱包**

```typescript
await account.connect(jwk?);
```

如果没有传递参数，帐户将使用注入的 `arweaveWallet`对象。在这种情况下，请确保您在调用此方法之前已使用正确的权限处理了钱包连接流，以避免任何意外行为。

**创建/更新 arweave 帐户资料**

```typescript
await account.updateProfile(profileObj);
```

确保之前调用了`connect()`。

## **示例：更新用户的用户名和简介**

如果用户没有帐户，它将创建帐户。

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

**注意**

高级用法仅与使用 [dispatch()](https://github.com/th8ta/ArConnect#dispatchtransaction-promisedispatchresult) 注入`arweaveWallet`对象的钱包兼容。

> ℹ️ 如果您希望兼容更多钱包，请随时在此处展开讨论（问题）或在 discord 上私信我：cromatikap#6039

## 参考

**Typescript导入**

```typescript
import { ArAccount, ArProfile } from 'arweave-account';
```
**Ar账户对象**

当获取帐户信息时，库通过网关请求相关事务，对存储的信息进行解码，并返回按以下方式格式化的帐户对象：

| 属性名称 | 无帐户默认值 | 描述 |
| --- | --- | --- |
| txid | null | 与 arweave 帐户关联的当前交易 |
| addr | tx.owner.address | arweave 帐户的钱包地址 |
| handle | 截断钱包地址(例如: aIUm...zdog) | 从 profile.handleName 和钱包地址派生的唯一句柄。例如: cromatikap#aIUdog
|
| profile | - | [Ar 资料对象](https://github.com/MetaweaveTeam/arweave-account#arprofile-object) |
| apps | - | [issue](https://github.com/MetaweaveTeam/Account/issues/1) 中的 WIP : 也许命名为 storage? |

**Ar资料对象**   

| 属性名词 | 无账户默认值 | 描述 |
| --- | --- | --- |
| avatar | "ar://OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA" | [支持多种协议](https://github.com/MetaweaveTeam/arweave-account#avatar-and-banner-properties) 的用户头像的图片URI |
| avatarURL | "https://arweave.net/OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA" | 用户头像的开箱即用URL图片 |
| banner | "ar://a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k" |[支持多种协议](https://github.com/MetaweaveTeam/arweave-account#avatar-and-banner-properties) 的用户横幅的图片URI |
| bannerURL | "https://arweave.net/a0ieiziq2JkYhWamlrUCHxrGYnHWUAMcONxRmfkWt-k" | 用户横幅的开箱即用URL图片 |
| handleName | "" | 用户选择的用户名，这是生成帐户唯一用户名的必要组成部分 |
| name | "" | 次要名称 |
| bio | "" | 简介资料 |
| links | {} | 用户社交联系 |
| wallets | {} | 其他用于跨链识别的钱包地址 |

## avatar和banner属性

avatar 和 banner 等图像属性可以引用来自不同链的 NFT。支持以下协议：

- http://
- https://
- ar://

> ℹ️ 如果您希望添加其他协议，我们很乐意这样做。请随时与我们联系！

> ❣️ 此外，Metaweave 团队为合并的 Pull Requests 提供资助。

对于每个图像属性，都会根据提供的原始 URI 生成一个`https` URL。您可以使用后缀 `URL`
访问它。

例如：   

| 属性名称 | 价值 |
| --- | --- |
| profile.avatar | ar://xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI |
| profile.avatarURL | https://arweave.net/xqjVvn9b8hmtDJhfVw80OZzAsn-ErpWbaFCPZWG5vKI |

## **数据协议**

Account 是 Arweave 上的一个简单的原生数据协议。它由一个包含最新数据状态的简单事务组成。钱包密钥附加到其自己的最新写入，标签为 `Protocol-Name: 'Account-<version>'`

例如：

使用 [ArQL](https://www.npmjs.com/package/ar-gql) 请求最新更新的帐户资料

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

## **数据架构**

在 arweave 账户协议中，一组代表用户配置文件的数据被编码存储在交易中，并解码为 `ArAccount`类型的对象。

以下是钱包`aIUmY9Iy4qoW3HOikTy6aJww-mM4Y-CUJ7mXoPdzdog`的编码和解码账户数据集示例：

**编码的 arweave 账户数据（写在链上）**

```
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

## **解码后的 arweave 帐户数据**

以下是使用库获得的数据集

```
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

为了方便起见，添加了相关的`txid`和钱包`addr`。此外，您还可以访问从用户选择的用户名及其钱包地址派生的完整唯一`handle`

## **从1.2.5迁移到1.3.x**

1、唯一用户名（名称#xxxxxx）位于帐户级别

`account.profile.handle`
->`account.handle`

从用户选择的用户名及其钱包地址派生的唯一用户名现在可以在`account`级别访问。

在 `account.profile`对象中，有一个新的属性`handleName`可用，它仅构成用户名的名称部分。

2、URL 资源自动生成

您不再需要从 `avatar`属性制作 URL。该库现在提供可在任何标准标签中使用的 URL。
