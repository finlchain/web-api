//
const crypto = require('crypto');

//
const cryptoSsl = require("./../../../../addon/crypto-ssl");

//
const logger = require('./../utils/winlog.js');

//
module.exports.encrypt = (text, password) => {
    const key = password.repeat(32).substr(0, 32);
    const iv = password.repeat(16).substr(0, 16);
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

module.exports.decrypt = (text, password) => {
    const key = password.repeat(32).substr(0, 32);
    const iv = password.repeat(16).substr(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

//
module.exports.aes256CbcEncrypt = (plaintextStr, password) => {
    let plaintextHexStr = Buffer.from(plaintextStr, 'utf8').toString('hex');
    // logger.debug('plaintextHexStr : ' + plaintextHexStr);

    //
    let ciphertextHexStr = cryptoSsl.aes256CbcEnc(plaintextHexStr, password);
    // logger.debug('ciphertextHexStr : ' + ciphertextHexStr);

    return ciphertextHexStr;
}

module.exports.aes256CbcDecrypt = (ciphertextHexStr, password) => {
    //
    let retPlaintextHexStr = cryptoSsl.aes256CbcDec(ciphertextHexStr, password);
    // logger.debug('retPlaintextHexStr : ' + retPlaintextHexStr);

    let retPlaintextStr = Buffer.from(retPlaintextHexStr, 'hex').toString('utf-8');;
    // logger.debug('retPlaintextStr : ' + retPlaintextStr.toString('hex'));

    return retPlaintextStr;
}

//
module.exports.ariaEncrypt = (plaintextStr, password) => {
    let plaintextHexStr = Buffer.from(plaintextStr, 'utf8').toString('hex');
    // logger.debug('plaintextHexStr : ' + plaintextHexStr);

    //
    let ciphertextHexStr = cryptoSsl.ariaEnc(plaintextHexStr, password);
    // logger.debug('ciphertextHexStr : ' + ciphertextHexStr);

    return ciphertextHexStr;
}

module.exports.ariaDecrypt = (ciphertextHexStr, password) => {
    //
    let retPlaintextHexStr = cryptoSsl.ariaDec(ciphertextHexStr, password);
    // logger.debug('retPlaintextHexStr : ' + retPlaintextHexStr);

    let retPlaintextStr = Buffer.from(retPlaintextHexStr, 'hex').toString('utf-8');;
    // logger.debug('retPlaintextStr : ' + retPlaintextStr.toString('hex'));

    return retPlaintextStr;
}
