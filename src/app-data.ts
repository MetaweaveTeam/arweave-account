import { Async } from 'crocks'
import { lensPath, map, path, prop, set } from 'ramda'
import { T_profile } from './types'

declare var arweaveWallet: any;

interface Tag {
  name: string,
  value: string
}

// @ts-ignore
const { fromPromise, of } = Async

export default function ({ arweave, ardb, appIdentifier }: any, addr: string) {
  const get = fromPromise(arweave.api.get.bind(arweave.api))
  //const post = fromPromise(arweave.api.post.bind(arweave.api))

  const createTx = fromPromise(arweave.createTransaction)
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
    .map(x => (console.log(x), x))
    .map(prop('id'))
    .chain(get)
    .map(prop('data'))

  const writeProfile = (profile: T_profile) =>
    of({ data: profile })
      .chain(createTx)
      .map((tx: any) => {
        map(({ name, value }: Tag) => tx.addTag(name, value), [
          { name: 'Protocol-Name', value: 'Account-0.2' },
          { name: 'handle', value: profile.handle }
        ])
        return tx
      })
      .chain(dispatch)
      .toPromise()

  return {
    get: (key: string) =>
      getProfile(addr)
        .map(path([appIdentifier, key]))
        .toPromise()
    ,
    set: (key: string, value: any) => {
      getProfile(addr)
        .map(set(lensPath([appIdentifier, key]), value))
        .chain(writeProfile)
        .toPromise()
    }

  }

}