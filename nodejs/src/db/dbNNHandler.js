//
const define = require('./../../config/define.js');
const dbUtil = require("./../../src/db/dbUtil.js");
const dbNN = require("./../../src/db/dbNN.js");
const util = require('./../../src/utils/commonUtil.js');
const logger = require('./../../src/utils/winlog.js');

///////////////////////////////////////////////////////////////////////////////////////////
//
module.exports.accountTokenCheck = async (tAction, tName, tSymbol) => {
    logger.debug("tAction : " + tAction + ", tName : " + tName + ", tSymbol : " + tSymbol);
    if ((typeof tAction !== 'undefined') && (typeof tName !== 'undefined') && (typeof tSymbol !== 'undefined'))
    {
        const conn = await dbUtil.getConn();
        [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_tokens.selectAccountTokenTNS, [tAction, tName, tSymbol]);
        await dbUtil.releaseConn(conn);

        return query_result;
    }
    else if (typeof tAction !== 'undefined')
    {
        const conn = await dbUtil.getConn();
        [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_tokens.selectAccountTokenT, [tAction]);
        await dbUtil.releaseConn(conn);

        return query_result;
    }

    logger.error("Error - accountTokenCheck");

    return query_result;
}

module.exports.accountTokenKeyCheck = async (owner_pk, super_pk) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_tokens.selectAccountTokenKey, [owner_pk, owner_pk, super_pk, super_pk]);
    await dbUtil.releaseConn(conn);

    return query_result;
}

module.exports.accountTokenAccountCheck = async (account) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_tokens.selectAccountTokenAccount, [account]);
    await dbUtil.releaseConn(conn);

    return query_result;
}

//////////////////
//
module.exports.accountUserAccountIdCheck = async (account_id) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_users.selectAccountUsersByAccountId, [account_id]);

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.accountUserAccountNumCheck = async (account_num) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_users.selectAccountUsersByAccountNum, [account_num]);

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.accountUserCheck = async (owner_pk, super_pk, account_id) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_users.selectAccountUsersByKeysAndAccountId, [owner_pk, owner_pk, super_pk, super_pk, account_id]);

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.accountUserKeyCheck = async (owner_pk, super_pk) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_users.selectAccountUsersByKey, [owner_pk, owner_pk, super_pk, super_pk]);

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.accountScActionCheck = async (scAction) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_sc.selectByScActionLimit, [scAction]);

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.accounScActionAndTargetCheck = async (scAction) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_sc.selectByScActionAndActionTargetLimit, [scAction, scAction]);

    await dbUtil.releaseConn(conn);

    return query_result;
}

///////////////////////////////////////////////////////////////////////////////////////////
//
module.exports.getScTxsCntAll = async () => {
    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCnt;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getScTxsCntAllByTxn = async () => {
    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByTxn;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getScTxsCntAllByTxnAndSubnetId = async (subnetId) => {
    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByTxnAndSubnetId;
        
        let query_result = await dbUtil.queryPre(sql, [subnetId]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getScTxsCntAllByTxnAction = async (accountAction) => {
    logger.debug(accountAction);

    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByTxnAction;
        
        let query_result = await dbUtil.queryPre(sql, [accountAction]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getScTxsCntPerDayByTokenAccountAction = async (accountAction, minMs, maxMs) => {
    logger.debug(accountAction);

    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByTxnActionAndCreateTm;
        
        let query_result = await dbUtil.queryPre(sql, [accountAction, minMs, maxMs]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

module.exports.getScTxsCntByMinMaxDbKey = async (minDbKey, maxDbKey) => {
    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByMinMaxDbKey;
        
        let query_result = await dbUtil.queryPre(sql, [minDbKey, maxDbKey]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

module.exports.getScTxsCntByCreateTmAndSubnetId = async (minTmMs, maxTmMs, subnetId) => {
    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByCreateTmAndSubnetId;
        
        let query_result = await dbUtil.queryPre(sql, [minTmMs, maxTmMs, subnetId]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

module.exports.getScTxsCntByAccountNum = async (AccountNum) => {
    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByAccountNum;
        
        let query_result = await dbUtil.queryPre(sql, [AccountNum, AccountNum, AccountNum]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

module.exports.getScTxsCntByTxnAndActionAndAccountNum = async (tAccountAction, AccountNum) => {
    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByTxnAndActionAndAccountNum;
        
        let query_result = await dbUtil.queryPre(sql, [tAccountAction, AccountNum, AccountNum, AccountNum]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getMaxDbKeyBySubnetId = async (subnetId) => {
    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectMaxDbKeyBySubnetId;
        
        let query_result = await dbUtil.queryPre(sql, [subnetId]);
        
        if(query_result.length) 
        {
            return query_result[0].max_db_key;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getScContentsByFromAccountNum = async (fromAccountNum) => {
    logger.debug(fromAccountNum);

    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectLatestTxsByFromAccountNumLimit;

        let query_result = await dbUtil.queryPre(sql, [fromAccountNum, 1]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error");
    }

    return false;
}

//
module.exports.getLatestScTxs = async (limitNum, subnetId) => {
    try {
        let scTxsArray = new Array();

        let sql;
        let query_result;

        if ((typeof subnetId === 'undefined'))
        {
            sql = dbNN.querys.sc.sc_contents.selectLatestTxsLimit;
            query_result = await dbUtil.queryPre(sql, [limitNum]);
        }
        else
        {
            sql = dbNN.querys.sc.sc_contents.selectLatestTxsBySubnetIdLimit;
            query_result = await dbUtil.queryPre(sql, [subnetId, limitNum]);
        }

        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                confirmed : element.confirmed, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getLatestScTxsBySubnetIdAndTxnLimit = async (limitNum, subnetId) => {
    try {
        let scTxsArray = new Array();

        let sql = dbNN.querys.sc.sc_contents.selectLatestTxsBySubnetIdAndTxnLimit;
        let query_result = await dbUtil.queryPre(sql, [subnetId, limitNum]);

        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                confirmed : element.confirmed, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getLatestScTxsByFromAccountNumLimit = async (limitNum, fromAccountNum) => {
    try {
        let scTxsArray = new Array();

        let sql;
        let query_result;

        sql = dbNN.querys.sc.sc_contents.selectLatestTxsByFromAccountNumLimit;
        query_result = await dbUtil.queryPre(sql, [fromAccountNum, limitNum]);
        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                confirmed : element.confirmed, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        scTxsArray.sort(function(x, y){
            return y.create_tm - x.create_tm; // Desc Sort
        });

        if (scTxsArray.length > limitNum)
        {
            //
        }

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getLatestScTxsByToAccountNumLimit = async (limitNum, toAccountNum) => {
    try {
        let scTxsArray = new Array();

        let sql;
        let query_result;

        sql = dbNN.querys.sc.sc_contents.selectLatestTxsByToAccountNumLimit;
        query_result = await dbUtil.queryPre(sql, [toAccountNum, limitNum]);
        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                confirmed : element.confirmed, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        scTxsArray.sort(function(x, y){
            return y.create_tm - x.create_tm; // Desc Sort
        });

        if (scTxsArray.length > limitNum)
        {
            //
        }

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getLatestScTxsByFromAccountAndToAccountNumLimit = async (limitNum, fromAccountNum, toAccountNum) => {
    try {
        let scTxsArray = new Array();

        let sql;
        let query_result;

        sql = dbNN.querys.sc.sc_contents.selectLatestTxsByFromAccountAndToAccountLimit;
        query_result = await dbUtil.queryPre(sql, [fromAccountNum, toAccountNum, toAccountNum, limitNum]);
        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                confirmed : element.confirmed, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        scTxsArray.sort(function(x, y){
            return y.create_tm - x.create_tm; // Desc Sort
        });

        if (scTxsArray.length > limitNum)
        {
            //
        }

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getLatestScTxsByAccountNumLimit = async (limitNum, accountNum) => {
    try {
        let scTxsArray = new Array();

        //
        // sql = dbNN.querys.sc.sc_contents.selectLatestTxsByAccountNumLimit;
        // query_result = await dbUtil.queryPre(sql, [accountNum, accountNum, accountNum, limitNum]);
        // await util.asyncForEach(query_result, async(element, index) => {
        //     let obj = { 
        //         create_tm : element.create_tm, 
        //         db_key :  element.db_key, 
        //         confirmed : element.confirmed, 
        //         from_account : element.from_account,
        //         to_account : element.to_account,
        //         dst_account : element.dst_account,
        //         action : element.action,
        //         c_action : element.c_action,
        //         amount : element.amount,
        //         sc_hash :  element.sc_hash,
        //         blk_num : element.blk_num,
        //         subnet_id : element.subnet_id,
        //         contract : element.contract
        //     };

        //     scTxsArray.push(obj);
        // });

        let sql;
        let query_result;

        sql = dbNN.querys.sc.sc_contents.selectLatestTxsByFromAccountNumLimit;
        query_result = await dbUtil.queryPre(sql, [accountNum, limitNum]);
        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                confirmed : element.confirmed, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        // sql = dbNN.querys.sc.sc_contents.selectLatestTxsByToAccountNumLimit;
        // query_result = await dbUtil.queryPre(sql, [accountNum, limitNum]);
        // await util.asyncForEach(query_result, async(element, index) => {
        //     let obj = { 
        //         create_tm : element.create_tm, 
        //         db_key :  element.db_key, 
        //         confirmed : element.confirmed, 
        //         from_account : element.from_account,
        //         to_account : element.to_account,
        //         dst_account : element.dst_account,
        //         action : element.action,
        //         c_action : element.c_action,
        //         amount : element.amount,
        //         sc_hash :  element.sc_hash,
        //         blk_num : element.blk_num,
        //         subnet_id : element.subnet_id,
        //         contract : element.contract
        //     };

        //     scTxsArray.push(obj);
        // });

        sql = dbNN.querys.sc.sc_contents.selectLatestTxsByDstAccountNumLimit;
        query_result = await dbUtil.queryPre(sql, [accountNum, limitNum]);
        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                confirmed : element.confirmed, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        scTxsArray.sort(function(x, y){
            return y.create_tm - x.create_tm; // Desc Sort
        });

        if (scTxsArray.length > limitNum)
        {
            //
        }

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getLatestScTxsByTxnLimit = async (limitNum) => {
    try {
        let scTxsArray = new Array();

        let sql = dbNN.querys.sc.sc_contents.selectLatestTxsByTxnLimit;
        let query_result = await dbUtil.queryPre(sql, [limitNum]);

        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getLatestScTxsByTxnActionLimit = async (limitNum, txnAction) => {
    try {
        let scTxsArray = new Array();

        let sql = dbNN.querys.sc.sc_contents.selectLatestTxsByTxnAndActionLimit;
        let query_result = await dbUtil.queryPre(sql, [txnAction, limitNum]);

        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getLatestScTxsByTxnActionAndAccountNumLimit = async (limitNum, txnAction, accounNum) => {
    try {
        let scTxsArray = new Array();

        let sql;
        let query_result;

        if (Number(txnAction) === define.CONTRACT_DEFINE.ACTIONS.TOKEN.SECURITY_TOKEN)
        {
            sql = dbNN.querys.sc.sc_contents.selectLatestTxsByTxnAndSecActionAndAccountNumLimit;
            query_result = await dbUtil.queryPre(sql, [txnAction, accounNum, accounNum, limitNum]);
        }
        else
        {
            sql = dbNN.querys.sc.sc_contents.selectLatestTxsByTxnAndUtilActionAndAccountNumLimit;
            query_result = await dbUtil.queryPre(sql, [txnAction, accounNum, accounNum, accounNum, limitNum]);
        }

        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                create_tm : element.create_tm, 
                db_key :  element.db_key, 
                from_account : element.from_account,
                to_account : element.to_account,
                dst_account : element.dst_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getScTxsByDbKey = async (dbKey, scHash) => {
    try {
        let sql = dbNN.querys.sc.sc_contents.selectTxsByDbKey;

        let query_result = await dbUtil.queryPre(sql, [dbKey]);

        if (query_result.length)
        {
            return query_result[0];
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getScTxsByMinMaxDbKey = async (minDbKey, maxDbKey) => {
    try {
        let scTxsArray = new Array();

        let sql = dbNN.querys.sc.sc_contents.selectTxsByMinMaxDbKey;

        let query_result = await dbUtil.queryPre(sql, [minDbKey, maxDbKey]);

        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                db_key :  element.db_key, 
                from_account : element.from_account,
                to_account : element.to_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getScTxsByMinMaxDbKeyLimit = async (minDbKey, maxDbKey, limitNum) => {
    try {
        let scTxsArray = new Array();

        let sql = dbNN.querys.sc.sc_contents.selectTxsByMinMaxDbKeyLimit;

        let query_result = await dbUtil.queryPre(sql, [minDbKey, maxDbKey, limitNum]);

        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { 
                db_key :  element.db_key, 
                from_account : element.from_account,
                to_account : element.to_account,
                action : element.action,
                c_action : element.c_action,
                amount : element.amount,
                sc_hash :  element.sc_hash,
                blk_num : element.blk_num,
                subnet_id : element.subnet_id,
                contract : element.contract
            };

            scTxsArray.push(obj);
        });

        return scTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
//
//
module.exports.getBlkTxsDbKeyByScHash = async (scHash) => {
    logger.debug(scHash);

    try {
        //
        let sql = dbNN.querys.block.blk_txs.selectDbKeyByScHash;
        
        let query_result = await dbUtil.queryPre(sql, [scHash]);
        if(query_result.length) 
        {
            return query_result[0].db_key;
        }
        else
        {
            logger.debug('None ');
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getBlkTxsMinMaxInfoByBlkNum = async (blkNum) => {
    logger.debug(blkNum);

    try {
        //
        let sql = dbNN.querys.block.blk_txs.selectDbKeyMinMaxByblkNum;
        
        let query_result = await dbUtil.queryPre(sql, [blkNum]);
        if(query_result.length) 
        {
            let retObj = {min_db_key : query_result[0].min_db_key, max_db_key : query_result[0].max_db_key};

            return retObj;
        }
        else
        {
            logger.debug('None ');
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}


//
module.exports.getBlkCnt = async () => {
    try {
        let sql = dbNN.querys.block.blk_contents.selectLastBlkNum;

        let query_result = await dbUtil.query(sql);

        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

module.exports.getBlkCntByCreateTm = async (minTmMs, maxTmMs) => {
    try {
        //
        let sql = dbNN.querys.block.blk_contents.selectCntByCreateTm;

        let query_result = await dbUtil.queryPre(sql, [minTmMs, maxTmMs]);
        
        if(query_result.length) 
        {
            // return query_result[0].total_count;
            return query_result[0].max_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getBlkInfoByBlkNum = async (blkNum) => {
    try {
        let sql = dbNN.querys.block.blk_contents.selectByBlkNum;

        let query_result = await dbUtil.queryPre(sql, [blkNum]);

        if (query_result.length)
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getBlkInfoByBlkHash = async (blkHash) => {
    try {
        let sql = dbNN.querys.block.blk_contents.selectByBlkHash;

        let query_result = await dbUtil.queryPre(sql, [blkHash]);

        if (query_result.length)
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getTxCntByBlkNum = async (sttBN, endBN) => {
    try {
        let blkTxsArray = new Array();

        let sql = dbNN.querys.block.blk_contents.selectTxCntByBlkNum;

        let query_result = await dbUtil.queryPre(sql, [sttBN, endBN]);

        await util.asyncForEach(query_result, async(element, index) => {
            let obj = { blkNum : element.blk_num, txCnt : element.tx_cnt};
            blkTxsArray.push(obj);
        });

        return blkTxsArray;
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getRangeBlksByBlkNum = async (sttBN, endBN) => {
    try {
        let sql = dbNN.querys.block.blk_contents.selectRangeBlksByBlkNum;

        let query_result = await dbUtil.queryPre(sql, [sttBN, endBN]);

        return query_result;
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getLatestBlks = async (limitNum) => {
    try {
        let sql = dbNN.querys.block.blk_contents.selectLatestBlks;

        let query_result = await dbUtil.queryPre(sql, [limitNum]);

        return query_result;
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
//
module.exports.getTokenInfoByTokenAccountAction = async (accountAction) => {
    logger.debug(accountAction);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByAccountAction;
        
        let query_result = await dbUtil.queryPre(sql, [accountAction]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getTokenInfoByTokenAccountName = async (accountName) => {
    logger.debug(accountName);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByAccountName;
        
        let query_result = await dbUtil.queryPre(sql, [accountName]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getTokenInfoByTokenAccountSymbol = async (accountSymbol) => {
    logger.debug(accountSymbol);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByAccountSymbol;
        
        let query_result = await dbUtil.queryPre(sql, [accountSymbol]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getTokenInfoByAlphabeticName = async () => {
    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByAlphabeticName;
        
        // let query_result = await dbUtil.queryPre(sql, [10]);
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getTokenInfoByIdx = async () => {
    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByIdx;
        
        // let query_result = await dbUtil.queryPre(sql, [10]);
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getTokenInfoWithTxsCnt = async () => {
    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokenInfoWithTxsCnt;
        
        // let query_result = await dbUtil.queryPre(sql, [10]);
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
//
module.exports.getTradeVolumePerDayByTokenAccountAction = async (accountAction, minMs, maxMs) => {
    logger.debug(accountAction);

    try {

        let tokenInfo = await this.getTokenInfoByTokenAccountAction(accountAction);
        if (tokenInfo !== false)
        {
            //
            let tokenTradeVol = 0;
            //
            let sql = dbNN.querys.account.account_ledgers.selectLedgersAmountByActionAndCreateTm;
            
            // let query_result = await dbUtil.queryPre(sql, [accountAction, minMs, maxMs, tokenInfo.account_num]);
            let query_result = await dbUtil.queryPre(sql, [accountAction, minMs, maxMs]);

            // logger.debug("query_result length : " + query_result.length);
            for(var i = 0; i < query_result.length; i++)
            {
                // for ( var keyNm in query_result[i]) {
                //     logger.debug("key : " + keyNm + ", value : " + query_result[i][keyNm]);
                // }

                if ((tokenInfo.account_num != query_result[i].my_account_num) && (Number(query_result[i].amount) > 0))
                {
                    tokenTradeVol = util.calNum(tokenTradeVol, '+', query_result[i].amount, tokenInfo.decimal_point);
                }
            }

            // logger.debug("query_result : " + JSON.stringify(query_result));

            logger.debug("tokenTradeVol : " + tokenTradeVol);

            return {action : tokenInfo.action, name : tokenInfo.name, symbol : tokenInfo.symbol, tradePerDay : tokenTradeVol};
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getLedgersByActionAndAccountNum = async (action, accountNum) => {
    try {
        //
        let sql = dbNN.querys.account.account_ledgers.selectLedgersByActionAndAccountNum;
        
        let query_result = await dbUtil.queryPre(sql, [action, accountNum]);
        
        return query_result;
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
//
module.exports.getSubNetIdByUserAccountPubkey = async (pubkey) => {
    logger.debug(pubkey);

    try {
        //
        let sql = dbNN.querys.account.account_users.selectUsersByPubkey;
        
        let query_result = await dbUtil.queryPre(sql, [pubkey, pubkey]);
        
        if(query_result.length) 
        {
            return query_result[0].subnet_id;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

module.exports.getSubNetIdByUserAccountNum = async (accountNum) => {
    logger.debug(accountNum);

    try {
        //
        let sql = dbNN.querys.account.account_users.selectUsersByAccountNum;
        
        let query_result = await dbUtil.queryPre(sql, [accountNum]);
        
        if(query_result.length) 
        {
            return query_result[0].subnet_id;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

module.exports.getSubNetIdByUserAccountId = async (accountId) => {
    logger.debug(accountId);

    try {
        //
        let sql = dbNN.querys.account.account_users.selectUsersByAccountId;
        
        let query_result = await dbUtil.queryPre(sql, [accountId]);
        
        if(query_result.length) 
        {
            return query_result[0].subnet_id;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
//
module.exports.getSubNetIdByTokenAccountPubkey = async (pubkey) => {
    logger.debug(pubkey);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByPubkey;
        
        let query_result = await dbUtil.queryPre(sql, [pubkey, pubkey]);
        
        if(query_result.length) 
        {
            return query_result[0].subnet_id;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

module.exports.getSubNetIdByTokenAccountNum = async (accountNum) => {
    logger.debug(accountNum);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByAccountNum;
        
        let query_result = await dbUtil.queryPre(sql, [accountNum]);
        
        if(query_result.length) 
        {
            return query_result[0].subnet_id;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

module.exports.getSubNetIdByTokenAccountAction = async (accountAction) => {
    logger.debug(accountAction);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByAccountAction;
        
        let query_result = await dbUtil.queryPre(sql, [accountAction]);
        
        if(query_result.length) 
        {
            return query_result[0].subnet_id;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

module.exports.getSubNetIdByTokenAccountName = async (accountName) => {
    logger.debug(accountName);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByAccountName;
        
        let query_result = await dbUtil.queryPre(sql, [accountName]);
        
        if(query_result.length) 
        {
            return query_result[0].subnet_id;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

module.exports.getSubNetIdByTokenAccountSymbol = async (accountSymbol) => {
    logger.debug(accountSymbol);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByAccountSymbol;
        
        let query_result = await dbUtil.queryPre(sql, [accountSymbol]);
        
        if(query_result.length) 
        {
            return query_result[0].subnet_id;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
//
module.exports.getUserAccountsByIdx = async () => {
    try {
        //
        let sql = dbNN.querys.account.account_users.selectUsersByIdx;
        
        let query_result = await dbUtil.query(sql);

        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getUserAccountByAccountId = async (accountId) => {
    logger.debug(accountId);

    try {
        //
        let sql = dbNN.querys.account.account_users.selectUsersByAccountId;
        
        let query_result = await dbUtil.queryPre(sql, [accountId]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getUserAccountByPubkey = async (pubkey) => {
    logger.debug(pubkey);

    try {
        //
        let sql = dbNN.querys.account.account_users.selectUsersByPubkey;
        
        let query_result = await dbUtil.queryPre(sql, [pubkey, pubkey]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getTokenAccountByPubkey = async (pubkey) => {
    logger.debug(pubkey);

    try {
        //
        let sql = dbNN.querys.account.account_tokens.selectTokensByPubkey;
        
        let query_result = await dbUtil.queryPre(sql, [pubkey, pubkey]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getUserAccountByAccountNum = async (accountNum) => {
    logger.debug(accountNum);

    try {
        //
        let sql = dbNN.querys.account.account_users.selectUsersByAccountNum;
        
        let query_result = await dbUtil.queryPre(sql, [accountNum]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getTokenAccountByAccountNum = async (accountNum) => {
    logger.debug(accountNum);

    try {
        //
        
        let sql = dbNN.querys.account.account_tokens.selectTokensByAccountNum;
        
        let query_result = await dbUtil.queryPre(sql, [accountNum]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
//
module.exports.getMaxBlkNumFromBlkContents = async () => {
    const conn = await dbUtil.getConn();
    // await exeQuery(conn, dbNN.querys.block.useBlock);

    [query_result] = await dbUtil.exeQuery(conn, dbNN.querys.block.blk_contents.selectLastBlkNum);

    let lastBN = '0';

    if (query_result.length)
    {
        if (query_result[0].max_blk_num !== null)
        {
            lastBN = query_result[0].max_blk_num;
        }
    }

    // for(var i = 0; i < query_result.length; i++)
    // {
    //     for ( var keyNm in query_result[i])
    //     {
    //         logger.debug("query_result[i][keyNm] : [" + i +"] " + keyNm + " - " + query_result[i][keyNm]);
    //         if (query_result[i][keyNm])
    //         {
    //             lastBN = query_result[i][keyNm];
    //         }
    //     }
    // }

    logger.debug("lastBN : " + lastBN);

    await dbUtil.releaseConn(conn);

    return lastBN;
}

//////////////////////////////////////////////////////////////////////
//
module.exports.getAccountBalanceCntAllByTokenAccountAction = async (accountAction) => {
    logger.debug(accountAction);

    try {
        //
        let sql = dbNN.querys.account.account_ledgers.selectCntByAction;
        
        let query_result = await dbUtil.queryPre(sql, [accountAction]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getAccountBalanceByActionAndLimit = async (accountAction, limit) => {
    try {
        //
        
        let sql = dbNN.querys.account.account_ledgers.selectLedgersByActionAndLimit;
        
        let query_result = await dbUtil.queryPre(sql, [accountAction, limit]);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getAccountBalanceByAccountNum = async (account_num) => {
    logger.debug("func - getAccountBalanceByAccountNum");

    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_ledgers.selectLedgersByAccountNum, [account_num]);
    // logger.debug("query_result.length : " + query_result.length)
    // for(var i = 0; i < query_result.length; i++)
    // {
    //     for ( var keyNm in query_result[i])
    //     {
    //         if (query_result[i][keyNm])
    //         {
    //             logger.debug("keyNm : " + keyNm + ", value : " + query_result[i][keyNm]);
    //         }
    //     }
    // }

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.getAccountBalanceByAccountNumAndCreateTm = async (account_num, create_tm) => {
    logger.debug("func - getAccountBalanceByAccountNum");

    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_ledgers.selectLedgersByAccountNumAndCreateTm, [account_num, create_tm]);
    // logger.debug("query_result.length : " + query_result.length)
    // for(var i = 0; i < query_result.length; i++)
    // {
    //     for ( var keyNm in query_result[i])
    //     {
    //         if (query_result[i][keyNm])
    //         {
    //             logger.debug("keyNm : " + keyNm + ", value : " + query_result[i][keyNm]);
    //         }
    //     }
    // }

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.getLedgersByAccountNumAndAction = async (account, action) => {
    logger.debug("func - getLedgersByAccountNumAndAction");

    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_ledgers.selectLedgersByAccountNumAndAction, [account, action]);
    // for(var i = 0; i < query_result.length; i++)
    // {
    //     for ( var keyNm in query_result[i])
    //     {
    //         if (query_result[i][keyNm])
    //         {
    //             logger.debug("keyNm : " + keyNm + ", value : " + query_result[i][keyNm]);
    //         }
    //     }
    // }

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.getAccountLedgerAmountList = async (account, action, minBN, maxBN) => {
    logger.debug("func - getAccountLedgerAmountList");

    let query_result = new Array();

    if (minBN >= maxBN)
    {
        logger.debug("minBN > maxBN / minBN : " + minBN + ", maxBN : " + maxBN);

        return query_result;
    }

    const conn = await dbUtil.getConn();

    let selectAccountLedger = dbNN.querys.account.account_ledgers.selectByAccountNumAndActionAndBN;

    // logger.debug("selectAccountLedger : " + selectAccountLedger);

    [query_result] = await dbUtil.exeQueryParam(conn, selectAccountLedger, [account, action, minBN, maxBN]);
    // for(var i = 0; i < query_result.length; i++)
    // {
    //     for ( var keyNm in query_result[i])
    //     {
    //         if (query_result[i][keyNm])
    //         {
    //             logger.debug("keyNm : " + keyNm + ", value : " + query_result[i][keyNm]);
    //         }
    //     }
    // }

    await dbUtil.releaseConn(conn);

    return query_result;
}

//
module.exports.getAccountBalanceAll = async(accountNum) => {
    logger.debug("func - getAccountBalanceAll");

    let myBal = new Array();

    // Update Balance
    query_result = await this.getAccountBalanceByAccountNum(accountNum);
    if (query_result.length)
    {
        await util.asyncForEach(query_result, async (aBal, index) => {
            myBal.push({action : aBal.action, name : aBal.name, symbol : aBal.symbol, blk_num : aBal.blk_num, balance : aBal.balance});
        });

        return myBal;
    }

    return define.ERR_CODE.ERROR;
}

//
module.exports.getAccountBalanceByAccountNumAndAction = async(accountNum, action) => {
    logger.debug("func - getAccountBalanceByAccountNumAndAction");

    // Update Balance
    query_result = await this.getLedgersByAccountNumAndAction(accountNum, action);
    if (query_result.length)
    {
        aBal = query_result[0];

        return {action : aBal.action, blk_num : aBal.blk_num, balance : aBal.balance};
    }
    else
    {
        logger.error("Error - Balance Action");
    }

    return define.ERR_CODE.ERROR;
}

// //
// //
// module.exports.getTotalTokenAccount = async (account, action) => {
//     logger.debug("func - getTotalTokenAccount");

//     [query_result] = await dbUtil.query(conn, dbNN.querys.account.account_balance.selectBalanceByAccountNumAndAction, [account, action]);
//     // for(var i = 0; i < query_result.length; i++)
//     // {
//     //     for ( var keyNm in query_result[i])
//     //     {
//     //         if (query_result[i][keyNm])
//     //         {
//     //             logger.debug("keyNm : " + keyNm + ", value : " + query_result[i][keyNm]);
//     //         }
//     //     }
//     // }

//     await dbUtil.releaseConn(conn);

//     return query_result;
// }

//////////////////////////////////////////
//
module.exports.getAccountScCntByScAction = async (scAction) => {
    logger.debug(scAction);

    try {
        //
        let sql = dbNN.querys.account.account_sc.selectCntByScAction;
        
        let query_result = await dbUtil.queryPre(sql, [scAction]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return 0;
}

//
module.exports.getAccountScInfoByScAction = async (scAction) => {
    logger.debug(scAction);

    try {
        //
        let sql = dbNN.querys.account.account_sc.selectByScAction;
        
        let query_result = await dbUtil.queryPre(sql, [scAction]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

//
module.exports.getAccountScInfoByScActionAndActionTarget = async (scAction) => {
    logger.debug(scAction);

    try {
        //
        let sql = dbNN.querys.account.account_sc.selectByScActionAndActionTarget;
        
        let query_result = await dbUtil.queryPre(sql, [scAction, scAction]);
        
        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}

// JOIN
//
module.exports.getAccountLedgersUsersByActionAndLimit = async (accountAction, limit) => {
    try {
        //
        
        let sql = dbNN.querys.account.account_ledgers.selectLedgersUsersByActionAndLimit;
        
        let query_result = await dbUtil.queryPre(sql, [accountAction, limit]);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - ");
    }

    return false;
}
