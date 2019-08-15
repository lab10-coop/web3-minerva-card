
import { MinervaCardSigner } from './index';
import web3 from 'web3';

// abstract class App {

//   static init() : any {

//   }
// }

async function test() {
  console.log('started a test!');
  const cardSigner = new MinervaCardSigner();

  const web3Instance = new web3('');

  const transaction = {
    to: '0x3939A535d686Da047C589c80538cEb6CfFC933EE',
    value: '0x1000',
    gasPrice: web3.utils.toHex('100000000'), // 100 gwei
  };

  const result = await web3Instance.eth.sendTransaction(transaction);
}

test();
