//
const dbUtil = require("./../../src/db/dbUtil.js");
const logger = require('./../../src/utils/winlog.js');

//
module.exports.querys = {
    is : {
        hub_info : {
            selectHubInfo: "SELECT * FROM is.hub_info",
        }, 
        cluster_info : {
            getAll : `SELECT * FROM is.cluster_info`, 
            getClusterAddrByRole : `select cluster_p2p_addr from is.cluster_info where role = ?`, 
        }, 
        kafka_info : {
            // getAll : `SELECT * FROM is.kafka_info_shard`, 
            getAll : `SELECT * FROM is.kafka_info`, 
            // getByLikeTopic : `SELECT * FROM is.kafka_info_shard WHERE topic_list LIKE `,
            getByLikeTopic : `SELECT * FROM is.kafka_info WHERE topic_list LIKE `,

            // txList : "SELECT db_key FROM info ORDER BY blk_num DESC LIMIT ?, ?",
            // txListWithHash : "SELECT i.subnet_id, i.blk_num AS blk_num, i.sc_hash, c.contract, i.db_key FROM info AS i, contents AS c WHERE i.db_key = c.db_key AND i.sc_hash LIKE ",
            // txListWithBN : "SELECT i.subnet_id, i.blk_num AS blk_num, i.sc_hash, c.contract FROM info AS i, contents AS c WHERE (i.db_key = c.db_key) AND blk_num = ?",
            // getDBKeyWithFromAndAction : "SELECT db_key FROM contract WHERE from_pk = ? AND action = ? ORDER BY revision DESC LIMIT 1",
            // txInfo : "SELECT subnet_id, blk_num, sc_hash, db_key FROM info WHERE sc_hash = ?",
            // txInfoContract : "SELECT contract FROM contents WHERE db_key = ?",
            // TxInfoUsingDBKey : "SELECT i.subnet_id, i.blk_num AS blk_num, i.sc_hash, c.contract FROM info AS i, contents AS c WHERE (i.db_key = c.db_key) AND i.db_key IN (",
            // recentTx : "SELECT c.contract, s.blk_num AS blk_num FROM contents AS c INNER JOIN (SELECT DISTINCT db_key, blk_num FROM ((SELECT DISTINCT db_key, blk_num FROM ledgers WHERE from_pk = ? AND blk_num >= ?) UNION (SELECT DISTINCT db_key, blk_num FROM ledgers WHERE to_pk = ? AND blk_num >= ?)) AS t ORDER BY blk_num DESC) AS s ON c.db_key = s.db_key",
            // // tXContractUsingDbKey : "SELECT contract FROM contents WHERE db_key IN (",
            // txInfoSingleDbKey : "SELECT i.subnet_id, i.blk_num AS blk_num, c.contract, i.sc_hash FROM info AS i, contents AS c WHERE i.db_key = c.db_key AND c.db_key =  ?",
            // totalScCnt : "SELECT count(*) AS cnt from info",
            // lastTxWithAction : "SELECT contract FROM contents WHERE db_key = (SELECT db_key FROM ledgers WHERE action = ? ORDER BY revision DESC LIMIT 1)",
            // subnetRewardTotal : "SELECT SUM(r1.total_reward) AS total_reward FROM reward as r1, (SELECT MAX(idx) as idx, MAX(time) as time FROM reward GROUP BY subnet_id) as r2 WHERE r1.idx = r2.idx and r1.time = r2.time"
            // // tps : "SELECT count(*) as cnt from info where bgt >= ? AND bgt < ?"
        },
        repl_info : {
            //
            selectReplInfo: "SELECT * FROM is.repl_info ORDER BY blk_num DESC",
            selectReplInfoByBN: "SELECT * FROM is.repl_info WHERE blk_num = ? ORDER BY blk_num DESC",
            selectReplInfoByBNAndRole: "SELECT * FROM is.repl_info WHERE blk_num = ? and role = ? ORDER BY blk_num DESC",
            selectReplInfoByBNAndRoleAndClusterP2pAddr: "SELECT * FROM is.repl_info WHERE blk_num = ? and role = ? and cluster_p2p_addr = ? ORDER BY blk_num DESC",
            //
            selectMaxReplInfoByBN: "SELECT MAX(blk_num) as max_blk_num FROM is.repl_info WHERE blk_num <= ? ORDER BY blk_num DESC",
            selectMaxReplInfoByBNAndRole: "SELECT MAX(blk_num) as max_blk_num FROM is.repl_info WHERE blk_num <= ? and role = ? ORDER BY blk_num DESC",
        }, 
        reg_token : {
            //
            // selectRegTokenByAction : "SELECT * FROM is.reg_token_shard WHERE action = ?",
            selectRegTokenByAction : "SELECT * FROM is.reg_token WHERE action = ?",
            // selectRegTokenByName : "SELECT * FROM is.reg_token_shard WHERE name = ?",
            selectRegTokenByName : "SELECT * FROM is.reg_token WHERE name = ?",
            selectRegTokenBySymbol : "SELECT * FROM is.reg_token WHERE symbol = ?",
            selectRegTokenAll : "SELECT * FROM is.reg_token",
        },
        system_info : {
            //
            selectSystemInfo : `SELECT * FROM is.system_info`, 
            selectSystemInfoBgStatus : `SELECT json_value(net_info, "$.bg_status") AS bg_status FROM is.system_info`, 
        },
    },
}
