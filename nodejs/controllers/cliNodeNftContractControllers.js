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
const cliContractProc = require("./cliNodeNftContractControllersProc.js");

// POST
//
//////////////////////////////////////////////////
//
module.exports.heartbeat = async (req, res) => {
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents : { res : true, msg : define.ERR_MSG.SUCCESS.MSG}};

    logger.debug("func : heartbeat");

    res.send(ret_msg);
}


// //
// module.exports.chkWalletInfo = async (req, res) => {
//     const reqBody = req.body;
//     let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

//     logger.debug("func : chkWalletInfo 1");

//     try {
//         ret_msg = await cliContractProc.chkWalletInfoProc(reqBody);
//     } catch (err) {
//         logger.error("Error - 24");
//     }

//     logger.debug("ret_msg : " + JSON.stringify(ret_msg));

//     res.send(ret_msg);
// }

//
module.exports.txMintNode = async (req, res) => {
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : txMintNode");

    try {
        ret_msg = await cliContractProc.txMintNodeProc(reqBody);
    } catch (err) {
        logger.error("Error - 25");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.chkUserNFT = async (req, res) => {
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : chkUserNFT");

    try {
        ret_msg = await cliContractProc.chkUserNFTProc(reqBody);
    } catch (err) {
        logger.error("Error - 26");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.refundNft = async (req, res) => {
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : refundNft");

    try {
        ret_msg = await cliContractProc.refundNftProc(reqBody);
    } catch (err) {
        logger.error("Error - 27");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}
//
module.exports.txNft = async (req, res) => {
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : txNft");

    try {
        ret_msg = await cliContractProc.txNftProc(reqBody);
    } catch (err) {
        logger.error("Error - 28");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}