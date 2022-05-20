import { Async } from 'crocks'
import { map, path, prop } from 'ramda'
import { T_profile } from './types'


export default function ({ arweave, ardb, appIdentifier }, addr: string) {
  const createTx = Async.fromPromise(arweave.createTransaction)
  const dispatch = Async.fromPromise((tx: unknown) => {
    if (arweaveWallet) {
      return arweaveWallet.dispatch(tx)
    }
    arweave.transactions.sign(tx)
      .then(() => arweave.transactions.post(tx))
  })
  const getProfile = (addr: string) => Async.of(addr)
    .chain(Async.fromPromise((addr: string) => ardb
      .search('transactions')
      .tag('Protocol-Name', 'Account-0.2')
      .from(addr)
      .limit(1)
      .find()
    ))
    .map(prop('id'))
    .chain(Async.fromPromise(arweave.api.get))
    .map(prop('data'))

  const writeProfile = (profile: T_profile) =>
    Async.of(profile)
      .chain(createTx)
      .map(tx => {
        map(({ name, value }) => tx.addTag(name, value), [
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