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
const cliContractProc = require("./cliUserControllersProc.js");

// POST
//
//////////////////////////////////////////////////
//
module.exports.chkWalletInfo = async (req, res) => {
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : chkWalletInfo 2");

    try {
        ret_msg = await cliContractProc.chkWalletInfoProc(reqBody);
    } catch (err) {
        logger.error("Error - chkWalletInfo");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}
