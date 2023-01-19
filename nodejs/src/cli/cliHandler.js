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
    else if(cmd.slice(0,13) === define.CMD.TEST_DUPL_ARR)
    {
        const arr = [{index: 1, toAccount: 'red'}, {index: 2, toAccount: 'green'}, {index: 3, toAccount: 'yellow'}, {index: 4, toAccount: 'green'}, {index: 5, toAccount: 'red'}];

        let duplicates;

        duplicates = util.findDuplArrByField(arr, 'toAccount');
        logger.debug('duplicates.length :' + duplicates.length);
        logger.debug(JSON.stringify(duplicates));

        duplicates = util.delDuplArrByField(arr, 'toAccount');
        logger.debug('duplicates.length :' + duplicates.length);
        logger.debug(JSON.stringify(duplicates));

        const arr2 = [{index: 1, toAccount: 'red'}, {index: 2, toAccount: 'green'}, {index: 3, toAccount: 'yellow'}, {index: 2, toAccount: 'green'}, {index: 1, toAccount: 'red'}];
        duplicates = util.delDuplArr(arr2);
        logger.debug('duplicates.length :' + duplicates.length);
        logger.debug(JSON.stringify(duplicates));
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