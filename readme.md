# apibtc.com Javascript API

[![npm package](https://nodei.co/npm/apibtc.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/apibtc/)

---

### Getting Started

You will first need an [ApiBtc](https://apibtc.com) account, your **secret key**, and a **wallet token**. See the ApiBtc docs here. https://apibtc.com/en/docs.



### Installation
```sh
npm i apibtc
```
or
```sh
yarn add apibtc
```



### Usage

The API uses Promises for all interaction.

```js
const ApiBtc = require('apibtc')({
  key: 'KEY',
  token: 'TOKEN'
})

ApiBtc.address()
  .then(a => {
    console.log(a.Address)
  })
  .catch(e => {
    console.log(e)
  })
```


---

## API Reference

### address(url)
- Creates a new one-time use address
- **url**: Your callback URL, where you will receive 6 confirmations.

### verify(data,[ip])
- Verify http post data using your key
- **data**: Must contain `hash`, `txid`, `apibtc_id`, and `address`
- **ip**: Optionally pass an ip address to check if it is coming from the correct ip

### balance([address])
- The balance of your wallet
- **address**: Filter by specific address

### send(address, amount)
### send([{address: address, amount: amount}...])
- Create a transaction to the specified wallet address. Takes an optional array instead of 2 params
- **address**: The address to send to
- **amount**: The amount to send

### history([start],[count])
- The your transaction history
- **start**: Transaction to start on. Defaults to 1
- **count**: Limit transactions to an amount. Defaults to 10

### count()
- Get the transaction count of your wallet

### validate(address)
- Validate an address and returns true or false
- **address**: Address to verify


### fee(address, amount)
- Estimate the network fee. Must have enough funds to estimate.
- **address**: Address to send to
- **amount**: Amount to send

---

## Examples

### Create a new wallet address:
```js
ApiBtc.address('http://yoursite/callback')
```

### Verify POST callback data with appropriate response:

```js
app.post('/callback', (req, res) => {
  let transactionid = 123
  let status = ApiBtc.verify(
    req.body,
    req.headers['x-forwarded-for'] || req.connection.remoteAddress
  )
  res.send('Successfully|' + transactionid)
})
```

### Check a wallet balance:

```js
ApiBtc.balance()

ApiBtc.balance('somebtcaddress')
```

### Create a new transaction:

```js
ApiBtc.send('somebtcaddress', .0001)

ApiBtc.send([
  {address: 'somebtcaddress', amount: 0.001},
  {address: 'somebtcaddress2', amount: 0.002}
])
```

### Check wallet history:

```js
ApiBtc.history(0,10)
```

### Get wallet transaction count:

```js
ApiBtc.count()
```

### Validate an address:

```js
ApiBtc.validate('somebtcaddress')
```

### Estimate network fee

```js
ApiBtc.fee('somebtcaddress', 0.002)
```
