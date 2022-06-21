//
const fs = require("fs");

//
const cryptoSsl = require("./../../../addon/crypto-ssl");

//
const config = require("../config/config.js");
const define = require("../config/define.js");
const dbUtil = require("../src/db/dbUtil");
const util = require("../src/utils/commonUtil.js");
const cryptoUtil = require("../src/sec/cryptoUtil.js");
const encrypto = require("../src/sec/encrypto.js");
const logger = require('../src/utils/winlog.js');

//
const cliWalletProc = require("./cliWalletControllersProc.js");
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
            if (reqBody.hasOwnProperty("contents"))
            {
                // logger.debug("contents : " + reqBody.contents);

                let contentsJson = JSON.parse(reqBody.contents);
    
                ret_msg = await cliWalletProc.walletProc(contentsJson);
            }
            else if (reqBody.hasOwnProperty("contentsEnc"))
            {
                // logger.debug("contentsEnc : " + reqBody.contentsEnc);

                //
                if (!reqBody.hasOwnProperty("encXPubkey") || !reqBody.hasOwnProperty("myXPubkey"))
                {
                    break;
                }

                // logger.debug("encXPubkey : " + reqBody.encXPubkey);
                // logger.debug("myXPubkey : " + reqBody.myXPubkey);

                //
                let xPubkey = cryptoSsl.ed25519GetPubkey(config.X_PUBKEY_PEM_PATH);
                // logger.debug("xPubkey : " + xPubkey);

                if (reqBody.encXPubkey !== xPubkey)
                {
                    break;
                }

                //
                let xPrikeyFile = fs.readFileSync(config.X_PRIKEY_PEM_PATH, 'binary');
                // logger.debug("xPrikeyFile : " + xPrikeyFile);

                // Decrypted Contract
                let plaintext = cryptoUtil.contentsDecFromBuf(xPrikeyFile, reqBody.myXPubkey, reqBody.contentsEnc);
                // logger.debug("plaintext : " + plaintext);

                let contentsJson = JSON.parse(plaintext);
    
                ret_msg = await cliWalletProc.walletProc(contentsJson);
            }
            else
            {
                // User Functionalities
                if (reqBody.hasOwnProperty("addUser"))
                {
                    // logger.debug("addUser : " + request.addUser);

                    let contentsJson = JSON.parse(reqBody.addUser);

                    ret_msg = await cliContractProc.addUserProc(contentsJson);
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

    //
    if (reqBody.hasOwnProperty("contentsEnc"))
    {
        if(ret_msg.errorCode === define.ERR_MSG.SUCCESS.CODE)
        {
            let plaintext = JSON.stringify(ret_msg.contents);
            // logger.debug("plaintext.length : " + plaintext.length);
            // logger.debug("plaintext : " + plaintext);

            //
            let xPrikeyFile = fs.readFileSync(config.X_PRIKEY_PEM_PATH, 'binary');
            // console.log("xPrikeyFile : " + xPrikeyFile);
            
            let encMsg = cryptoUtil.contentsEncFromBuf(xPrikeyFile, reqBody.myXPubkey, plaintext);
            // logger.debug("encMsg : " + encMsg);

            //
            ret_msg = {
                errorCode :define.ERR_MSG.SUCCESS.CODE,
                contentsEnc : encMsg,
                encXPubkey : reqBody.myXPubkey,
                myXPubkey : reqBody.encXPubkey
            }
        }
    }

    res.send(ret_msg);
}

//
module.exports.keyGen = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : keyGen");

    try {
        ret_msg = await cliWalletProc.keyGenProc(reqBody);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

// GET
//
module.exports.getPubkey = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getPubkey");

    try {
        do
        {
            if (request.hasOwnProperty("x25519"))
            {
                let x_pubkey = cryptoSsl.ed25519GetPubkey(config.X_PUBKEY_PEM_PATH);
                logger.debug("x_pubkey : " + x_pubkey);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : new Date().getTime(),
                        xPubkey : x_pubkey
                    }
                }
            }
        } while (0);
    } catch (err) {
        logger.error("Error - ");
        logger.debug("ret_msg : " + JSON.stringify(ret_msg));
    }

    res.send(ret_msg);
}
