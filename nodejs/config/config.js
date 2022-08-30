//
const fs = require('fs');
const os = require('os');

//
const cryptoSsl = require("./../../../addon/crypto-ssl");

//
const NETCONF_JSON = JSON.parse(fs.readFileSync("./../../conf/netconf.json"));

//
module.exports.X_PRIKEY_PEM_PATH = "./../../conf/key/me/x_privkey.pem";
module.exports.X_PUBKEY_PEM_PATH = "./../../conf/key/me/x_pubkey.pem";

//
module.exports.KEY_PATH = {
    PW_SEED: NETCONF_JSON.DEF_PATH.PW_DB_ME + '/' + NETCONF_JSON.DB.PW.NAME.SEED, 
    PW_MARIA : NETCONF_JSON.DEF_PATH.PW_DB_ME + '/' + NETCONF_JSON.DB.PW.NAME.MARIA, 
    PW_REDIS : NETCONF_JSON.DEF_PATH.PW_DB_ME + '/' + NETCONF_JSON.DB.PW.NAME.REDIS, 
    IS_PUBKEY: NETCONF_JSON.DEF_PATH.KEY_REMOTE_IS + '/' + NETCONF_JSON.KEY.NAME.ED_PUBKEY, 
}

module.exports.CFG_PATH = {
    CONTRACT_ACTIONS : NETCONF_JSON.DEF_INFO.CONTRACT_ACTIONS, 
    NODE_CFG : NETCONF_JSON.DEF_INFO.NODE_CFG, 
    MARIA : {
        DB_HOST : NETCONF_JSON.DB.MARIA.HOST, 
        DB_PORT : NETCONF_JSON.DB.MARIA.PORT, 
        DB_USER : NETCONF_JSON.DB.MARIA.USER, 
        PW_MARIA : cryptoSsl.aesDecPw(this.KEY_PATH.PW_SEED, this.KEY_PATH.PW_MARIA),
    },
    REDIS : {
        HOST : NETCONF_JSON.DB.REDIS.HOST, 
        PORT : NETCONF_JSON.DB.REDIS.PORT, 
        PW_REDIS : cryptoSsl.aesDecPw(this.KEY_PATH.PW_SEED, this.KEY_PATH.PW_REDIS)
    },
    WEBAPI : {
        ISAG_PORT : NETCONF_JSON.WEBAPI.ISAG.PORT,
        FBN_PORT : NETCONF_JSON.WEBAPI.FBN.PORT,
    },
}

// Contract Actions
module.exports.CONTRACT_ACTIONS_JSON = JSON.parse(fs.readFileSync(this.CFG_PATH.CONTRACT_ACTIONS));

// Version info
module.exports.paddy = (num, padLen, padChar) => {
    var pad_char = typeof padChar !== 'undefined' ? padChar : '0';
    var pad = new Array(1 + padLen).join(pad_char);

    return (pad + num).slice(-pad.length);
}

const getVerInfo = () => {
    //
    let mainVerInfo = '0';
    let subVerInfo = '0';

    //
    let lineArr = fs.readFileSync(this.CFG_PATH.NODE_CFG).toString().split('\n');

    for (idx in lineArr)
    {
        if (lineArr[idx].includes('VER_INFO_MAIN'))
        {
            mainVerInfo = lineArr[idx].split(' ')[2];
        }
        else if (lineArr[idx].includes('VER_INFO_SUB'))
        {
            subVerInfo = lineArr[idx].split(' ')[2];
        }
    }

    let verInfo = mainVerInfo + '.' + this.paddy(subVerInfo, 4);

    return verInfo;
}

//
module.exports.VERSION_INFO = getVerInfo();

module.exports.IS_SIG_TYPE = this.KEY_PATH.IS_PUBKEY.includes("ed") ? "EDDSA" : "ECDSA";

// Redis
module.exports.REDIS_CONFIG = {
    host : this.CFG_PATH.REDIS.HOST,
    port : parseInt(this.CFG_PATH.REDIS.PORT),
    password : this.CFG_PATH.REDIS.PW_REDIS,
}

module.exports.MARIA_CONFIG = {
    host: this.CFG_PATH.MARIA.DB_HOST,
    port: this.CFG_PATH.MARIA.DB_PORT,
    user: this.CFG_PATH.MARIA.DB_USER,
    password : this.CFG_PATH.MARIA.PW_MARIA,
    supportBigNumbers: true,
    bigNumberStrings: true,
    connectionLimit : 10
}

// IP Control
module.exports.IP_ASSIGN = {
    CTRL: 0,
    DATA: 0,
    REPL: 0
};

//
module.exports.DB_TEST_MODE = false;
module.exports.CONTRACT_SIG_CHK_MODE = true;
module.exports.CONTRACT_TEST_MODE = false;

// ISAG URL
module.exports.ISAG_URL = "api.finlscan.org"; // '203.238.181.162'; // FINL
module.exports.ISAG_PORT = '3000';
if (os.hostname().includes('puri'))
{
    // module.exports.ISAG_URL = '220.86.111.197' // PURI
    // module.exports.ISAG_URL = "http://purichain.com"
    this.ISAG_URL = "www.purichain.com";
}
else if (os.hostname().includes('finlt'))
{
    this.ISAG_URL = "apih.finlscan.org"; // '203.238.181.164'; // FINLT
}
else if (os.hostname().includes('finld'))
{
    this.ISAG_URL = 'apid.finlscan.org'; // FINLD
}

module.exports.ISAG_CONFIG = {
    family : 4,
    host : this.ISAG_URL,
    port : this.ISAG_PORT,
    json : true,
    headers : {
        'Content-Type' : 'application/json'
    },
    timeout : 10000
}

// FBN URL
module.exports.FBN_URL = "api.finlscan.org"; // '203.238.181.162'; // FINL
module.exports.FBN_PORT = '4000';
if (os.hostname().includes('puri'))
{
    // module.exports.FBN_URL = '220.86.111.197' // PURI
    // module.exports.FBN_URL = "http://purichain.com"
    this.FBN_URL = "www.purichain.com";
}
else if (os.hostname().includes('finlt'))
{
    this.FBN_URL = "apih.finlscan.org"; // '203.238.181.164'; // FINLT
}
else if (os.hostname().includes('finld'))
{
    this.FBN_URL = 'apid.finlscan.org'; // FINLD
}

module.exports.FBN_CONFIG = {
    family : 4,
    host : this.FBN_URL,
    port : this.FBN_PORT,
    json : true,
    headers : {
        'Content-Type': 'application/json'
    },
    timeout: 10000
}

// FBN INTERNAL URL
module.exports.FBNIN_URL = "api.finlscan.org"; // '203.238.181.162'; // FINL
module.exports.FBNIN_PORT = '3000';
if (os.hostname().includes('puri'))
{
    // module.exports.FBN_URL = '220.86.111.197' // PURI
    // module.exports.FBN_URL = "http://purichain.com"
    this.FBNIN_URL = "www.purichain.com";
}
else if (os.hostname().includes('finlt'))
{
    this.FBNIN_URL = "apih.finlscan.org"; // '203.238.181.164'; // FINLT
}
else if (os.hostname().includes('finld'))
{
    this.FBNIN_URL = 'apid.finlscan.org'; // FINLD
}

module.exports.FBNIN_CONFIG = {
    family : 4,
    host : this.FBNIN_URL,
    port : this.FBNIN_PORT,
    json : true,
    headers : {
        'Content-Type': 'application/json'
    },
    timeout: 10000
}

module.exports.NFT_PORT = '14501';
module.exports.NFT_CONFIG = {
    family : 4,
    host : this.FBNIN_URL,
    port : this.NFT_PORT,
    json : true,
    headers : {
        'Content-Type': 'application/json'
    },
    timeout: 10000
}

module.exports.SCH_URL = '175.207.29.22'
module.exports.SCH_CONFIG = {
    family : 4,
    host : this.SCH_URL,
    port : this.NFT_PORT,
    json : true,
    headers : {
        'Content-Type': 'application/json'
    },
    timeout: 10000
}