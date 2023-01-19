//
const dbUtil = require("./../../src/db/dbUtil.js");
const dbIS = require("./../../src/db/dbIS.js");
const logger = require('./../../src/utils/winlog.js');

//
module.exports.getClusterInfoAll = async () => {
    try {
        //
        let sql = dbIS.querys.is.cluster_info.getAll;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getClusterInfoAll");
    }

    return false;
}

//
module.exports.getClusterAddrByRole = async (role) => {
    try {
        //
        let sql = dbIS.querys.is.cluster_info.getClusterAddrByRole;
        
        let query_result = await dbUtil.queryPre(sql, [role]);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getClusterAddrByRole");
    }

    return false;
}

//
module.exports.getHubInfo = async () => {
    try {
        //
        let sql = dbIS.querys.is.hub_info.selectHubInfo;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getHubInfo");
    }

    return false;
}

//
module.exports.getKafkaInfoAll = async () => {
    try {
        //
        let sql = dbIS.querys.is.kafka_info.getAll;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getKafkaInfoAll");
    }

    return false;
}

module.exports.getKafkaInfoByLikeTopic = async (likeTopic) => {
    try {
        //
        let sql = dbIS.querys.is.kafka_info.getByLikeTopic + `"%${likeTopic}"`;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getKafkaInfoByLikeTopic");
    }

    return false;
}

module.exports.getTokenInfoByAction = async (tokenAction) => {
    try {
        //
        let sql = dbIS.querys.is.reg_token.selectRegTokenByAction;
        
        let query_result = await dbUtil.queryPre(sql, tokenAction);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getTokenInfoByAction");
    }

    return false;    
}

module.exports.getTokenInfoByName = async (tokenName) => {
    try {
        //
        let sql = dbIS.querys.is.reg_token.selectRegTokenByName;
        
        let query_result = await dbUtil.queryPre(sql, tokenName);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getTokenInfoByName");
    }

    return false;    
}

module.exports.getTokenInfoBySymbol = async (tokenSymbol) => {
    try {
        //
        let sql = dbIS.querys.is.reg_token.selectRegTokenBySymbol;
        
        let query_result = await dbUtil.queryPre(sql, tokenSymbol);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getTokenInfoBySymbol");
    }

    return false;    
}

module.exports.getTokenInfoAll = async () => {
    try {
        //
        let sql = dbIS.querys.is.reg_token.selectRegTokenAll;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getTokenInfoAll");
    }

    return false;    
}

//
module.exports.getSystemInfo = async () => {
    try {
        //
        let sql = dbIS.querys.is.system_info.selectSystemInfo;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getSystemInfo");
    }

    return false;    
}


//
module.exports.getSystemInfoBgStatus = async () => {
    try {
        //
        let sql = dbIS.querys.is.system_info.selectSystemInfoBgStatus;
        
        let query_result = await dbUtil.query(sql);
        
        if(query_result.length) 
        {
            return query_result;
        }
    } catch (err) {
        logger.error("Error - getSystemInfoBgStatus");
    }

    return false;    
}
