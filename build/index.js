"use strict";
/**
* @file Web3 Security2Go
* @author Thomas Haller <thomas.haller@lab10.coop>
* @version 0.1
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var web3utils = require("web3-utils");
var util = require("util");
var Tx = require("ethereumjs-tx");
var utils = require("ethereumjs-util");
function toHex(nonHex, prefix) {
    if (prefix === void 0) { prefix = true; }
    var temp = nonHex.toString("hex");
    if (prefix) {
        temp = "0x" + temp;
    }
    return temp;
}
function toHexString(byteArray) {
    var s = "0x";
    byteArray.forEach(function (byte) {
        s += ("0" + (byte & 0xFF).toString(16)).slice(-2);
    });
    return s;
}
function isError(code) {
    if (code[0] === 0x90 && code[1] === 0) {
        return false;
    }
    return true;
}
/**
 *
 * @param {byte[]} errorCode byte array with the error information at position 0 and zero
 * @returns {string} error message
 */
function getGenericErrorAsString(errorCode) {
    // todo: maybe thread the error codes in lookup tables ?
    // that would make it easier to distinguish between generic and specific errors.
    // success is not an error. please check for success state before.
    if (errorCode[0] === 0x90 && errorCode[1] === 0) {
        return "Success";
    }
    if (errorCode[0] === 0x64) {
        return "Operation failed (" + errorCode[1] + ")";
    }
    if (errorCode[0] === 0x67 && errorCode[1] === 0) {
        return "Wrong length";
    }
    if (errorCode[0] === 0x69) {
        if (errorCode[1] === 0x82) {
            return "Global or key-specific signature counter exceeded";
        }
    }
    if (errorCode[0] === 0x6A) {
        if (errorCode[1] === 0x86) {
            return "Incorrect parameters P1/P2";
        }
        // this is NOT documented as a "Generic Error" but for now it seems to be safe to thread it like this.
        if (errorCode[1] === 0x88) {
            return "Key slot with given index is not available";
        }
    }
    if (errorCode[0] === 0x6D && errorCode[1] === 0) {
        return "Instruction code is not supported or invalid or application has not selected with the SELECT APP command";
    }
    if (errorCode[0] === 0x6E && errorCode[1] === 0) {
        return "Class not supported";
    }
    if (errorCode[0] === 0x6F && errorCode[1] === 0) {
        return "Unknown Error";
    }
    function InttoHex(d) {
        return ("0" + Number(d).toString(16)).slice(-2).toUpperCase();
    }
    return "ErrorCode Unknown:" + InttoHex(errorCode[0]) + " " + InttoHex(errorCode[1]);
}
function parseSelectAppResponse(response) {
    var result = {
        pinActivationStatus: 0,
        cardID: "",
        versionStringRaw: "",
        versionString: "",
        successRaw: "",
        success: true,
        errorString: "",
    };
    if (response.length === 2) {
        result.success = false;
        getGenericErrorAsString(response);
        result.errorString();
    }
    else if (response.length === 20) {
        var pinActivationStatusByte = response[0];
        result.pinActivationStatus = pinActivationStatusByte;
        result.cardID = response.slice(1, 11);
        result.versionStringRaw = response.slice(11, 18);
        result.versionString = result.versionStringRaw.toString("ascii");
        var responseSuccess = response.slice(19, 20);
        if (responseSuccess[0] === 0x90 && responseSuccess[1] === 0x0) {
            result.success = true;
        }
        else {
            // according to S2G documentation that else should never hit.
            result.success = false;
            result.errorString = getGenericErrorAsString(responseSuccess);
        }
        // result.pinActivationStatus = response[0];
    }
    else if (response.length === 14) {
        // TODO:
        // according to Documentation, SELECT APP response should be 20 bytes, but is 14.
        console.log(toHexString(response));
    }
    else {
        throw Error("unexpected SelectAppResponse length: " + response.length);
    }
    return result;
}
/**
* Sends raw byte commands to the card and receives the response.
* sends the always required SelectApp command in advance.
*
* @param {Security2GoCard} card object
* @param {byte[]} bytes raw byte[] with the netto data.
* @param {receiveHandler} callback once the operation is finished.
*/
function sendCommand(card, bytes, receiveHandler) {
    if (receiveHandler === void 0) { receiveHandler = null; }
    var maxResponseLength = 128;
    card.logSigning("connecting...");
    card.reader.connect({}, function (errConnect, protocolConnnected) {
        if (errConnect) {
            console.error("Connecting Error:" + errConnect);
        }
        else {
            var protocol_1 = protocolConnnected;
            if (protocol_1 === undefined) {
                protocol_1 = card.PROTOCOL_ID;
            }
            card.logSigning("protocol:" + protocol_1);
            var selectAppIncldingCommand = [0x00, 0xA4, 0x04, 0x00, 0x0D,
                0xD2, 0x76, 0x00, 0x00, 0x04, 0x15, 0x02, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01 /* end of body */, 12];
            card.reader.transmit(Buffer.from(selectAppIncldingCommand), maxResponseLength, protocol_1, function (errSelectAppTransmit, dataSelectAppTransmit) {
                card.logSigning("select App Completed");
                if (errSelectAppTransmit) {
                    console.error(errSelectAppTransmit);
                }
                else {
                    var selectAppResponse = parseSelectAppResponse(dataSelectAppTransmit);
                    card.logSigning("SelectApp result: " + JSON.stringify(selectAppResponse) + " ");
                    // todo: validate result.
                    card.reader.transmit(Buffer.from(bytes), maxResponseLength, protocol_1, function (err, dataTransmit) {
                        if (err) {
                            // todo: interprate error here ?
                            card.logSigning("Error on transmitting");
                            card.logSigning(err);
                            return [];
                        }
                        // asume all 2 byte results are errors ?!
                        if (dataTransmit.length === 2 && isError(dataTransmit)) {
                            var errorMsg = getGenericErrorAsString(dataTransmit);
                            console.error("Received Data is Error received: " + errorMsg);
                            throw errorMsg;
                        }
                        card.logSigning(receiveHandler);
                        // reader.close();
                        // pcsc.close();
                        if (receiveHandler != null) {
                            receiveHandler(dataTransmit);
                        }
                        return true;
                    });
                }
            });
        }
    });
}
function generateSignatureRaw(card, bytes, keyIndex) {
    return __awaiter(this, void 0, void 0, function () {
        function generateSignatureRawFunction(args, callback) {
            // const { bytes } = args;
            // const { keyIndex } = args;
            // const { card } = args;
            if (bytes.length !== 32) {
                var error = "message to sign needs to be 32 byte long. got:" + bytes.length;
                card.logSigning(error);
                throw error;
            }
            var messageBuffer = new ArrayBuffer(38);
            var messageBufferView = new Int8Array(messageBuffer);
            messageBufferView[1] = 0x18;
            messageBufferView[2] = keyIndex;
            messageBufferView[3] = 0x00;
            messageBufferView[4] = 0x20;
            messageBufferView.set(bytes, 5);
            card.logSigning("signing: " + toHexString(messageBufferView));
            sendCommand(card, messageBuffer, function (sendCommandResponse, error) {
                if (sendCommandResponse) {
                    card.logSigning("Signing: Got Response: " + toHexString(sendCommandResponse));
                    if (sendCommandResponse[sendCommandResponse.length - 2] === 0x90
                        && sendCommandResponse[sendCommandResponse.length - 1] === 0) {
                        card.logSigning("card Signature is a success!");
                        // todo:
                        var resultBin = sendCommandResponse.slice(9, sendCommandResponse.length - 2);
                        var result = web3utils.bytesToHex(resultBin);
                        callback(null, result);
                        return;
                    }
                    console.error("Signing: not implmented signing response:" + toHexString(sendCommandResponse));
                }
                if (error) {
                    console.error("Signing Error: " + error);
                    callback(error, null);
                }
            });
        }
        var func;
        return __generator(this, function (_a) {
            func = util.promisify(generateSignatureRawFunction);
            return [2 /*return*/, func({ card: card, bytes: bytes, keyIndex: keyIndex })];
        });
    });
}
var Security2GoCard = /** @class */ (function () {
    /**
       * Represents an Infinion Security2Go played on a card reader using the pcsclite framework.
       *
       * @param {pcsclite.CardReader} reader a CardReader from pcsclite.
       */
    function Security2GoCard(reader) {
        this.reader = reader;
        // todo: in our case protocol was allways 2. sometimes reader.connect() delievers a protocol number, sometimes not
        // this is a very uncool workaround for this problem.
        this.PROTOCOL_ID = 2;
        this.log_debug_signing = false;
        this.log_debug_web3 = false;
    }
    /**
      * returns the publicKey of the given index of the card.
      * for retrieving the (ethereum) address call getAddress(keyIndex)
      * @param {byte} cardKeyIndex
      * index (0..255) of the Security2Go Card.  defaults to 1 (first generated key on the card)
      * @return {string} public key
      */
    Security2GoCard.prototype.getPublicKey = function (cardKeyIndex) {
        if (cardKeyIndex === void 0) { cardKeyIndex = 1; }
        return __awaiter(this, void 0, void 0, function () {
            function getPublicKeyFunction(args, callback) {
                var card = args.card;
                sendCommand(card, args.command, function (response) {
                    if (response.length === 2) {
                        if (response[0] === 0x69) {
                            if (response[1] === 82) {
                                card.logSigning("Maximal number of key import calls exceeded (Security status not satisfied)");
                            }
                            else if (response[1] === 85) {
                                card.logSigning("Not authenticated with PIN (Condition of use not satisfied)");
                            }
                        }
                        if (response[0] === 0x6a && response[1] === 0x88) {
                            card.logSigning("Key slot with given index is not available");
                        }
                    }
                    else if (response.length === 75) {
                        // var sec1EncodedPublicKey =  response.slice(8, 64);
                        // card.logSigning('response: ' + response);
                        card.logSigning("result_code: " + response[73] + " " + response[74]);
                        // card.logSigning('Public key:' + keyIndex + ':' + toHexString(publicKey));
                        var buffer = response.slice(9, 64 + 9);
                        // var bufferHex = toHexString(buffer);
                        callback(null, buffer);
                    }
                    else {
                        card.logSigning("Unknown response: length: " + response.length + " - " + response);
                    }
                });
            }
            var card, command, func;
            return __generator(this, function (_a) {
                card = this;
                card.logSigning("getting key #" + cardKeyIndex);
                command = [0x00, 0x16, cardKeyIndex, 0x00, 0x00];
                card.logSigning("response");
                func = util.promisify(getPublicKeyFunction);
                return [2 /*return*/, func({ card: this, command: command })];
            });
        });
    };
    /**
      * returns the (ethereum) address of the given index of the card.
      * for retrieving the raw public key call getPublicKey(keyIndex)
      * @param {byte} keyIndex index (0..255) of the Security2Go Card. defaults to 1 (first generated key on the card)
      * @return {string} public key
      */
    Security2GoCard.prototype.getAddress = function (keyCardIndex) {
        if (keyCardIndex === void 0) { keyCardIndex = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var publicKey, publicKeyHex, address;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPublicKey(keyCardIndex)];
                    case 1:
                        publicKey = _a.sent();
                        publicKeyHex = web3utils.bytesToHex(publicKey);
                        this.logSigning("publicKeyHex:");
                        this.logSigning(publicKeyHex);
                        address = "0x" + web3utils.sha3(publicKeyHex).slice(26);
                        this.logSigning("address");
                        this.logSigning(address);
                        return [2 /*return*/, address];
                }
            });
        });
    };
    /**
      * Generates a signature for a given web3 style transaction
      * @param {Web3} web3 a Web3 instance.
      * @param {*} rawTransaction a Web3 style transaction.
      * @param {byte} cardKeyIndex keyIndex index (0..255) of the Security2Go Card.
      * defaults to 1 (first generated key on the card)
      * @returns hex-serialized transaction object (use getSignedTransactionObject() to get the raw object)
      */
    Security2GoCard.prototype.signTransaction = function (web3, rawTransaction, cardKeyIndex) {
        if (cardKeyIndex === void 0) { cardKeyIndex = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSignedTransaction(web3, rawTransaction, cardKeyIndex)];
                    case 1:
                        tx = _a.sent();
                        return [2 /*return*/, tx.rawTransaction];
                }
            });
        });
    };
    /**
      * Generates a ethereum compatible secp256k1 signature for the given hash
      * @param {string} hashString hex encoded hash string.
      * @param {byte} cardKeyIndex keyIndex index (0..255) of the Security2Go Card.
      * defaults to 1 (first generated key on the card)
      */
    Security2GoCard.prototype.getSignatureFromHash = function (hashString, cardKeyIndex) {
        if (cardKeyIndex === void 0) { cardKeyIndex = 1; }
        return __awaiter(this, void 0, void 0, function () {
            function isAddressMatching(testingVvalue) {
                var pubKey = utils.ecrecover(hashBytes, testingVvalue, result.r, result.s);
                // console.log('comparing public key');
                // console.log(pubKey);
                // console.log(correctPublicKey);
                return correctPublicKey.equals(pubKey);
            }
            var hash, hashBytes, cardSig, rStart, length, rLength, r, sStart, sLength, s, result, correctPublicKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hash = hashString;
                        if (typeof hash === "string") {
                            if (hash.startsWith("0x")) {
                                hash = hash.substring(2, hash.length);
                            }
                            hashBytes = Buffer.from(hash, "hex");
                        }
                        else {
                            hashBytes = hash;
                        }
                        this.logSigning("hash:" + hash);
                        this.logSigning("buffer.length: " + hashBytes.length);
                        return [4 /*yield*/, generateSignatureRaw(this, hashBytes, cardKeyIndex)];
                    case 1:
                        cardSig = _a.sent();
                        this.logSigning("tries to generate signature.");
                        // const cardSig = await wrapper.generateSignature(1, hash.toString('hex'));
                        this.logSigning("cardSig");
                        this.logSigning(cardSig);
                        rStart = 6;
                        length = 2;
                        rLength = parseInt(cardSig.slice(rStart, rStart + length), 16);
                        this.logSigning("rLength");
                        this.logSigning(rLength);
                        rStart += 2;
                        r = cardSig.slice(rStart, rStart + rLength * 2);
                        this.logSigning("r");
                        this.logSigning(r);
                        console.assert(r.length === rLength * 2, "r should be length " + rLength * 2 + " but has length " + r.length);
                        sStart = rStart + rLength * 2 + 2;
                        sLength = parseInt(cardSig.slice(sStart, sStart + length), 16);
                        this.logSigning("sLength");
                        this.logSigning(sLength);
                        sStart += 2;
                        s = cardSig.slice(sStart, sStart + sLength * 2);
                        this.logSigning("s");
                        this.logSigning(s);
                        console.assert(s.length === sLength * 2, "s should be length " + sLength * 2 + " but has length " + s.length);
                        result = {
                            r: "0x" + r,
                            s: "0x" + s,
                        };
                        return [4 /*yield*/, this.getPublicKey(cardKeyIndex)];
                    case 2:
                        correctPublicKey = _a.sent();
                        if (isAddressMatching("0x1b")) {
                            result.v = "0x1b";
                        }
                        else if (isAddressMatching("0x1c")) {
                            result.v = "0x1c";
                        }
                        else {
                            throw Error("unable to determine correct v value");
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * @param {Web3} web3
     * @param {object} rawTransaction web3 style transaction object
     * @param {byte} cardKeyIndex
     * @returns object with r,s,v,hash,rawTransaction. compatible with interface required by web3.
     * compatible with transactionSigner.
     */
    Security2GoCard.prototype.getSignedTransaction = function (web3, rawTransaction, cardKeyIndex) {
        if (cardKeyIndex === void 0) { cardKeyIndex = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var address, transaction, _a, _b, _c, tx, result, hashBytes, rsSig;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getAddress(cardKeyIndex)];
                    case 1:
                        address = _d.sent();
                        this.logSigning("address");
                        this.logSigning(address);
                        transaction = JSON.parse(JSON.stringify(rawTransaction));
                        if (!!transaction.nonce) return [3 /*break*/, 3];
                        _a = transaction;
                        _c = (_b = web3.utils).toHex;
                        return [4 /*yield*/, web3.eth.getTransactionCount(address)];
                    case 2:
                        _a.nonce = _c.apply(_b, [_d.sent()]);
                        _d.label = 3;
                    case 3:
                        // todo: is it safe to not add the "from" addres ?
                        // maybe we should throw an error if "from" is not the signing card ?
                        // if (!transaction.from) {
                        //   transaction.from = address;
                        // }
                        // removed EIP-155 transaction for now
                        // since it caused invalid signatures.
                        transaction.chainId = undefined;
                        tx = new Tx(transaction);
                        result = {
                            r: "0x",
                            s: "0x",
                            v: "0x",
                            messageHash: "0x",
                            rawTransaction: "0x",
                        };
                        hashBytes = tx.hash(false);
                        result.messageHash = "0x" + toHex(hashBytes, false);
                        this.logSigning("hash");
                        this.logSigning(result.messageHash);
                        return [4 /*yield*/, this.getSignatureFromHash(result.messageHash, cardKeyIndex)];
                    case 4:
                        rsSig = _d.sent();
                        result.r = rsSig.r;
                        result.s = rsSig.s;
                        result.v = rsSig.v;
                        tx.r = rsSig.r;
                        tx.s = rsSig.s;
                        tx.v = rsSig.v;
                        result.rawTransaction = toHex(tx.serialize());
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
       * @param {Web3} web3 a Web3 instance
       * @param {object} web3 transaction tx
       * @param {number} cardKeyIndex keyIndex index (0..255) of the Security2Go Card
       * @throws {*} error from sendSignedTransaction
       * @return {receipt} the web3 receipt
       */
    Security2GoCard.prototype.signAndSendTransaction = function (web3, tx, cardKeyIndex) {
        if (cardKeyIndex === void 0) { cardKeyIndex = 1; }
        return __awaiter(this, void 0, void 0, function () {
            var signature, txReceipt, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.signTransaction(web3, tx, cardKeyIndex)];
                    case 1:
                        signature = _a.sent();
                        this.logWeb3("tx: " + JSON.stringify(tx, null, 2));
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        this.logWeb3("sending transaction");
                        return [4 /*yield*/, web3.eth.sendSignedTransaction(signature)];
                    case 3:
                        txReceipt = _a.sent();
                        this.logWeb3("receipt: " + txReceipt);
                        return [2 /*return*/, txReceipt];
                    case 4:
                        error_1 = _a.sent();
                        // the following error occurs all the time.
                        // Error: Transaction has been reverted by the EVM:
                        // no idea why yet....
                        console.error("Error:", error_1);
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
       * console.log() if log_debug_web3
       * @param {*} message
       */
    Security2GoCard.prototype.logWeb3 = function (message) {
        if (this.log_debug_web3) {
            console.log(message);
        }
    };
    /**
       * console.log() if log_debug_signing
       * @param {*} message
       */
    Security2GoCard.prototype.logSigning = function (message) {
        if (this.log_debug_signing) {
            console.log(message);
        }
    };
    return Security2GoCard;
}());
var MinervaCardSigner = /** @class */ (function () {
    function MinervaCardSigner() {
        this.card = null;
        this.cardKeyIndex = 1;
        this.web3 = null;
    }
    MinervaCardSigner.prototype.sign = function (rawTx) {
        return __awaiter(this, void 0, void 0, function () {
            var signedTransaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("signing with MinervaCardSigner");
                        return [4 /*yield*/, this.card.getSignedTransaction(this.web3, rawTx, this.cardKeyIndex)];
                    case 1:
                        signedTransaction = _a.sent();
                        console.log("signed with MinervaCardSigner: " + JSON.stringify(signedTransaction));
                        return [2 /*return*/, signedTransaction];
                }
            });
        });
    };
    return MinervaCardSigner;
}());
module.exports = {
    Security2GoCard: Security2GoCard,
    MinervaCardSigner: MinervaCardSigner,
};
//# sourceMappingURL=index.js.map