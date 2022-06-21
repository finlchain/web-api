//
const config = require("./../config/config.js");
const define = require("./../config/define.js");
const dbUtil = require("./../src/db/dbUtil.js");
const dbIS = require("./../src/db/dbIS.js");
const dbNN = require("./../src/db/dbNN.js");
const dbISHandler = require("../src/db/dbISHandler.js");
const util = require("./../src/utils/commonUtil.js");
const cryptoUtil = require("./../src/sec/cryptoUtil.js");
const logger = require('./../src/utils/winlog.js');

//
module.exports.clusterList = async (req, res) => {
    const request = req.query;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : clusterList");

    if (request.hasOwnProperty("all"))
    {
        //
        try {
            //
            let clusters = await dbISHandler.getClusterAddrByRole(define.NODE_ROLE.NUM.NN);

            if (clusters !== false)
            {
                ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents: {res : true, clusters : clusters }};
            }
        } catch (err) {
            ret_msg = { errorCode : define.ERR_MSG.ERR_DATABASE.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_DATABASE.MSG}};
        }
    }

    logger.debug("ret_msg : " + JSON.stringify(ret_msg));

    res.send(ret_msg);
}

// exports.nodeList = async (req, res) => {
//     const request = req.query;
//     const len = parseInt(request.length);
//     const startIdx = parseInt(request.start);
    
//     if(startIdx === undefined || len === undefined) {
//         res.send(404);
//         return;
//     }

//     let ret_msg;

//     try {
//         const isag_url = config.ISAG_URL + "/ALL";
//         const api_req_argv = {
//             id : 1,
//             ip : 1,
//             p2paddress : 1,
//             role : 1,
//             status : 1,
//             country : 1,
//             city : 1,
//             cnt : 0
//         }
    
//         let api_res = await api.APICall_GET(isag_url, api_req_argv);
//         let node_data = api_res.data;
    
//         let node_info_array = new Array();
    
//         await util.asyncForEach(node_data, async (element, index) => {
//             for(var i = 0; i < element.length; i++) {
//                 node_info_array.push(element[i]);
//             }
//         });
        
//         ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents : { nodelist : node_info_array.slice(startIdx, len) }, data : node_info_array.slice(startIdx, len), recordsTotal : node_info_array.length, recordsFiltered : node_info_array.length };
    
//         res.send(ret_msg);
//     } catch (err) {

//         res.send(404);
//         return;
//     }
// }

// module.exports.nodeNum = async (req, res) => {
//     let ret_msg;
//     let node_num = 0;

//     try {
//         const isag_url = config.ISAG_URL + "/ALL";
//         const api_req_argv = {
//             role : 1,
//             cnt : 0
//         }

//         let api_res = await api.APICall_GET(isag_url, api_req_argv);
//         let node_data = api_res.data;

//         let node_info_array = new Array();

//         await util.asyncForEach(node_data, async (element, index) => {
//             for(var i = 0; i < element.length; i++) {
//                 node_info_array.push(element[i]);
//             }
//         });

//         ret_msg = { errorCode : define.ERR_MSG.SUCCESS.CODE, contents : { nodeNum : node_info_array.length }};

//         res.send(ret_msg);
//         return;

//     } catch (err) {

//         res.send(404);
//         return;
//     }
// }
