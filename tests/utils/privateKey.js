"use strict";
exports.__esModule = true;
exports.myAddress = exports.myPublicKeyHash = exports.myPublicKey = exports.myPrivateKey = exports.showAddr = exports.genPrivKey = void 0;
var scrypt_ts_1 = require("scrypt-ts");
var dotenv = require("dotenv");
var fs = require("fs");
var dotenvConfigPath = '.env';
dotenv.config({ path: dotenvConfigPath });
// fill in private key on testnet in WIF here
var privKey = process.env.PRIVATE_KEY;
if (!privKey) {
    genPrivKey();
}
else {
    showAddr(scrypt_ts_1.bsv.PrivateKey.fromWIF(privKey));
}
function genPrivKey() {
    var newPrivKey = scrypt_ts_1.bsv.PrivateKey.fromRandom('testnet');
    console.log("Missing private key, generating a new one ...\nPrivate key generated: '".concat(newPrivKey.toWIF(), "'\nYou can fund its address '").concat(newPrivKey.toAddress(), "' from the sCrypt faucet https://scrypt.io/#faucet"));
    // auto generate .env file with new generated key
    fs.writeFileSync(dotenvConfigPath, "PRIVATE_KEY=\"".concat(newPrivKey, "\""));
    privKey = newPrivKey.toWIF();
}
exports.genPrivKey = genPrivKey;
function showAddr(privKey) {
    console.log("Private key already present ...\nYou can fund its address '".concat(privKey.toAddress(), "' from the sCrypt faucet https://scrypt.io/#faucet"));
}
exports.showAddr = showAddr;
exports.myPrivateKey = scrypt_ts_1.bsv.PrivateKey.fromWIF(privKey);
exports.myPublicKey = scrypt_ts_1.bsv.PublicKey.fromPrivateKey(exports.myPrivateKey);
exports.myPublicKeyHash = scrypt_ts_1.bsv.crypto.Hash.sha256ripemd160(exports.myPublicKey.toBuffer());
exports.myAddress = exports.myPublicKey.toAddress();
