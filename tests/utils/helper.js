"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.__esModule = true;
exports.getDummySigner = exports.getDummyUTXO = exports.dummyUTXO = exports.getDefaultSigner = exports.randomPrivateKey = exports.sleep = exports.inputSatoshis = void 0;
var scrypt_ts_1 = require("scrypt-ts");
var crypto_1 = require("crypto");
var privateKey_1 = require("./privateKey");
exports.inputSatoshis = 10000;
var sleep = function (seconds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                setTimeout(function () {
                    resolve({});
                }, seconds * 1000);
            })];
    });
}); };
exports.sleep = sleep;
function randomPrivateKey() {
    var privateKey = scrypt_ts_1.bsv.PrivateKey.fromRandom('testnet');
    var publicKey = scrypt_ts_1.bsv.PublicKey.fromPrivateKey(privateKey);
    var publicKeyHash = scrypt_ts_1.bsv.crypto.Hash.sha256ripemd160(publicKey.toBuffer());
    var address = publicKey.toAddress();
    return [privateKey, publicKey, publicKeyHash, address];
}
exports.randomPrivateKey = randomPrivateKey;
function getDefaultSigner(privateKey) {
    if (global.testnetSigner === undefined) {
        global.testnetSigner = new scrypt_ts_1.TestWallet(privateKey_1.myPrivateKey, new scrypt_ts_1.DefaultProvider());
    }
    if (privateKey !== undefined) {
        global.testnetSigner.addPrivateKey(privateKey);
    }
    return global.testnetSigner;
}
exports.getDefaultSigner = getDefaultSigner;
exports.dummyUTXO = {
    txId: (0, crypto_1.randomBytes)(32).toString('hex'),
    outputIndex: 0,
    script: '',
    satoshis: exports.inputSatoshis
};
function getDummyUTXO(satoshis, unique) {
    if (satoshis === void 0) { satoshis = exports.inputSatoshis; }
    if (unique === void 0) { unique = false; }
    if (unique) {
        return Object.assign({}, exports.dummyUTXO, {
            satoshis: satoshis,
            txId: (0, crypto_1.randomBytes)(32).toString('hex')
        });
    }
    return Object.assign({}, exports.dummyUTXO, { satoshis: satoshis });
}
exports.getDummyUTXO = getDummyUTXO;
function getDummySigner(privateKey) {
    if (global.dummySigner === undefined) {
        global.dummySigner = new scrypt_ts_1.TestWallet(privateKey_1.myPrivateKey, new scrypt_ts_1.DummyProvider());
    }
    if (privateKey !== undefined) {
        global.dummySigner.addPrivateKey(privateKey);
    }
    return global.dummySigner;
}
exports.getDummySigner = getDummySigner;
