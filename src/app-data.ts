import Arweave from 'arweave'
import ArDB from 'ardb'
import Transaction from "arweave/node/lib/transaction"

import { Async } from 'crocks'
import { compose, dissocPath, head, lensPath, map, path, prop, set } from 'ramda'
import { T_profile } from './types'

interface JWKPublicInterface {
  kty: string;
  e: string;
  n: string;
}

interface JWKInterface extends JWKPublicInterface {
  d?: string;
  p?: string;
  q?: string;
  dp?: string;
  dq?: string;
  qi?: string;
}

export interface AccountMgr {
  arweave: Arweave,
  ardb: ArDB,
  appIdentifier: string,
  jwk?: JWKInterface
}

interface Tag {
  name: string,
  value: string
}

// @ts-ignore
const { fromPromise, of } = Async
// @ts-ignore
const getFirstTxId = compose(prop('id'), head)

export default function ({ arweave, ardb, appIdentifier, jwk }: AccountMgr, addr: string) {
  const get = fromPromise(arweave.api.get.bind(arweave.api))
  //const post = fromPromise(arweave.api.post.bind(arweave.api))

  const createTx = fromPromise(arweave.createTransaction.bind(arweave))

  const dispatch = fromPromise((tx: Transaction) => {
    //const wallet : JWKInterface | string = jwk | 'use_wallet'; 
    return (jwk ? arweave.transactions.sign(tx, jwk) : arweave.transactions.sign(tx))
      .then(() => arweave.transactions.post(tx))
  })

  const getProfile = (addr: string) => of(addr)
    .chain(fromPromise((addr: string) => ardb
      .search('transactions')
      .tag('Protocol-Name', 'Account-0.2')
      .from(addr)
      .limit(1)
      .find()
    ))
    .map(getFirstTxId)
    .chain(get)
    .map(prop('data'))

  const writeProfile = (profile: T_profile) =>
    of({ data: JSON.stringify(profile) })
      .chain(createTx)
      .map((tx: Transaction) => {
        map(({ name, value }: Tag) => tx.addTag(name, value), [
          { name: 'Protocol-Name', value: 'Account-0.2' },
          { name: 'handle', value: profile.handle }
        ])
        return tx
      })
      .chain(dispatch)
      .map(() => ({ ok: true }))

  return {
    get: (key: string) =>
      getProfile(addr)
        .map(path(['apps', appIdentifier, key]))
        .toPromise()
    ,
    set: (key: string, value: unknown) =>
      getProfile(addr)
        .map(set(lensPath(['apps', appIdentifier, key]), value))
        .chain(writeProfile)
        .toPromise(),
    remove: (key: string) =>
      getProfile(addr)
        .map(dissocPath(['apps', appIdentifier, key]))
        .chain(writeProfile)
        .toPromise()


  }

}