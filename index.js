const
  request = require('request-promise'),
  md5 = require('md5')

class ApiBtc {
  constructor(params) {
    if (!params.token || !params.key) {
      throw 'Must pass an object containing both `key` and `token` to ApiBtc.'
    }

    this.token = params.token
    this.key = params.key

    this.api = 'https://apibtc.com/api/'
    this.apiip = '185.161.211.251'
  }

  _request(url, data, method, bool) {
    return new Promise((resolve, reject) => {
      let r = {
        url: this.api + url,
        method: method || 'GET'
      }

      data = data || {}
      data.token = this.token

      if (method == 'POST') {
        r.body = JSON.stringify(data)
      } else {
        r.qs = data
      }

      request
        .get(r)
        .then(d => {
          let j
          try {
            j = JSON.parse(d)
          } catch (e) {
            console.log('FAILED PARSE')
            return reject(d)
          }

          if (bool) {
            return resolve(j.success ? true : false)
          }

          if (j.success === false) {
            return reject(d.msg)
          } else {
            delete j.success
          }

          resolve(j)
        })
        .catch(reject)
    })
  }

  address(url) {
    if (!url) {
      return Promise.reject('createAddress requires a `url` argument.')
    }
    return new Promise((resolve, reject) => {
      this
        ._request('create_address', {callback: url})
        .then(d => {
          if (d.Res) {
            return resolve(d.Res)
          }
          reject(d)
        }).catch(reject)
    })
    return
  }

  verify(data, ip) {
    if (data.hash != md5(this.key + data.txid + data.apibtc_id + data.address)) {
      return false
    }
    if (ip && ip != this.apiip) {
      return false
    }
    return true
  }

  balance(address) {
    return this._request('get_balance', address ? {address: address} : null)
  }

  send(wallet, amount) {
    if (wallet instanceof Array) {
      for (let o of wallet) {
        if (!o.address || !o.amount) {
          return Promise.reject('Sending an array requies 2 paramaters per item, `address` and `amount`')
        }
      }
      return this._request('sendmoney', {outputs: wallet}, 'POST')

    } else {
      if (!wallet || !amount) {
        return Promise.reject('Send requies 2 paramaters, `address` and `amount`')
      }
      return this._request('sendmoney', {wallet: wallet, amount: amount})
    }
  }

  history(start, count) {
    start = parseInt(start) || 0
    count = parseInt(count) || 10
    return this._request('get_transaction', {start: start, count: count})
  }

  count() {
    return this._request('get_count_transaction')
  }

  validate(address) {
    if (!address) {
      return Promise.reject('Validate requies an `address`')
    }
    return this._request('validateaddress', {address: address}, null, true)
  }

  fee(address, amount) {
    if (!address || !amount) {
      return Promise.reject('Comission requies an `address` and `amount`')
    }
    return this._request('check_transaction_fee', {address: address, amount: amount})
  }
}

module.exports = params => {
  return new ApiBtc(params)
}
