"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const web3_1 = __importDefault(require("web3"));
async function test() {
    console.log('started a test!');
    const cardSigner = new index_1.MinervaCardSigner();
    const web3Address = 'https://rpc.tau1.artis.network';
    // web3Core.AbstractWeb3Module
    const web3tmp = new web3_1.default(web3Address);
    const web3Options = {
        transactionConfirmationBlocks: 1,
        defaultGasPrice: web3tmp.utils.toHex('100000000000'),
        transactionSigner: cardSigner,
    };
    // const provider = new HttpProvider();
    // const web3Instance = new Web3(web3Address , null, web3Options);
    const web3Instance = new web3_1.default(web3Address, undefined, web3Options);
    const transaction = {
        from: '0x756269ce7e0285670ecbd234f230645efba049d3',
        to: '0x3939a535d686da047c589c80538ceb6cffc933ee',
        value: '0x1000',
        gasPrice: web3Instance.utils.toHex('100000000000'),
        gas: web3Instance.utils.toHex('21000'),
    };
    console.log('sending transaction...');
    const result = await web3Instance.eth.sendTransaction(transaction);
    console.log('transaction sent!', result);
}
test();
//# sourceMappingURL=test.js.map