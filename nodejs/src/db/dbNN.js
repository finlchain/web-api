//
const define = require('./../../config/define.js');
const dbUtil = require("./../../src/db/dbUtil.js");
const util = require('./../../src/utils/commonUtil.js');
const logger = require('./../../src/utils/winlog.js');

//
module.exports.querys = {
    sc : {
        sc_contents : {
            //
            addJsonVirtualColumnDstAccount : `ALTER TABLE sc.sc_contents ADD IF NOT EXISTS dst_account bigint(20) unsigned AS (CONV(json_value(contract, '$.contents.dst_account'),16,10))`,
            dropJsonVirtualColumnDstAccount : `ALTER TABLE sc.sc_contents DROP IF EXISTS dst_account`,
            // 
            createIndexDstAccount : `CREATE INDEX IF NOT EXISTS dst_account ON sc.sc_contents(dst_account)`,
            dropIndexDstAccount : `ALTER TABLE sc.sc_contents DROP index IF EXISTS dst_account`,
            createIndexCreateTm : `CREATE INDEX IF NOT EXISTS create_tm ON sc.sc_contents(create_tm)`,
            dropIndexCreateTm : `ALTER TABLE sc.sc_contents DROP index IF EXISTS create_tm`,
            createIndexSubnetId : `CREATE INDEX IF NOT EXISTS subnet_id ON sc.sc_contents(subnet_id)`,
            dropIndexSubnetId : `ALTER TABLE sc.sc_contents DROP index IF EXISTS subnet_id`,

            //
            selectCnt : `SELECT COUNT(*) as total_count FROM sc.sc_contents`,
            selectCntByTxnAndSubnetId : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND subnet_id = ?`,
            selectCntByTxn : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX}`,
            // selectCntByTxnAction : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE action = ?`,
            // selectCntByTxnAction : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE action = ? AND json_value(contract,'$.contents.action') = ?`,
            selectCntByTxnAction : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND c_action = ?`,
            // selectCntByTxnActionAndCreateTm : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE action = ? AND ? <= create_tm AND create_tm <= ?`,
            // selectCntByTxnActionAndCreateTm : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE action = ? AND json_value(contract,'$.contents.action') = ? AND ? <= create_tm AND create_tm <= ?`,
            selectCntByTxnActionAndCreateTm : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND c_action = ? AND ? <= create_tm AND create_tm <= ?`,
            selectCntByMinMaxDbKey : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE ? <= db_key AND db_key <=? AND confirmed = ${true}`,
            selectCntByCreateTmAndSubnetId : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE ? <= create_tm AND create_tm <= ? AND subnet_id = ?`, 
            // selectCntByAccountNum : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE from_account = ? OR to_account = ?`, 
            selectCntByAccountNum : `SELECT COUNT(*) as total_count FROM sc.sc_contents WHERE from_account = ? OR to_account = ? OR dst_account = ?`, 
            selectCntByTxnAndActionAndAccountNum : `SELECT COUNT(*) as total_count FROM sc.sc_contents `
                                + `WHERE action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND c_action = ? AND (from_account = ? OR to_account = ? OR dst_account = ?)`,

            // 
            selectMaxDbKeyBySubnetId : `select MAX(db_key) as max_db_key from sc.sc_contents where subnet_id = ?`,

            //
            // selectLatestTxsLimit : `SELECT * FROM sc.sc_contents ORDER BY create_tm DESC LIMIT ?`,
            selectLatestTxsLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            // selectLatestTxsBySubnetIdLimit : `SELECT * FROM sc.sc_contents WHERE subnet_id = ? ORDER BY create_tm DESC LIMIT ?`,
            selectLatestTxsBySubnetIdLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.subnet_id = ? ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsBySubnetIdAndTxnLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.subnet_id = ? AND A.action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByAccountNumLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A ` 
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.from_account = ? OR A.to_account = ? OR A.dst_account = ? `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByFromAccountNumLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A ` 
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.from_account = ? `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByToAccountNumLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A ` 
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.to_account = ? `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByDstAccountNumLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A ` 
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.dst_account = ? `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByTxnLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByFromAccountAndToAccountLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND A.from_account = ? AND (A.to_account = ? OR A.dst_account = ?) `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByTxnAndActionLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND A.c_action = ? `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByTxnAndSecActionAndAccountNumLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND A.c_action = ? AND (A.from_account = ? OR A.to_account = ?) `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
            selectLatestTxsByTxnAndUtilActionAndAccountNumLimit : `SELECT A.*, B.sc_hash, B.blk_num `
                                + `FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE A.action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND A.c_action = ? AND (A.from_account = ? OR A.to_account = ? OR A.dst_account = ?) `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,

            //
            selectTxsByDbKey : `SELECT * FROM sc.sc_contents WHERE db_key = ?`,
            selectTxsByMinMaxDbKey : `SELECT A.*, B.sc_hash, B.blk_num FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE ? <= A.db_key AND A.db_key <= ? AND A.confirmed = ${true} `
                                + `ORDER BY A.create_tm DESC`,
            // selectTxsByMinMaxDbKeyLimit : `SELECT * FROM sc.sc_contents WHERE ? <= db_key AND db_key <=? AND confirmed = ${true} ORDER BY create_tm DESC LIMIT ?`,
            selectTxsByMinMaxDbKeyLimit : `SELECT A.*, B.sc_hash, B.blk_num FROM sc.sc_contents AS A `
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE ? <= A.db_key AND A.db_key <= ? AND A.confirmed = ${true} `
                                + `ORDER BY A.create_tm DESC LIMIT ?`,
        },
        sc_delayed_txs : {
            //
        },
    },
    block : {
        blk_txs : {
            //
            selectByDbKey : `SELECT * FROM block.blk_txs WHERE db_key = ?`,

            //
            selectCntByblkNum : `SELECT COUNT(*) as total_count FROM block.blk_txs WHERE blk_num = ?`,
            selectDbKeyByblkNum : `SELECT db_key FROM block.blk_txs WHERE blk_num = ?`,
            selectDbKeyByScHash : `SELECT db_key FROM block.blk_txs WHERE sc_hash = ?`,

            //
            selectDbKeyMinMaxByblkNum : `SELECT MIN(db_key) as min_db_key, MAX(db_key) as max_db_key FROM block.blk_txs WHERE blk_num = ?`,
        },
        blk_contents : {
            // 
            createIndexBgt : `CREATE INDEX IF NOT EXISTS bgt ON block.blk_contents(bgt)`,
            dropIndexBgt : `ALTER TABLE account.account_ledgers DROP index IF EXISTS bgt`,
            //
            // selectCnt : `SELECT COUNT(*) AS total_count FROM block.blk_contents`,
            selectCnt : `SELECT MAX(blk_num) AS total_count FROM block.blk_contents`,
            // selectCntByCreateTm : `SELECT COUNT(*) as total_count FROM block.blk_contents WHERE ? <= bgt AND bgt <= ?`, 
            selectCntByCreateTm : `SELECT MAX(blk_num) AS max_count, MIN(blk_num) AS min_count FROM block.blk_contents WHERE ? <= bgt AND bgt <= ?`, 
            // selectCntByCreateTm : `SELECT MAX(blk_num) AS max_count FROM block.blk_contents WHERE bgt <= ?`, 

            //
            selectByBlkNum : `SELECT * FROM block.blk_contents WHERE blk_num = ?`,
            selectTxCntByBlkNum : `SELECT blk_num, tx_cnt FROM block.blk_contents WHERE ? <= blk_num AND blk_num <= ?`,

            //
            selectByBlkHash : `SELECT * FROM block.blk_contents WHERE blk_hash = ?`,

            //
            selectLatestBlks : `SELECT * FROM block.blk_contents ORDER BY blk_num DESC LIMIT ?`,
            selectLastBlkNum : `SELECT MAX(blk_num) AS max_blk_num FROM block.blk_contents`,

            //
            selectRangeBlksByBlkNum : `SELECT * FROM block.blk_contents WHERE ? <= blk_num AND blk_num <= ? ORDER BY blk_num DESC `,

            //
        },
    },
    account : {
        account_tokens : {
            //
            // selectCnt : `SELECT COUNT(*) AS total_count FROM account.account_tokens`,
            // selectCnt : `SELECT MAX(idx) AS total_count FROM account.account_tokens`,
            selectCnt : `SELECT COUNT(*) AS total_count FROM account.account_tokens WHERE idx IN (SELECT MAX(idx) FROM account.account_tokens GROUP BY name)`, 
            selectCntByAction : `SELECT COUNT(*) AS total_count FROM account.account_tokens WHERE action = ?`,  
            // selectCntByCreateTm : `SELECT MIN(idx) AS min_idx, MAX(idx) AS max_idx FROM account.account_tokens WHERE ? <= create_tm AND create_tm <= ?`, 
            selectCntByCreateTm : `SELECT COUNT(*) AS total_count FROM account.account_tokens WHERE idx IN (SELECT MAX(idx) FROM account.account_tokens GROUP BY name) AND revision = 0 AND ? <= create_tm AND create_tm <= ?`, 

            //
            // selectTokensByPubkey : `SELECT * FROM account.account_tokens WHERE owner_pk = ? OR super_pk = ? ORDER BY idx DESC LIMIT 1`, 
            selectTokensByPubkey : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.action, A.name, A.symbol, ` 
                                + `A.total_supply, A.market_supply, A.decimal_point, A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.owner_pk = ? OR A.super_pk = ? `
                                + `ORDER BY A.idx DESC LIMIT 1`, 
            // selectTokensByAccountNum : `SELECT * FROM account.account_tokens WHERE account_num = ? ORDER BY idx DESC LIMIT 1`,
            selectTokensByAccountNum : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.action, A.name, A.symbol, ` 
                                + `A.total_supply, A.market_supply, A.decimal_point, A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.account_num = ? `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            // selectTokensByAccountAction : `SELECT * FROM account.account_tokens WHERE action = ? ORDER BY idx DESC LIMIT 1`,
            selectTokensByAccountAction : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.action, A.name, A.symbol, ` 
                                + `A.total_supply, A.market_supply, A.decimal_point, A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.action = ? `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            // selectTokensByAccountName : `SELECT * FROM account.account_tokens WHERE name = ? ORDER BY idx DESC LIMIT 1`,
            selectTokensByAccountName : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.action, A.name, A.symbol, ` 
                                + `A.total_supply, A.market_supply, A.decimal_point, A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.name = ? `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            // selectTokensByAccountSymbol : `SELECT * FROM account.account_tokens WHERE symbol = ? ORDER BY idx DESC LIMIT 1`,
            selectTokensByAccountSymbol : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.action, A.name, A.symbol, ` 
                                + `A.total_supply, A.market_supply, A.decimal_point, A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.symbol = ? `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            //
            // selectTokensByAlphabeticName : `SELECT * FROM account.account_tokens ORDER BY name DESC`,
            selectTokensByAlphabeticName : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.action, A.name, A.symbol, ` 
                                + `A.total_supply, A.market_supply, A.decimal_point, A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_tokens GROUP BY name ) `
                                + `ORDER BY A.name DESC`,

            selectTokensByIdx : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.action, A.name, A.symbol, ` 
                                + `A.total_supply, A.market_supply, A.decimal_point, A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_tokens GROUP BY name ) `
                                + `ORDER BY A.idx DESC`,
            
            ///////////////////////////////////////////////////////////////////
            //
            selectTokenInfoWithTxsCnt : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.action, A.name, A.symbol, ` 
                                + `A.total_supply, A.market_supply, A.decimal_point, A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions, `
                                + `COUNT(*) AS total_txs_count `
                                + `FROM account.account_tokens AS A ` 
                                + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `INNER JOIN sc.sc_contents AS C ON C.action = ${define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX} AND C.c_action = A.action `
                                + `ORDER BY A.idx DESC`,
            //
            selectAccountTokenT : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, `
                                + `A.account_num, A.action, A.name, A.symbol, A.total_supply, A.market_supply, A.decimal_point, `
                                + `A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE B.blk_num > 0 AND A.action = ? `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            //
            selectAccountTokenTNS : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, `
                                + `A.account_num, A.action, A.name, A.symbol, A.total_supply, A.market_supply, A.decimal_point, `
                                + `A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE B.blk_num > 0 AND ( A.action = ? OR A.name = ? OR A.symbol = ? ) `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            //
            selectAccountTokenKey : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, `
                                + `A.account_num, A.action, A.name, A.symbol, A.total_supply, A.market_supply, A.decimal_point, `
                                + `A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE B.blk_num > 0 AND ( A.owner_pk = ? OR A.super_pk = ? OR A.owner_pk = ? OR A.super_pk = ? ) `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            // 
            selectAccountTokenAccount : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, `
                                + `A.account_num, A.action, A.name, A.symbol, A.total_supply, A.market_supply, A.decimal_point, `
                                + `A.lock_time_from, A.lock_time_to, A.lock_transfer, A.black_list, A.functions `
                                + `FROM account.account_tokens AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                + `WHERE B.blk_num > 0 AND ( A.account_num = ? ) `
                                + `ORDER BY A.idx DESC LIMIT 1`,
        },
        account_users : {
            //
            // selectCnt : `SELECT COUNT(*) AS total_count FROM account.account_users`, 
            selectCnt : `SELECT MAX(idx) AS total_count FROM account.account_users`, 
            selectCntByCreateTm : `SELECT MIN(idx) AS min_idx, MAX(idx) AS max_idx FROM account.account_users WHERE ? <= create_tm AND create_tm <= ?`, 

            //
            // selectUsersByPubkey : `SELECT * FROM account.account_users WHERE owner_pk = ? OR super_pk = ? ORDER BY idx DESC LIMIT 1`,
            selectUsersByPubkey : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.account_id ` 
                                + `FROM account.account_users AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.owner_pk = ? OR A.super_pk = ? `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            // selectUsersByAccountNum : `SELECT * FROM account.account_users WHERE account_num = ? ORDER BY idx DESC LIMIT 1`,
            selectUsersByAccountNum : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.account_id ` 
                                + `FROM account.account_users AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.account_num = ? `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            // selectUsersByAccountId : `SELECT * FROM account.account_users WHERE account_id = BINARY(?) ORDER BY idx DESC LIMIT 1`,
            selectUsersByAccountId : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.account_id ` 
                                + `FROM account.account_users AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE A.account_id = BINARY(?) `
                                + `ORDER BY A.idx DESC LIMIT 1`,
            selectUsersByIdx : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.account_id ` 
                                + `FROM account.account_users AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `ORDER BY A.idx DESC`,
            ///////////////////////////////////////////////////////////////////
            //
            selectAccountUsersByAccountId : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.account_id ` 
                                        + `FROM account.account_users AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                        + `WHERE B.blk_num > 0 AND A.account_id = ? `
                                        + `ORDER BY A.idx DESC LIMIT 1`, 
            // 
            selectAccountUsersByAccountNum : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.account_id ` 
                                        + `FROM account.account_users AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                        + `WHERE B.blk_num > 0 AND A.account_num = ? `
                                        + `ORDER BY A.idx DESC LIMIT 1`, 
            //
            selectAccountUsersByKeysAndAccountId : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.account_id ` 
                                + `FROM account.account_users AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE B.blk_num > 0 AND ( A.owner_pk = ? OR A.super_pk = ? OR A.owner_pk = ? OR A.super_pk = ? OR A.account_id = ? ) `
                                + `ORDER BY A.idx DESC LIMIT 1`, 
            //
            selectAccountUsersByKey : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.owner_pk, A.super_pk, A.account_num, A.account_id ` 
                                + `FROM account.account_users AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                + `WHERE B.blk_num > 0 AND ( A.owner_pk = ? OR A.super_pk = ? OR A.owner_pk = ? OR A.super_pk = ? ) `
                                + `ORDER BY A.idx DESC LIMIT 1`,

        },
        account_ledgers : {
            // 
            createIndexActionAccount : `CREATE INDEX IF NOT EXISTS action_account ON account.account_ledgers(action, my_account_num)`,
            dropIndexActionAccount : `ALTER TABLE account.account_ledgers DROP index IF EXISTS action_account`,

            //
            // selectLedgersAmountByActionAndCreateTm : `SELECT my_account_num, amount FROM account.account_ledgers WHERE action = ? AND ? <= create_tm AND create_tm <= ? AND ? != my_account_num`,
            selectLedgersAmountByActionAndCreateTm : `SELECT my_account_num, amount FROM account.account_ledgers WHERE action = ? AND ? <= create_tm AND create_tm <= ?`,

            //
            // selectLedgersByActionAndAccountNum : `SELECT * FROM account.account_ledgers WHERE action = ? AND my_account_num = ? ORDER BY idx DESC`,
            selectLedgersByActionAndAccountNum : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, A.amount, A.balance ` 
                                            + `FROM account.account_ledgers AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                            + `WHERE A.action = ? AND A.my_account_num = ? `
                                            + `ORDER BY A.idx DESC`,

            //
            selectByAccountNumAndActionAndBN : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, A.amount, A.balance `
                                            + `FROM account.account_ledgers AS A INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                            + `WHERE A.my_account_num = ? and A.action = ? and B.blk_num > ? and B.blk_num <= ? `
                                            + `ORDER BY A.idx ASC, A.create_tm ASC`, 

            //
            // selectCntByAction : `SELECT COUNT(DISTINCT my_account_num) AS total_count FROM account.account_ledgers WHERE action = ?`,
            // selectCntByAction : `SELECT COUNT(DISTINCT A.my_account_num) AS total_count ` 
            //                     + `FROM account.account_ledgers AS A `
            //                     + `INNER JOIN account.account_users AS B ON A.my_account_num = B.account_num `
            //                     + `WHERE A.action = ?`,
            selectCntByAction : `SELECT COUNT(*) AS total_count `
                                + `FROM account.account_ledgers AS A `
                                + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE action = ? GROUP BY my_account_num)`, 
            //
            selectLedgersByActionAndLimit : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, A.amount, A.balance ` 
                                        + `FROM account.account_ledgers AS A ` 
                                        + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                        + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE action = ? GROUP BY my_account_num ) `
                                        + `ORDER BY balance*1 DESC LIMIT ?`, 

            //
            // selectLedgersByAccountNum : `SELECT * ` 
            //                             + `FROM account.account_ledgers ` 
            //                             + `WHERE idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE my_account_num = ? GROUP BY action )`, 
            // selectLedgersByAccountNum : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, D.name, D.symbol, A.amount, A.balance, C.account_id ` 
            //                             + `FROM account.account_ledgers AS A ` 
            //                             + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
            //                             + `INNER JOIN account.account_users AS C ON A.my_account_num = C.account_num `
            //                             + `INNER JOIN account.account_tokens AS D ON A.action = D.action `
            //                             + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE my_account_num = ? GROUP BY action )`, 
            selectLedgersByAccountNum : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, D.name, D.symbol, A.amount, A.balance ` 
                                        + `FROM account.account_ledgers AS A ` 
                                        + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                        + `INNER JOIN account.account_tokens AS D ON A.action = D.action `
                                        + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE my_account_num = ? GROUP BY action )`,
            // selectLedgersByAccountNumAndCreateTm : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, D.name, D.symbol, A.amount, A.balance, C.account_id ` 
            //                             + `FROM account.account_ledgers AS A ` 
            //                             + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
            //                             + `INNER JOIN account.account_users AS C ON A.my_account_num = C.account_num `
            //                             + `INNER JOIN account.account_tokens AS D ON A.action = D.action `
            //                             + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE my_account_num = ? AND create_tm <= ? GROUP BY action )`, 
            selectLedgersByAccountNumAndCreateTm : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, D.name, D.symbol, A.amount, A.balance ` 
                                        + `FROM account.account_ledgers AS A ` 
                                        + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                        + `INNER JOIN account.account_tokens AS D ON A.action = D.action `
                                        + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE my_account_num = ? AND create_tm <= ? GROUP BY action )`, 
            // selectLedgersByAccountNumAndAction : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, D.name, D.symbol, A.amount, A.balance, C.account_id ` 
            //                             + `FROM account.account_ledgers AS A ` 
            //                             + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
            //                             + `INNER JOIN account.account_users AS C ON A.my_account_num = C.account_num `
            //                             + `INNER JOIN account.account_tokens AS D ON A.action = D.action `
            //                             + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE my_account_num = ? AND action = ?)`, 
            selectLedgersByAccountNumAndAction : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, D.name, D.symbol, A.amount, A.balance ` 
                                        + `FROM account.account_ledgers AS A ` 
                                        + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key ` 
                                        + `INNER JOIN account.account_tokens AS D ON A.action = D.action `
                                        + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE my_account_num = ? AND action = ?)`, 
            // selectLedgersUsersByActionAndLimit : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, D.name, D.symbol, A.amount, A.balance, C.account_id ` 
            //                             + `FROM account.account_ledgers AS A `
            //                             + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
            //                             + `INNER JOIN account.account_users AS C ON A.my_account_num = C.account_num `
            //                             + `INNER JOIN account.account_tokens AS D ON A.action = D.action `
            //                             + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE action = ? GROUP BY my_account_num) ORDER BY balance*1 DESC LIMIT ?`,
            selectLedgersUsersByActionAndLimit : `SELECT A.subnet_id, A.idx, A.create_tm, B.blk_num, A.db_key, A.my_account_num, A.account_num, A.action, D.name, D.symbol, A.amount, A.balance ` 
                                        + `FROM account.account_ledgers AS A `
                                        + `INNER JOIN block.blk_txs AS B ON A.db_key = B.db_key `
                                        + `INNER JOIN account.account_tokens AS D ON A.action = D.action `
                                        + `WHERE A.idx IN (SELECT MAX(idx) FROM account.account_ledgers WHERE action = ? GROUP BY my_account_num) ORDER BY balance*1 DESC LIMIT ?`,
        },
        account_balance : {
            // //
            // selectCntByAction : `SELECT COUNT(*) as total_count FROM account.account_balance WHERE action = ?`,
            // //
            // selectBalanceByActionAndLimit : `SELECT * FROM account.account_balance WHERE action = ? ORDER BY balanceN DESC LIMIT ?`,

            // //
            // selectBalanceByAccountNum : `SELECT * FROM account.account_balance WHERE my_account_num = ?`,
            // selectBalanceByAccountNumAndAction : `SELECT * FROM account.account_balance WHERE my_account_num = ? AND action = ?`, 
        },
        account_sc : {
            //
            selectCntByScAction : "SELECT COUNT(*) as total_count FROM account.account_sc WHERE sc_action = ?", 
            //
            selectByScAction : `SELECT * FROM account.account_sc WHERE sc_action = ? ORDER BY sc_action DESC LIMIT 1`, 
            //
            selectByScActionLimit : `SELECT * FROM account.account_sc WHERE sc_action = ? ORDER BY idx DESC LIMIT 1`, 
            //
            selectByScActionAndActionTarget : `SELECT * FROM account.account_sc WHERE sc_action = ? and action_target != ?`, 
            //
            selectByScActionAndActionTargetLimit : `SELECT * FROM account.account_sc WHERE sc_action = ? and action_target != ? ORDER BY idx DESC LIMIT 1`,
        },
        account_join : {
            //
            selectBalanceUsersByActionAndLimit : `SELECT A.*, B.account_id `
                                        + `FROM account.account_balance AS A `
                                        + `LEFT JOIN account.account_users as B ON A.my_account_num = B.account_num `
                                        + `WHERE A.action = ? `
                                        + `ORDER BY balanceN DESC LIMIT ?`,
        },
    },
}

//
const initScVirtualColumns = async (conn) => {
    try {
        let sql;

        // init vitual columns
        sql = this.querys.sc.sc_contents.addJsonVirtualColumnDstAccount;
        await conn.query(sql);
    } catch (err) {
        debug.error(err);
    }
}

//
const initBlockIndex = async (conn) => {
    try {
        let sql;

        sql = this.querys.block.blk_contents.createIndexBgt;
        await conn.query(sql);
    } catch (err) {
        debug.error(err);
    }
}

//
const initScIndex = async (conn) => {
    try {
        let sql;

        sql = this.querys.sc.sc_contents.createIndexDstAccount;
        await conn.query(sql);

        sql = this.querys.sc.sc_contents.createIndexCreateTm;
        await conn.query(sql);

        sql = this.querys.sc.sc_contents.createIndexSubnetId;
        await conn.query(sql);
    } catch (err) {
        debug.error(err);
    }
}

//
const initAccountIndex = async (conn) => {
    try {
        let sql;

        sql = this.querys.account.account_ledgers.createIndexActionAccount;
        await conn.query(sql);
    } catch (err) {
        debug.error(err);
    }
}

//
const initDatabaseSC = async () => {
    let ret;
    const conn = await dbUtil.getConn();

    try {
        let sql;

        await initBlockIndex(conn);
        await initScVirtualColumns(conn);
        await initScIndex(conn);
        await initAccountIndex(conn);
        
        ret = { res : true };
        logger.info("Database Init - sc");
    } catch (err) {
        ret = { res : false };
    }

    await dbUtil.releaseConn(conn);

    return ret;
}

//
module.exports.initDatabaseNN = async () => {
    await initDatabaseSC();
}
