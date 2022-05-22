import { Async } from 'crocks'
import { compose, head, lensPath, map, path, prop, set } from 'ramda'
import { T_profile } from './types'

declare var arweaveWallet: any;

interface Tag {
  name: string,
  value: string
}

// @ts-ignore
const { fromPromise, of } = Async
// @ts-ignore
const getFirstTxId = compose(prop('id'), head)

export default function ({ arweave, ardb, appIdentifier }: any, addr: string) {
  const get = fromPromise(arweave.api.get.bind(arweave.api))
  //const post = fromPromise(arweave.api.post.bind(arweave.api))

  const createTx = fromPromise(arweave.createTransaction.bind(arweave))

  const dispatch = fromPromise((tx: unknown) => {
    if (arweaveWallet) {
      return arweaveWallet.dispatch(tx)
    }
    arweave.transactions.sign(tx)
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
      .map((tx: any) => {
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
    set: (key: string, value: any) =>
      getProfile(addr)
        .map(set(lensPath(['apps', appIdentifier, key]), value))
        .chain(writeProfile)
        .toPromise()


  }

}