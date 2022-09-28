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

module.exports.accountScActionAndSubId = async (scAction, subId) => {
    const conn = await dbUtil.getConn();

    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_sc.selectByScActionAndSubId, [scAction, subId]);

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
        logger.error("Error - 59");
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
        logger.error("Error - 60");
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
        logger.error("Error - 61");
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
        logger.error("Error - 62");
    }

    return 0;
}

//
module.exports.getScTxsCntPerDayByTokenAccountAction = async (accountAction, minMs, maxMs) => {
    logger.debug(accountAction);

    try {
        //
        let sql = dbNN.querys.sc.sc_contents.selectCntByTxnActionAndCreateTm;
        
        // let query_result = await dbUtil.queryPre(sql, [accountAction, minMs, maxMs]);
        let query_result = await dbUtil.queryPre(sql, [minMs, maxMs]);
        
        if(query_result.length) 
        {
            return query_result[0].total_count;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - 63");
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
        logger.error("Error - 64");
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
        logger.error("Error - 65");
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
        logger.error("Error - 66");
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
        logger.error("Error - 67");
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
        logger.error("Error - 68");
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
        logger.error("Error - 69");
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
        logger.error("Error - 70");
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
        logger.error("Error - 71");
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
        logger.error("Error - 72");
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
        logger.error("Error - 73");
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
        logger.error("Error - 74");
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
        logger.error("Error - 75");
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
        logger.error("Error - 76");
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
        logger.error("Error - 77");
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
        logger.error("Error - 78");
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
        logger.error("Error - 79");
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
        logger.error("Error - 80");
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
        logger.error("Error - 81");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
//
module.exports.getDbKeyByCreateTm = async (create_tm) => {
    try {
        let sql = dbNN.querys.sc.sc_contents.selectDbKeyByCreateTime;

        let query_result = await dbUtil.queryPre(sql, [create_tm]);
        
        if(query_result.length) 
        {
            return query_result[0].db_key;
        }
        else
        {
            return 0;
        }
    } catch (err) {
        logger.error("Error - 82");
    }

    return false;
}

//////////////////////////////////////////////////////////////////////
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
        logger.error("Error - 83");
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
        logger.error("Error - 84");
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
        logger.error("Error - 85");
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
        logger.error("Error - 86");
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
        logger.error("Error - 87");
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
        logger.error("Error - 88");
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
        logger.error("Error - 89");
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
        logger.error("Error - 90");
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
        logger.error("Error - 91");
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
        logger.error("Error - 92");
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
        logger.error("Error - 93");
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
        logger.error("Error - 94");
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
        logger.error("Error - 95");
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
        logger.error("Error - 96");
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
        logger.error("Error - 97");
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
        logger.error("Error - 98");
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
        logger.error("Error - 99");
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
        logger.error("Error - 100");
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
        logger.error("Error - 101");
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
        logger.error("Error - 102");
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
        logger.error("Error - 103");
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
        logger.error("Error - 104");
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
        logger.error("Error - 105");
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
        logger.error("Error - 106");
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
        logger.error("Error - 107");
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
        logger.error("Error - 108");
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
        logger.error("Error - 109");
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
        logger.error("Error - 110");
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
        logger.error("Error - 111");
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
        logger.error("Error - 112");
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
        logger.error("Error - 113");
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
        logger.error("Error - 114");
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
        logger.error("Error - 115");
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
        logger.error("Error - 116");
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
        logger.error("Error - 117");
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
        logger.error("Error - 118");
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
        logger.error("Error - 119");
    }

    return false;
}

// Contract Checker
module.exports.accountLegerCheck = async (account_num, action) => {
    const conn = await dbUtil.getConn();

    // logger.debug("accountLegerCheck - account_num : " + account_num + ", action : " + action);
    [query_result] = await dbUtil.exeQueryParam(conn, dbNN.querys.account.account_ledgers.selectAccountLegers, [action, account_num]);

    await dbUtil.releaseConn(conn);

    return query_result;
}

// NFT
module.exports.getNftList = async () => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectNFTList1;
        let sql2 = dbNN.querys.account.account_sc.selectNFTList2;
        
        let query_result = await dbUtil.query(sql);
        let query_result2 = await dbUtil.query(sql2);
        
        if (query_result2.length) {
            query_result = query_result.concat(query_result2);
        }
        
        if(query_result.length) 
        {
            let sql = dbNN.querys.account.account_sc.selectCntByScAction;
            for (let i = 0; i < query_result.length; i++) {

                let cnt_result = await dbUtil.queryPre(sql, [query_result[i].sc_action]);
                
                if(cnt_result.length) 
                {
                    query_result[i].total_cnt = cnt_result[0].total_count;
                    query_result[i].total_ratio = cnt_result[0].sum_ratio;
                    query_result[i].total_amount = cnt_result[0].sum_amount;
                }
                else
                {
                    query_result[i].total_cnt = 0;
                    query_result[i].total_ratio = 0;
                    query_result[i].total_amount = 0;
                }
            }
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 120");
    }

    return false;
}
//TODO: order by recent tx time
module.exports.orderNftList = async () => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.orderByRecentTxTime;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 121");
    }

    return false;
}

module.exports.getActionTargetList = async (action_target) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectUtilList;
        
        let query_result = await dbUtil.queryPre(sql, [action_target]);
        
        if(query_result.length) 
        {
            let sql = dbNN.querys.account.account_sc.selectCntByScAction;
            for (let i = 0; i < query_result.length; i++) {

                let cnt_result = await dbUtil.queryPre(sql, [query_result[i].sc_action]);
                
                if(cnt_result.length) 
                {
                    query_result[i].total_cnt = cnt_result[0].total_count;
                }
                else
                {
                    query_result[i].total_cnt = 0;
                }
                
            }
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 122");
    }

    return false;
}

module.exports.getActionTargetInfo = async (action_target) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectUtilList;
        
        let query_result = await dbUtil.queryPre(sql, [action_target]);
        
        if(query_result.length) 
        {
            let sql = dbNN.querys.account.account_sc.selectCntByScAction;
            for (let i = 0; i < query_result.length; i++) {

                let cnt_result = await dbUtil.queryPre(sql, [query_result[i].sc_action]);
                
                if(cnt_result.length) 
                {
                    query_result[i].total_cnt = cnt_result[0].total_count;
                }
                else
                {
                    query_result[i].total_cnt = 0;
                }
                
            }
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 123");
    }

    return false;
}

module.exports.getSCActionTXList = async (scAction) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectScList;
        
        let query_result = await dbUtil.queryPre(sql, [scAction]);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 124");
    }

    return false;
}

module.exports.getScDetailnfo = async (scAction) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectScInfo;
        
        let query_result = await dbUtil.queryPre(sql, [scAction]);
        
        if(query_result.length) 
        {
            let sql = dbNN.querys.account.account_sc.cntHolders;
            let holders_result = await dbUtil.queryPre(sql, [scAction]);

            if (holders_result.length) {
                query_result[0].holders = holders_result[0].holders;
            } else {
                query_result[0].holders = 0;
            }

            sql = dbNN.querys.account.account_sc.selectCntByScAction;
            let cnt_result = await dbUtil.queryPre(sql, [scAction]);

            if (cnt_result.length) {
                query_result[0].total_cnt = cnt_result[0].total_count;
            } else {
                query_result[0].total_cnt = 0;
            }

            return query_result;
        }
    } catch (err) {
        logger.error("Error - 125");
    }

    return false;
}

module.exports.getScHoldersInfo = async (scAction) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectScHolders;
        
        let query_result = await dbUtil.queryPre(sql, [scAction]);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 126");
    }

    return false;
}

module.exports.getUserNftTxInfo = async (accountNum) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectUserNftTx;
        
        let query_result = await dbUtil.queryPre(sql, [accountNum, accountNum]);
        
        if(query_result.length) 
        {
            sql = dbNN.querys.account.account_sc.selectNftName;
            for (let i = 0; i < query_result.length; i++){

                let sc_result = await dbUtil.queryPre(sql, [query_result[i].sc_action]);
                query_result[i].nft_name = sc_result[0].nft_name;
            }
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 127");
    }

    return false;
}

module.exports.getSubIdTx = async (scAction, subId) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectSubIdTx;
        
        let query_result = await dbUtil.queryPre(sql, [scAction, subId]);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 128");
    }

    return false;
}

module.exports.getSubIdDetail = async (scAction, subId) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectSubIdDetail;
        
        let query_result = await dbUtil.queryPre(sql, [scAction, subId]);

        if(query_result.length) 
        {
            let sql = dbNN.querys.account.account_sc.selectSubIdMinting;
            let minting_result = await dbUtil.queryPre(sql, [scAction, subId]);
            if (minting_result.length) {
                query_result[0].blk_num = minting_result[0].blk_num;
                query_result[0].create_tm = minting_result[0].create_tm;
                query_result[0].sc_hash = minting_result[0].sc_hash;
            }

            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - 129");
    }

    return false;
}

module.exports.getSubIdSc= async (scAction) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectScUserNftInfo;
        
        let query_result = await dbUtil.queryPre(sql, [scAction]);

        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - 130");
    }

    return false;
}
module.exports.getSubIdTxCnt = async (scAction, subId) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.cntSubIdTx;
        
        let query_result = await dbUtil.queryPre(sql, [scAction, subId]);

        if(query_result.length) 
        {
            return query_result[0].total_tx;
        }
    } catch (err) {
        logger.error("Error - 131");
    }

    return false;
}

module.exports.getSumofAmount = async () => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.sumAmount;
        
        let query_result = await dbUtil.query(sql);

        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 132");
    }

    return false;
}
module.exports.getSumofAmountScAction = async (scAction) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.sumAmountwithScAction;
        
        let query_result = await dbUtil.queryPre(sql, [scAction]);

        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - 133");
    }

    return false;
}

module.exports.getMintSubId = async (scAction) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectRecentSubId;
        
        let query_result = await dbUtil.queryPre(sql, [scAction]);

        if(query_result.length) 
        {
            return query_result[0].sub_id;
        }
    } catch (err) {
        logger.error("Error - dbnn");
    }

    return false;
}

// For TGC
module.exports.getWalletInfo = async (wName) => {
    try {
        //
        let sql = dbNN.querys.account.account_users.selectWalletInfo;
        
        let query_result = await dbUtil.queryPre(sql, [wName]);

        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - 134");
    }

    return false;
}

module.exports.getPNumInfo = async (pNum) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectPNumByAccount;
        const SC_MAX = define.NODE_LIST.ZEUS.sc_action;
        const SC_MIN = define.NODE_LIST.CHARITES.sc_action;
        logger.error('SC_MIN : ' + SC_MIN);
        logger.error('SC_MAX : ' + SC_MAX);
        logger.error('pNum : ' + pNum);
        let query_result = await dbUtil.queryPre(sql, [SC_MIN, SC_MAX, pNum]);

        if(query_result.length && query_result[0].pNum) 
        {
            return true;
        }
    } catch (err) {
        logger.error("Error - 135");
    }

    return false;
}

module.exports.getUserNftInfo = async (accountNum) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectUserNftInfo;
        
        let query_result = await dbUtil.queryPre(sql, [accountNum]);
        
        if(query_result.length) 
        {
            for (let i = 0; i < query_result.length; i++) {
                let sql = dbNN.querys.account.account_sc.selectScUserNftInfo;
                let node_result = await dbUtil.queryPre(sql, [query_result[i].sc_action]);

                for (let j = 0; j < node_result.length; j++){
                    if (node_result.length) {
                        query_result[i].token_name = node_result[j].name;
                        query_result[i].token_symbol = node_result[j].symbol;
                        query_result[i].nft_name = node_result[j].nft_name;
                    } else {
                        query_result[i].token_name = '';
                        query_result[i].token_symbol = '';
                        query_result[i].nft_name = '';
                    }
                }
            }

            return query_result;
        }
    } catch (err) {
        logger.error("Error - 136");
    }

    return false;
}

module.exports.getNftListbyPnum = async (wName, pNum) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectUserNftbyPNum;
        
        let query_result = await dbUtil.queryPre(sql, [wName, pNum]);

        if(query_result.length) 
        {
            let sql = dbNN.querys.account.account_sc.selectScUserNftInfo;
            let node_result = await dbUtil.queryPre(sql, [query_result[0].sc_action]);

            if (node_result.length) {
                query_result[0].token_name = node_result[0].name;
                query_result[0].token_symbol = node_result[0].symbol;
                query_result[0].nft_name = node_result[0].nft_name;
            } else {
                query_result[0].token_name = '';
                query_result[0].token_symbol = '';
                query_result[0].nft_name = '';
            }
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 137");
    }

    return false;
}

module.exports.getNftListbyCreateTm = async (wName, createTm) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectUserNftbyCreateTm;
        
        let query_result = await dbUtil.queryPre(sql, [wName, createTm]);

        if(query_result.length) 
        {
            let sql = dbNN.querys.account.account_sc.selectScUserNftInfo;
            let node_result = await dbUtil.queryPre(sql, [query_result[0].sc_action]);

            if (node_result.length) {
                query_result[0].token_name = node_result[0].name;
                query_result[0].token_symbol = node_result[0].symbol;
                query_result[0].nft_name = node_result[0].nft_name;
            } else {
                query_result[0].token_name = '';
                query_result[0].token_symbol = '';
                query_result[0].nft_name = '';
            }
            return query_result;
        }
    } catch (err) {
        logger.error("Error - 138");
    }

    return false;
}

module.exports.getNftMetaData = async (scAction, subId, toAccNum) => {
    try {
        //
        let sql = dbNN.querys.account.account_sc.selectMetaData;
        
        let query_result = await dbUtil.queryPre(sql, [scAction, subId, toAccNum]);

        if(query_result.length) 
        {
            return query_result[0];
        }
    } catch (err) {
        logger.error("Error - 139");
    }

    return false;
}