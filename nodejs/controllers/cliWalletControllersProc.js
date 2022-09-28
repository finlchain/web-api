//
const fs = require("fs");

//
const cryptoSsl = require("./../../../addon/crypto-ssl");

//
const config = require("../config/config.js");
const define = require("../config/define.js");
const dbUtil = require("../src/db/dbUtil");
const util = require("../src/utils/commonUtil.js");
const cryptoUtil = require("../src/sec/cryptoUtil.js");
const encrypto = require("../src/sec/encrypto.js");
const base58 = require('../src/utils/base58.js');
const logger = require('../src/utils/winlog.js');

// POST
//
//
module.exports.walletProc = async (reqQuery) => {
    const request = reqQuery;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : walletProc");

    try {
        // User Functionalities
        if (request.hasOwnProperty("keyGen"))
        {
            // logger.debug("keyGen : " + JSON.stringify(request.keyGen));

            let contentsJson = request.keyGen;

            ret_msg = await this.keyGenProc(contentsJson);
        }
        else
        {
            ret_msg = { errorCode : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_JSON_UNKNOWN_FORMAT.MSG}};
        }
    } catch (err) {
        logger.error("Error - 42");
    }

    return (ret_msg);
}


//
module.exports.keyGenProc = async (reqQuery) => {
    const request = reqQuery;
    let ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};

    logger.debug("func : keyGenProc");

    try {
        do
        {
            // Password (Salt and Encryption)
            if (!request.hasOwnProperty("pw"))
            {
                logger.debug("pw field is needed");
                // Error Code
                ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};
                break;
            }

            //
            let regexResult = define.REGEX.PW_STRONG_REGEX.test(request.pw);
            let regexCondResult = define.REGEX.PW_STRONG_COND_REGEX.test(request.pw);
            if(!regexResult || !regexCondResult)
            {
                logger.debug("pw STRONG REGEX Failed : " + regexResult);
                // Error Code
                ret_msg = { errorCode : define.ERR_MSG.ERR_NO_DATA.CODE, contents : { res : false, msg : define.ERR_MSG.ERR_NO_DATA.MSG}};
                break;
            }

            logger.debug("pw : " + request.pw);

            // //
            // if (request.hasOwnProperty("email"))
            // {
            //     logger.debug("email : " + request.email);
            // }

            // Create Default Directory
            let rootDir = './key/gen';

            if (!fs.existsSync(rootDir))
            {
                fs.mkdirSync(rootDir, 0755);
                // fs.mkdirSync(path);
            }

            // Create Sub Directory Name
            let pwHash = cryptoUtil.genSha256Str(request.pw);
            logger.debug("pwHash : " + pwHash);
            let subDir = pwHash.slice(0,8);
            logger.debug("subDir : " + subDir);

            // Create Sub Directory
            let dir = rootDir + '/' + subDir;
            if (!fs.existsSync(dir))
            {
                fs.mkdirSync(dir, 0755);
                // fs.mkdirSync(path);
            }

            // Generate ED25519 Key and Save the Files
            let path = dir + '/';
            // let ret = cryptoSsl.ed25519KeyGenPem(path);

            let seed = request.pw;
            let ret1 = false;
            let ret2 = false;

            //
            let mnemonic = "";

            if (request.hasOwnProperty("mnemonic"))
            {
                mnemonic = request.mnemonic;
                let pw = request.pw;
                ret1 = cryptoSsl.ed25519KeyGenFinWithMnemonicOri(path, mnemonic, pw, seed, seed.length);
                // ret1 = cryptoSsl.ed25519KeyGenPemWithMnemonicOri(path, mnemonic, pw);
                ret2 = cryptoSsl.x25519KeyGenPemWithMnemonicOri(path, mnemonic, pw);
            }
            else
            {
                ret1 = cryptoSsl.ed25519KeyGenFin(path, seed, seed.length);
                // ret1 = cryptoSsl.ed25519KeyGenFin(path);
                ret2 = cryptoSsl.x25519KeyGenPem(path);
            }

            // logger.debug("ret1 : " + ret1 + "ret2 : " + ret2);
            if ((ret1 === true) && ((ret2 === true)))
            {
                logger.debug("path : " + path);
                // cryptoUtil.makeFin(dir, request.pw);

                //
                let edPrikeyFinPath = path + 'ed_privkey.fin';
                // let edPrikeyPemPath = path + 'ed_privkey.pem';
                let edPubkeyPemPath = path + 'ed_pubkey.pem';
                // let xPrikeyFinPath = path + 'x_privkey.fin';
                let xPriKeyPemPath = path + 'x_privkey.pem';
                let xPubkeyPemPath = path + 'x_pubkey.pem';

                //
                let edPubkey = cryptoUtil.getPubkey(edPubkeyPemPath);
                logger.debug("edPubkey : " + edPubkey);

                //
                let utcTime = Date.now();
                let base58Pubkey = base58.addrEncode(define.CONTRACT_DEFINE.ED_PUB_IDX + edPubkey);
                logger.debug("base58Pubkey : " + base58Pubkey);
                let wFileName = utcTime + '-{' + base58Pubkey  + '}';

                //
                let edPrikeyFin = fs.readFileSync(edPrikeyFinPath, 'binary');
                // logger.debug("edPrikeyFin : " + edPrikeyFin);
                // let edPrikeyPem = fs.readFileSync(edPrikeyPemPath, 'binary');
                // // logger.debug("edPrikeyPem : " + edPrikeyPem);
                let edPubkeyPem = fs.readFileSync(edPubkeyPemPath, 'binary');
                // logger.debug("edPubkeyPem : " + edPubkeyPem);
                // let xPrikeyFin = fs.readFileSync(xPrikeyFinPath, 'binary');
                // // logger.debug("xPrikeyFin : " + xPrikeyFin);
                let xPrikeyPem = fs.readFileSync(xPriKeyPemPath, 'binary');
                // logger.debug("xPrikeyPem : " + xPrikeyPem);
                let xPubkeyPem = fs.readFileSync(xPubkeyPemPath, 'binary');
                // logger.debug("xPubkeyPem : " + xPubkeyPem);

                // // For Test
                // let edPrikeyTestPemPath = path + 'ed_privkey_test.pem';
                // fs.writeFileSync(edPrikeyPemTestPath, edPrikey, 'binary');

                //
                let keyStorePath = path + wFileName + '.json';
                let keyStoreJson = {
                    version : 1, 
                    edPrikeyFin : edPrikeyFin, 
                    // edPrikeyPem : edPrikeyPem, 
                    edPubkeyPem : edPubkeyPem, 
                    // xPrikeyFin : xPrikeyFin, 
                    xPrikeyPem : xPrikeyPem, 
                    xPubkeyPem : xPubkeyPem
                };

                let keyStore = JSON.stringify(keyStoreJson);

                //
                let jsonOnly = 'no';
                let data;

                if (request.hasOwnProperty("jsonOnly") && (request.jsonOnly === 'yes'))
                {
                    jsonOnly = request.jsonOnly;
                    logger.debug("jsonOnly : " + request.jsonOnly);
                    data = keyStore;
                }
                else
                {
                    fs.writeFileSync(keyStorePath, keyStore, 'binary');

                    //
                    let zipFileName = 'key_' + wFileName + '.zip';
                    // let zipFilePath = dir +  '/' + zipFileName;
    
                    data = util.makeZip(dir, zipFileName, request.pw);
                }

                //
                if (data)
                {
                    //
                    // const encMsg = encrypto.encrypt(data, request.pw);
                    const encMsg = encrypto.aes256CbcEncrypt(data, request.pw);
                    // logger.debug("decMsg : " + data);
                    // logger.debug("pw : " + request.pw);
                    // logger.debug("encMsg : " + encMsg);
                    //
                    ret_msg = {
                        errorCode : define.ERR_MSG.SUCCESS.CODE,
                        contents : {
                            timestamp : new Date().getTime(),
                            jsonOnly : jsonOnly, 
                            wFileName : wFileName, 
                            key : encMsg
                        }
                    }
                }

                // //
                // if (data)
                // {
                //     ret_msg = {
                //         errorCode : define.ERR_MSG.SUCCESS.CODE,
                //         contents : {
                //             timestamp : new Date().getTime(),
                //             key : data
                //         }
                //     }
                // }

                // Delete The Directory
                util.rmdirSync(dir, { recursive: true });
            }
        } while (0);
    } catch (err) {
        logger.error("Error - 43");
        logger.debug("ret_msg_p : " + JSON.stringify(ret_msg));
    }

    return(ret_msg);
}

// GET
