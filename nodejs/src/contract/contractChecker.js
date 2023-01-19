//
const { del } = require("request");

//
const config = require("./../../config/config.js");
const define = require("./../../config/define.js");
const dbUtil = require("./../db/dbUtil.js");
const dbNNHandler = require("../db/dbNNHandler.js");
const util = require("./../utils/commonUtil.js");
const contractProc = require("./../contract/contractProc.js");
const logger = require("./../utils/winlog.js");

///////////////////////////////////////////////////////////////////////////////////////////
// 
module.exports.chkAccountDelimiter = (accountHexStr) => {
    logger.debug("chkAccountDelimiter");
    logger.debug("account : " + accountHexStr);

    let accountDeil = parseInt(accountHexStr.slice(0,1));
    logger.debug("accountDeil : " + accountDeil);

    return (accountDeil);
}

//
const chkTxTokenContract = async(contractJson) => {
    let retVal = define.ERR_CODE.ERROR;

    // Action
    let action = contractJson.action;
    if (action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX)
    {
        action = contractJson.contents.action;
    }

    // Check User Account
    let toAccountHexStr = contractJson.to_account;
    logger.debug("toAccountHexStr: " + toAccountHexStr);
    let fromAccountHexStr = contractJson.from_account;
    logger.debug("fromAccountHexStr: " + fromAccountHexStr);
    let dstAccountHexStr;

    let toAccount = util.hexStrToBigInt(toAccountHexStr);
    let fromAccount = util.hexStrToBigInt(fromAccountHexStr);

    logger.debug("token action: " + action);
    if (action) {
        dstAccountHexStr = contractJson.contents.dst_account;
        logger.debug("dstAccountHexStr: " + dstAccountHexStr);
        toAccountHexStr = dstAccountHexStr;
        toAccount = util.hexStrToBigInt(dstAccountHexStr);
    }

    //
    let fAccountDeli = this.chkAccountDelimiter(contractJson.from_account);
    
    //
    if (!fromAccount || !toAccount)
    {
        logger.error("chkTxTokenContract - Account");
        return retVal;
    }
    else if(fromAccount === toAccount) // Check
    {
        if(fAccountDeli !== define.CONTRACT_DEFINE.ACCOUNT_TOKEN_DELI)
        {
            logger.error("chkTxTokenContract - toAccount & fromAccount");
            return retVal;
        }
    }

    // // Check To Account whether it is token account or NOT
    // if(this.chkAccountDelimiter(contractJson.to_account) === define.CONTRACT_DEFINE.ACCOUNT_TOKEN_DELI)
    // {
    //     if (contractJson.to_account === define.CONTRACT_DEFINE.SEC_TOKEN_ACCOUNT)
    //     {
    //         logger.error("chkTxTokenContract - toAccount : ACCOUNT_TOKEN_DELI");
    //         return retVal;
    //     }
    // }
    // else if(fromAccount === toAccount) // Check
    // {
    //     logger.error("chkTxTokenContract - toAccount & fromAccount");
    //     return retVal;
    // }
    
    // Check Token Account
    let tokenAccount = await dbNNHandler.accountTokenCheck(action);
    if (!tokenAccount.length)
    {
        logger.error("chkTxTokenContract - account_token action");
        return retVal;
    }

    //
    if (!BigInt(tokenAccount[0].blk_num))
    {
        logger.error("chkTxTokenContract - account_token blk_num");
        return retVal;
    }

    // lock_transfer
    if (tokenAccount[0].lock_transfer === define.CONTRACT_DEFINE.LOCK_TOKEN_TX.LOCK_ALL)
    {
        logger.error("chkTxTokenContract - account_token lock_transfer ALL");
        return retVal;
    }
    else if (tokenAccount[0].lock_transfer === define.CONTRACT_DEFINE.LOCK_TOKEN_TX.LOCK_EXC_OWNER)
    {
        if (contractJson.signed_pubkey !== tokenAccount.owner_pk)
        {
            logger.error("chkTxTokenContract - account_token lock_transfer EXCLUDING OWNER");
            return retVal;
        }
    }

    // lock_time
    let curTime = util.getDateMS();
    if ((tokenAccount[0].lock_time_from !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
        && (tokenAccount[0].lock_time_to !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK))
    {
        if (tokenAccount[0].lock_time_from <= curTime && curTime <= tokenAccount[0].lock_time_to)
        {
            logger.error("chkTxTokenContract - account_token lock_time ALL");
            return retVal;
        }
    }
    else if (tokenAccount[0].lock_time_from !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
    {
        if (tokenAccount[0].lock_time_from <= curTime)
        {
            logger.error("chkTxTokenContract - account_token lock_time FROM");
            return retVal;
        }
    }
    else if (tokenAccount[0].lock_time_to !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
    {
        if (curTime <= tokenAccount[0].lock_time_to)
        {
            logger.error("chkTxTokenContract - account_token lock_time TO");
            return retVal;
        }
    }

    // black_list
    if (tokenAccount[0].black_list) {
        let blackListAll = JSON.parse(tokenAccount[0].black_list);
        logger.debug("JSON.stringify(blackListAll): " + JSON.stringify(blackListAll));
        let blackListAccNum = blackListAll.black_acc_num_list;
        logger.debug("blackListAccNum: " + blackListAccNum);

        if (blackListAccNum) {
            let isToAccountOnBlackList = blackListAccNum.indexOf(toAccountHexStr);
            if (isToAccountOnBlackList > -1 && toAccountHexStr == blackListAccNum[isToAccountOnBlackList]) {
                logger.error("chkTxTokenContract - User To Account is on Black List");
                return retVal;
            }

            let isFromAccountOnBlackList = blackListAccNum.indexOf(fromAccountHexStr);
            if (isFromAccountOnBlackList > -1 && fromAccountHexStr == blackListAccNum[isFromAccountOnBlackList]) {
                logger.error("chkTxTokenContract - User From Account is on Black List");
                return retVal;
            }
        }
    }
    
    logger.debug('contractJson.contents.amount : ' + contractJson.contents.amount);
    // Check Decimal Point
    let splitAmount = util.chkDecimalPoint(contractJson.contents.amount);
    
    logger.debug('splitAmount.length : ' + splitAmount.length);
    logger.debug('splitAmount[1].length : ' + splitAmount[1].length);
    if (splitAmount.length !== 2)
    {
        logger.error("chkTxTokenContract - No amount decimal_point");
        return retVal;
    }

    if (splitAmount[1].length !== tokenAccount[0].decimal_point)
    {
        logger.error("chkTxTokenContract - invalid amount decimal_point length");
        return retVal;
    }

    // Check From Account
    let fAccount;

    if(fAccountDeli === define.CONTRACT_DEFINE.ACCOUNT_TOKEN_DELI)
    {
        fAccount = await dbNNHandler.accountTokenAccountCheck(fromAccount);
    }
    else if(fAccountDeli <= define.CONTRACT_DEFINE.ACCOUNT_USER_DELI_MAX)
    {
        fAccount = await dbNNHandler.accountUserAccountNumCheck(fromAccount);
    }
    else
    {
        logger.error("chkTxTokenContract - fromAccount : No Account");
        return retVal;
    }

    if(fAccount.length)
    {
        let fa_owner_pk = fAccount[0].owner_pk;
        //
        if (contractJson.signed_pubkey !== fa_owner_pk)
        {
            logger.debug ("contractJson.signed_pubkey : " + contractJson.signed_pubkey);
            logger.debug ("fa_owner_pk : " + fa_owner_pk);
            logger.error("chkTxTokenContract - signed_pubkey");
            return retVal;
        }

        //
        logger.debug ("contractJson.from_account : " + contractJson.from_account.toString());
        if (contractJson.from_account === define.CONTRACT_DEFINE.SEC_TOKEN_ACCOUNT)
        {
            logger.debug ("SECURITY TOKEN DISTRIBUTTED BY TOKEN ACCOUNT");

            // TO DO : Maximum Token Distribution
        }
        else
        {
            logger.debug ("TOKEN DISTRIBUTTED BY USER ACCOUNT OR TOKEN ACCOUNT");
            let fAccountLeger = await dbNNHandler.accountLegerCheck(fromAccount, action);
            // let fAccountLeger = ledger.getAccountBalanceByAccountNumAndAction(fromAccount, action);
            if (!fAccountLeger.length)
            {
                logger.error("chkTxTokenContract - account_ledger");
                return retVal;
            }
            else if (!BigInt(tokenAccount[0].blk_num))
            {
                logger.error("chkTxTokenContract - account_ledger blk_num");
                return retVal;
            }
    
            let balVal = util.balNum(fAccountLeger[0].balance, contractJson.contents.amount, tokenAccount[0].decimal_point);
            if (balVal === false)
            {
                logger.error("chkTxTokenContract - balance");
                return retVal;
            }
        }
    }
    else
    {
        logger.error("chkTxTokenContract - fromAccount");
        return retVal;
    }

    // Check To Account
    let tAccount;
    let tAccountDeli = this.chkAccountDelimiter(contractJson.to_account);
    if(tAccountDeli === define.CONTRACT_DEFINE.ACCOUNT_TOKEN_DELI) // Utility Token
    {
        // To Account != Security Token Account
        if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.TOKEN.SECURITY_TOKEN)
        {
            logger.error("chkTxTokenContract - toAccount : action");
            return retVal;
        }
        else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX)
        {
            if (contractJson.contents.action === define.CONTRACT_DEFINE.ACTIONS.TOKEN.SECURITY_TOKEN)
            {
                logger.error("chkTxTokenContract - toAccount : action");
                return retVal;
            }
        }

        //
        let dstAccount = util.hexStrToBigInt(dstAccountHexStr);
        let dAccount = await dbNNHandler.accountUserAccountNumCheck(dstAccount);
        if(!dAccount.length)
        {
            logger.error("chkTxTokenContract - dstAccount : No Account");
            return retVal;
        }

        toAccount = util.hexStrToBigInt(contractJson.to_account);
        tAccount = await dbNNHandler.accountTokenAccountCheck(toAccount);
    }
    else if(tAccountDeli <= define.CONTRACT_DEFINE.ACCOUNT_USER_DELI_MAX) // Security Token
    {
        //
        if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX)
        {
            if (contractJson.contents.action !== define.CONTRACT_DEFINE.ACTIONS.TOKEN.SECURITY_TOKEN)
            {
                logger.error("chkTxTokenContract - toAccount : action");
                return retVal;
            }
        }
        else if (contractJson.action !== define.CONTRACT_DEFINE.ACTIONS.TOKEN.SECURITY_TOKEN)
        {
            logger.error("chkTxTokenContract - toAccount : action");
            return retVal;
        }

        tAccount = await dbNNHandler.accountUserAccountNumCheck(toAccount);
    }
    else
    {
        logger.error("chkTxTokenContract - toAccount : No Account 1");
        return retVal;
    }

    if(!tAccount.length)
    {
        logger.error("chkTxTokenContract - toAccount : No Account 2");
        return retVal;
    }

    retVal = define.ERR_CODE.SUCCESS;

    return retVal;
}

//
const chkMultiTxTokenContract = async(contractJson) => {
    let retVal = define.ERR_CODE.ERROR;

    // Check User Account
    let fromAccount = util.hexStrToBigInt(contractJson.from_account).toString();
    logger.debug("fromAccount: " + fromAccount);

    //
    let fAccountDeli = this.chkAccountDelimiter(contractJson.from_account);

    // Action
    let action = contractJson.contents.action;

    // Check Token Account
    let tokenAccount = await dbNNHandler.accountTokenCheck(action);
    if (!tokenAccount.length)
    {
        logger.error("chkMultiTxTokenContract - account_token action");
        return retVal;
    }

    //
    if (!BigInt(tokenAccount[0].blk_num))
    {
        logger.error("chkMultiTxTokenContract - account_token blk_num");
        return retVal;
    }

    // lock_transfer
    if (tokenAccount[0].lock_transfer === define.CONTRACT_DEFINE.LOCK_TOKEN_TX.LOCK_ALL)
    {
        logger.error("chkMultiTxTokenContract - account_token lock_transfer ALL");
        return retVal;
    }
    else if (tokenAccount[0].lock_transfer === define.CONTRACT_DEFINE.LOCK_TOKEN_TX.LOCK_EXC_OWNER)
    {
        if (contractJson.signed_pubkey !== tokenAccount.owner_pk)
        {
            logger.error("chkMultiTxTokenContract - account_token lock_transfer EXCLUDING OWNER");
            return retVal;
        }
    }

    // lock_time
    let curTime = util.getDateMS();
    if ((tokenAccount[0].lock_time_from !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
        && (tokenAccount[0].lock_time_to !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK))
    {
        if (tokenAccount[0].lock_time_from <= curTime && curTime <= tokenAccount[0].lock_time_to)
        {
            logger.error("chkMultiTxTokenContract - account_token lock_time ALL");
            return retVal;
        }
    }
    else if (tokenAccount[0].lock_time_from !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
    {
        if (tokenAccount[0].lock_time_from <= curTime)
        {
            logger.error("chkMultiTxTokenContract - account_token lock_time FROM");
            return retVal;
        }
    }
    else if (tokenAccount[0].lock_time_to !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
    {
        if (curTime <= tokenAccount[0].lock_time_to)
        {
            logger.error("chkMultiTxTokenContract - account_token lock_time TO");
            return retVal;
        }
    }

    // black_list
    if (tokenAccount[0].black_list) {
        let blackListAll = JSON.parse(tokenAccount[0].black_list);
        let blackListAccNum = blackListAll.black_acc_num_list;
        if (blackListAccNum) {
            let isFromAccountOnBlackList = blackListAccNum.indexOf(contractJson.from_account);
            if (isFromAccountOnBlackList > -1 && contractJson.from_account == blackListAccNum[isFromAccountOnBlackList]) {
                logger.error("chkMultiTxTokenContract - User From Account is on Black List");
                return retVal;
            }
        }
    }

    //
    let myTxInfo = JSON.parse(contractJson.contents.tx_info);

    // Check duplicated txAccount in txInfo
    let myDupl = util.findDuplArrByField(myTxInfo, 'dst_account');

    if (myDupl.length)
    {
        // Error Code
        logger.error("chkMultiTxTokenContract - Duplicated dst_account");
        return retVal;
    }

    //
    let totAmount = '0';

    await util.asyncForEach(myTxInfo, async(element, index) => {
        let myDstAccount = util.hexStrToBigInt(element.dst_account);
        let myAmount = element.amount;

        //
        uToAccountInfo = await dbNNHandler.getUserAccountByAccountNum(myDstAccount);

        if (uToAccountInfo === false)
        {
            logger.error("chkMultiTxTokenContract - None User Account Info");
            return retVal;
        }
        else
        {
            let toAccount = uToAccountInfo.account_num;
            logger.debug("toAccount: " + toAccount);
            let toAccountHexStr = BigInt(toAccount).toString(16);

            if (fromAccount === toAccount) {
                logger.error("chkMultiTxTokenContract - Check fromAccount & toAccount");
                return retVal;
            }
            else {
                // Check Decimal Point
                let splitAmount = util.chkDecimalPoint(myAmount);
                
                logger.debug('splitAmount.length : ' + splitAmount.length);
                logger.debug('splitAmount[1].length : ' + splitAmount[1].length);

                if (splitAmount.length !== 2)
                {
                    logger.error("chkMultiTxTokenContract - No amount decimal_point");
                    return retVal;
                }
                else if (splitAmount[1].length !== tokenAccount[0].decimal_point)
                {
                    logger.error("chkMultiTxTokenContract - invalid amount decimal_point length");
                    return retVal;
                }

                if (tokenAccount[0].black_list) {
                    let blackListAll = JSON.parse(tokenAccount[0].black_list);
                    let blackListAccNum = blackListAll.black_acc_num_list;
                    logger.debug("blackListAccNum: " + blackListAccNum)
                    if (blackListAccNum) {
                        let isToAccountOnBlackList = blackListAccNum.indexOf(toAccountHexStr);
                        if (isToAccountOnBlackList > -1 && toAccountHexStr == blackListAccNum[isToAccountOnBlackList]) {
                            logger.error("chkMultiTxTokenContract - User To Account is on Black List");
                            return retVal;
                        }
                    }
                    // else {
                    //     //
                    //     totAmount = util.calNum(totAmount, '+', myAmount, tokenAccount[0].decimal_point);
                    //     logger.info('totAmount : ' + totAmount);
                    // }
                }
                // else
                // {
                //     //
                //     totAmount = util.calNum(totAmount, '+', myAmount, tokenAccount[0].decimal_point);
                //     logger.info('totAmount : ' + totAmount);
                // }
                totAmount = util.calNum(totAmount, '+', myAmount, tokenAccount[0].decimal_point);
                logger.info('totAmount : ' + totAmount);
            }
        }
    });

    //
    if (contractJson.contents.total_amount !== totAmount)
    {
        logger.error("chkMultiTxTokenContract - Different total_amount : " + contractJson.contents.total_amount + ', ' + totAmount);
        return retVal;
    }

    // Check From Account
    let fAccount;

    if(fAccountDeli === define.CONTRACT_DEFINE.ACCOUNT_TOKEN_DELI)
    {
        fAccount = await dbNNHandler.accountTokenAccountCheck(fromAccount);
    }
    else if(fAccountDeli <= define.CONTRACT_DEFINE.ACCOUNT_USER_DELI_MAX)
    {
        fAccount = await dbNNHandler.accountUserAccountNumCheck(fromAccount);
    }
    else
    {
        logger.error("chkMultiTxTokenContract - fromAccount : No Account");
        return retVal;
    }

    if(fAccount.length)
    {
        let fa_owner_pk = fAccount[0].owner_pk;
        //
        if (contractJson.signed_pubkey !== fa_owner_pk)
        {
            logger.debug ("contractJson.signed_pubkey : " + contractJson.signed_pubkey);
            logger.debug ("fa_owner_pk : " + fa_owner_pk);
            logger.error("chkMultiTxTokenContract - signed_pubkey");
            return retVal;
        }

        //
        logger.debug ("contractJson.from_account : " + contractJson.from_account.toString());
        if (contractJson.from_account === define.CONTRACT_DEFINE.SEC_TOKEN_ACCOUNT)
        {
            logger.debug ("SECURITY TOKEN DISTRIBUTTED BY TOKEN ACCOUNT");

            logger.error("chkMultiTxTokenContract - Multi Transaction is NOT Support SEC_TOKEN_ACCOUNT");
            return retVal;
        }
        else
        {
            logger.debug ("TOKEN DISTRIBUTTED BY USER ACCOUNT OR TOKEN ACCOUNT");
            let fAccountLeger = await dbNNHandler.accountLegerCheck(fromAccount, action);

            if (!fAccountLeger.length)
            {
                logger.error("chkMultiTxTokenContract - account_ledger");
                return retVal;
            }
            else if (!BigInt(tokenAccount[0].blk_num))
            {
                logger.error("chkMultiTxTokenContract - account_ledger blk_num");
                return retVal;
            }
    
            logger.debug('fAccountLeger[0].balance : ' + fAccountLeger[0].balance + ', totAmount : ' + totAmount);
            let balVal = util.balNum(fAccountLeger[0].balance, totAmount, tokenAccount[0].decimal_point);
            if (balVal === false)
            {
                logger.error("chkMultiTxTokenContract - balance");
                return retVal;
            }
        }
    }
    else
    {
        logger.error("chkMultiTxTokenContract - fromAccount");
        return retVal;
    }

    retVal = define.ERR_CODE.SUCCESS;

    return retVal;
}

//
const chkTxSecTokenContract = async(contractJson) => {
    let retVal = define.ERR_CODE.ERROR;

    //
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TX_ST.AMOUNT)))
    {
        logger.error("chkTxSecTokenContract - Contents");
        return retVal;
    }

    retVal = await chkTxTokenContract(contractJson);
    if (retVal !== define.ERR_CODE.SUCCESS)
    {
        return retVal;
    }

    return define.ERR_CODE.SUCCESS;
}

const chkTxUtilTokenContract = async(contractJson) => {
    let retVal = define.ERR_CODE.ERROR;

    //
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TX_UT.DST_ACCOUNT)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TX_UT.AMOUNT)))
    {
        logger.error("chkTxUtilTokenContract - Contents");
        return retVal;
    }

    retVal = await chkTxTokenContract(contractJson);
    if (retVal !== define.ERR_CODE.SUCCESS)
    {
        return retVal;
    }

    return define.ERR_CODE.SUCCESS;
}

const chkTokenTxContract = async(contractJson) => {
    let retVal = define.ERR_CODE.ERROR;

    // //
    // logger.debug('action : ' + contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_TX.ACTION));
    // logger.debug('AMOUNT : ' + contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_TX.AMOUNT));
    // logger.debug('DST_ACCOUNT : ' + contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_TX.DST_ACCOUNT));
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_TX.ACTION)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_TX.AMOUNT)))
    {
        logger.error("chkTokenTxContract - Contents 1");
        return retVal;
    }
    
    // Utility Token
    if (BigInt(contractJson.contents.action))
    {
        if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_TX.DST_ACCOUNT)))
        {
            logger.error("chkTokenTxContract - Contents 2");
            return retVal;
        }
    }

    retVal = await chkTxTokenContract(contractJson);
    if (retVal !== define.ERR_CODE.SUCCESS)
    {
        return retVal;
    }

    return define.ERR_CODE.SUCCESS;
}

const chkTokenMultiTxContract = async(contractJson) => {
    let retVal = define.ERR_CODE.ERROR;

    //
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_MULTI_TX.ACTION)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_MULTI_TX.TOKEN_ACCOUNT)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_MULTI_TX.TOTAL_AMOUNT)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TOKEN_MULTI_TX.TX_INFO)))
    {
        logger.error("chkTokenMultiTxContract - Contents");
        return retVal;
    }

    retVal = await chkMultiTxTokenContract(contractJson);
    if (retVal !== define.ERR_CODE.SUCCESS)
    {
        return retVal;
    }

    return define.ERR_CODE.SUCCESS;
}

const chkCreateTokenContract = async(contractJson) => {
    let fromAccount = util.hexStrToBigInt(contractJson.from_account);
    let toAccount = util.hexStrToBigInt(contractJson.to_account);

    //
    if (fromAccount || toAccount)
    {
        logger.error("chkCreateTokenContract - Account");
        return define.ERR_CODE.ERROR;
    }

    //
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.OWNER_PK)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.SUPER_PK)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.ACTION)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.NAME)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.SYMBOL)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.TOTAL_SUPPLY)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.DECIMAL_POINT)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.LOCK_TIME_FROM)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.LOCK_TIME_TO)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.LOCK_TRANSFER)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.BLACK_LIST)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.FUNC)))
    {
        logger.error("chkCreateTokenContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    //
    let totalSupply = contractJson.contents.total_supply;
    let decimalPoint = contractJson.contents.decimal_point;

    //
    if ((decimalPoint <= 0) || (decimalPoint > define.CONTRACT_DEFINE.MAX_DECIMAL_POINT))
    {
        logger.error("chkCreateTokenContract - decimalPoint");
        return define.ERR_CODE.ERROR;
    }
    
    //
    let splitTotalSupply = util.chkDecimalPoint(totalSupply);
    if ((splitTotalSupply.length !== 2) || (splitTotalSupply[1].length !== decimalPoint))
    {
        logger.error("chkCreateTokenContract - totalSupply");
        return define.ERR_CODE.ERROR;
    }

    //
    let ownerPk = contractJson.contents.owner_pk;
    let superPk = contractJson.contents.super_pk;

    //
    let signedPubkey = contractJson.signed_pubkey;
    if (signedPubkey != superPk)
    {
        logger.error("chkLockTokenContract - Signed Pubkey");
        return define.ERR_CODE.ERROR;
    }

    // Check token account
    let tokenAccount = await dbNNHandler.accountTokenCheck(contractJson.contents.action)//, contractJson.contents.name, contractJson.contents.symbol);
    let tokenAccountKey =await dbNNHandler.accountTokenKeyCheck(ownerPk, superPk);

    if (tokenAccount.length || tokenAccountKey.length)
    {
        logger.error("chkCreateTokenContract - Already Existed");
        return define.ERR_CODE.ERROR;
    }

    return define.ERR_CODE.SUCCESS;
}

//
const chkLockTokenContract = async(contractJson) => {
    // Check user and token account
    let tokenAccount = await dbNNHandler.accountTokenCheck(contractJson.contents.action);
    if (!tokenAccount.length)
    {
        logger.error("chkLockTokenContract - No Token Account");
        return define.ERR_CODE.ERROR;
    }

    //
    let signedPubkey = contractJson.signed_pubkey;
    if (signedPubkey !== tokenAccount[0].super_pk)
    {
        logger.error("chkLockTokenContract - Signed Pubkey");
        return define.ERR_CODE.ERROR;
    }

    //
    let fromAccount = BigInt(util.hexStrToBigInt(contractJson.from_account));
    let toAccount = BigInt(util.hexStrToBigInt(contractJson.to_account));
    let tokenAccountNum = BigInt(tokenAccount[0].account_num);

    if ((fromAccount !== tokenAccountNum) || (toAccount !== tokenAccountNum))
    {
        logger.error("chkLockTokenContract - fromAccount || toAccount");
        logger.error("fromAccount : " + fromAccount + ", toAccount : " + toAccount + ", account_num : " + tokenAccountNum);
        return define.ERR_CODE.ERROR;
    }

    return define.ERR_CODE.SUCCESS;
}

//
const chkChangeTokenPubkeyContract = async(contractJson) => {
    let retVal;

    //
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.OWNER_PK)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.SUPER_PK)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_TOKEN.ACTION)))
    {
        logger.error("chkChangeTokenPubkeyContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    //
    let ownerPk = contractJson.contents.owner_pk;
    let superPk = contractJson.contents.super_pk;

    // 
    let tokenAccountKey =await dbNNHandler.accountTokenKeyCheck(ownerPk, superPk);

    if (tokenAccountKey.length)
    {
        logger.error("chkCreateTokenContract - Already Existed Keys");
        return define.ERR_CODE.ERROR;
    }

    //
    retVal = await chkLockTokenContract(contractJson);

    return retVal;
}

//
const chkLockTokenTxContract = async(contractJson) => {
    let retVal;
    
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.LOCK_TOKEN_TX.ACTION)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.LOCK_TOKEN_TX.LOCK)))
    {
        logger.error("chkLockTokenTxContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    //
    if ((contractJson.contents.lock < define.CONTRACT_DEFINE.LOCK_TOKEN_TX.UNLOCK) 
        || (contractJson.contents.lock > define.CONTRACT_DEFINE.LOCK_TOKEN_TX.LOCK_EXC_OWNER))
    {
        logger.error("chkLockTokenTxContract - lock");
        return define.ERR_CODE.ERROR;
    }

    //
    retVal = await chkLockTokenContract(contractJson);

    return retVal;
}

//
const chkLockTokenTimeContract = async(contractJson) => {
    let retVal;
    
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.LOCK_TOKEN_TIME.ACTION)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.LOCK_TOKEN_TIME.LOCK_TIME_FROM)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.LOCK_TOKEN_TIME.LOCK_TIME_TO)))
    {
        logger.error("chkLockTokenTimeContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    //
    let curTm = new util.getDateMS();
    if (contractJson.contents.lock_time_from !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
    {
        if (contractJson.contents.lock_time_from <= curTm)
        {
            logger.error("chkLockTokenTxContract - lock_time_from");
            return define.ERR_CODE.ERROR;
        }

        if (contractJson.contents.lock_time_to !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
        {
            if (contractJson.contents.lock_time_from >= contractJson.contents.lock_time_to)
            {
                logger.error("chkLockTokenTxContract - lock_time_from >= lock_time_to");
                return define.ERR_CODE.ERROR;
            }
        }
    }

    if (contractJson.contents.lock_time_to !== define.CONTRACT_DEFINE.LOCK_TOKEN_TIME.UNLOCK)
    {
        if (contractJson.contents.lock_time_to <= curTm)
        {
            logger.error("chkLockTokenTxContract - lock_time_to");
            return define.ERR_CODE.ERROR;
        }
    }

    //
    retVal = await chkLockTokenContract(contractJson);

    return retVal;
}

//
const chkLockTokenWalletContract = async(contractJson) => {
    let retVal;
    
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.LOCK_TOKEN_WALLET.ACTION)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.LOCK_TOKEN_WALLET.PK_LIST)))
    {
        logger.error("chkLockTokenWalletContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    //
    retVal = await chkLockTokenContract(contractJson);

    return retVal;
}

//
const chkAddUserContract = async(contractJson) => {
    let fromAccount = util.hexStrToBigInt(contractJson.from_account);
    let toAccount = util.hexStrToBigInt(contractJson.to_account);

    if (fromAccount || toAccount)
    {
        logger.error("chkAddUserContract - Account");
        return define.ERR_CODE.ERROR;
    }
    
    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.ADD_USER.OWNER_PK)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.ADD_USER.SUPER_PK)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.ADD_USER.ACCOUNT_ID)))
    {
        logger.error("chkAddUserContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    let ownerPk = contractJson.contents.owner_pk;
    let superPk = contractJson.contents.super_pk;
    let accountId = contractJson.contents.account_id;

    //
    let signedPubkey = contractJson.signed_pubkey;
    if (signedPubkey !== superPk)
    {
        logger.error("chkChangeUserContract - Signed Pubkey");
        return define.ERR_CODE.ERROR;
    }

    // Check account id
    let regexResult = define.REGEX.ID_REGEX.test(accountId);
    if(!regexResult)
    {
        logger.error("chkAddUserContract - Invalid ID");
        return define.ERR_CODE.ERROR;
    }
    
    // Check user and token account
    let userAccount = await dbNNHandler.accountUserCheck(ownerPk, superPk, accountId);
    let tokenAccountKey =await dbNNHandler.accountTokenKeyCheck(ownerPk, superPk);

    if (userAccount.length || tokenAccountKey.length)
    {
        logger.error("chkAddUserContract - Already Existed");
        return define.ERR_CODE.ERROR;
    }

    return define.ERR_CODE.SUCCESS;
}

//
const chkChangeUserContract = async(contractJson) => {
    // Check user and token account
    let userAccount = await dbNNHandler.accountUserAccountIdCheck(contractJson.contents.account_id);
    if (!userAccount.length)
    {
        logger.error("chkChangeUserContract - No User Account");
        return define.ERR_CODE.ERROR;
    }

    //
    let signedPubkey = contractJson.signed_pubkey;
    if (signedPubkey !== userAccount[0].super_pk)
    {
        logger.error("chkChangeUserContract - Signed Pubkey");
        return define.ERR_CODE.ERROR;
    }

    //
    let fromAccount = BigInt(util.hexStrToBigInt(contractJson.from_account));
    let toAccount = BigInt(util.hexStrToBigInt(contractJson.to_account));
    let userAccountNum = BigInt(userAccount[0].account_num);

    if ((fromAccount !== userAccountNum) || (toAccount !== userAccountNum))
    {
        logger.error("chkChangeUserContract - fromAccount || toAccount");
        logger.error("fromAccount : " + fromAccount + ", toAccount : " + toAccount + ", account_num : " + userAccountNum);
        return define.ERR_CODE.ERROR;
    }

    return define.ERR_CODE.SUCCESS;
}
//
const chkChangeUserPubkeyContract = async(contractJson) => {
    let retVal;

    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CHANGE_USER_PK.OWNER_PK)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CHANGE_USER_PK.SUPER_PK)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CHANGE_USER_PK.ACCOUNT_ID)))
    {
        logger.error("chkChangeUserPubkeyContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    //
    let ownerPk = contractJson.contents.owner_pk;
    let superPk = contractJson.contents.super_pk;

    // Check user account
    let userAccount = await dbNNHandler.accountUserKeyCheck(ownerPk, superPk)
    if (userAccount.length)
    {
        logger.error("chkChangeUserPubkeyContract - Already Existed Public Key");
        return define.ERR_CODE.ERROR;
    }

    //
    retVal = await chkChangeUserContract(contractJson);

    return retVal;
}

//
const chkCreateScContract = async(contractJson) => {

    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_SC.SC_ACTION)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_SC.ACTION_TARGET)
        && contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.CREATE_SC.SC)))
    {
        logger.error("chkCreateScContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    //
    let sc_action = contractJson.contents.sc_action;
    let action_target = contractJson.contents.action_target;
    let sc = contractJson.contents.sc;

    if(!util.isJsonString(sc))
    {
        logger.error("chkCreateScContract - Invalid sc json value");
        return define.ERR_CODE.ERROR;
    }

    //
    if ((sc_action < define.CONTRACT_DEFINE.ACTIONS.CONTRACT.SC.STT) ||
        (sc_action > define.CONTRACT_DEFINE.ACTIONS.CONTRACT.SC.END))
    {
        logger.error("chkCreateScContract - Invalid scAction Range");
        return define.ERR_CODE.ERROR;
    }

    //
    let scActionAccount = await dbNNHandler.accountScActionCheck(sc_action);
    logger.debug("scActionAccount : " + scActionAccount);
    if (scActionAccount)
    {
        logger.error("chkCreateScContract - Invalid scAction 1");
        return define.ERR_CODE.ERROR;
    }

    //
    if (action_target <= define.CONTRACT_DEFINE.ACTIONS.TOKEN.UTILITY_TOKEN_MAX)
    {
        let tokenAccount = await dbNNHandler.accountTokenCheck(action_target);
        // logger.debug("tokenAccount.length : " + tokenAccount.length);
        if (!tokenAccount.length)
        {
            logger.error("chkCreateScContract - Invalid Action");
            return define.ERR_CODE.ERROR;
        }

        // logger.debug("tokenAccount[0].owner_pk : " + tokenAccount[0].owner_pk);
        // logger.debug("contractJson.signed_pubk : " + contractJson.signed_pubkey);
        if (tokenAccount[0].owner_pk !== contractJson.signed_pubkey)
        {
            logger.error("chkCreateScContract - Invalid Signed Public Key");
            return define.ERR_CODE.ERROR;
        }
    }
    else
    {
        logger.error("chkCreateScContract - Invalid Action Target Range");
        return define.ERR_CODE.ERROR;
    }

    return define.ERR_CODE.SUCCESS;
}

//
const chkTransferScContract = async(contractJson) => {
    logger.debug("chkTransferScContract");

    if (!(contractJson.contents.hasOwnProperty(define.CONTRACT_DEFINE.CONTENTS_PROPERTY.TRANSFER_SC.SC)))
    {
        logger.error("chkTransferScContract - Contents");
        return define.ERR_CODE.ERROR;
    }

    //
    logger.debug('contractJson: ' + JSON.stringify(contractJson));
    
    let sc = contractJson.contents.sc;
    if(!util.isJsonString(sc))
    {
        logger.error("chkTransferScContract - Invalid sc json value");
        return define.ERR_CODE.ERROR;
    }

    //
    let sc_action = contractJson.action;
    // check sc_action range
    if ((sc_action < define.CONTRACT_DEFINE.ACTIONS.CONTRACT.SC.STT) ||
        (sc_action > define.CONTRACT_DEFINE.ACTIONS.CONTRACT.NFT.END))
    {
        logger.error("chkTransferScContract - Invalid scAction Range");
        return define.ERR_CODE.ERROR;
    }

    //
    let scActionAccount = await dbNNHandler.accounScActionAndTargetCheck(sc_action);
    logger.debug("scActionAccount : " + JSON.stringify(scActionAccount));
    if (!scActionAccount.length)
    {
        logger.error("chkCreateScContract - Invalid scAction 2");
        return define.ERR_CODE.ERROR;
    }

    // check toAccount
    let toAccountBInt = util.hexStrToBigInt(contractJson.to_account);
    logger.debug('contractJson - to_account_num to bigint: ' + toAccountBInt);

    let userToAccount = await dbNNHandler.accountUserAccountNumCheck(toAccountBInt);
    if (!userToAccount.length)
    {
        logger.error("chkTransferScContract - No User - toAccount");
        return define.ERR_CODE.ERROR;
    }
    

    // minting or tx
    let fromAccountBInt = util.hexStrToBigInt(contractJson.from_account);
    
    //
    if (!fromAccountBInt) {
        logger.info("contractChecker / sc transfer -- MINTING");
        let action_target = scActionAccount[0].action_target;
    
        let tokenAccount = await dbNNHandler.accountTokenCheck(action_target);
        // logger.debug("tokenAccount.length : " + tokenAccount.length);
        if (!tokenAccount.length)
        {
            logger.error("chkCreateScContract - Invalid Action");
            return define.ERR_CODE.ERROR;
        }
    
        logger.debug("tokenAccount[0].owner_pk : " + tokenAccount[0].owner_pk);
        logger.debug("contractJson.signed_pubkey : " + contractJson.signed_pubkey);

        if (tokenAccount[0].owner_pk !== contractJson.signed_pubkey)
        {
            logger.error("chkCreateScContract - Invalid Signed Public Key");
            return define.ERR_CODE.ERROR;
        }

    } else {

        //
        logger.info("contractChecker / sc transfer -- USER to USER");

        // check fromAccount
        let userFromAccount = await dbNNHandler.accountUserAccountNumCheck(fromAccountBInt);
        if (!userFromAccount.length)
        {
            logger.error("chkTransferScContract - No User - fromAccount");
            return define.ERR_CODE.ERROR;
        }
        let signedPubkey = contractJson.signed_pubkey;
        if (signedPubkey !== userFromAccount[0].super_pk)
        {
            logger.error("chkTransferScContract - Signed Pubkey");
            return define.ERR_CODE.ERROR;
        }

        //
        // check the recent owner of NFT
        let scAction = contractJson.action;
        let scParse = JSON.parse(sc);
        let subId = scParse.sub_id;

        logger.debug(`fromAccountNum: ${fromAccountBInt}, scAction: ${scAction}, subId: ${subId}`);
        let chkRecentTx = await dbNNHandler.getUserNftInfobyScActionSubId(fromAccountBInt, scAction, subId);
        logger.debug("chkRecentTx: " + JSON.stringify(chkRecentTx));
        let ownerAccount = chkRecentTx[0].owner_acc_num;

        logger.info("userFromAccount[0].account_num: " + userFromAccount[0].account_num);
        logger.info("ownerAccount: " + ownerAccount);

        if (userFromAccount[0].account_num !== ownerAccount) {
            logger.error("chkTransferScContract - Not Recent Owner // compared account_num");
            return define.ERR_CODE.ERROR;
        }
    }

    return define.ERR_CODE.SUCCESS;
}

// Check Account
module.exports.chkContract = async (contractJson) => {
    let retVal = define.ERR_CODE.ERROR;

    //
    if (contractJson.action <= define.CONTRACT_DEFINE.ACTIONS.TOKEN.SECURITY_TOKEN)
    {
        retVal = await chkTxSecTokenContract(contractJson);
    }
    else if (contractJson.action <= define.CONTRACT_DEFINE.ACTIONS.TOKEN.UTILITY_TOKEN_MAX)
    {
        retVal = await chkTxUtilTokenContract(contractJson);
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_CREATION)
    {
        retVal = await chkCreateTokenContract(contractJson);
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.EXE_FUNC)
    {
        //
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.CHANGE_TOKEN_PUBKEY)
    {
        retVal = await chkChangeTokenPubkeyContract(contractJson);
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.TOKEN_TX)
    {
        if (contractJson.to_account === define.CONTRACT_DEFINE.TO_DEFAULT)
        {
            retVal = await chkTokenMultiTxContract(contractJson);
        }
        else
        {
            retVal = await chkTokenTxContract(contractJson);
        }
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.LOCK_TOKEN_TX)
    {
        retVal = await chkLockTokenTxContract(contractJson);
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.LOCK_TOKEN_TIME)
    {
        retVal = await chkLockTokenTimeContract(contractJson);
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.LOCK_TOKEN_WALLET)
    {
        retVal = await chkLockTokenWalletContract(contractJson);
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.ADD_USER)
    {
        retVal = await chkAddUserContract(contractJson);
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.CHANGE_USER_PUBKEY)
    {
        retVal = await chkChangeUserPubkeyContract(contractJson);
    }
    else if (contractJson.action === define.CONTRACT_DEFINE.ACTIONS.CONTRACT.DEFAULT.CREATE_SC)
    {
        retVal = await chkCreateScContract(contractJson);
    }
    else if ((contractJson.action >= define.CONTRACT_DEFINE.ACTIONS.CONTRACT.SC.STT) &&
            (contractJson.action <= define.CONTRACT_DEFINE.ACTIONS.CONTRACT.NFT.END))
    {
        retVal = await chkTransferScContract(contractJson);
    }
    // else
    // {
    //     // For test
    //     retVal = define.ERR_CODE.SUCCESS;
    // }

    return retVal;
}
