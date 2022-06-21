//
const config = require("../config/config.js");
const define = require("../config/define.js");
const dbUtil = require("../src/db/dbUtil");
const dbNN = require("../src/db/dbNN.js");
const dbISHandler = require("../src/db/dbISHandler.js");
const dbNNHandler = require("../src/db/dbNNHandler.js");
const webApi = require("./../src/net/webApi.js");
const util = require("../src/utils/commonUtil.js");
const logger = require('../src/utils/winlog.js');

// GET
//
module.exports.getScTxsAll = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getScTxsAll");

    if (request.hasOwnProperty("tAccountAction"))
    {
        if (isNaN(request.tAccountAction))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            //
            let txsCnt = await dbNNHandler.getScTxsCntAllByTxnAction(request.tAccountAction);

            //
            let curMs = Date.now();
            let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;

            let txs24hCnt = await dbNNHandler.getScTxsCntPerDayByTokenAccountAction(request.tAccountAction, prv24hMs, curMs);

            if ((txsCnt !== false) && (txs24hCnt !== false))
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        txsCnt : txsCnt,
                        txs24hCnt : txs24hCnt,
                    }
                }
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getScTxsPerDay = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getScTxsPerDay");

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

            let txsCnt = await dbNNHandler.getScTxsCntPerDayByTokenAccountAction(request.tAccountAction, prv24hMs, curMs);

            if (txsCnt !== false)
            {
                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        txsCnt : txsCnt,
                    }
                }
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getScTxsHistory = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getScTxsHistory");

    if (request.hasOwnProperty("tAccountAction") &&
        request.hasOwnProperty("interval") &&
        request.hasOwnProperty("period"))
    {
        if (isNaN(request.tAccountAction) ||
            !isNaN(request.interval) ||
            isNaN(request.period))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            //
            const limitPeriod = Number(request.period);

            if (limitPeriod && limitPeriod <= define.FIXED_VAL.MAX_PERIOD)
            {
                //
                let curMs = Date.now();
                // let sttVal;
                let intervalMs;
                let sttMs;
                let endMs;

                if (request.interval.toUpperCase() === define.INTERVAL.DAY)
                {
                    intervalMs = define.FIXED_VAL.ONE_DAY_MS;
                }
                else // HOUR
                {
                    intervalMs = define.FIXED_VAL.ONE_HOUR_MS;
                }

                // // From 0 hour Ms ~ 24 hour Ms
                // sttVal = util.calNum(curMs, '/', intervalMs, 0);
                // sttMs = sttVal * intervalMs;
                // endMs = sttMs + intervalMs;

                // From Current Ms to Previous 24h Ms
                endMs =curMs;
                sttMs = endMs - define.FIXED_VAL.ONE_DAY_MS;

                let historyList = new Array();

                //
                for (let idx = 0; idx < limitPeriod; idx++)
                {
                    let txsCnt = await dbNNHandler.getScTxsCntPerDayByTokenAccountAction(request.tAccountAction, sttMs, endMs);

                    historyList.push({index : idx, txsCnt : txsCnt, sttMs : sttMs, endMs : endMs});

                    sttMs -= intervalMs;
                    endMs -= intervalMs;
                }

                ret_msg = {
                    errorCode : define.ERR_MSG.SUCCESS.CODE,
                    contents : {
                        timestamp : Date.now(),
                        historyList : historyList,
                    }
                }
            }
            else
            {
                ret_msg = { errorCode : define.ERR_MSG.ERR_INVALID_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_INVALID_DATA.MSG}};
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getLatestTxs = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getLatestTxs");

    if (request.hasOwnProperty("cnt"))
    {
        if (isNaN(request.cnt))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            // ToDo : Max Cnt
            //
            try {
                //
                const limitNum = Number(request.cnt);

                //
                if (request.hasOwnProperty("subnetId"))
                {
                    if (isNaN(request.subnetId))
                    {
                        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
                    }
                    else
                    {
                        let subnetId = request.subnetId;

                        if (request.hasOwnProperty("txns"))
                        {
                            //
                            let totalTxsCnt = await dbNNHandler.getScTxsCntAllByTxn();

                            //
                            let subnetTxsCnt = await dbNNHandler.getScTxsCntAllByTxnAndSubnetId();
                            
                            //
                            let subnetLatestScTxs = await dbNNHandler.getLatestScTxsBySubnetIdAndTxnLimit(limitNum, subnetId);
                            if (subnetLatestScTxs !== false)
                            {
                                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, totalTxsCnt : totalTxsCnt, subnetId : subnetId, subnetTxsCnt : subnetTxsCnt.toString(), subnetLatestScTxs : subnetLatestScTxs }};
                            }
                        }
                        else
                        {
                            //
                            let maxDbKey = await dbNNHandler.getMaxDbKeyBySubnetId(subnetId);
                            // logger.debug("maxDbKey : " + maxDbKey);
                            if ((maxDbKey !== null) && (maxDbKey !== false))
                            {
                                //
                                let subnetTxsCntHex = BigInt(maxDbKey).toString(16).slice(5);
                                let subnetTxsCnt = util.hexStrToBigInt(subnetTxsCntHex);
                                //
                                subnetTxsCnt = subnetTxsCnt + BigInt(1); // Actual Txs Count of a subnet = dbkey index + 1 because dbkey is started from '0'
                                // logger.debug('subnetTxsCnt : ' + subnetTxsCnt.toString());

                                //
                                let totalTxsCnt = await dbNNHandler.getScTxsCntAll();

                                //
                                let subnetLatestScTxs = await dbNNHandler.getLatestScTxs(limitNum, subnetId);
                                if (subnetLatestScTxs !== false)
                                {
                                    ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, totalTxsCnt : totalTxsCnt, subnetId : subnetId, subnetTxsCnt : subnetTxsCnt.toString(), subnetLatestScTxs : subnetLatestScTxs }};
                                }
                            }
                        }
                    }
                }
                else if (request.hasOwnProperty("fromAccountNum") && request.hasOwnProperty("toAccountNum"))
                {
                    if (isNaN(request.fromAccountNum) || isNaN(request.toAccountNum))
                    {
                        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
                    }
                    else
                    {
                        let fromAccountNum = request.fromAccountNum;
                        let toAccountNum = request.toAccountNum;

                        //
                        let accountLatestScTxs = await dbNNHandler.getLatestScTxsByFromAccountAndToAccountNumLimit(limitNum, fromAccountNum, toAccountNum);
                        let accountLatestTxsCnt = accountLatestScTxs.length;

                        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, fromAccountNum : fromAccountNum, toAccountNum : toAccountNum, accountLatestTxsCnt : accountLatestTxsCnt, accountLatestScTxs : accountLatestScTxs }};
                    }
                    
                }
                else if (request.hasOwnProperty("fromAccountNum"))
                {
                    if (isNaN(request.fromAccountNum))
                    {
                        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
                    }
                    else
                    {
                        let fromAccountNum = request.fromAccountNum;

                        //
                        let accountLatestScTxs = await dbNNHandler.getLatestScTxsByFromAccountNumLimit(limitNum, fromAccountNum);
                        let accountLatestTxsCnt = accountLatestScTxs.length;

                        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, fromAccountNum : fromAccountNum, accountLatestTxsCnt : accountLatestTxsCnt, accountLatestScTxs : accountLatestScTxs }};
                    }
                }
                else if (request.hasOwnProperty("toAccountNum"))
                {
                    if (isNaN(request.toAccountNum))
                    {
                        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
                    }
                    else
                    {
                        let toAccountNum = request.toAccountNum;

                        //
                        let accountLatestScTxs = await dbNNHandler.getLatestScTxsByFromAccountNumLimit(limitNum, toAccountNum);
                        let accountLatestTxsCnt = accountLatestScTxs.length;

                        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, toAccountNum : toAccountNum, accountLatestTxsCnt : accountLatestTxsCnt, accountLatestScTxs : accountLatestScTxs }};
                    }
                }
                else if (request.hasOwnProperty("accountNum"))
                {
                    if (isNaN(request.accountNum))
                    {
                        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
                    }
                    else if (request.hasOwnProperty("tAccountAction")) {
                        if (isNaN(request.tAccountAction))
                        {
                            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
                        }
                        else
                        {
                            let accountNum = request.accountNum;
                            let tAccountAction = request.tAccountAction;

                            //
                            let accountTxsCnt = await dbNNHandler.getScTxsCntAllByTxnAction(tAccountAction);

                            //
                            let accountLatestScTxs = await dbNNHandler.getLatestScTxsByTxnActionAndAccountNumLimit(limitNum, tAccountAction, accountNum);

                            let accountLatestTxsCnt = accountLatestScTxs.length;
    
                            ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, tAccountAction : tAccountAction, accountTxsCnt : accountTxsCnt, accountLatestTxsCnt : accountLatestTxsCnt, accountLatestScTxs : accountLatestScTxs }};
                        }
                    }
                    else
                    {
                        let accountNum = request.accountNum;
                        //
                        let accountTxsCnt = await dbNNHandler.getScTxsCntByAccountNum(accountNum);

                        //
                        let accountLatestScTxs = await dbNNHandler.getLatestScTxsByAccountNumLimit(limitNum, accountNum);
                        let accountLatestTxsCnt = accountLatestScTxs.length;

                        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, accountNum : accountNum, accountTxsCnt : accountTxsCnt, accountLatestTxsCnt : accountLatestTxsCnt, accountLatestScTxs : accountLatestScTxs }};
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
                        let tAccountAction = request.tAccountAction;
                        //
                        let accountTxsCnt = await dbNNHandler.getScTxsCntAllByTxnAction(tAccountAction);

                        //
                        let accountLatestScTxs = await dbNNHandler.getLatestScTxsByTxnActionLimit(limitNum, tAccountAction);
                        let accountLatestTxsCnt = accountLatestScTxs.length;

                        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, tAccountAction : tAccountAction, accountTxsCnt : accountTxsCnt, accountLatestTxsCnt : accountLatestTxsCnt, accountLatestScTxs : accountLatestScTxs }};
                    }
                }
                else if (request.hasOwnProperty("txns"))
                {
                    //
                    let accountTxsCnt = await dbNNHandler.getScTxsCntAllByTxn();

                    //
                    let accountLatestScTxs = await dbNNHandler.getLatestScTxsByTxnLimit(limitNum);
                    let accountLatestTxsCnt = accountLatestScTxs.length;

                    ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, accountTxsCnt : accountTxsCnt, accountLatestTxsCnt : accountLatestTxsCnt, accountLatestScTxs : accountLatestScTxs }};
                }
                else
                {
                    //
                    let totalTxsCnt = await dbNNHandler.getScTxsCntAll();

                    //
                    let latestScTxs = await dbNNHandler.getLatestScTxs(limitNum);
                    if (latestScTxs !== false)
                    {
                        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, totalTxsCnt : totalTxsCnt, latestScTxs : latestScTxs }};
                    }
                }
            } catch (err) {
                ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getRange = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getRange");

    if (request.hasOwnProperty("minDK") && request.hasOwnProperty("maxDK"))
    {
        if (isNaN(request.minDK) || isNaN(request.maxDK))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            //
            try {
                //
                subnetIdMinDkHex = BigInt(request.minDK).toString(16).slice(0,4);
                subnetIdMaxDkHex = BigInt(request.maxDK).toString(16).slice(0,4);

                subnetIdMinDk = util.hexStrToInt(subnetIdMinDkHex);
                subnetIdMaxDk = util.hexStrToInt(subnetIdMaxDkHex);

                if (subnetIdMinDk === subnetIdMaxDk)
                {
                    //
                    let maxDbKey = await dbNNHandler.getMaxDbKeyBySubnetId(subnetIdMinDk);

                    if (maxDbKey !== false)
                    {
                        //
                        let subnetTxsCntHex = BigInt(maxDbKey).toString(16).slice(5);
                        let subnetTxsCnt = util.hexStrToBigInt(subnetTxsCntHex);
                        //
                        subnetTxsCnt = subnetTxsCnt + BigInt(1); // Actual Txs Count of a subnet = dbkey index + 1 because dbkey is started from '0'
                        // logger.debug('subnetTxsCnt : ' + subnetTxsCnt.toString());

                        //
                        let totalTxsCnt = await dbNNHandler.getScTxsCntAll();

                        //
                        let rangeScTxs = await dbNNHandler.getScTxsByMinMaxDbKey(request.minDK, request.maxDK);
                        if (rangeScTxs !== false)
                        {
                            ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, totalTxsCnt : totalTxsCnt, subnetId : subnetIdMinDk, subnetTxsCnt : subnetTxsCnt.toString(), rangeScTxs : rangeScTxs }};
                        }
                    }
                }
            } catch (err) {
                ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getTxsInfo = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getTxsInfo");

    if (request.hasOwnProperty("blkNum") && request.hasOwnProperty("cnt"))
    {
        if (isNaN(request.blkNum) || isNaN(request.cnt))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            try {
                //
                const blkNum = BigInt(request.blkNum);

                //
                const limitNum = Number(request.cnt);

                //
                let dbKeyInfo = await dbNNHandler.getBlkTxsMinMaxInfoByBlkNum(blkNum);
                if (dbKeyInfo !== false)
                {
                    // logger.debug(dbKeyInfo.min_db_key);
                    // logger.debug(dbKeyInfo.max_db_key);

                    let totalTxsCnt = await dbNNHandler.getScTxsCntByMinMaxDbKey(dbKeyInfo.min_db_key, dbKeyInfo.max_db_key);
                    if (totalTxsCnt === false)
                    {
                        totalTxsCnt = 0;
                    }

                    let scTxsInfo = await dbNNHandler.getScTxsByMinMaxDbKeyLimit(dbKeyInfo.min_db_key, dbKeyInfo.max_db_key, limitNum);
                    if (scTxsInfo !== false)
                    {
                        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: { res : true, blkNum : request.blkNum, dbKeyInfo : dbKeyInfo, totalTxsCnt : totalTxsCnt, scTxsInfo : scTxsInfo }};
                    }
                }
            } catch (err) {
                ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
            }
        }
    }
    else if (request.hasOwnProperty("scHash"))
    {
        if (!isNaN(request.scHash))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            try {
                //
                const scHash = request.scHash;

                //
                let dbKey = await dbNNHandler.getBlkTxsDbKeyByScHash(scHash);
                if (dbKey !== false)
                {
                    let scTxsInfo = await dbNNHandler.getScTxsByDbKey(dbKey, scHash);
                    if (scTxsInfo !== false)
                    {
                        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: { res : true, scHash : request.scHash, scTxsInfo : scTxsInfo }};
                    }
                }
            } catch (err) {
                ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

//
module.exports.getTxsCluster = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getTxsCluster");

    if (request.hasOwnProperty("bpInfo"))
    {
        try {
            //////////////////////////////////////////////////////////////////
            // NET
            // Get Cluster Info
            let clusters = await dbISHandler.getClusterAddrByRole(define.NODE_ROLE.NUM.NN);

            if (clusters === false)
            {
                //
            }
            else
            {
                //
                let bp_info_array = new Array();
                let totalTxsCnt = BigInt(0);
                let totalTxs24hCnt = 0;

                await util.asyncForEach(clusters, async(element, index) => {
                    // logger.debug("cluster_p2p_addr [" + index + "] : "+ element);

                    // subnet id
                    let subnet_id = util.hexStrToInt(element.cluster_p2p_addr.slice(define.P2P_DEFINE.P2P_ROOT_SPLIT_INDEX.START));

                    // subnet tx count
                    let subnetTxsCntHex;
                    let subnetTxsCnt = 0;
                    let maxDbKey = await dbNNHandler.getMaxDbKeyBySubnetId(subnet_id);
                    if ((maxDbKey !== false) & maxDbKey !== null)
                    {
                        subnetTxsCntHex = BigInt(maxDbKey).toString(16).slice(5);
                        subnetTxsCnt = util.hexStrToBigInt(subnetTxsCntHex) + BigInt(1); // Actual Txs Count of a subnet = dbkey index + 1 because dbkey is started from '0'
                    }

                    totalTxsCnt = BigInt(totalTxsCnt) + BigInt(subnetTxsCnt);

                    // subnet tx 24h count
                    let curMs = Date.now();
                    let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;

                    let subnet24hCnt = 0;
                    subnet24hCnt = await dbNNHandler.getScTxsCntByCreateTmAndSubnetId(prv24hMs, curMs, subnet_id);
                    if (subnet24hCnt === false)
                    {
                        subnet24hCnt = 0;
                    }

                    totalTxs24hCnt = totalTxs24hCnt + parseInt(subnet24hCnt);

                    //
                    let bp_info = {clusterAddr : element.cluster_p2p_addr, subnetId : subnet_id, subnetTxsCnt : subnetTxsCnt.toString(), subnet24hCnt : subnet24hCnt};
                    // let bp_info = {subnetId : subnet_id, subnetTxsCnt : subnetTxsCnt.toString()};

                    //
                    bp_info_array.push(bp_info);
                });
    
                // ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: { res : true, clusters : clusters }};
                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: { res : true, bpCnt : clusters.length, totalTxsCnt : totalTxsCnt.toString(), totalTxs24hCnt : totalTxs24hCnt.toString(), bp_info : bp_info_array }};
            }
        } catch (err) {
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}
