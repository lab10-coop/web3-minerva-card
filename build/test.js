"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const web3_1 = __importDefault(require("web3"));
// abstract class App {
//   static init() : any {
//   }
// }
async function test() {
    console.log('started a test!');
    const cardSigner = new index_1.MinervaCardSigner();
    const web3Instance = new web3_1.default('');
    const transaction = {
        to: '0x3939A535d686Da047C589c80538cEb6CfFC933EE',
        value: '0x1000',
        gasPrice: web3_1.default.utils.toHex('100000000'),
    };
    const result = await web3Instance.eth.sendTransaction(transaction);
}
test();
//# sourceMappingURL=test.js.map