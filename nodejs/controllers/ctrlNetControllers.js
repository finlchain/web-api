//
const config = require("../config/config.js");
const define = require("../config/define.js");
const dbUtil = require("../src/db/dbUtil.js");
const dbIS = require("../src/db/dbIS.js");
const dbNN = require("../src/db/dbNN.js");
const dbISHandler = require("../src/db/dbISHandler.js");
const util = require("../src/utils/commonUtil.js");
const cryptoUtil = require("../src/sec/cryptoUtil.js");
const logger = require('../src/utils/winlog.js');

const webApi = require("./../src/net/webApi.js");

// GET
//
module.exports.clusterList = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : clusterList");

    if (request.hasOwnProperty("all"))
    {
        //
        try {
            //
            let clusters = await dbISHandler.getClusterAddrByRole(define.NODE_ROLE.NUM.NN);

            if (clusters !== false)
            {
                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, clusters : clusters }};
            }
        } catch (err) {
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.hubList = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : hubList");

    if (request.hasOwnProperty("all"))
    {
        //
        try {
            //
            let hubInfo = await dbISHandler.getHubInfo();

            if (hubInfo !== false)
            {
                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, hubInfo : hubInfo }};
            }
        } catch (err) {
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.tokenList = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : tokenList");

    // check reg_token
    if (request.hasOwnProperty("tokenAction"))
    {
        try {

            logger.debug("tokenAction : " + request.tokenAction);
            // 
            let tokens = await dbISHandler.getTokenInfoByAction(request.tokenAction);
            
            if ((tokens === false) || (tokens[0] === undefined))
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_TOKEN_INFO.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_TOKEN_INFO.MSG}};
            }
            else
            {
                ret_msg = { errorCode: 0, contents: { res: true, tokenInfo: { tokenName: tokens[0].name, tokenAction: tokens[0].action, tokenSymbol: tokens[0].symbol }, msg: "this Token is provided" } };
            }
        } catch (err) {
            logger.debug("err --> " + err);
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }
    else if (request.hasOwnProperty("tokenName"))
    {
        try {

            logger.debug("tokenName : " + request.tokenName);
            //
            let tokens = await dbISHandler.getTokenInfoByName(request.tokenName);
            
            if ((tokens === false) || (tokens[0] === undefined))
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_TOKEN_INFO.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_TOKEN_INFO.MSG}};
            }
            else
            {
                ret_msg = { errorCode: 0, contents: { res: true, tokenInfo: { tokenName: tokens[0].name, tokenAction: tokens[0].action, tokenSymbol: tokens[0].symbol }, msg: "this Token is provided" } };
            }
        } catch (err) {
            logger.debug("err --> " + err);
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }
    else if (request.hasOwnProperty("tokenSymbol"))
    {
        try {

            logger.debug("tokenSymbol : " + request.tokenSymbol);
            // 
            let tokens = await dbISHandler.getTokenInfoBySymbol(request.tokenSymbol);
            
            if ((tokens === false) || (tokens[0] === undefined))
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_TOKEN_INFO.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_TOKEN_INFO.MSG}};
            }
            else
            {
                ret_msg = { errorCode: 0, contents: { res: true, tokenInfo: { tokenName: tokens[0].name, tokenAction: tokens[0].action, tokenSymbol: tokens[0].symbol }, msg: "this Token is provided" } };
            }
        } catch (err) {
            logger.debug("err --> " + err);
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }
    else if (request.hasOwnProperty("all"))
    {
        try {
            // ISAG
            let tokens = await dbISHandler.getTokenInfoAll();
            
            if (tokens[0] === undefined)
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_TOKEN_INFO.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_TOKEN_INFO.MSG}};
            }
            else
            {
                ret_msg = { errorCode: 0, contents: { res: true, tokenInfo: { tokens }, msg: "this Token is provided" } };
            }
        } catch (err) {
            logger.debug("err --> " + err);
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }
    else
    {
        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.MSG}};       
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

module.exports.tokenCheck = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : tokenCheck");

    // check reg_token
    if (request.hasOwnProperty("tokenAction"))
    {
        try {

            logger.debug("tokenAction : " + request.tokenAction);

            // ISAG
            let tokens = await dbISHandler.getTokenInfoByAction(request.tokenAction);
            
            if (tokens[0] === undefined)
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_TOKEN_INFO.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_TOKEN_INFO.MSG}};
            }
            else
            {
                ret_msg = { errorCode: 0, contents: { res: true, tokenInfo: { tokenName: tokens[0].name, tokenAction: tokens[0].action, tokenSymbol: tokens[0].symbol }, msg: "this Token is provided" } };
            }
        } catch (err) {
            logger.debug("err --> " + err);
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }
    else if (request.hasOwnProperty("tokenName"))
    {
        try {

            logger.debug("tokenName : " + request.tokenName);
            
            // ISAG
            let tokens = await dbISHandler.getTokenInfoByName(request.tokenName);
            
            if (tokens[0] === undefined)
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_TOKEN_INFO.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_TOKEN_INFO.MSG}};
            }
            else
            {
                ret_msg = { errorCode: 0, contents: { res: true, tokenInfo: { tokenName: tokens[0].name, tokenAction: tokens[0].action, tokenSymbol: tokens[0].symbol }, msg: "this Token is provided" } };
            }

        } catch (err) {
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }
    else if (request.hasOwnProperty("tokenSymbol"))
    {
        try {

            logger.debug("tokenSymbol : " + request.tokenSymbol);            
            
            // ISAG
            let tokens = await dbISHandler.getTokenInfoBySymbol(request.tokenSymbol);
            
            if (tokens[0] === undefined)
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_TOKEN_INFO.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_TOKEN_INFO.MSG}};
            }
            else
            {
                ret_msg = { errorCode: 0, contents: { res: true, tokenInfo: { tokenName: tokens[0].name, tokenAction: tokens[0].action, tokenSymbol: tokens[0].symbol }, msg: "this Token is provided" } };
            }
        } catch (err) {
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }
    else
    {
        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.MSG}};     
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

module.exports.systemInfo = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : systemInfo");

    // check reg_token
    if (request.hasOwnProperty("blkgen"))
    {
        try {
            let net_info = await dbISHandler.getSystemInfoBgStatus();

            ret_msg = { errorCode: 0, contents: { res: true, systemInfo: { netInfo: {bgStatus: net_info[0].bg_status} }, msg: "System Information Check Succeed" } };
        } catch (err) {
            logger.debug("err --> " + err);
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }
    else
    {
        try {
            let sys_info = await dbISHandler.getSystemInfo();

            ret_msg = { errorCode: 0, contents: { res: true, systemInfo: { netInfo: sys_info[0].net_info }, msg: "System Information Check Succeed" } };
        } catch (err) {
            logger.debug("err --> " + err);
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}