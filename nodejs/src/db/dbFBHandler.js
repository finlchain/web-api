//
const dbUtil = require("./../../src/db/dbUtil.js");
const dbFB = require("./../../src/db/dbFB.js");
const dbIS = require("./../../src/db/dbIS.js");
const util = require("./../../src/utils/commonUtil.js");
const logger = require('./../../src/utils/winlog.js');

// //
// module.exports.setReplInfo = async (subnet_id, blk_num, ip, role, log_file, log_pos, cluster_p2p_addr) => {
//     let sql = dbFB.querys.fb.repl_info.insertReplInfo;

//     let query_result = await dbUtil.queryPre(sql, [subnet_id, blk_num, ip, role, log_file, log_pos, cluster_p2p_addr]);
// }

///////////////////////////////////////////////////////////////////////
// Replication Get
module.exports.getReplData = async (blkNum, role, clusterP2pAddr) => {
    logger.debug("func : getReplData");

    let query_result;

    //
    if (typeof blkNum === 'undefined')
    {
        query_result = await dbUtil.query(dbFB.querys.fb.repl_info.selectReplInfo);
    }
    else if (typeof role === 'undefined')
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectMaxReplInfoByBN, [blkNum]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);
    
            query_result = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectReplInfoByBN, [maxBlkNum]);
        }
    }
    else if (typeof clusterP2pAddr === 'undefined')
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectMaxReplInfoByBNAndRole, [blkNum, role]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);
            
            query_result = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectReplInfoByBNAndRole, [maxBlkNum, role]);
        }
    }
    else
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectMaxReplInfoByBNAndRole, [blkNum, role]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);
    
            query_result = await dbUtil.queryPre(dbFB.querys.fb.repl_info.selectReplInfoByBNAndRoleAndClusterP2pAddr, [maxBlkNum, role, clusterP2pAddr]);
        }
    }
    
    //
    if (!query_result.length)
    {
        logger.error("Error - getReplData");
    }

    return query_result;
}

// Replication Get From IS Shard
module.exports.getReplDataIS = async (blkNum, role, clusterP2pAddr) => {
    logger.debug("func : getReplDataIS");

    let query_result;

    //
    if (typeof blkNum === 'undefined')
    {
        query_result = await dbUtil.query(dbIS.querys.is.repl_info.selectReplInfo);
    }
    else if (typeof role === 'undefined')
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbIS.querys.is.repl_info.selectMaxReplInfoByBN, [blkNum]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);
    
            query_result = await dbUtil.queryPre(dbIS.querys.is.repl_info.selectReplInfoByBN, [maxBlkNum]);
        }
    }
    else if (typeof clusterP2pAddr === 'undefined')
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbIS.querys.is.repl_info.selectMaxReplInfoByBNAndRole, [blkNum, role]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);

            if (util.isIntegerValue(maxBlkNum) === false)
            {
                maxBlkNum = 0;
            }
            
            query_result = await dbUtil.queryPre(dbIS.querys.is.repl_info.selectReplInfoByBNAndRole, [maxBlkNum, role]);
        }
    }
    else
    {
        let maxBlkNum;

        let query_result_1 = await dbUtil.queryPre(dbIS.querys.is.repl_info.selectMaxReplInfoByBNAndRole, [blkNum, role]);
        if (query_result_1.length)
        {
            maxBlkNum = query_result_1[0].max_blk_num;
            logger.debug("maxBlkNum : " + maxBlkNum);
    
            query_result = await dbUtil.queryPre(dbIS.querys.is.repl_info.selectReplInfoByBNAndRoleAndClusterP2pAddr, [maxBlkNum, role, clusterP2pAddr]);
        }
    }
    
    //
    if (!query_result.length)
    {
        logger.error("Error - getReplData");
    }

    return query_result;
}

module.exports.getReplDataArr = async (blkNum, role, clusterP2pAddr) => {
    let replDataArr = new Array();

    let replData = await this.getReplDataIS(blkNum, role, clusterP2pAddr);

    if (replData.length)
    {
        for(var i = 0; i < replData.length; i++)
        {
            // 
            // replDataArr.push({data : replData[i].repl_data});
            // blk_num, ip, role, log_file, log_pos, cluster_p2p_addr
            replDataArr.push({blk_num : replData[i].blk_num, ip : replData[i].ip, role : replData[i].role, 
                    log_file : replData[i].log_file, log_pos : replData[i].log_pos, cluster_p2p_addr : replData[i].cluster_p2p_addr});
        }
    }
    else
    {
        logger.error("Error - getReplDataArr : No replDataArr");
    }

    return replDataArr;
}

// //
// module.exports.saveReplInfo = async (clusterP2pAddr, replData) => {
//     let replBlkNum = replData.blk_num;
//     let ip =  replData.ip;
//     let logFile = replData.log_file;
//     let logPos = replData.log_pos;

//     let subNetId = clusterP2pAddr.slice(10, 14);

//     logger.info("clusterP2pAddr : " + clusterP2pAddr + ", subNetId : " + subNetId);
//     logger.info("ip : " + ip + ", logFile : " + logFile + ", logPos : " + logPos + ", replBlkNum : " + replBlkNum);
//     await dbRepl.setReplSlaveInfo(subNetId, ip, logFile, logPos);

//     //
//     let isagServerIdHex = '0x' + subNetId + define.NODE_ROLE.NUM.ISAG.toString();
//     let isagServerId = parseInt(isagServerIdHex);
//     logger.info("isagServerIdHex : " + isagServerIdHex + ", isagServerId : " + isagServerId);

//     let res = await dbRepl.setReplMaster(isagServerId);

//     // 
//     let repl_res = {
//         ip: util.getMyReplIP().toString(),
//         kind: 'repl get',//msgKind + ' ' + splitMsg[cmdRedis.detail_kind],
//         status: 'complete',
//         data: res.fileName + ' ' + res.filePosition
//     }

//     netUtil.writeData(socket, JSON.stringify(repl_res));

//     // subnet_id, blk_num, ip, role, log_file, log_pos, cluster_p2p_addr
//     dbFBHandler.setReplInfo(subNetId, replBlkNum, util.getMyReplIP().toString(), define.NODE_ROLE.NUM.ISAG, res.fileName, res.filePosition, clusterP2pAddr);
// }
