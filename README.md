# web3-s2g

A nodejs library for interacting with the Infineon Securiy2Go SmartCard for signing transactions for ethereum blockchain based systems on a nodejs server.
Since websites cannot directly interact with USB devices or NFC-Readers (web-nfc does NOT solve this issue in this case) this library works only for nodejs server instance. 

# Requirements

- A NFC Card reader that is supported by [PCSC lite](https://pcsclite.apdu.fr/)
- In order to install the package you need to have installed in the system the pcsclite libraries. For example, in Debian/Ubuntu: `apt-get install libpcsclite1 libpcsclite-dev`
- Access to an Ethereum compatible blockchain
- A [Security2Go NFC Card](https://github.com/Infineon/blockchain) 
- Linux OS - tested with Ubuntu 18 LTS - but most other common Linux distros should do as well
- libudev and libusb 1.0.8 or later
- [Node.js](https://nodejs.org/en/) v10 LTS (tested with v10.15.3)
- [NPM](https://www.npmjs.com/get-npm) (tested with v6.4.1)

# Example in js
```javascript
const web3 = require('web3');
const web3s2g = require('web3-s2g');

function wait(ms) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

async function test() {

  console.log('started a test!');
  const cardSigner = new web3s2g.MinervaCardTransactionSigner(1, true);
  const web3Address = 'https://rpc.tau1.artis.network';

  const web3Options = {
    transactionSigner : cardSigner,
  };

  const web3Instance = new web3(web3Address, undefined, web3Options);

  const transaction = {
    from: '0x756269ce7e0285670ecbd234f230645efba049d3' /* requires to be the address of the MinervaCard */,
    to:   '0x3939a535d686da047c589c80538ceb6cffc933ee',
    value: '0x1000',
    gasPrice: web3Instance.utils.toHex('100000000000'), // 100 gwei
    gas:  web3Instance.utils.toHex('21000'),
  };

  console.log('sending transaction...');
  const result = await web3Instance.eth.sendTransaction(transaction);
  console.log('transaction sent!', result);

}

test();
wait(600000);
```

# troubleshooting 

## Linux
There are known problems with PC/SC Smart Card Daemon (pcscd). Sometimes the cardreader stops working immediatly after plugging it in or booting up the computer. A restart of the daemon can help in this case `systemctl restart pcscd`
