//
const config = require("../config/config.js");
const define = require("../config/define.js");
const dbUtil = require("../src/db/dbUtil");
const dbNN = require("../src/db/dbNN.js");
const dbNNHandler = require("../src/db/dbNNHandler.js");
const util = require("../src/utils/commonUtil.js");
const logger = require('../src/utils/winlog.js');


// GET
//
module.exports.getBlkTxCnt = async (req, res) => {
    const request = req.query;
    let ret_msg;

    logger.debug(JSON.stringify(req.query) + ' ' + request.hasOwnProperty("sttBN") + ' ' + request.hasOwnProperty("endBN"));

    if(!(request.hasOwnProperty("sttBN")) && !(request.hasOwnProperty("endBN")))
    {
        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_PROPERTY.MSG}};
    }
    else if(isNaN(request.sttBN) || isNaN(request.endBN))
    {
        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
    }
    else
    {
        //
        const sttBN = BigInt(request.sttBN);
        const endBN = BigInt(request.endBN);

        //
        try {
            let blkTxsArray = await dbNNHandler.getTxCntByBlkNum(sttBN, endBN);
            if (blkTxsArray !== false)
            {
                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, blkTxsArray : blkTxsArray }};
            }
        } catch (err) {
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }

    res.send(ret_msg);
}

//
module.exports.getBlkInfo = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getBlkInfo");

    if (request.hasOwnProperty("blkNum"))
    {
        if (isNaN(request.blkNum))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            try {
                //
                const blkNum = BigInt(request.blkNum);

                //
                let blkInfo = await dbNNHandler.getBlkInfoByBlkNum(blkNum);
                if (blkInfo !== false)
                {
                    ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, blkInfo : blkInfo }};
                }
            } catch (err) {
                ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
            }
        }
    }
    else if (request.hasOwnProperty("blkHash"))
    {
        if (!isNaN(request.blkHash))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            try {
                //
                let blkInfo = await dbNNHandler.getBlkInfoByBlkHash(request.blkHash);
                if (blkInfo !== false)
                {
                    ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, blkInfo : blkInfo }};
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
module.exports.getBlkCnt = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    try {
        //
        // let totalBlkCnt = await dbNNHandler.getBlkCnt();
        let lastBN = await dbNNHandler.getMaxBlkNumFromBlkContents();
        totalBlkCnt = lastBN;

        //
        let curMs = Date.now();
        let prv24hMs = curMs - define.FIXED_VAL.ONE_DAY_MS;
        let prv24h10mMs = prv24hMs - define.FIXED_VAL.TEN_MIN_MS;

        let totalBlk24hCnt = 0;
        //
        let prv24hCnt = await dbNNHandler.getBlkCntByCreateTm(prv24h10mMs, prv24hMs);

        if (prv24hCnt !== false)
        {
            totalBlk24hCnt = totalBlkCnt - prv24hCnt;
        }

        //
        ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, totalBlkCnt : totalBlkCnt, lastBN : lastBN, totalBlk24hCnt : totalBlk24hCnt }};
    } catch (err) {
        ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
    }

    res.send(ret_msg);
}

//
module.exports.getLatestBlks = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : getLatestBlks");

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
                let totalBlkCnt = await dbNNHandler.getMaxBlkNumFromBlkContents();

                //
                const limitNum = Number(request.cnt)
                let latestBlks = await dbNNHandler.getLatestBlks(limitNum);
                if (latestBlks !== false)
                {
                    ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, totalBlkCnt : totalBlkCnt, latestBlks : latestBlks }};
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
module.exports.getBlkRange = async (req, res) => {
    const request = req.query;
    let ret_msg;

    logger.debug(JSON.stringify(req.query) + ' ' + request.hasOwnProperty("sttBN") + ' ' + request.hasOwnProperty("endBN"));

    if(!(request.hasOwnProperty("sttBN")) && !(request.hasOwnProperty("endBN")))
    {
        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_PROPERTY.MSG}};
    }
    else if(isNaN(request.sttBN) || isNaN(request.endBN))
    {
        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
    }
    else
    {
        //
        const sttBN = BigInt(request.sttBN);
        const endBN = BigInt(request.endBN);

        //
        try {
            //
            let totalBlkCnt = await dbNNHandler.getMaxBlkNumFromBlkContents();

            //
            let rangeBlks = await dbNNHandler.getRangeBlksByBlkNum(sttBN, endBN);
            if (rangeBlks !== false)
            {
                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, totalBlkCnt : totalBlkCnt, rangeBlks : rangeBlks }};
            }
        } catch (err) {
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }

    res.send(ret_msg);
}

// const blk_list_sort = (a, b) => {
//     if(parseInt(a.blk_num) == parseInt(b.blk_num)) {
//         return 0;
//     }
//     return parseInt(a.blk_num) < parseInt(b.blk_num) ? 1 : -1;
// }

// exports.LightBlkInfo = async (req, res) => {
//     const request = req.query;

//     if(request.hash === undefined && request.blknum === undefined) {
//         res.send(404);
//         return;
//     }

//     if(request.hash !== undefined) {
//         if(!define.REGEX.HEX_STR_REGEX.test(request.hash) || request.hash.length < 0 || request.hash.length > 64) {
//             res.send(404);
//             return;
//         }
//     }

//     const conn = await dbUtil.getConn();
//     let ret_msg;
//     let blkinfo;
//     let tx_list;

//     try {
//         if(request.blknum !== undefined) 
//         {
//             sql = dbNN.querys.block.lightBlkInfoWithBN;
//             sql += `${parseInt(request.blknum)}`;

//             [query_result] = await conn.query(sql);
//             blkinfo = query_result[0];
//         }
//         else if(request.blknum === undefined && request.hash !== undefined) 
//         {
//             sql = dbNN.querys.block.lightBlkInfoWithHash;
//             [query_result] = await conn.query(sql, [request.hash]);
//             blkinfo = query_result[0];
//         }
//         else
//         {
//             //
//         }

//         sql = dbNN.querys.sc.txListWithBN;
//         [query_result] = await conn.query(sql, [blkinfo.blk_num]);

//         let tx_list = query_result;

//         ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents : { blkinfo : blkinfo, txlist : tx_list}};

//         // sql = "FLUSH TABLES";
//         // await conn.query(sql);

//         res.send(ret_msg);
//     } catch (err) {
//         logger.error(err);
//         res.send(404);
//     }

//     await dbUtil.releaseConn(conn);
// }

// module.exports.BlkList = async (req, res) => {
//     const request = req.query;
//     const len = parseInt(request.length);
//     const startIdx = parseInt(request.start);
//     const search = request.search.value;
    
//     if(startIdx === undefined || len === undefined) {
//         res.send(404);
//         return;
//     }

//     let ret_msg;
//     const conn = await dbUtil.getConn();

//     try {
//         let sql;

//         if(search === "" || define.REGEX.HASH_REGEX.test(search) || search.length < 4) {
//             sql = dbNN.querys.block.blkList;
//             [query_result] = await conn.query(sql, [startIdx, len]);
//         }
//         else {
//             sql = dbNN.querys.block.blkListWithHash + `"%${search}%"`;
//             [query_result] = await conn.query(sql);
//         }

//         let blk_list_arr = new Array();
//         await util.asyncForEach(query_result, (element, index) => {
//             let blkInfo = {
//                 blk_num : element.blk_num,
//                 bgt : element.bgt,
//                 tx_cnt : element.tx_cnt,
//                 blk_hash  : element.blk_hash,
//                 subnet_id : element.subnet_id
//             }
//             blk_list_arr.push(blkInfo);
//         });

//         sql = dbNN.querys.block.totalBlkCnt;
//         [query_result] = await conn.query(sql);
//         let total_blk_num = query_result[0].cnt;

//         // blk_list_arr.sort(blk_list_sort);
//         ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents : { blklist : blk_list_arr}, data : blk_list_arr, recordsTotal : total_blk_num, recordsFiltered : total_blk_num, timestamp : new Date().getTime()};

//         // sql = "FLUSH TABLES";
//         // await conn.query(sql);

//         res.send(ret_msg);
//     } catch (err) {
//         logger.error(err);
//         res.sendStatus(404);
//     }

//     await dbUtil.releaseConn(conn);
// }

// module.exports.lastBlkNum = async (req, res) => {
//     let ret_msg;

//     let sql = dbNN.querys.block.totalBlkCnt;
    
//     try {
//         [query_result] = await dbUtil.query(sql);
//         let total_blk_num;

//         if(query_result === undefined) {
//             total_blk_num = 1;
//         } else {
//             total_blk_num = Number(query_result[0].cnt) + 1;
//         }

//         ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents : {blk_num : total_blk_num }};

//         res.send(ret_msg);

//     } catch (err) {
//         logger.error(err);

//         res.send(404);
//     }
// }