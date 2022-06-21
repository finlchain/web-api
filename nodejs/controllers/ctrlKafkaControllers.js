//
const config = require("../config/config.js");
const define = require("../config/define.js");
const dbUtil = require("../src/db/dbUtil.js");
const dbIS = require("../src/db/dbIS.js");
const dbNN = require("../src/db/dbNN.js");
const dbISHandler = require("../src/db/dbISHandler.js");
const dbNNHandler = require("../src/db/dbNNHandler.js");
const util = require("../src/utils/commonUtil.js");
const cryptoUtil = require("../src/sec/cryptoUtil.js");
const logger = require('../src/utils/winlog.js');

///////////////////////////////////////////////////////
// KAFKA
module.exports.getBrokerList = async (req, res) => {
    const request = req.query;

    let subNetId = 0;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    //
    if (request.hasOwnProperty("all"))
    {
        let kafkaInfo = await dbISHandler.getKafkaInfoAll();
        if (kafkaInfo.length)
        {
            
            let kafkaList = new Array();

            for (let idx=0; idx<kafkaInfo.length; idx++)
            {
                kafkaList.push({broker_list : kafkaInfo[idx].broker_list, topic_list : kafkaInfo[idx].topic_list});
            }

            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : new Date().getTime(),
                    kafka_list : kafkaList
                }
            }
        }
    }
    else if (request.hasOwnProperty("subNetId"))
    {
        if (isNaN(request.subNetId))
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_INVALID_PROPERTY.MSG}};
        }
        else
        {
            subNetId = request.subNetId;
        }
    }
    else
    {
        ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.MSG}};
    }

    //
    if (subNetId)
    {
        let likeTopic = Number(subNetId).toString(16);
        // logger.debug("likeTopic : " + likeTopic);

        let kafkaInfo = await dbISHandler.getKafkaInfoByLikeTopic(likeTopic);
        if (kafkaInfo.length)
        {
            ret_msg = {
                errorCode : define.ERR_MSG.SUCCESS.CODE,
                contents : {
                    timestamp : Date.now(),
                    kafka_list : kafkaInfo
                    // broker_list : kafkaInfo[0].broker_list,
                    // topic_name : kafkaInfo[0].topic_list
                }
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}
