const logger = require('./../../src/utils/winlog.js');
const define = require('./../../config/define.js');

const myCluster = require("./../myCluster.js");
//

//////////////////////////////////////////////////
//
let timerObjMintScArr = 0;
let timerObjMintScArrMsInterval = 2000;

//
module.exports.setIntervalMintScArr = () => {
    if (timerObjMintScArr)
    {
        return false;
    }

    timerObjMintScArr = setInterval(myCluster.sendNullMintScToMaster, timerObjMintScArrMsInterval);

    return true;
}

module.exports.clrIntervalMintScArr = () => {
    if (!timerObjMintScArr)
    {
        return false;
    }

    clearInterval(timerObjMintScArr);

    timerObjMintScArr = 0;

    return true;
}
//////////////////////////////////////////////////