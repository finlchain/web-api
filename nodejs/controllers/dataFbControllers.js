//
const config = require("../config/config.js");
const define = require("../config/define.js");
const dbUtil = require("../src/db/dbUtil");
const dbFB = require("../src/db/dbFB.js");
const dbFBHandler = require("../src/db/dbFBHandler.js");
const util = require("../src/utils/commonUtil.js");
const logger = require('../src/utils/winlog.js');

// GET
//
module.exports.getReplInfo = async (req, res) => {
    const request = req.query;

    logger.debug("func : replInfo");

    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    //
    let replDataArr;

    if (request.hasOwnProperty("blkNum"))
    {
        if (request.hasOwnProperty("nodeRule"))
        {
            replDataArr = await dbFBHandler.getReplDataArr(request.blkNum, request.nodeRule);
        }
        else
        {
            replDataArr = await dbFBHandler.getReplDataArr(request.blkNum, define.NODE_ROLE.NUM.ISAG);
        }
    }
    else
    {
        if (request.hasOwnProperty("nodeRule"))
        {
            replDataArr = await dbFBHandler.getReplDataArr(0, request.nodeRule);
        }
        else
        {
            replDataArr = await dbFBHandler.getReplDataArr(0, define.NODE_ROLE.NUM.ISAG);
        }
    }

    if (replDataArr.length)
    {
        ret_msg = {
            errorCode : define.ERR_MSG.SUCCESS.CODE,
            contents : {
                timestamp : Date.now(),
                replInfo : replDataArr
            }
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}