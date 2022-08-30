//
const fs = require("fs");

//
const cryptoSsl = require("./../../../addon/crypto-ssl");

//
const config = require("./../config/config.js");
const define = require("./../config/define.js");
//
const dbUtil = require("./../src/db/dbUtil.js");
const util = require("./../src/utils/commonUtil.js");
const cryptoUtil = require('./../src/sec/cryptoUtil.js');
const contractProc = require("./../src/contract/contractProc.js");
const webApi = require("./../src/net/webApi.js");
const kafkaHandler = require('./../src/net/kafkaHandler.js');
const logger = require('./../src/utils/winlog.js');

//
const cliContractProc = require("./cliContractControllersProc.js");

// POST
//
module.exports.toolJson = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : toolJson");

    try {
        do
        {
            //
            if (reqBody.hasOwnProperty("contract"))
            {
                // logger.debug("contract : " + reqBody.contract);

                let contentsJson = JSON.parse(reqBody.contract);
    
                ret_msg = await cliContractProc.inspectContract(JSON.stringify(contentsJson));
            }
            else if (reqBody.hasOwnProperty("contents"))
            {
                // logger.debug("contents : " + reqBody.contents);

                // let myContents = reqBody.contents;
                let myContents = Buffer.from(reqBody.contents, 'hex');

                // // For test
                // let plaintextHexStr = Buffer.from(myContents, 'binary').toString('hex');
                // console.log('plaintextHexStr : ' + plaintextHexStr);
                // let testContentsPath = './' + 'testContents.ctd';
                // fs.writeFileSync(testContentsPath, myContents, 'binary');

                //
                let contentsJson = JSON.parse(myContents.toString('binary'));

                // //
                // let testOwnerPrikeyPath = './' + 'testOwnerPrikey.fin';
                // fs.writeFileSync(testOwnerPrikeyPath, contentsJson.addUser.ownerPrikey, 'binary');

                ret_msg = await cliContractProc.contractExe(contentsJson);
            }
            else if (reqBody.hasOwnProperty("contentsEnc"))
            {
                // let contentsEnc;
                let encXPubkey;
                let remoteXPubkey;

                // logger.debug("contentsEnc : " + reqBody.contentsEnc);

                if (reqBody.hasOwnProperty("encXPubkey") && reqBody.hasOwnProperty("myXPubkey")) // Don't use it
                {
                    // logger.debug("encXPubkey : " + reqBody.encXPubkey);
                    // logger.debug("myXPubkey : " + reqBody.myXPubkey);

                    //
                    contentsEncHexStr = reqBody.contentsEnc;
                    encXPubkey = reqBody.encXPubkey;
                    remoteXPubkey = reqBody.myXPubkey;
                }
                else // Use it
                {
                    if (!util.isJsonString(reqBody.contentsEnc))
                    {
                        logger.error("Error - contentsEnc");
                        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON.MSG}};
                        break;
                    }

                    let encJsonMsg = JSON.parse(reqBody.contentsEnc);

                    if (!encJsonMsg.hasOwnProperty("jsonEnc"))
                    {
                        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_PARSE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_PARSE.MSG}};
                        break;
                    }

                    if (!encJsonMsg.jsonEnc.hasOwnProperty("contentsEnc") || 
                        !encJsonMsg.jsonEnc.hasOwnProperty("encXPubkey") || 
                        !encJsonMsg.jsonEnc.hasOwnProperty("myXPubkey"))
                    {
                        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_PROPERTY.MSG}};
                        break;
                    }

                    contentsEncHexStr = encJsonMsg.jsonEnc.contentsEnc;
                    encXPubkey = encJsonMsg.jsonEnc.encXPubkey;
                    remoteXPubkey = encJsonMsg.jsonEnc.myXPubkey;
                }

                // console.log("contentsEncHexStr.length : " + contentsEncHexStr.length);
                // console.log("contentsEncHexStr : " + contentsEncHexStr);

                // encXPubkey
                //
                if (encXPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
                {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_PUBKEY_LEN.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_PUBKEY_LEN.MSG}};
                    break;
                }

                //
                if (encXPubkey.slice(0,2) !== define.SEC_DEFINE.KEY_DELIMITER.ED25519_DELIMITER)
                {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_PUBKEY_DELI.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_PUBKEY_DELI.MSG}};
                    break;
                }

                // encXPubkey
                //
                if (remoteXPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
                {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_PUBKEY_LEN.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_PUBKEY_LEN.MSG}};
                    break;
                }

                //
                if (remoteXPubkey.slice(0,2) !== define.SEC_DEFINE.KEY_DELIMITER.ED25519_DELIMITER)
                {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_PUBKEY_DELI.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_PUBKEY_DELI.MSG}};
                    break;
                }

                //
                let xPubkey = cryptoSsl.ed25519GetPubkey(config.X_PUBKEY_PEM_PATH);
                // logger.debug("xPubkey : " + xPubkey);

                if (encXPubkey.slice(2) !== xPubkey)
                {
                    logger.debug("encXPubkey : " + encXPubkey.slice(2));
                    logger.debug("xPubkey : " + xPubkey);
                    ret_msg = { errorCode : define.ERR_MSG.ERR_PUBKEY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_PUBKEY.MSG}};
                    break;
                }

                //
                let xPrikeyFile = fs.readFileSync(config.X_PRIKEY_PEM_PATH, 'binary');
                // logger.debug("xPrikeyFile : " + xPrikeyFile);

                // Decrypted Contract
                let plaintextHex = cryptoSsl.x25519MixDec(xPrikeyFile, remoteXPubkey.slice(2), contentsEncHexStr, contentsEncHexStr.length);
                // logger.debug("plaintextHex : " + plaintextHex);

                if (plaintextHex === false)
                {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_DECRYPT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DECRYPT.MSG}};
                    break;
                }

                let plaintext = Buffer.from(plaintextHex, 'hex');
                // logger.debug("plaintext : " + plaintext);

                ///////////////////////////////////////////////////////////////////////
                // // test
                // let testPlaintextPath = './' + 'testPlaintext.ctd';
                // fs.writeFileSync(testPlaintextPath, plaintext, 'binary');
                // let testPlaintext = fs.readFileSync(testPlaintextPath, 'binary');
                ///////////////////////////////////////////////////////////////////////

                let contentsJson = JSON.parse(plaintext.toString('binary'));

                ///////////////////////////////////////////////////////////////////////
                // // test
                // let contentsJsonStrPath = './' + 'contentsJsonStr.jst';
                // fs.writeFileSync(contentsJsonStrPath, JSON.stringify(contentsJson), 'binary');
                // let contentsJsonStr = fs.readFileSync(contentsJsonStrPath, 'binary');
                ///////////////////////////////////////////////////////////////////////

                ret_msg = await cliContractProc.contractExe(contentsJson);
            }
            else
            {
                // User Functionalities
                if (reqBody.hasOwnProperty("addUser"))
                {
                    logger.debug("addUser : " + reqBody.addUser);

                    let contentsJson = JSON.parse(reqBody.addUser);

                    ret_msg = await cliContractProc.addUserProc(contentsJson);
                }
                else if (reqBody.hasOwnProperty("changeUserPubkey"))
                {
                    logger.debug("changeUserPubkey : " + reqBody.changeUserPubkey);

                    let contentsJson = JSON.parse(reqBody.changeUserPubkey);

                    ret_msg = await cliContractProc.changeUserPubkeyProc(contentsJson);
                }
                // Token Functionalities
                else if (reqBody.hasOwnProperty("createToken"))
                {
                    logger.debug("createToken : " + reqBody.createToken);

                    let contentsJson = JSON.parse(reqBody.createToken);

                    ret_msg = await cliContractProc.createTokenProc(contentsJson);
                }
                else if (reqBody.hasOwnProperty("changeTokenPubkey"))
                {
                    logger.debug("changeTokenPubkey : " + reqBody.changeTokenPubkey);

                    let contentsJson = JSON.parse(reqBody.changeTokenPubkey);

                    ret_msg = await cliContractProc.changeTokenPubkeyProc(contentsJson);
                }
                else if (reqBody.hasOwnProperty("changeTokenLockTx"))
                {
                    logger.debug("changeTokenLockTx : " + reqBody.changeTokenLockTx);

                    let contentsJson = JSON.parse(reqBody.changeTokenLockTx);

                    ret_msg = await cliContractProc.changeTokenLockTxProc(contentsJson);
                }
                else if (reqBody.hasOwnProperty("changeTokenLockTime"))
                {
                    logger.debug("changeTokenLockTime : " + reqBody.changeTokenLockTime);

                    let contentsJson = JSON.parse(reqBody.changeTokenLockTime);

                    ret_msg = await cliContractProc.changeTokenLockTimeProc(contentsJson);
                }
                else if (reqBody.hasOwnProperty("changeTokenLockWallet"))
                {
                    logger.debug("changeTokenLockWallet : " + reqBody.changeTokenLockWallet);

                    let contentsJson = JSON.parse(reqBody.changeTokenLockWallet);

                    ret_msg = await cliContractProc.changeTokenLockWalletProc(contentsJson);
                }
                else if (reqBody.hasOwnProperty("txToken"))
                {
                    logger.debug("txToken : " + reqBody.txToken);

                    let contentsJson = JSON.parse(reqBody.txToken);

                    ret_msg = await cliContractProc.txTokenProc(contentsJson);
                }
                else if (reqBody.hasOwnProperty("createSc"))
                {
                    logger.debug("createSc : " + reqBody.createSc);

                    let contentsJson = JSON.parse(reqBody.createSc);

                    ret_msg = await cliContractProc.createScProc(contentsJson);
                }
                else if (reqBody.hasOwnProperty("txSc"))
                {
                    logger.debug("txSc : " + reqBody.txSc);

                    let contentsJson = JSON.parse(reqBody.txSc);

                    ret_msg = await cliContractProc.txScProc(contentsJson);
                }
                else
                {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.MSG}};
                }
            }
        } while(0);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.addUser = async (req, res) => {
    // const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : addUser");

    try {
        ret_msg = await cliContractProc.addUserProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.changeUserPubkey = async (req, res) => {
    // const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : changeUserPubkey");

    try {
        ret_msg = await cliContractProc.changeUserPubkeyProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.createToken = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : createToken");

    try {
        ret_msg = await cliContractProc.createTokenProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.changeTokenPubkey = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : changeTokenPubkey");

    try {
        ret_msg = await cliContractProc.changeTokenPubkeyProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.changeTokenLockTx = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : changeTokenLockTx");

    try {
        ret_msg = await cliContractProc.changeTokenLockTxProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.changeTokenLockTime = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : changeTokenLockTime");

    try {
        ret_msg = await cliContractProc.changeTokenLockTimeProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.changeTokenLockWallet = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : changeTokenLockWallet");

    try {
        ret_msg = await cliContractProc.changeTokenLockWalletProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.txToken = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : txToken");

    try {
        ret_msg = await cliContractProc.txTokenProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//////////////////////////////////////////////////
//
module.exports.createSc = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : createSc");

    try {
        ret_msg = await cliContractProc.createScProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.txSc = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : txSc");

    try {
        ret_msg = await cliContractProc.txScProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.mintSc = async (req, res) => {
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : mintSc");

    try {
        ret_msg = await cliContractProc.mintScProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}