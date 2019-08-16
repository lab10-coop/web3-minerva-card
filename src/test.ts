
import { MinervaCardSigner } from './index';
import web3 from 'web3';
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
    gasPrice: web3Instance.utils.toHex('100000000'), // 100 gwei
  };

  console.log('sending transaction...');
  const result = await web3Instance.eth.sendTransaction(transaction);
  console.log('transaction sent!', result);
}

test();
