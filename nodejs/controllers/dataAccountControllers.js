//
const config = require("../config/config.js");
const define = require("../config/define.js");
const dbUtil = require("../src/db/dbUtil.js");
const dbNN = require("../src/db/dbNN.js");
const dbNNHandler = require("../src/db/dbNNHandler.js");
const util = require("../src/utils/commonUtil.js");
const webApi = require("./../src/net/webApi.js");
const base58 = require("../src/utils/base58.js");
const debug = require("../src/utils/debug.js");
const logger = require('../src/utils/winlog.js');
const e = require("express");

/////////////////////////////////////////////////////////////////
// POST
//
module.exports.getBalance = async (req, res) => {
    const request = req.query;
    const reqBody = req.body;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getBalance");

    // logger.debug("req.body : " + JSON.stringify(req.body));
    if ((reqBody.hasOwnProperty("uAccountNum")) && (reqBody.hasOwnProperty("tAccountAction")))
    {
        // let lastBN = await dbNNHandler.getMaxBlkNumFromBlkContents();

        let myBal = await dbNNHandler.getAccountBalanceByAccountNumAndAction(reqBody.uAccountNum, reqBody.tAccountAction);
        if (myBal !== define.ERR_CODE.ERROR)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    token : [myBal]
                }
            }
        }
    }
    else if (reqBody.hasOwnProperty("uAccountNum"))
    {
        // let lastBN = await dbNNHandler.getMaxBlkNumFromBlkContents();

        let myBal = await dbNNHandler.getAccountBalanceAll(reqBody.uAccountNum);

        if (myBal !== define.ERR_CODE.ERROR)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    token : myBal
                }
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

/////////////////////////////////////////////////////////////////
// GET

//
module.exports.getMarketSupply = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getMarketSupply");

    if (request.hasOwnProperty("tAccountAction"))
    {
        if (isNaN(request.tAccountAction))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            let tokenInfo = await dbNNHandler.getTokenInfoByTokenAccountAction(request.tAccountAction);

            if (tokenInfo !== false)
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        action : tokenInfo.action,
                        name : tokenInfo.name,
                        symbol : tokenInfo.symbol,
                        totalSupply : tokenInfo.total_supply,
                        marketSupply :  tokenInfo.market_supply
                    }
                }
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getTradePerDay = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getTradeVolPerDay");

    if (request.hasOwnProperty("tAccountAction"))
    {
        if (isNaN(request.tAccountAction))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            let curMs = Date.now();
            let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;

            let tokenTradeInfo = await dbNNHandler.getTradeVolumePerDayByTokenAccountAction(request.tAccountAction, prv24hMs, curMs);
            if (tokenTradeInfo !== false)
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        action : tokenTradeInfo.action,
                        name : tokenTradeInfo.name,
                        symbol : tokenTradeInfo.symbol,
                        tradePerDay : tokenTradeInfo.tradePerDay,
                    }
                }
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getRichList = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getRichList");

    try {
        let tokenInfo = false;

        if (request.hasOwnProperty("tAccountAction") && request.hasOwnProperty("cnt"))
        {
            if (isNaN(request.tAccountAction) || isNaN(request.cnt))
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
            }
            else
            {
                // ToDo : Max Cnt
                //
                tokenInfo = await dbNNHandler.getTokenInfoByTokenAccountAction(request.tAccountAction);
            }
        }
        else if (request.hasOwnProperty("tAccountSymbol") && request.hasOwnProperty("cnt"))
        {
            if (!isNaN(request.tAccountSymbol) || isNaN(request.cnt))
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
            }
            else
            {
                // ToDo : Max Cnt
                //
                tokenInfo = await dbNNHandler.getTokenInfoByTokenAccountSymbol(request.tAccountSymbol);
            }
        }
        else if (request.hasOwnProperty("tAccountName") && request.hasOwnProperty("cnt"))
        {
            if (!isNaN(request.tAccountName) || isNaN(request.cnt))
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
            }
            else
            {
                // ToDo : Max Cnt
                //
                tokenInfo = await dbNNHandler.getTokenInfoByTokenAccountName(request.tAccountName);
            }
        }

        if (tokenInfo !== false)
        {
            //
            let totalAccountNum = await dbNNHandler.getAccountBalanceCntAllByTokenAccountAction(tokenInfo.action);

            //
            const limitNum = Number(request.cnt)
            let richList = await dbNNHandler.getAccountLedgersUsersByActionAndLimit(tokenInfo.action, limitNum);
            if (richList !== false)
            {
                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, action : tokenInfo.action, name : tokenInfo.name, symbol : tokenInfo.symbol, market_supply : tokenInfo.market_supply, totalAccountNum : totalAccountNum, richList : richList}};
            }
        }
    } catch (err) {
        ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
    }

    // if (request.hasOwnProperty("tAccountAction") && request.hasOwnProperty("cnt"))
    // {
    //     if (isNaN(request.tAccountAction) || isNaN(request.cnt))
    //     {
    //         ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
    //     }
    //     else
    //     {
    //         // ToDo : Max Cnt
    //         //
    //         try {
    //             let tokenInfo = await dbNNHandler.getTokenInfoByTokenAccountAction(request.tAccountAction);

    //             if (tokenInfo !== false)
    //             {
    //                 //
    //                 let totalAccountNum = await dbNNHandler.getAccountBalanceCntAllByTokenAccountAction(request.tAccountAction);

    //                 //
    //                 const limitNum = Number(request.cnt)
    //                 let richList = await dbNNHandler.getAccountLedgersUsersByActionAndLimit(request.tAccountAction, limitNum);
    //                 if (richList !== false)
    //                 {
    //                     ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, action : request.tAccountAction, market_supply : tokenInfo.market_supply, totalAccountNum : totalAccountNum, richList : richList}};
    //                 }
    //             }

    //         } catch (err) {
    //             ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
    //         }
    //     }
    // }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getSubNetId = async (req, res) => {
    const request = req.query;

    logger.debug("func : getSubNetId");

    let subNetId = 0;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    //
    if (request.hasOwnProperty("uPubkey"))
    {
        logger.debug("request.uPubkey : " + request.uPubkey);
        if (isNaN(request.uPubkey))
        {
            subNetId = await dbNNHandler.getSubNetIdByUserAccountPubkey(request.uPubkey);
        }
        else
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
    }
    else if (request.hasOwnProperty("uAccountNum"))
    {
        logger.debug("request.uAccountNum : " + request.uAccountNum);
        if (isNaN(request.uAccountNum))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            let accountNum = request.uAccountNum;

            if ('0x' === request.uAccountNum.slice(0,2))
            {
                accountNum = util.hexStrToBigInt(request.uAccountNum.slice(2));
            }

            subNetId = await dbNNHandler.getSubNetIdByUserAccountNum(accountNum);
        }
    }
    else if (request.hasOwnProperty("uAccountId"))
    {
        logger.debug("request.uAccountId : " + request.uAccountId);
        subNetId = await dbNNHandler.getSubNetIdByUserAccountId(request.uAccountId);
    }
    else if (request.hasOwnProperty("tPubkey"))
    {
        if (isNaN(request.tPubkey))
        {
            subNetId = await dbNNHandler.getSubNetIdByTokenAccountPubkey(request.tPubkey);
        }
        else
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
    }
    else if (request.hasOwnProperty("tAccountNum"))
    {
        if (isNaN(request.tAccountNum))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            let accountNum = request.tAccountNum;

            if ('0x' === request.tAccountNum.slice(0,2))
            {
                accountNum = util.hexStrToBigInt(request.tAccountNum.slice(2));
            }

            subNetId = await dbNNHandler.getSubNetIdByTokenAccountNum(accountNum);
        }
    }
    else if (request.hasOwnProperty("tAccountAction"))
    {
        if (isNaN(request.tAccountAction))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            subNetId = await dbNNHandler.getSubNetIdByTokenAccountAction(request.tAccountAction);    
        }
    }
    else if (request.hasOwnProperty("tAccountName"))
    {
        if (isNaN(request.tAccountName))
        {
            subNetId = await dbNNHandler.getSubNetIdByTokenAccountName(request.tAccountName);
        }
        else
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
    }
    else if (request.hasOwnProperty("tAccountSymbol"))
    {
        if (isNaN(request.tAccountSymbol))
        {
            subNetId = await dbNNHandler.getSubNetIdByTokenAccountSymbol(request.tAccountSymbol);
        }
        else
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
    }
    else
    {
        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.MSG}};
    }

    //
    if (subNetId)
    {
        ret_msg = {
            errorCode : define.ERR_MSG.SUCCESS.CODE,
            contents : {
                timestamp : Date.now(),
                subNetId : subNetId
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getAccountList = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    if (request.hasOwnProperty("total"))
    {
        //
        let query_result_tokens = await dbUtil.query(dbNN.querys.account.account_tokens.selectCnt);
        let query_result_users = await dbUtil.query(dbNN.querys.account.account_users.selectCnt);

        //
        let curMs = Date.now();
        let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;

        let tAccount24hCnt = 0;
        let query_result_tokens_24h = await dbUtil.queryPre(dbNN.querys.account.account_tokens.selectCntByCreateTm, [prv24hMs, curMs]);
        if (query_result_tokens_24h.length)
        {
            tAccount24hCnt = query_result_tokens_24h[0].total_count;
            // if ((query_result_tokens_24h[0].max_idx !== null) && (query_result_tokens_24h[0].min_idx !== null))
            // {
            //     tAccount24hCnt = query_result_tokens_24h[0].max_idx - query_result_tokens_24h[0].min_idx + 1;
            // }

            logger.debug('tAccount24hCnt : ' + tAccount24hCnt);
        }

        let uAccount24hCnt = 0;
        let query_result_users_24h = await dbUtil.queryPre(dbNN.querys.account.account_users.selectCntByCreateTm, [prv24hMs, curMs]);
        if (query_result_users_24h.length)
        {
            if ((query_result_users_24h[0].max_idx !== null) && (query_result_users_24h[0].min_idx !== null))
            {
                uAccount24hCnt = query_result_users_24h[0].max_idx - query_result_users_24h[0].min_idx + 1;
            }

            logger.debug('uAccount24hCnt : ' + uAccount24hCnt);
        }

        if (query_result_tokens.length && query_result_users.length)
        {
            let tAccountTotalCnt = query_result_tokens[0].total_count;
            let uAccountTotalCnt = query_result_users[0].total_count;

            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    tAccountTotalCnt : tAccountTotalCnt,
                    uAccountTotalCnt : uAccountTotalCnt, 
                    tAccount24hCnt : tAccount24hCnt, 
                    uAccount24hCnt : uAccount24hCnt
                }
            }
        }

    }
    else if (request.hasOwnProperty("users"))
    {
        let uAccountInfoList = await dbNNHandler.getUserAccountsByIdx();
        if (uAccountInfoList !== false)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    uAccountInfoList : uAccountInfoList
                }
            }
        }
    }
    else if (request.hasOwnProperty("tokens"))
    {
        let tAccountInfoList = await dbNNHandler.getTokenInfoByIdx();
        if (tAccountInfoList !== false)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    tAccountInfoList : tAccountInfoList
                }
            }
        }
    }
    else if (request.hasOwnProperty("tokensL"))
    {
        let tAccountInfoList = await dbNNHandler.getTokenInfoWithTxsCnt();
        if (tAccountInfoList !== false)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    tAccountInfoList : tAccountInfoList
                }
            }
        }
    }
    else if (request.hasOwnProperty("tAccountAction"))
    {
        let tAccountInfo = await dbNNHandler.getTokenInfoByTokenAccountAction(request.tAccountAction);

        if (tAccountInfo !== false)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    tAccountInfo : tAccountInfo
                }
            }
        }
    }
    else if (request.hasOwnProperty("tPubkey"))
    {
        tAccountInfo = await dbNNHandler.getTokenAccountByPubkey(request.tPubkey);
        if (tAccountInfo !== false)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    tAccountInfo : tAccountInfo
                }
            }
        } 
    }
    else if (request.hasOwnProperty("uPubkey"))
    {
        uAccountInfo = await dbNNHandler.getUserAccountByPubkey(request.uPubkey);
        if (uAccountInfo !== false)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    uAccountInfo : uAccountInfo
                }
            }
        }
    }
    else if (request.hasOwnProperty("tAccountNum"))
    {
        tAccountInfo = await dbNNHandler.getTokenAccountByAccountNum(request.tAccountNum);
        if (tAccountInfo !== false)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    tAccountInfo : tAccountInfo
                }
            }
        } 
    }
    else if (request.hasOwnProperty("uAccountNum"))
    {
        uAccountInfo = await dbNNHandler.getUserAccountByAccountNum(request.uAccountNum);
        if (uAccountInfo !== false)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    uAccountInfo : uAccountInfo
                }
            }
        }
    }
    // SC
    else if (request.hasOwnProperty("scAction"))
    {
        logger.debug("scAction : " + request.scAction);

        let scAccountInfo = await dbNNHandler.getAccountScInfoByScAction(request.scAction);
        if (scAccountInfo !== false)
        {
            logger.debug("scAccountInfo : " + scAccountInfo);

            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    scAccountInfo : scAccountInfo
                }
            }
        }
        else
        {
            logger.debug("scAction : Error");
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getAccountHistory = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getAccountHistory");
    
    try {
        do
        {
            let uAccountNum = false;

            if (request.hasOwnProperty("tAccountAction") && request.hasOwnProperty("uAccountNum"))
            {
                logger.debug('request.tAccountAction : ' + request.tAccountAction);
                logger.debug('request.uAccountNum : ' + request.uAccountNum);

                uAccountNum = request.uAccountNum;
            }
            else if (request.hasOwnProperty("tAccountAction") && request.hasOwnProperty("uAccountId"))
            {
                logger.debug('request.tAccountAction : ' + request.tAccountAction);
                logger.debug('request.uAccountId : ' + request.uAccountId);

                let apiPath = `/account/chk/info?accountIdSimple=${request.uAccountId}`;
                logger.debug("apiPath : " + apiPath);
                apiRes = await webApi.APICallProc(apiPath, config.FBNIN_CONFIG, webApi.WEBAPI_DEFINE.METHOD.GET);
                logger.debug("apiRes : " + JSON.stringify(apiRes));
                if (apiRes.errorCode)
                {
                    // Error Code
                    logger.error("Invalid uAccountId");
                    break;
                }

                if (!apiRes.contents.hasOwnProperty("uAccountInfo"))
                {
                    // Error Code
                    logger.error("None User Account Info");
                    break;
                }

                uAccountNum = apiRes.contents.uAccountInfo.account_num;
                // logger.debug("uAccountNum : " + uAccountNum);
            }

            if (request.hasOwnProperty("tAccountAction") && uAccountNum !== false)
            {
                let uAccountLedgers = await dbNNHandler.getLedgersByActionAndAccountNum(request.tAccountAction, uAccountNum);
                logger.debug('uAccountLedgers.length : ' + uAccountLedgers.length);
        
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountLedgers : uAccountLedgers
                    }
                }
            }
        } while (0);
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.chkAccountInfo = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : chkAccountInfo");

    try {
        let uAccountInfo;
        let tAccountInfo;

        if (request.hasOwnProperty("accountId"))
        {
            logger.debug("accountId : " + request.accountId);
            uAccountInfo = await dbNNHandler.getUserAccountByAccountId(request.accountId);
            if (uAccountInfo !== false)
            {
                //
                let uAccountBalance = await dbNNHandler.getAccountBalanceByAccountNum(uAccountInfo.account_num);
                logger.debug('uAccountBalance.length : ' + uAccountBalance.length);

                //
                let curMs = Date.now();
                let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;
                let prv30dMs = curMs - define.FIXED_VAL.THIRTY_DAY_MS;
                let uAccountBalancePrv24h = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv24hMs);
                let uAccountBalancePrv30d = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv30dMs);

                //
                let uAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(uAccountInfo.account_num);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(), 
                        uAccountTxsCnt : uAccountTxsCnt, 
                        uAccountInfo : uAccountInfo, 
                        numOfTokens : uAccountBalance.length, 
                        uAccountBalance : uAccountBalance, 
                        uAccountBalancePrv24h : uAccountBalancePrv24h, 
                        uAccountBalancePrv30d : uAccountBalancePrv30d
                    }
                }
            }
        }
        else if (request.hasOwnProperty("accountIdSimple"))
        {
            logger.debug("accountIdSimple : " + request.accountIdSimple);
            uAccountInfo = await dbNNHandler.getUserAccountByAccountId(request.accountIdSimple);
            if (uAccountInfo !== false)
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(), 
                        uAccountInfo : uAccountInfo
                    }
                }
            }
        }

        if (request.hasOwnProperty("accountNum"))
        {
            logger.debug("accountNum : " + request.accountNum);
            uAccountInfo = await dbNNHandler.getUserAccountByAccountNum(request.accountNum);
            if (uAccountInfo !== false)
            {
                //
                let uAccountBalance = await dbNNHandler.getAccountBalanceByAccountNum(uAccountInfo.account_num);
                logger.debug('uAccountBalance.length : ' + uAccountBalance.length);

                //
                let curMs = Date.now();
                let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;
                let prv30dMs = curMs - define.FIXED_VAL.THIRTY_DAY_MS;

                let uAccountBalancePrv24h = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv24hMs);
                let uAccountBalancePrv30d = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv30dMs);

                //
                let uAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(uAccountInfo.account_num);
                
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountTxsCnt : uAccountTxsCnt,
                        uAccountInfo : uAccountInfo, 
                        numOfTokens : uAccountBalance.length, 
                        uAccountBalance : uAccountBalance, 
                        uAccountBalancePrv24h : uAccountBalancePrv24h, 
                        uAccountBalancePrv30d : uAccountBalancePrv30d
                    }
                }
            }
            else
            {
                tAccountInfo = await dbNNHandler.getTokenAccountByAccountNum(request.accountNum);
                if (tAccountInfo !== false)
                {
                    //
                    let tAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(tAccountInfo.account_num);
    
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : Date.now(),
                            tAccountTxsCnt : tAccountTxsCnt, 
                            tAccountInfo : tAccountInfo
                        }
                    }
                }
            }
        }
        else if (request.hasOwnProperty("accountNumSimple"))
        {
            logger.debug("accountNumSimple : " + request.accountNumSimple);
            uAccountInfo = await dbNNHandler.getUserAccountByAccountNum(request.accountNumSimple);
            if (uAccountInfo !== false)
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountInfo : uAccountInfo
                    }
                }
            }
            else
            {
                tAccountInfo = await dbNNHandler.getTokenAccountByAccountNum(request.accountNumSimple);
                if (tAccountInfo !== false)
                {
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : Date.now(),
                            tAccountInfo : tAccountInfo
                        }
                    }
                }
            }
        }

        if (request.hasOwnProperty("pubkey"))
        {
            logger.debug("pubkey : " + request.pubkey);
            uAccountInfo = await dbNNHandler.getUserAccountByPubkey(request.pubkey);
            if (uAccountInfo !== false)
            {
                //
                let uAccountBalance = await dbNNHandler.getAccountBalanceByAccountNum(uAccountInfo.account_num);

                //
                let curMs = Date.now();
                let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;
                let prv30dMs = curMs - define.FIXED_VAL.THIRTY_DAY_MS;
                let uAccountBalancePrv24h = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv24hMs);
                let uAccountBalancePrv30d = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv30dMs);

                //
                let uAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(uAccountInfo.account_num);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountTxsCnt : uAccountTxsCnt,
                        uAccountInfo : uAccountInfo, 
                        numOfTokens : uAccountBalance.length, 
                        uAccountBalance : uAccountBalance, 
                        uAccountBalancePrv24h : uAccountBalancePrv24h, 
                        uAccountBalancePrv30d : uAccountBalancePrv30d
                    }
                }
            }
            else
            {
                tAccountInfo = await dbNNHandler.getTokenAccountByPubkey(request.pubkey);
                if (tAccountInfo !== false)
                {
                    //
                    let tAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(tAccountInfo.account_num);
    
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : Date.now(),
                            tAccountTxsCnt : tAccountTxsCnt, 
                            tAccountInfo : tAccountInfo
                        }
                    }
                } 
            }
        }
        else if (request.hasOwnProperty("pubkeySimple"))
        {
            logger.debug("pubkeySimple : " + request.pubkeySimple);
            uAccountInfo = await dbNNHandler.getUserAccountByPubkey(request.pubkeySimple);
            if (uAccountInfo !== false)
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountInfo : uAccountInfo
                    }
                }
            }
            else
            {
                tAccountInfo = await dbNNHandler.getTokenAccountByPubkey(request.pubkeySimple);
                if (tAccountInfo !== false)
                {
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : Date.now(),
                            tAccountInfo : tAccountInfo
                        }
                    }
                } 
            }
        }

        if (request.hasOwnProperty("ownerPubkey"))
        {
            logger.debug("ownerPubkey : " + request.ownerPubkey);
            uAccountInfo = await dbNNHandler.getUserAccountByPubkey(request.ownerPubkey);
            if (uAccountInfo !== false)
            {
                //
                let uAccountBalance = await dbNNHandler.getAccountBalanceByAccountNum(uAccountInfo.account_num);

                //
                let curMs = Date.now();
                let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;
                let prv30dMs = curMs - define.FIXED_VAL.THIRTY_DAY_MS;
                let uAccountBalancePrv24h = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv24hMs);
                let uAccountBalancePrv30d = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv30dMs);

                //
                let uAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(uAccountInfo.account_num);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountTxsCnt : uAccountTxsCnt,
                        uAccountInfo : uAccountInfo, 
                        numOfTokens : uAccountBalance.length, 
                        uAccountBalance : uAccountBalance, 
                        uAccountBalancePrv24h : uAccountBalancePrv24h, 
                        uAccountBalancePrv30d : uAccountBalancePrv30d
                    }
                }
            }
            else
            {
                tAccountInfo = await dbNNHandler.getTokenAccountByPubkey(request.ownerPubkey);
                if (tAccountInfo !== false)
                {
                    //
                    let tAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(tAccountInfo.account_num);
    
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : Date.now(),
                            tAccountTxsCnt : tAccountTxsCnt, 
                            tAccountInfo : tAccountInfo
                        }
                    }
                } 
            }
        }
        else if (request.hasOwnProperty("ownerPubkeySimple"))
        {
            logger.debug("ownerPubkeySimple : " + request.ownerPubkeySimple);
            uAccountInfo = await dbNNHandler.getUserAccountByPubkey(request.ownerPubkeySimple);
            if (uAccountInfo !== false)
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountInfo : uAccountInfo
                    }
                }
            }
            else
            {
                tAccountInfo = await dbNNHandler.getTokenAccountByPubkey(request.ownerPubkeySimple);
                if (tAccountInfo !== false)
                {
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : Date.now(),
                            tAccountInfo : tAccountInfo
                        }
                    }
                } 
            }
        }

        if (request.hasOwnProperty("superPubkey"))
        {
            logger.debug("superPubkey : " + request.superPubkey);
            uAccountInfo = await dbNNHandler.getUserAccountByPubkey(request.superPubkey);
            if (uAccountInfo !== false)
            {
                //
                let uAccountBalance = await dbNNHandler.getAccountBalanceByAccountNum(uAccountInfo.account_num);
                logger.debug('uAccountBalance.length : ' + uAccountBalance.length);

                //
                let curMs = Date.now();
                let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;
                let prv30dMs = curMs - define.FIXED_VAL.THIRTY_DAY_MS;
                let uAccountBalancePrv24h = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv24hMs);
                let uAccountBalancePrv30d = await dbNNHandler.getAccountBalanceByAccountNumAndCreateTm(uAccountInfo.account_num, prv30dMs);

                //
                let uAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(uAccountInfo.account_num);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountTxsCnt : uAccountTxsCnt,
                        uAccountInfo : uAccountInfo, 
                        numOfTokens : uAccountBalance.length, 
                        uAccountBalance : uAccountBalance, 
                        uAccountBalancePrv24h : uAccountBalancePrv24h, 
                        uAccountBalancePrv30d : uAccountBalancePrv30d
                    }
                }
            }
            else
            {
                tAccountInfo = await dbNNHandler.getTokenAccountByPubkey(request.superPubkey);
                if (tAccountInfo !== false)
                {
                    //
                    let tAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(tAccountInfo.account_num);
    
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : Date.now(),
                            tAccountTxsCnt : tAccountTxsCnt, 
                            tAccountInfo : tAccountInfo
                        }
                    }
                } 
            }
        }
        else if (request.hasOwnProperty("superPubkeySimple"))
        {
            logger.debug("superPubkeySimple : " + request.superPubkeySimple);
            uAccountInfo = await dbNNHandler.getUserAccountByPubkey(request.superPubkeySimple);
            if (uAccountInfo !== false)
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        uAccountInfo : uAccountInfo
                    }
                }
            }
            else
            {
                tAccountInfo = await dbNNHandler.getTokenAccountByPubkey(request.superPubkeySimple);
                if (tAccountInfo !== false)
                {
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : Date.now(),
                            tAccountInfo : tAccountInfo
                        }
                    }
                } 
            }
        }

        // Token Only
        if (request.hasOwnProperty("tokenAction"))
        {
            logger.debug("tokenAction : " + request.tokenAction);

            let tokenAction = request.tokenAction;

            let tAccountInfo = await dbNNHandler.getTokenInfoByTokenAccountAction(tokenAction);
            if (tAccountInfo !== false)
            {
                //
                let tAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(tAccountInfo.account_num);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        tAccountTxsCnt : tAccountTxsCnt, 
                        tAccountInfo : tAccountInfo
                    }
                }
            } 
        }

        if (request.hasOwnProperty("tokenName"))
        {
            logger.debug("tokenName : " + request.tokenName);

            let tAccountInfo = await dbNNHandler.getTokenInfoByTokenAccountName(request.tokenName);
            if (tAccountInfo !== false)
            {
                //
                let tAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(tAccountInfo.account_num);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        tAccountTxsCnt : tAccountTxsCnt, 
                        tAccountInfo : tAccountInfo
                    }
                }
            } 
        }

        if (request.hasOwnProperty("tokenSymbol"))
        {
            logger.debug("tokenSymbol : " + request.tokenSymbol);

            let tAccountInfo = await dbNNHandler.getTokenInfoByTokenAccountSymbol(request.tokenSymbol);
            if (tAccountInfo !== false)
            {
                //
                let tAccountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(tAccountInfo.account_num);
                
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        tAccountTxsCnt : tAccountTxsCnt, 
                        tAccountInfo : tAccountInfo
                    }
                }
            } 
        }

        // SC
        if (request.hasOwnProperty("scAction"))
        {
            logger.debug("scAction : " + request.scAction);

            let scAccountInfo = await dbNNHandler.getAccountScInfoByScAction(request.scAction);
            if (scAccountInfo !== false)
            {
                logger.debug("scAccountInfo : " + scAccountInfo);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        scAccountInfo : scAccountInfo
                    }
                }
            }
            else
            {
                logger.debug("scAccountInfo : Error");
            }
        }

        if (request.hasOwnProperty("scActionTarget"))
        {
            logger.debug("scActionTarget : " + request.scActionTarget);

            let scAccountInfo = await dbNNHandler.getAccountScInfoByScActionAndActionTarget(request.scActionTarget);
            if (scAccountInfo !== false)
            {
                logger.debug("scAccountInfo : " + scAccountInfo);

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        scAccountInfo : scAccountInfo
                    }
                }
            }
            else
            {
                logger.debug("scAccountInfo : Error");
            }
        }
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.chkAccountCnt = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : chkAccountInfo");

    try {
        // SC
        if (request.hasOwnProperty("scAction"))
        {
            logger.debug("scAction : " + request.scAction);

            let totalScActionCnt = await dbNNHandler.getAccountScCntByScAction(request.scAction);
            logger.debug("totalScActionCnt : " + totalScActionCnt);

            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    totalScActionCnt : totalScActionCnt
                }
            }
        }
    } catch (err) {
        logger.error("Error - ");
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}
