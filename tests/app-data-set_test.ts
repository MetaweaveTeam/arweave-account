import { test } from 'uvu'
import * as assert from 'uvu/assert'
import nock from 'nock'

import AppData from '../src/app-data'
import Arweave from 'arweave'
import ArDB from 'ardb'

nock('https://arweave.net')
  .get('/')
  .reply(200)

nock('https://arweave.net')
  .get('/tx_anchor')
  .reply(200, 'xvK1W6Sm7J2byEz_c4RRN1zqKsY7xAladNeRtePe9OpOMmyQBSDvA9V9Y6CR-2ye')

nock('https://arweave.net')
  .get('/1HfOBWt5brDNNIt96fIRazPOUOxAF-p8R5_YXXo9hN0')
  .reply(200, {
    "addr": "",
    "links": { "twitter": "rakis_me", "github": "rakis-me" },
    "handle": "rakis",
    "name": "rakis",
    "bio": "Arweave Developer",
    "apps": {
      "permanotes": {
        "pk": "test-data"
      }
    }
  })

nock('https://arweave.net')
  .post('/graphql')
  .reply(200, {
    "data": {
      "transactions": {
        "pageInfo": { "hasNextPage": false },
        "edges": [{
          "cursor": "WyIyMDIyLTA1LTEwVDAwOjI1OjIxLjczOVoiLDFd",
          "node": {
            "id": "1HfOBWt5brDNNIt96fIRazPOUOxAF-p8R5_YXXo9hN0",
            "anchor": "WFG4spVRZWYcahoyMaJgFbEC1kX1a-bCh1cfaUQ0I6HrLrXk7mPuQ9azvgIrWKux",
            "signature": "Odq7lGxwTPhUKrQOZyXEuRJobiBOwv2C5OvPXd6EHrJMENf8naqN6CS6HkElcJmnSAojGplQxtCpJ-pawrBt82_wWPN9Y4cu3lO_n8I1OXc0nVGBehQpl733b3OVybEcBBZvaPyi9ekaP0L9WAE6rEhqwNdrUnyI_1mdUmGS336owc1WBMG8-YGSsh0HqmJeA3_irm-oTBWw4sHo6scsqBrD64lMgPf4UpyoEmYn5mcrfo-JHhQjT-gtvDcx6lesjzQ2_2lpHoIWNIGpf9o4X6q9jKjgipL0pZf5jpmoqOjOfIy7S7YSNM1iN7zHrby7pZJNZxdFE1PSX72B9McVR2sUBPyu27QYj5aqzKLYaE72NAkRP7P_U4yH_ywWKaHus_LJivJEFl9NEkqdtNlwdGiXG0pwiInAd9yuE0TDwnW0h5Ye6HCnQ8BOVPsDBm5Ro2beCUrYkRiWjGLa_7ZHlzqd0UEOk1fmKeRx7YjoLXqbDir2Pyd3eC5wS6zfYbGmklIe5g9m_Zsppchk9bqbpV3Rk6mT5o6G7OUaA_HxU2EWQK3YzMHS0q2cqR2WIfRcPhbuTsa6mZfyxPGsSK4-D6XNA8DXZlndqZbHNXrLpaupbQFX-mMsi-CckwLo9qHoPvC12ftKiHFjfkNacWLEXN60mW9iQyIpC3sr9L8lw3I", "recipient": "", "owner": { "address": "vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI", "key": "raUmzBSXLPX-G97EjgnPSAVYLbHHVF6yDJsoTGBB6CIl3CzDMULfOH5oAlHCWzQtqQaLq3JipwnD8qPGF4veJgn6_fYa5KRogN3EQpPSwb7akpo3Iutt5z0G8Hem9t3xw6ux6-DCxZL9p7FStMn8-DPrxAmG3Jz8yQP0lZUFDfeIhAds7wW1B0Z46IdTjkYv-JnvKmawR15Izw9M4ywh0FF9GPadGpisdZ1JmBNOfg3dd0y2V4HBa_ZT95H-qWdzo8f4YZPFLEddHlFhuFNZuHeYx8fLVCPziyoe36DM4jd4O1_80RtKWbFpwBWL4vdtuX0qUFSGEG9IQNECtsKLhXQnkYtjST-tJpWSJ8PmXfCeJsb2zxGfq8zZANGGmEcASP8KicxQEAKUd9boOEYDEbh_G37SJsjggxV9c09Wh2v8fW4ANv64F2rKY5FfAMhdDCcYNrYbk0wma9VFK2RWQrV1Am4XejGibrq0ulBSmB1VZDOi_BI_arsdZW9mxvI-FH9huiWhq_5nQ6kFMgkbO1vh09XyqrB2eNrxHYPpk4bEUfQ3TgjW-LKdn_0ERTgNhHamRACdYc7mcfDX3g8T3VfUtyH7Db8t-Fx_Xqj3qIDv2FB2ed1AHqk03YH-uE_Xe5XdZ8qqsJPgrqmXQXEuI7co4jI3SzHa6ewd3AhAHlc" }, "fee": { "winston": "58590163", "ar": "0.000058590163" }, "quantity": { "winston": "0", "ar": "0.000000000000" }, "data": { "size": "218", "type": null }, "tags": [{ "name": "Protocol-Name", "value": "Account-0.2" }, { "name": "handle", "value": "rakis" }], "block": { "id": "Ip2eAx52xsMWLW0R0vDTEJi9aKF5r2TcUYVyrw3jBVQLBsrnmQ7JYhyVt_oBqJQk", "timestamp": 1647803222, "height": 896470, "previous": "8hMLoHnlKJDm-pyLOvYcXMR4B1YYnbZm0WURHpenYOTfcQExDRBzphEWTcfaDzI9" }, "parent": null
          }
        }, {
          "cursor": "WyIyMDIyLTA1LTEwVDAwOjI1OjIxLjczOVoiLDJd", "node": {
            "id": "YRecidAYb-nlSW4rlRZlKzQ66qOhPrGvBMX8qLguHfE", "anchor": "MN4Rxp167AUtx3AnfFu-Nf9-06A5ikDuba73wHve0h0K8kf2jSaEzuLUllfze23Y", "signature": "c-vc49pd1wI-7YBWMDcK3D1uh44lpvJB1iRG2Dxi1-Wli7mhaZwDqe2WJxqhP8aT5lNjtSh-WsTgQdhpmOAZYGrmZWpfEu7waDUHG_UcHmL-nK41kLgRtunR_l3O4IREfNxevbgsYxNTB9nTDCIhctWGLEKGCJx-3JtsdXKqE5f2wfUrGN-RQgowR4jdlnfxegcn0cR3D5BX2cgF6gGVAzEnL3qE9LaQqmXK7DoeMlj3es66A4_yU_oOmiemPNLTX_wRlA2fSyR4EBKJvD-amvLofj20doeCGVdQRddaPudeez8BOlGmT27Psn54t39OpyXWRMpizS9DhZ-pEtdx-4iUvpPI45bYRmKJM86RcMyiN6XoRateNm97-k4r3wQ229lMpN-2U3UVBfcrw3Qkn90PVO56uPq_qinaqpdBxuHBP4bKm7PX3n4N8Gdva-HyohMpLWUz1Jo92hn9pIdWaE2WwDevIloXg-nGwvoq3jKqVIgsc-z8e4FhNhIDs1yVwFW4Xwc_UHZhN_YsvamvPFx6NzaHd9D3T_K7XqYtLFF0XO1yBG9OFQNqSDqOqUt--2sNJahIL_eNzesa_ii4KF_lLo_g3HJFcwgxoZZx6B_jd-prUzm3jmVDZ3UA7LVle_oOkmrvPH4bm7Z0rKhBVgqUC_X4dh63ge38nsHQBjQ", "recipient": "", "owner": { "address": "vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI", "key": "raUmzBSXLPX-G97EjgnPSAVYLbHHVF6yDJsoTGBB6CIl3CzDMULfOH5oAlHCWzQtqQaLq3JipwnD8qPGF4veJgn6_fYa5KRogN3EQpPSwb7akpo3Iutt5z0G8Hem9t3xw6ux6-DCxZL9p7FStMn8-DPrxAmG3Jz8yQP0lZUFDfeIhAds7wW1B0Z46IdTjkYv-JnvKmawR15Izw9M4ywh0FF9GPadGpisdZ1JmBNOfg3dd0y2V4HBa_ZT95H-qWdzo8f4YZPFLEddHlFhuFNZuHeYx8fLVCPziyoe36DM4jd4O1_80RtKWbFpwBWL4vdtuX0qUFSGEG9IQNECtsKLhXQnkYtjST-tJpWSJ8PmXfCeJsb2zxGfq8zZANGGmEcASP8KicxQEAKUd9boOEYDEbh_G37SJsjggxV9c09Wh2v8fW4ANv64F2rKY5FfAMhdDCcYNrYbk0wma9VFK2RWQrV1Am4XejGibrq0ulBSmB1VZDOi_BI_arsdZW9mxvI-FH9huiWhq_5nQ6kFMgkbO1vh09XyqrB2eNrxHYPpk4bEUfQ3TgjW-LKdn_0ERTgNhHamRACdYc7mcfDX3g8T3VfUtyH7Db8t-Fx_Xqj3qIDv2FB2ed1AHqk03YH-uE_Xe5XdZ8qqsJPgrqmXQXEuI7co4jI3SzHa6ewd3AhAHlc" },
            "fee": { "winston": "58590163", "ar": "0.000058590163" },
            "quantity": { "winston": "0", "ar": "0.000000000000" },
            "data": { "size": "120", "type": null },
            "tags": [{ "name": "Protocol-Name", "value": "Account-0.2" }, { "name": "handle", "value": "rakis" }],
            "block": {
              "id": "WITDG2fv5wHDlYrzAymOu3ziTZpAGklb_bueHxz9t-Q4jVEfICmAaMtRv1AyNwaz",
              "timestamp": 1647802445,
              "height": 896465,
              "previous": "P7wNkn4y3IJKuLzAGI-oAIkyxJpn1xA4uYg8fFVv5gBqBh1sYPhXKigjHN7P18Bu"
            }, "parent": null
          }
        }]
      }
    }
  })

nock('https://arweave.net')
  .get('/price/161')
  .reply(200, '73874553')

nock('https://arweave.net')
  .post('/tx')
  .reply(200)

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const appIdentifier = 'permanotes'
const addr = 'x4PpVA-uhpIsUWNB8gLtMLMS3OClviGoMwJCndhPS3c'

test('set appInfo item', async () => {
  const jwk = await arweave.wallets.generate()
  const ardb = new ArDB(arweave)
  const appData = AppData({ arweave, ardb, appIdentifier, jwk }, addr)

  const result = await appData.set('pk', 'test-1234')
  console.log(result)
  assert.ok(result.ok)
})

test.run()