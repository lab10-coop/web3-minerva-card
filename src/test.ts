
import { MinervaCardSigner } from './index';
import web3 from 'web3';
import ethereumjsUtil from 'ethereumjs-util';

// import web3Core from 'web3-core';

// import { Provider, HttpProvider } from 'web3/providers';

// abstract class App {

//   static init() : any {

//   }
// }

async function test() {
  console.log('started a test!');

  const cardSigner = new MinervaCardSigner();
  const web3Address = 'https://rpc.tau1.artis.network';

  // web3Core.AbstractWeb3Module

  const web3tmp = new web3(web3Address);

  const web3Options = {
    transactionConfirmationBlocks: 1,
    defaultGasPrice : web3tmp.utils.toHex('100000000000'),
    transactionSigner : cardSigner,
  };

  // const provider = new HttpProvider();

  // const web3Instance = new Web3(web3Address , null, web3Options);
  const web3Instance = new web3(web3Address, undefined, web3Options);

  const transaction = {
    from: '0x756269ce7e0285670ecbd234f230645efba049d3',
    to:   '0x3939a535d686da047c589c80538ceb6cffc933ee',
    value: '0x1000',
    gasPrice: web3Instance.utils.toHex('100000000000'), // 100 gwei
    gas:  web3Instance.utils.toHex('21000'),
  };

  console.log('sending transaction...');
  const result = await web3Instance.eth.sendTransaction(transaction);
  console.log('transaction sent!', result);
}

function testFailingEcrecover() {

  const r = Buffer.from('15670e3c763598c4c1835519ba20cef01ea381fb6fec41a38cee2c11745a7d25', 'hex');
  const s = Buffer.from('2963c8c2ec1f9fda414b1d1b9088813f2b9b1bc8f603574059834dddfc389a5b', 'hex');
  const v = 27;
  const hash = Buffer.from('b0218d7a7f531b586e6a8fc6c117a6ba169c410d7cdfff47cd6c314231c63c12', 'hex');

  console.log('r:' +  r.toString('utf-8'));

  const pubKey = ethereumjsUtil.ecrecover(hash, v, r, s);

  console.log('publicKey:' +  pubKey.toString('utf-8'));

}

// testFailingEcrecover();
test();
