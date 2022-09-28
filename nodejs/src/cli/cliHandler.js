//
const define = require('./../../config/define.js');
const dbNNHandler = require("./../db/dbNNHandler.js");
const util = require('./../utils/commonUtil.js');
const logger = require('./../utils/winlog.js');

//
module.exports.handler = async (cmd) => {
    let retVal = true;

    logger.debug('webApi CLI Received Data : ' + cmd);

    let cmdSplit = cmd.split(' ');

    //
    if(cmd.slice(0,13) === define.CMD.TEST_NODE_NFT)
    {
        //
    }
    else if(cmd.slice(0,10) === define.CMD.TEST_SUBID)
    {
        // Current subId
        let scAction = '2684354562';
        let subId = await dbNNHandler.getMintSubId(scAction);
        logger.debug("subId 1 : " + subId);

        let subIdHexStr = util.paddy(parseInt(subId).toString(16), 4);
        logger.debug("subIdHexStr 1 : " + subIdHexStr);

        // Next subId
        subId = util.hexStrToInt(subIdHexStr) + 1;
        subIdHexStr = util.paddy(parseInt(subId).toString(16), 4);
        logger.debug("subIdHexStr 1 : " + subIdHexStr);

        //
        let randomHexStr = util.paddy(util.getRandomNumBuf(2, 1, 255).toString('hex'), 4);
        // logger.debug('currentMsHexStr : ' + currentMsHexStr);
        logger.debug('randomHexStr : ' + randomHexStr);

        subIdHexStr = randomHexStr + subIdHexStr;
        logger.debug("subIdHexStr 2 : " + subIdHexStr);

        // Output value
        subId = util.hexStrToInt(subIdHexStr);
        logger.debug("subId 2 : " + subId);

        
    }
    else
    {
        retVal = false;
        logger.error("[CLI] " + cmd + ' is an incorrect command. See is --help');
    }

    return retVal;
}