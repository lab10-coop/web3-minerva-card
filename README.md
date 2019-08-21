# About

This library implements a module for [web3.js](https://github.com/ethereum/web3.js/) which allows to sign arbitrary Ethereum transactions with the Minerva Card.  
It's suited for deployments of desktop Dapps or Dapps running on standalone devices (e.g. a Raspberry Pi).  
At the moment it's not suited for browser Dapps because of the limitations of the Web platform in regard to accessing NFC devices. 

# Requirements

- Linux OS - tested with Ubuntu 18.04 LTS - but most other common Linux distros should do as well
- [Node.js](https://nodejs.org/en/) v10 LTS (tested with v10.15.3)
- [NPM](https://www.npmjs.com/get-npm) (tested with v6.4.1)
- A Minerva Card
- An NFC Card reader that is supported by [PCSC lite](https://pcsclite.apdu.fr/)
- The pcsclite libraries need to be installed on the system. For example, in Debian/Ubuntu: `apt-get install libpcsclite1 libpcsclite-dev`
- libudev and libusb 1.0.8 or later
- Ethereum or an Ethereum compatible sidechain (e.g. [ARTIS](https://artis.eco/)) 

# Example
```javascript
const web3 = require('web3');
const web3MC = require('web3-minerva-card');

function wait(ms) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

async function test() {
  console.log('started a test!');
  const cardSigner = new web3MC.MinervaCardTransactionSigner(1, true);
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

# Troubleshooting 

## Linux

There are known problems with PC/SC Smart Card Daemon (pcscd). Sometimes the card reader stops working immediately after plugging it in or booting up the computer. A restart of the daemon can help in this case: `systemctl restart pcscd`
