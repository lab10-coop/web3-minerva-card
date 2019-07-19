

# Transactions

web3 libarary has a lot of different classes that represent a transaction (signed and unsingned ones)
in order to get an overview i try to list those that are used in the context of this project.


## web3 style js transaction object

the most seen transaction object used by `web3.eth.sendTransaction()`.
see: https://web3js.readthedocs.io/en/1.0/web3-eth.html#sendtransaction

## web3 signedTransactionData

The signed data RLP encoded transaction in HEX string format. see `web3.eth.sendSignedTransaction(signedTransactionData [, callback])`
see:https://web3js.readthedocs.io/en/1.0/web3-eth.html?highlight=sendsignedtransaction#sendsignedtransaction

## web3 transactionSigner SignedTransaction

```
interface SignedTransaction {
    messageHash: string,
    v: string,
    r: string,
    s: string,
    rawTransaction: string
}
```

https://web3js.readthedocs.io/en/1.0/web3-shh.html#web3-module-transactionsigner