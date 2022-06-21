//
const dbUtil = require("./../../src/db/dbUtil.js");
const logger = require('./../../src/utils/winlog.js');

//
module.exports.querys = {
    fb : {
        //
        repl_info : {
            //
            insertReplInfo: "INSERT INTO fb.repl_info(subnet_id, blk_num, ip, role, log_file, log_pos, cluster_p2p_addr) values(?, ?, ?, ?, ?, ?, ?)",
            //
            selectReplInfo: "SELECT * FROM fb.repl_info ORDER BY blk_num DESC",
            selectReplInfoByBN: "SELECT * FROM fb.repl_info WHERE blk_num = ? ORDER BY blk_num DESC",
            selectReplInfoByBNAndRole: "SELECT * FROM fb.repl_info WHERE blk_num = ? and role = ? ORDER BY blk_num DESC",
            selectReplInfoByBNAndRoleAndClusterP2pAddr: "SELECT * FROM fb.repl_info WHERE blk_num = ? and role = ? and cluster_p2p_addr = ? ORDER BY blk_num DESC",
            //
            selectMaxReplInfoByBN: "SELECT MAX(blk_num) as max_blk_num FROM fb.repl_info WHERE blk_num <= ? ORDER BY blk_num DESC",
            selectMaxReplInfoByBNAndRole: "SELECT MAX(blk_num) as max_blk_num FROM fb.repl_info WHERE blk_num <= ? and role = ? ORDER BY blk_num DESC",
        }
    },
};
