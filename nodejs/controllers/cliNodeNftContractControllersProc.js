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
                // let sharedKey2 = cryptoApi.generateX25519PemSKey(xaPrikeyFile, xbPubkeyFile);

                let data = `apiKey=${apiKey}&ts=${ts}&version=${version}`;

                let keyHex1 = sharedKey1.slice(32);
                // let keyHex2 = sharedKey2.slice(32);

                // logger.debug("keyHex1 : " + keyHex1);
                // logger.debug("data : " + data);

                let sig1 = cryptoApi.generateSignature(keyHex1, data);
                // let sig2 = cryptoApi.generateSignature(keyHex2, data);

                // if (keyHex1 !== keyHex2 || signature !== sig1 || signature !== sig2) {
                if (signature !== sig1) {
                    logger.error("Error -  Invalid signature");
                    ret_msg = { errorCode : define.ERR_MSG.ERR_SIG.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_SIG.MSG}};
                    break;
                }

                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents : { res : true, msg : define.ERR_MSG.SUCCESS.MSG}};
                
            } while(0);
    } catch (err) {
        logger.error("Error - ");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return (ret_msg);
}

//
module.exports.chkWalletInfoProc = async (reqQuery) => {
    const request = reqQuery;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : chkWalletInfoProc 1 for TGC");

    try {
        if (request.hasOwnProperty("apiKey") && 
            request.hasOwnProperty("ts") && 
            request.hasOwnProperty("version") &&
            request.hasOwnProperty("signature") &&
            request.hasOwnProperty("requester") && 
            request.hasOwnProperty("wName") &&
            request.wName.length)
        {
            logger.debug("apiKey : " + request.apiKey);
            logger.debug("ts : " + request.ts);
            logger.debug("version : " + request.version);
            logger.debug("signature : " + request.signature);
            logger.debug("requester : " + request.requester);
            logger.debug("wName : " + request.wName);

            do
            {
                //
                let apiPath;
                let apiRes;

                // check api client is valid
                let isValid = await this.chkClientInfo(request.apiKey, request.ts, request.version, request.signature, request.requester);
                logger.debug("🚀 ~ module.exports.chkWalletInfoProc ~ isValid" + isValid)

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
        logger.error("Error - ");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return (ret_msg);
}

//
module.exports.txMintNodeProc = async (reqQuery) => {
    const request = reqQuery;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : txMintNodeProc for TGC");

    try {
        if (request.hasOwnProperty("apiKey") && 
            request.hasOwnProperty("ts") && 
            request.hasOwnProperty("version") &&
            request.hasOwnProperty("signature") &&
            request.hasOwnProperty("requester") && 
            request.hasOwnProperty("nCurrency") && 
            request.hasOwnProperty("nPrice") &&
            request.hasOwnProperty("pNum") &&
            request.hasOwnProperty("pSiteId") &&
            request.hasOwnProperty("wName") &&
            request.wName.length &&
            request.pNum.length &&
            request.nCurrency.length &&
            Number(request.nPrice) > 0 &&
            request.pSiteId.length)
        {
            logger.debug("apiKey : " + request.apiKey);
            logger.debug("timestamp : " + request.ts);
            logger.debug("version : " + request.version);
            logger.debug("signature : " + request.signature);
            logger.debug("requester : " + request.requester);
            logger.debug("nCurrency : " + request.nCurrency);
            logger.debug("nPrice : " + request.nPrice);
            logger.debug("pNum : " + request.pNum);
            logger.debug("wName : " + request.wName);
            logger.debug("pSiteId : " + request.pSiteId);

            do
            {
                //
                let apiPath;
                let apiRes;
                //

                // check api client is valid
                let isValid = await this.chkClientInfo(request.apiKey, request.ts, request.version, request.signature, request.requester);
                logger.debug("module.exports.txMintNodeProc= ~ isValid", isValid)

                if (!isValid.errorCode) {

                    // check nCurrency
                    if (request.nCurrency !== "USD")
                    {
                        // Error Code
                        logger.error("Error -  Invalid Currency type");
                        ret_msg =  { errorCode : define.ERR_MSG.ERR_CURRENCY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_CURRENCY.MSG}};
                        break;
                    }
    
                    // check purchase price
                    let nPrice = request.nPrice;
                    let nPriceSplit = nPrice.split(".");
                    if (nPriceSplit[1]) {
                        // Error Code
                        logger.error("Error -  Invalid Price");
                        ret_msg =  { errorCode : define.ERR_MSG.ERR_PRICE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_PRICE.MSG}};
                        break;
                    }

                    // check purchase number
                    let pNumList = await dbNNHandler.getPNumInfo(request.wName);
                    logger.debug("pNumList " + JSON.stringify(pNumList));
                    let pResult;

                    for (let i = 0; i < pNumList.length; i++){
                        if (pNumList[i].pNum === request.pNum) {
                            pResult = true;
                        } else {
                            pResult = false;
                        }
                    }

                    if (pResult) {
                        // Error Code
                        logger.error("Error -  Invalid pNum");
                        ret_msg =  { errorCode : define.ERR_MSG.ERR_PNUM.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_PNUM.MSG}};
                        break;
                    }

                    apiPath = `/contract/sc/mint`;
                    // let postData = `toAccount=${request.wName}&amount=1&scAction=2684354573`;
                    let postData = `toAccount=${request.wName}&amount=${request.nPrice}&pNum=${request.pNum}&seller=${request.requester}&pSiteId=${request.pSiteId}`;
                    logger.debug("postData", postData)
                    apiRes = await webApi.APICallProc(apiPath, config.NFT_CONFIG, webApi.WEBAPI_DEFINE.METHOD.POST, postData);
                    logger.debug("apiRes", JSON.stringify(apiRes))
                    if (apiRes.errorCode) {
                        // Error Code
                        logger.error("Error - ");
                        ret_msg =  { errorCode : define.ERR_MSG.ERR_RES.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_RES.MSG}};
                        break;
                    }
                    logger.debug("apiRes : " + JSON.stringify(apiRes));

                    // ret_msg = apiRes;
                    ret_msg = {
                        errorCode: "SUCCESS",
                        contents: {
                            wName: request.wName,
                            pNum: request.pNum
                        }
                    };
                } else {
                    ret_msg = isValid;
                }
            } while(0);
        } else {
            ret_msg = { errorCode : define.ERR_MSG.ERR_REQ_PARAMS.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_REQ_PARAMS.MSG}};
        }
    } catch (err) {
        logger.error("Error - ");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return (ret_msg);
}


module.exports.chkUserNFTProc = async (reqQuery) => {
    const request = reqQuery;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : chkUserNFTProc for TGC");

    try {
        if (request.hasOwnProperty("apiKey") && 
            request.hasOwnProperty("ts") && 
            request.hasOwnProperty("version") &&
            request.hasOwnProperty("signature") &&
            request.hasOwnProperty("requester") && 
            request.hasOwnProperty("wName") &&
            request.wName.length)
        {
            logger.debug("apiKey : " + request.apiKey);
            logger.debug("ts : " + request.ts);
            logger.debug("version : " + request.version);
            logger.debug("signature : " + request.signature);
            logger.debug("requester : " + request.requester);
            logger.debug("wName : " + request.wName);

            do
            {
                //
                let apiPath;
                let apiRes;

                // check api client is valid
                let isValid = await this.chkClientInfo(request.apiKey, request.ts, request.version, request.signature, request.requester);

                if (!isValid.errorCode) { 
                    let nftInfo = new Array();
                    if (request.hasOwnProperty("pNum") && 
                        request.hasOwnProperty("nCurrency") && 
                        request.hasOwnProperty("nPrice") && 
                        request.hasOwnProperty("pSiteId"))
                    {
                        logger.debug("pNum : " + request.pNum);
                        logger.debug("nCurrency : " + request.nCurrency);
                        logger.debug("pNnPriceum : " + request.nPrice);
                        logger.debug("pSiteId : " + request.pSiteId);

                        let selectedNft = await dbNNHandler.getNftListbyPnum(request.wName, request.pNum);
                        if (selectedNft) {
                            nftInfo.push(selectedNft);
                            ret_msg = {
                                errorCode: "SUCCESS",
                                contents: {
                                    wName: request.wName,
                                    nNftCnt: (selectedNft.length).toString(),
                                    blk_num: selectedNft[0].blk_num, 
                                    sc_hash: selectedNft[0].sc_hash,
                                    create_tm: selectedNft[0].create_tm,
                                    sub_id: selectedNft[0].sub_id,
                                    sc_action: selectedNft[0].sc_action,
                                    amount: request.nPrice,
                                    pSiteId: request.pSiteId, 
                                    pNum: request.pNum, 
                                    meta_data: selectedNft[0].meta_data
                                }
                            };
                        } else {
                            logger.error("Error -  Check Wallet Name or PNum");
                            ret_msg =  { errorCode : define.ERR_MSG.ERR_NO_NFT_2.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_NFT_2.MSG + `${request.wName} and ${request.pNum}`}};
                            break;
                        }
                    }
                    else if (request.hasOwnProperty("pNum")) {
                        logger.debug("pNum : " + request.pNum);
                        let selectedNft = await dbNNHandler.getNftListbyPnum(request.wName, request.pNum);
                        if (selectedNft) {
                            nftInfo.push(selectedNft);
                            ret_msg = {
                                errorCode: "SUCCESS",
                                contents: {
                                    wName: request.wName,
                                    nNftCnt: (selectedNft.length).toString(),
                                    nft: nftInfo
                                }
                            };
                        } else {
                            logger.error("Error -  Check Wallet Name or PNum");
                            ret_msg =  { errorCode : define.ERR_MSG.ERR_NO_NFT_2.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_NFT_2.MSG + `${request.wName} and ${request.pNum}`}};
                            break;
                        }
                    } else {
                        logger.debug("request.wName2 : " + request.wName)
                        logger.debug("request.wName2 length : " + request.wName.length)
                        apiPath = `/account/nft?user=${request.wName}`;
                        apiRes = await webApi.APICallProc(apiPath, config.NFT_CONFIG, webApi.WEBAPI_DEFINE.METHOD.GET);
                        if (apiRes.errorCode) {
                            // Error Code
                            if (apiRes.errorCode == define.ERR_MSG.ERR_ACCOUNT.CODE) {
                                
                                logger.error("Error -  Check Wallet Name 1-1");
                                ret_msg =  { errorCode : define.ERR_MSG.ERR_ACCOUNT.CODE, contents : { res : false, msg : `Wallet : ${request.wName} is NOT registered.`}};
                                break;
                            }

                            if (apiRes.errorCode == define.ERR_MSG.ERR_NO_NFT.CODE) {
                                logger.error("Error -  Check Wallet Name 1-2 // has no nft");
                                ret_msg =  { errorCode : define.ERR_MSG.ERR_NO_NFT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_NFT.MSG}};
                                break;
                            }
                        }
                        logger.debug("apiRes : " + JSON.stringify(apiRes));
                        logger.debug("user owned : " + (apiRes.contents.NFT).length);
                        let chkData = apiRes.contents.NFT;
                        for (let i = 0; i < chkData.length; i++){
                            let infoList = {};
                            infoList.nId = chkData[i].nft_name;
                            infoList.nNftId = chkData[i].sub_id.toString();
                            // infoList.nNftHash = chkData[i].sc_hash.toUpperCase();
                            infoList.nNftHash = chkData[i].sc_hash;
                            infoList.nNftMeta = chkData[i].meta_data;
                            nftInfo.push(infoList);
                        }
                        ret_msg = {
                            errorCode: "SUCCESS",
                            contents: {
                                wName: request.wName,
                                nNftCnt: (apiRes.contents.NFT).length,
                                nft: nftInfo
                            }
                        };
                    }
                } else {
                    ret_msg = isValid;
                }
            } while(0);
        } else {
            ret_msg = { errorCode : define.ERR_MSG.ERR_REQ_PARAMS.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_REQ_PARAMS.MSG}};
        }
    } catch (err) {
        logger.error("Error - ");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return (ret_msg);
}

module.exports.refundNftProc = async (reqBody) => {
    const request = reqBody;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : refundNftProc");
    logger.debug("reqBody " + JSON.stringify(request));
    logger.debug("reqBody " + request);
    try {
        if (request.hasOwnProperty("nId") && 
            request.hasOwnProperty("nNftId") &&
            request.hasOwnProperty("userPrikey") &&
            request.hasOwnProperty("userPrikeyPw") && 
            request.hasOwnProperty("userPubkey") &&
            request.hasOwnProperty("verificationNum") &&
            request.hasOwnProperty("fromAccount") &&
            request.fromAccount.length)
        {
            logger.debug("nId : " + request.nId);
            logger.debug("nNftId : " + request.nNftId);
            logger.debug("userPrikey : " + request.userPrikey);
            logger.debug("userPrikeyPw : " + request.userPrikeyPw);
            logger.debug("userPubkey : " + request.userPubkey);
            logger.debug("fromAccount : " + request.fromAccount);
            logger.debug("verificationNum : " + request.verificationNum);

            do
            {
                //
                let apiPath;
                let apiRes;
                let fromAccountNum;
                let toAccount;
                let scAction;

                // Check fromAccount
                let userInfo = await dbNNHandler.getUserAccountByAccountId(request.fromAccount);
                if (userInfo !== false) {
                    fromAccountNum = userInfo.account_num;
                    logger.debug("fromAccount acc_num: " + fromAccountNum);
                } else {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_ACCOUNT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_ACCOUNT.MSG}};
                    break;
                }

                // Check scAction
                let nodeList = define.NODE_LIST;
                
                
                let nodeName = (request.nId).toUpperCase();
                logger.debug("nodeName: " + nodeName);

                scAction = nodeList[`${nodeName}`].sc_action;
                toAccount = nodeList[`${nodeName}`].walletAcc;
                
                // check meta_data;
                let data = await dbNNHandler.getNftMetaData(scAction, request.nNftId, fromAccountNum);
                let meta_data = data.meta_data;

                logger.debug("meta_data: " + meta_data);

                // FIXME: Check refundId
                let xaPrikeyPath = './key/fc_x_privkey.pem';
                let xbPubkeyPath = './key/tgc_x_pubkey.pem'
                let xaPrikeyFile = await fs.readFileSync(xaPrikeyPath, 'binary');
                let xbPubkeyFile = await fs.readFileSync(xbPubkeyPath, 'binary');

                let sharedKey1 = cryptoApi.generateX25519PemSKey(xaPrikeyFile, xbPubkeyFile);

                let keyHex1 = sharedKey1.slice(32);

                let sig1 = cryptoApi.generateSignature(keyHex1, meta_data);
                logger.debug("sig1: " + sig1);

                if (sig1 !== request.verificationNum) {

                    ret_msg = { errorCode : define.ERR_MSG.ERR_REFUND_ID.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_REFUND_ID.MSG}};
                    break;
                }

                logger.debug("scAction: " + scAction);
                logger.debug("toAccount: " + toAccount);
                if (scAction && toAccount) {

                    let apiRoutePath = '/contract/sc/tx';

                    let txKey1 = 'userPrikey';
                    let txKey2 = 'userPrikeyPw';
                    let txKey3 = 'userPubkey';
                    let txVal1 = encodeURIComponent(request.userPrikey);
                    let txVal2 = encodeURIComponent(request.userPrikeyPw);
                    let txVal3 = encodeURIComponent(request.userPubkey);
                    let scActionKey = 'scAction', fAccountKey = 'fromAccount', tAccountKey = 'toAccount', subIdKey = 'subId';

                    let postData = `${scActionKey}=${scAction}&${txKey1}=${txVal1}&${txKey2}=${txVal2}&${txKey3}=${txVal3}&${fAccountKey}=${fromAccountNum}&${tAccountKey}=${toAccount}&${subIdKey}=${request.nNftId}`;
                    logger.debug("postData: " + postData);
                    apiRes = await webApi.APICallProc(apiRoutePath, config.NFT_CONFIG, webApi.WEBAPI_DEFINE.METHOD.POST, postData);
                        
                    logger.debug("apiRes: " + JSON.stringify(apiRes));
                    ret_msg = apiRes;
                } else {
                    break;
                }
            } while(0);
        } else {
            ret_msg = { errorCode : define.ERR_MSG.ERR_REQ_PARAMS.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_REQ_PARAMS.MSG}};
        }
    } catch (err) {
        logger.error("Error - ");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return (ret_msg);
}

module.exports.txNftProc = async (reqBody) => {
    const request = reqBody;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : txNftProc");

    try {
        if (request.hasOwnProperty("nId") && 
            request.hasOwnProperty("nNftId") &&
            request.hasOwnProperty("userPrikey") &&
            request.hasOwnProperty("userPrikeyPw") && 
            request.hasOwnProperty("userPubkey") &&
            request.hasOwnProperty("toAccount") &&
            request.hasOwnProperty("fromAccount"))
        {
            logger.debug("nId : " + request.nId);
            logger.debug("nNftId : " + request.nNftId);
            logger.debug("userPrikey : " + request.userPrikey);
            logger.debug("userPrikeyPw : " + request.userPrikeyPw);
            logger.debug("userPubkey : " + request.userPubkey);
            logger.debug("toAccount : " + request.toAccount);
            logger.debug("fromAccount : " + request.fromAccount);

            do
            {
                //
                let apiPath;
                let apiRes;
                let recentPer;
                let toAccount;
                let scAction;

                // Check fromAccount
                let userInfo = await dbNNHandler.getUserAccountByAccountId(request.fromAccount);
                if (userInfo !== false) {
                    toAccount = userInfo.account_num;
                    logger.debug("toAccount acc_num: " + toAccount);
                } else {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_ACCOUNT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_ACCOUNT.MSG}};
                    break;
                }

                // FIXME: Check toAccount
                userInfo = await dbNNHandler.getUserAccountByAccountId(request.fromAccount);
                if (userInfo !== false) {
                    toAccount = userInfo.account_num;
                    logger.debug("toAccount acc_num: " + toAccount);
                } else {
                    ret_msg = { errorCode : define.ERR_MSG.ERR_ACCOUNT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_ACCOUNT.MSG}};
                    break;
                }

                // Check scAction
                let nodeList = define.NODE_LIST;
                if (request.hasOwnProperty("nodeName")) {

                    let nodeName = (request.nodeName).toUpperCase();
                    
                    let node_sc = nodeList[`${nodeName}`].sc_action;
                    
                    // recentPer = await dbNNHandler.getSumofRatioScAction(request.scAction);
                    recentPer = await dbNNHandler.getSumofAmountScAction(node_sc);
                    scAction = recentPer.sc_action;
                    if (recentPer.sum_amount < nodeList.TOTAL_PRICE) {
                        if (nodeList.TOTAL_PRICE < Number(request.amount) + recentPer.sum_amount) {
                            //ERROR CODE
                            ret_msg = { errorCode : define.ERR_MSG.ERR_AMOUNT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_AMOUNT.MSG}};
                            break;
                        }
                    } else {
                        //ERROR CODE
                        logger.error("unavailable to buy: " + request.scAction);
                        ret_msg = { errorCode : define.ERR_MSG.ERR_SOLD_OUT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_SOLD_OUT.MSG}};
                        break;
                    }
                }

                logger.debug("scAction: " + scAction);
                logger.debug("toAccount: " + toAccount);
                

                if (scAction && toAccount) {
                    let subId = await dbNNHandler.getMintSubId(scAction);
                    logger.debug("subId: " + subId);

                    let ratioCal = request.amount / define.NODE_LIST.TOTAL_PRICE * 100;
                    if (subId) {
                        let sc = {
                            sub_id: subId,
                            owner: request.toAccount,
                            pNum: request.pNum,
                            meta_data: {
                                pNum: request.pNum,
                                ratio: ratioCal,
                                amount: request.amount
                            }
                        }
                        // ret_msg = {
                        //     errorCode : define.ERR_MSG.SUCCESS.CODE,
                        //     contents : {
                        //         timestamp: Date.now(),
                        //         fromAccount: 0,
                        //         toAccount: toAccount,
                        //         scAction: scAction,
                        //         subId: subId,
                        //         sc: JSON.stringify(sc)
                        //     }
                        // }

                        let apiRoutePath = '/contract/sc/tx';
                        let dir = nodeList.KEY_DIR;
                        // let tkeyStoreJson = fs.readFile(dir, "binary", (err, data) => {
                        //     if(err) {
                        //         console.log(err);
                        //     }
                        //     console.log(data);
                        // });

                        let tkeyStoreJson = await fs.readFileSync(dir, 'binary');
                        let tkeyStore = JSON.parse(tkeyStoreJson);
                        let tokenPrikey = 'userPrikey';
                        let tokenPrikeyVal = tkeyStore.edPrikeyFin;
                        let tokenPrikeyPw = 'userPrikeyPw';
                        let tokenPrikeyPwVal = process.env.UTIL_TKN_PW;
                        let tokenPubkey = 'userPubkey';
                        let tokenPubkeyVal = define.CONTRACT_DEFINE.ED_PUB_IDX + await cryptoUtil.getPubkeyNoFile(tkeyStore.edPubkeyPem);
                        let tokenPrikeyEnc = encodeURIComponent(tokenPrikeyVal);
                        let tokenPrikeyPwEnc = encodeURIComponent(tokenPrikeyPwVal);
                        let tokenPubkeyEnc = encodeURIComponent(tokenPubkeyVal);
                        let scActionKey = 'scAction', scKey = 'sc', fAccountKey = 'fromAccount', tAccountKey = 'toAccount', subIdKey = 'subId';

                        let postData = `${scActionKey}=${scAction}&${scKey}=${JSON.stringify(sc)}&${tokenPrikey}=${tokenPrikeyEnc}&${tokenPrikeyPw}=${tokenPrikeyPwEnc}&${tokenPubkey}=${tokenPubkeyEnc}&${fAccountKey}=0&${tAccountKey}=${toAccount}&${subIdKey}=${subId}`;
                        
                        apiRes = await webApi.APICallProc(apiRoutePath, config.FBN_CONFIG, webApi.WEBAPI_DEFINE.METHOD.POST, postData);
                        
                        logger.debug("apiRes: " + JSON.stringify(apiRes));
                        ret_msg = apiRes;
                    }
                } else {
                    break;
                }
            } while(0);
        }
    } catch (err) {
        logger.error("Error - ");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return (ret_msg);
}