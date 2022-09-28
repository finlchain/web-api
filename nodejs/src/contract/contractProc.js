//
const cryptoUtil = require('../sec/cryptoUtil.js');

//
const define = require('../../config/define.js');
const config = require('../../config/config.js');
const util = require('../utils/commonUtil.js');
const logger = require('../utils/winlog.js');

//
const cliContractProc = require("./../../controllers/cliContractControllersProc.js");

//
const C_DEFINE = define.CONTRACT_DEFINE;

////////////////////////////////////////////////////////
//
let contractArray = new Array();

module.exports.contractArray = contractArray;

module.exports.getContractArray = () => {
    let tempArray = [...contractArray];
    return tempArray;
}

module.exports.getContractArrayLen = () => {
    return contractArray.length;
}

module.exports.setContractArray = async (array) => {
    contractArray = await contractArray.concat(array);
}

module.exports.pushContractArray = (data) => {
    // logger.debug("data.jsonData : " + data.jsonData);
    contractArray.push(data);
}

module.exports.reinitContractArray = async () => {
    contractArray = new Array();
}

//
module.exports.mintScTimerProc = async () => {
    if(util.isArray(contractArray) && contractArray.length)
    {
        let transferArray;
        let transferCnt = 1;

        transferArray = contractArray.slice(0, transferCnt);
        contractArray = contractArray.slice(transferCnt, contractArray.length);

        await util.asyncForEach(transferArray, async (element, index) => {
            cliContractProc.mintScPostProc(element);
        });
        
    }
}
////////////////////////////////////////////////////////

// 
module.exports.cAddUser = async (ownerPubKey, superPubKey, accountId, ownerPrikey, seed) => {
    logger.debug("func - cAddUser");

    // Owner Public Key
    if (ownerPubKey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    // Super Public Key
    if (superPubKey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : C_DEFINE.FROM_DEFAULT,
        to_account : C_DEFINE.TO_DEFAULT,
        action : C_DEFINE.ACTIONS.CONTRACT.DEFAULT.ADD_USER,
        contents : {
            owner_pk : ownerPubKey,
            super_pk : superPubKey,
            account_id : accountId
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, ownerPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = superPubKey;

    return contractJson;
}

// 
module.exports.cChangeUserPk = async (accountNum, ownerPubKey, superPubKey, accountId, regSuperPubkey, regSuperPrikey, seed) => {
    logger.debug("func - cChangeUserPk");

    // Owner Public Key
    if (ownerPubKey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    // Super Public Key
    if (superPubKey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    // Registered Super Public Key
    if (regSuperPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : accountNum,
        to_account : accountNum,
        action : C_DEFINE.ACTIONS.CONTRACT.DEFAULT.CHANGE_USER_PUBKEY,
        contents : {
            owner_pk : ownerPubKey,
            super_pk : superPubKey,
            account_id : accountId
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, regSuperPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = regSuperPubkey;

    return contractJson;
}

// 
module.exports.cCreateToken = async (ownerPubKey, superPubKey, ownerPrikey, seed, tokenAction, tokenName, tokenSymbol, totalSupply, decimalPoint) => {
    logger.debug("func - cCreateToken");

    // Owner Public Key
    if (ownerPubKey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    // Super Public Key
    if (superPubKey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }


    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : C_DEFINE.FROM_DEFAULT,
        to_account : C_DEFINE.TO_DEFAULT,
        action : C_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_CREATION,
        contents : {
            owner_pk : ownerPubKey,
            super_pk : superPubKey,
            action : tokenAction,
            name : tokenName,
            symbol : tokenSymbol,
            total_supply : totalSupply,
            decimal_point : decimalPoint,
            lock_time_from : "0",
            lock_time_to : "0",
            lock_transfer : 0,
            black_list : "",
            functions : ""
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, ownerPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = superPubKey;

    return contractJson;
}

// 
module.exports.cChangeTokenPk = async (accountNum, ownerPubkey, superPubkey, tokenAction, regSuperPubkey, regSuperPrikey, seed) => {
    logger.debug("func - cChangeTokenPk");

    // Owner Public Key
    if (ownerPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    // Super Public Key
    if (superPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    // Registered Super Public Key
    if (regSuperPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : accountNum,
        to_account : accountNum,
        action : C_DEFINE.ACTIONS.CONTRACT.DEFAULT.CHANGE_TOKEN_PUBKEY,
        contents : {
            super_pk : ownerPubkey,
            owner_pk : superPubkey,
            action : tokenAction
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, regSuperPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = regSuperPubkey;

    return contractJson;
}

// 
module.exports.cChangeTokenLockTx = async (accountNum, tokenAction, lockTx, regSuperPubkey, regSuperPrikey, seed) => {
    logger.debug("func - cChangeTokenLockTx");

    // Registered Super Public Key
    if (regSuperPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : accountNum,
        to_account : accountNum,
        action : C_DEFINE.ACTIONS.CONTRACT.DEFAULT.LOCK_TOKEN_TX,
        contents : {
            action : tokenAction,
            lock_tx : lockTx
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, regSuperPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = regSuperPubkey;

    return contractJson;
}

// 
module.exports.cChangeTokenLockTime = async (accountNum, tokenAction, lockTimeFrom, lockTimeTo, regSuperPubkey, regSuperPrikey, seed) => {
    logger.debug("func - cChangeTokenLockTx");

    // Registered Super Public Key
    if (regSuperPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : accountNum,
        to_account : accountNum,
        action : C_DEFINE.ACTIONS.CONTRACT.DEFAULT.LOCK_TOKEN_TIME,
        contents : {
            action : tokenAction,
            lock_time_from : lockTimeFrom,
            lock_time_to : lockTimeTo
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, regSuperPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = regSuperPubkey;

    return contractJson;
}

// 
module.exports.cChangeTokenLockWallet = async (accountNum, tokenAction, blackPubkeyList, whitePubkeyList, regSuperPubkey, regSuperPrikey, seed) => {
    logger.debug("func - cChangeTokenLockTx");

    // Registered Super Public Key
    if (regSuperPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }
    
    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : accountNum,
        to_account : accountNum,
        action : C_DEFINE.ACTIONS.CONTRACT.DEFAULT.LOCK_TOKEN_WALLET,
        contents : {
            action : tokenAction,
            pk_list: blackPubkeyList
            // black_pk_list : blackPubkeyList,
            // white_pk_list : whitePubkeyList
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, regSuperPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = regSuperPubkey;

    return contractJson;
}

// 
module.exports.cTxToken = async (fromAccount, toAccount, tokenAction, amount, ownerPubkey, ownerPrikey, seed) => {
    logger.debug("func - cTxToken");

    // Owner Public Key
    if (ownerPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    //
    let contractJson;

    if (tokenAction === define.CONTRACT_DEFINE.ACTIONS.TOKEN.SECURITY_TOKEN)
    {
        logger.debug("SECURITY_TOKEN");

        contractJson = {
            create_tm : util.getDateMS().toString(),
            fintech : C_DEFINE.FINTECH.FINANCIAL_TX,
            privacy : C_DEFINE.PRIVACY.PUBLIC,
            fee : C_DEFINE.FEE_DEFAULT,
            from_account : fromAccount,
            to_account : toAccount,
            action : tokenAction,
            contents : {
                amount : amount//Number(amount).toString()
            },
            memo : ""
        };
    }
    else
    {
        logger.debug("UTILITY_TOKEN");

        let acc_1 = parseInt(C_DEFINE.ACCOUNT_TOKEN_DELI).toString(16);
        let acc_2 = util.paddy(parseInt(tokenAction).toString(16), 15);

        tokenAccount = acc_1 + acc_2;

        logger.debug("tokenAction : " + tokenAction + ", tokenAccount : " + tokenAccount);

        contractJson = {
            create_tm : util.getDateMS().toString(),
            fintech : C_DEFINE.FINTECH.FINANCIAL_TX,
            privacy : C_DEFINE.PRIVACY.PUBLIC,
            fee : C_DEFINE.FEE_DEFAULT,
            from_account : fromAccount,
            to_account : tokenAccount,
            action : tokenAction,
            contents : {
                dst_account : toAccount,
                amount : amount//Number(amount).toString()
            },
            memo : ""
        };
    }

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, ownerPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = ownerPubkey;

    return contractJson;
}

// 
module.exports.cTxToken2 = async (fromAccount, toAccount, tokenAccount, tokenAction, amount, ownerPubkey, ownerPrikey, seed) => {
    logger.debug("func - cTxToken");

    // Owner Public Key
    if (ownerPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    //
    let contractJson;

    if (tokenAction === define.CONTRACT_DEFINE.ACTIONS.TOKEN.SECURITY_TOKEN)
    {
        logger.debug("SECURITY_TOKEN");

        contractJson = {
            create_tm : util.getDateMS().toString(),
            fintech : C_DEFINE.FINTECH.FINANCIAL_TX,
            privacy : C_DEFINE.PRIVACY.PUBLIC,
            fee : C_DEFINE.FEE_DEFAULT,
            from_account : fromAccount,
            to_account : toAccount,
            action : define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX,
            contents : {
                action : tokenAction,
                amount : amount//Number(amount).toString()
            },
            memo : ""
        };
    }
    else
    {
        logger.debug("UTILITY_TOKEN");

        // let acc_1 = parseInt(C_DEFINE.ACCOUNT_TOKEN_DELI).toString(16);
        // let acc_2 = util.paddy(parseInt(tokenAction).toString(16), 15);

        // tokenAccount = acc_1 + acc_2;

        // logger.debug("tokenAction : " + tokenAction + ", tokenAccount : " + tokenAccount);

        contractJson = {
            create_tm : util.getDateMS().toString(),
            fintech : C_DEFINE.FINTECH.FINANCIAL_TX,
            privacy : C_DEFINE.PRIVACY.PUBLIC,
            fee : C_DEFINE.FEE_DEFAULT,
            from_account : fromAccount,
            to_account : tokenAccount,
            action : define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX,
            contents : {
                action : tokenAction,
                dst_account : toAccount,
                amount : amount//Number(amount).toString()
            },
            memo : ""
        };
    }

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, ownerPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = ownerPubkey;

    return contractJson;
}

// 
module.exports.cCreateSc = async (scAction, actionTarget, sc, ownerPubkey, ownerPrikey, seed) => {
    logger.debug("func - cCreateSc");

    // Owner Public Key
    if (ownerPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }

    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : C_DEFINE.FROM_DEFAULT,
        to_account : C_DEFINE.TO_DEFAULT,
        action : C_DEFINE.ACTIONS.CONTRACT.DEFAULT.CREATE_SC,
        contents : {
            sc_action : scAction, 
            action_target : actionTarget, 
            sc : sc
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, ownerPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = ownerPubkey;

    return contractJson;
}

// 
module.exports.cTxSc = async (scAction, sc, userPubkey, userPrikey, fromAccount, toAccount, seed) => {
    logger.debug("func - cTxSc");

    // User Public Key
    if (userPubkey.length !== define.SEC_DEFINE.PUBLIC_KEY_LEN)
    {
        return false;
    }
    
    if (!isNaN(Number(fromAccount))) {
        fromAccount = C_DEFINE.FROM_DEFAULT;
    }

    //
    let contractJson = {
        create_tm : util.getDateMS().toString(),
        fintech : C_DEFINE.FINTECH.NON_FINANCIAL_TX,
        privacy : C_DEFINE.PRIVACY.PUBLIC,
        fee : C_DEFINE.FEE_DEFAULT,
        from_account : fromAccount,
        to_account : toAccount,
        action : scAction,
        contents : {
            sc : sc
        },
        memo : ""
    };

    //
    let sig = cryptoUtil.genSignNoFile(JSON.parse(JSON.stringify(contractJson)), seed, userPrikey);
    contractJson.sig = sig;

    contractJson.signed_pubkey = userPubkey;

    return contractJson;
}
