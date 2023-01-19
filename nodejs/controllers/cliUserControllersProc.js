//
const fs = require("fs");

//
const cryptoSsl = require("./../../../addon/crypto-ssl");

//
const config = require("./../config/config.js");
const define = require("./../config/define.js");
//
const dbISHandler = require("../src/db/dbISHandler.js");
const dbNNHandler = require("../src/db/dbNNHandler.js");
//
const dbUtil = require("./../src/db/dbUtil.js");
const util = require("./../src/utils/commonUtil.js");
const cryptoUtil = require('./../src/sec/cryptoUtil.js');
const cryptoApi = require('./../src/sec/cryptoApi.js');
const contractProc = require("./../src/contract/contractProc.js");
const webApi = require("./../src/net/webApi.js");
const kafkaHandler = require('./../src/net/kafkaHandler.js');
const logger = require('./../src/utils/winlog.js');
//
const dbFB = require("./../src/db/dbFB.js");
const dbFBHandler = require("./../src/db/dbFBHandler.js");

//
const contractChecker = require("./../src/contract/contractChecker.js");
const e = require("express");
//

// POST
//
module.exports.chkClientInfo = async (apiKey, ts, version, signature, requester) => {
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};
    try {
            logger.debug("apiKey : " + apiKey);
            logger.debug("timestamp : " + ts);
            logger.debug("version : " + version);
            logger.debug("signature : " + signature);
            logger.debug("requester : " + requester);

            do
            {

                // check requester
                // if (requester !== 'TGC') {
                if (requester !== 'WCL') {
                    // WCL? WLC?
                    logger.error("Error -  Invalid requester");
                    ret_msg = { errorCode : define.ERR_MSG.ERR_REQUESTER.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_REQUESTER.MSG}};
                    break;
                }

                // check version
                if (version !== 'v1.0.0') {
                    logger.error("Error -  Invalid version");
                    ret_msg = { errorCode : define.ERR_MSG.ERR_VERSION.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_VERSION.MSG}};
                    break;
                }

                // check api key
                let xbPubkey = apiKey;
                let xbPubkeyDir = './key/tgc_x_pubkey.pem'
                let readXbPub = cryptoSsl.ed25519GetPubkey(xbPubkeyDir);
                let xbPubkeyFile = await fs.readFileSync(xbPubkeyDir, 'binary');

                
                if (xbPubkey !== readXbPub) {
                    logger.error("Error -  Invalid API Key value");
                    ret_msg = { errorCode : define.ERR_MSG.ERR_PUBKEY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_PUBKEY.MSG}};
                    break;
                }


                // check signature
                let xaPrikeyPath = './key/fc_x_privkey.pem';
                let xaPrikeyFile = await fs.readFileSync(xaPrikeyPath, 'binary');

                let sharedKey1 = cryptoApi.generateX25519MixSKey(xaPrikeyFile, xbPubkey);

                let data = `apiKey=${apiKey}&ts=${ts}&version=${version}`;


                let keyHex1 = sharedKey1.slice(32);

                let sig1 = cryptoApi.generateSignature(keyHex1, data);

                // if (keyHex1 !== keyHex2 || signature !== sig1 || signature !== sig2) {
                if (signature !== sig1) {
                    logger.error("Error -  Invalid signature");
                    ret_msg = { errorCode : define.ERR_MSG.ERR_SIG.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_SIG.MSG}};
                    break;
                }

                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents : { res : true, msg : define.ERR_MSG.SUCCESS.MSG}};
                
            } while(0);
    } catch (err) {
        logger.error("Error - cliUserControllerProc / chkClientInfo");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return (ret_msg);
}


//
module.exports.chkWalletInfoProc = async (reqQuery) => {
    const request = reqQuery;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : chkWalletInfoProc 2 for TGC");

    try {
        logger.debug("apiKey : " + request.apiKey);
        logger.debug("ts : " + request.ts);
        logger.debug("version : " + request.version);
        logger.debug("signature : " + request.signature);
        logger.debug("requester : " + request.requester);
        logger.debug("wName : " + request.wName);

        if (request.hasOwnProperty("apiKey") && 
            request.hasOwnProperty("ts") && 
            request.hasOwnProperty("version") &&
            request.hasOwnProperty("signature") &&
            request.hasOwnProperty("requester") && 
            request.hasOwnProperty("wName") &&
            request.wName.length)
        {
            do
            {
                //
                let apiPath;
                let apiRes;

                // check api client is valid
                let isValid = await this.chkClientInfo(request.apiKey, request.ts, request.version, request.signature, request.requester);
                logger.debug("chkWalletInfoProc ~ isValid" + isValid.errorCode)

                if (!isValid.errorCode) {
                    
                    let walletInfo = await dbNNHandler.getWalletInfo(request.wName);
                    if (walletInfo) {
                        ret_msg = {
                            // timestamp: Date.now(),
                            errorCode : "SUCCESS",
                            contents : {
                                wName: walletInfo.account_id,
                                wAddr: walletInfo.owner_pk,
                                wAccount: BigInt(walletInfo.account_num).toString(16).toUpperCase()
                            }
                        }
                    } else {
                        // Error Code
                        logger.error("Error -  Check Wallet Name 2");
                        ret_msg =  { errorCode : define.ERR_MSG.ERR_ACCOUNT.CODE, contents : { res : false, msg : `Wallet : ${request.wName} is NOT registered.`}};
                        break;
                    }
                } else {
                    ret_msg = isValid;
                }
            } while(0);
        } else {
            ret_msg = { errorCode : define.ERR_MSG.ERR_REQ_PARAMS.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_REQ_PARAMS.MSG}};
        }
    } catch (err) {
        logger.error("Error - chkWalletInfoProc");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return (ret_msg);
}
