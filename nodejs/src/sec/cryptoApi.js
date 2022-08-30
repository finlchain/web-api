//
const crypto = require('crypto');

//
const cryptoSsl = require("./../../../../addon/crypto-ssl");

//
const logger = require('./../utils/winlog.js');

//
// Eg. )
// Input
//   keyHex : '38df3a8e044d47e891a51f539633a392'
//   data : "apiKey=a2310fb0bb92478a93d0608e2507955e&timeStamp=2022-07-12 04:22:01.000&version=V1.0.0"
// Output
//   sig : '2040491ba546e0e90181e5e1daf48e7da0b6c9e6a1b30f377076f0f9f56fc572'
module.exports.generateSignature = (keyHex, data) => {
    let sig = cryptoSsl.genHmacSha256Str(keyHex, data);
    logger.debug("sig : " + sig);

    return sig;
}

//
module.exports.generateX25519HexSKey = (prikey, peerPubkey) => {
    let sharedKey = cryptoSsl.x25519HexSkey(prikey, peerPubkey);
    logger.debug("sharedKey : " + sharedKey);

    return sharedKey;
}

//
module.exports.generateX25519PemSKey = (prikeyPath, peerPubkeyPath) => {
    let sharedKey = cryptoSsl.x25519PemSkey(prikeyPath, peerPubkeyPath);
    logger.debug("sharedKey : " + sharedKey);

    return sharedKey;
}

//
module.exports.generateX25519MixSKey = (prikeyPath, peerPubkey) => {
    let sharedKey = cryptoSsl.x25519MixSkey(prikeyPath, peerPubkey);
    logger.debug("sharedKey : " + sharedKey);

    return sharedKey;
}