const config = require("./config.js");

const ENABLED = true;
const DISABLED = false;

module.exports.ERR_CODE ={
    ERROR : -1,
    SUCCESS : 1
}

module.exports.ERR_MSG ={
    //
    SUCCESS : {
        CODE : 0, 
        MSG : "Succeed"
    },  
    ERR_NO_DATA : {
        CODE : 3000,
        MSG : "No Data"
    },  
    ERR_INVALID_DATA : {
        CODE : 3001, 
        MSG : "Invalid Data"
    }, 
    ERR_EXIST_DATA : {
        CODE : 3001, 
        MSG : "Existed Data"
    }, 
    ERR_CONTRACT : {
        CODE : 3002, 
        MSG : "Invalid Contract"
    }, 
    ERR_PUBKEY : {
        CODE : 3003, 
        MSG : "Invalid Pubkey"
    }, 
    ERR_PUBKEY_LEN : {
        CODE : 3004, 
        MSG : "Invalid Pubkey Length"
    }, 
    ERR_PUBKEY_DELI : {
        CODE : 3005, 
        MSG : "Invalid Pubkey Delimiter"
    }, 
    ERR_VERIFY_SIG : {
        CODE : 3006, 
        MSG : "Failed Signature Verification"
    },
    ERR_EXIST_PUBKEY : {
        CODE : 3007, 
        MSG : "Existed Pubkey"
    },
    //
    //
    ERR_TOKEN : {
        CODE : 3010, 
        MSG : "Invalid Token"
    }, 
    ERR_EXIST_TOKEN : {
        CODE : 3011, 
        MSG : "Existed Token"
    }, 
    ERR_TOKEN_INFO : {
        CODE : 3012, 
        MSG : "Invalid Token Information"
    }, 
    ERR_TOKEN_BALANCE : {
        CODE : 3013, 
        MSG : "Invalid Token Balance"
    }, 
    //
    ERR_LOCK_TOKEN_TX : {
        CODE : 3014, 
        MSG : "Token Lock Policy - TX"
    },
    ERR_LOCK_TOKEN_TIME : {
        CODE : 3015, 
        MSG : "Token Lock Policy - TIME"
    },
    ERR_LOCK_TOKEN_WALLET : {
        CODE : 3016, 
        MSG : "Token Lock Policy - WALLET"
    },
    //
    ERR_ACCOUNT : {
        CODE : 3020, 
        MSG : "Invalid Account"
    }, 
    //
    ERR_SC_ACTION : {
        CODE : 3030, 
        MSG : "Invalid SC Action"
    }, 
    ERR_SC_ACTION_RANGE : {
        CODE : 3031, 
        MSG : "Invalid SC Action Range"
    }, 
    ERR_EXIST_SC_ACTION : {
        CODE : 3032, 
        MSG : "Exist SC Action"
    }, 
    //
    ERR_ENCRYPT : {
        CODE : 3100, 
        MSG : "Invalid Encryption"
    }, 
    ERR_DECRYPT : {
        CODE : 3101, 
        MSG : "Invalid Decryption"
    }, 
    //
    ERR_REGEX : {
        CODE : 3200, 
        MSG : "Invalid Regex"
    }, 
    //
    ERR_KAFKA_LIST : {
        CODE : 4000, 
        MSG : "CANNOT get Kafka Broker List"
    }, 
    ERR_KAFKA_TX : {
        CODE : 4001, 
        MSG : "CANNOT Transfer Message Through Kafka"
    }, 
    //
    ERR_JSON : {
        CODE : 4100, 
        MSG : "Invalid Json"
    }, 
    ERR_JSON_PARSE : {
        CODE : 4101, 
        MSG : "Invalid Json Parse"
    }, 
    ERR_JSON_PROPERTY : {
        CODE : 4102, 
        MSG : "None Json Property"
    }, 
    ERR_JSON_INVALID_PROPERTY : {
        CODE : 4103, 
        MSG : "None Json Invalid Property"
    }, 
    ERR_JSON_UNKNOWN_FORMAT : {
        CODE : 4104, 
        MSG : "Unknown Json Format"
    }, 
    ERR_DATABASE : {
        CODE : 4500, 
        MSG : "Database Error"
    }, 
    //
    ERR_UNKNOWN : {
        CODE : 9999, 
        MSG : "Unknown"
    }
}


module.exports.NODE_ROLE = {
    STR : {
        NN : 'NN',
        DN : 'DN',
        DBN : 'DBN',
        SCA : 'SCA',
        ISAG: 'ISAg',
        RN : 'RN',
        BN : 'BN'
    },
    NUM : {
        NN: 0,
        // DN: 1,
        DBN: 2,
        ISAG: 4
    },
}

module.exports.USER_STATUS = {
    LOGOUT : 0,
    LOGIN : 1
}

module.exports.PADDING_DELIMITER = {
    FRONT : 0,
    BACK : 1
}

module.exports.LENGTH = {
    P2P_ADDR_LEN : 16,
    TOPIC_NAME_PARSE_LEN : 12,
}

module.exports.INDEX = {
    TOPIC_NAME_SPLIT_START : 0,
    TOPIC_NAME_SPLIT_END : 12
}

module.exports.DATA_HANDLER = {
    status_cmd : {
        start : 'start',
        stop : 'stop',
    }, 
}

module.exports.SEC_DEFINE = {
    HASH_ALGO : "sha256",
    DIGEST : {
        HEX : 'hex',
        BASE64 : 'base64',
    },
    PUBLIC_KEY_LEN : 66,
    CURVE_NAMES : {
        ECDH_SECP256R1_CURVE_NAME : "prime256v1",
        ECDH_SECP256K1_CURVE_NAME : "secp256k1",
        EDDSA_CURVE_NAME : "ed25519",
        ECDSA_SECP256K1_CURVE_NAME : "secp256k1",
        ECDSA_SECP256R1_CURVE_NAME : "p256"
    },
    KEY_DELIMITER : {
        START_INDEX : 0,
        END_INDEX : 2,
        DELIMITER_LEN : 2,
        SECP256_COMPRESSED_EVEN_DELIMITER : "02",
        SECP256_COMPRESSED_ODD_DELIMITER : "03",
        SECP256_UNCOMPRESSED_DELIMITER : "04",
        ED25519_DELIMITER : "05",
    },
    SIGN : {
        R_START_INDEX : 0,
        R_LEN : 64,
        S_START_INDEX : 64,
        S_END_INDEX : 64
    },
    SIG_KIND : {
        ECDSA : "ECDSA",
        EDDSA : "EDDSA"
    },
    CONVERT_KEY : {
        COMPRESSED : "compressed",
        UNCOMPRESSED : "uncompressed"
    },
    // KEY_PURPOSE : {
    //     NET : "net",
    //     WALLET : "wallet"
    // }
}

module.exports.CONTRACT_DEFINE = {
    ED_PUB_IDX : '05',
    MAX_TX_CNT : 500,
    ACCOUNT_TOKEN_DELI : 1,
    ACCOUNT_USER_DELI_MIN : 2,
    ACCOUNT_USER_DELI_MAX : 7,
    MILLI_DECIMAL_POINT : 3,
    MICRO_DECIMAL_POINT : 6,
    NANO_DECIMAL_POINT : 9,
    MAX_DECIMAL_POINT : 9, // 4
    SEC_TOKEN_ACCOUNT : '1000000000000000',
    FROM_DEFAULT : '0000000000000000',
    TO_DEFAULT : '0000000000000000',
    FEE_DEFAULT : '0',
    ACTIONS : {
        // TOKEN
        TOKEN : {
            //
            SECURITY_TOKEN : config.CONTRACT_ACTIONS_JSON.TOKEN.SECURITY,
            // 
            UTILITY_TOKEN_PLATINUM_MAX : config.CONTRACT_ACTIONS_JSON.TOKEN.UTILITY_PLATINUM.END,
            UTILITY_TOKEN_GOLD_MAX : config.CONTRACT_ACTIONS_JSON.TOKEN.UTILITY_GOLD.END,
            UTILITY_TOKEN_MAX : config.CONTRACT_ACTIONS_JSON.TOKEN.UTILITY.END,
        }, 

        // CONTRACT
        CONTRACT : {
            // DEFAULT
            DEFAULT : {
                TOKEN_CREATION : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.TOKEN_CREATION,
                EXE_FUNC : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.EXE_FUNC,
                CHANGE_TOKEN_PUBKEY : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.CHANGE_TOKEN_PUBKEY,
                TOKEN_TX : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.TOKEN_TX,
        
                LOCK_TOKEN_TX : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.LOCK_TOKEN_TX,
                LOCK_TOKEN_TIME : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.LOCK_TOKEN_TIME,
                LOCK_TOKEN_WALLET : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.LOCK_TOKEN_WALLET,
        
                // 
                ADD_USER : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.ADD_USER, 
                CHANGE_USER_PUBKEY : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.CHANGE_USER_PUBKEY, 
        
                //
                CREATE_SC : config.CONTRACT_ACTIONS_JSON.CONTRACT.DEFAULT.CREATE_SC, 
            }, 

            // PURI
            PURI : {
                STT : config.CONTRACT_ACTIONS_JSON.CONTRACT.PURI.STT, 
                END : config.CONTRACT_ACTIONS_JSON.CONTRACT.PURI.END, 
            }, 

            // SC
            SC : {
                STT : config.CONTRACT_ACTIONS_JSON.CONTRACT.SC.STT, 
                END : config.CONTRACT_ACTIONS_JSON.CONTRACT.SC.END,
            }, 
        }, 
        
        // NOTICE
        NOTICE : {
            STT : config.CONTRACT_ACTIONS_JSON.NOTICE.STT, 
            END : config.CONTRACT_ACTIONS_JSON.NOTICE.END, 
        }, 

        NONE : config.CONTRACT_ACTIONS_JSON.NOTICE.END, 
    },
    FINTECH : {
        NON_FINANCIAL_TX : '0',
        FINANCIAL_TX : '1',
    },
    PRIVACY : {
        PUBLIC : '0',
        PRIVATE : '1'
    },
    CONTRACT_PROPERTY : {
        REVISION : "revision",
        PREV_KEY_ID : "prev_key_id",
        CREATE_TM : "create_tm",
        FINTECH : "fintech",
        PRIVACY : "privacy",
        FEE : "fee",
        FROM_ACCOUNT : "from_account",
        TO_ACCOUNT : "to_account",
        ACTION : "action",
        CONTENTS : "contents",
        MEMO : "memo",
        SIG : "sig",
        SIGNED_PUPKEY : "signed_pubkey"
    },
    CONTENTS_PROPERTY : {
        TX : {
            DST_ACCOUNT : "dst_account", 
            AMOUNT : "amount"
        }, 
        TX_ST : {
            AMOUNT : "amount"
        }, 
        TX_UT : {
            DST_ACCOUNT : "dst_account", 
            AMOUNT : "amount"
        }, 
        TOKEN_TX : {
            ACTION : "action",
            DST_ACCOUNT : "dst_account", 
            AMOUNT : "amount"
        }, 
        LOCK_TOKEN_TX : {
            ACTION : "action",
            LOCK : "lock"
        }, 
        LOCK_TOKEN_TIME : {
            ACTION : "action",
            LOCK_TIME_FROM : "lock_time_from",
            LOCK_TIME_TO : "lock_time_to"
        }, 
        LOCK_TOKEN_WALLET : {
            ACTION : "action",
            PK_LIST : "pk_list"
        }, 
        ADD_USER : {
            OWNER_PK : "owner_pk",
            SUPER_PK : "super_pk",
            ACCOUNT_ID : "account_id"
        }, 
        CHANGE_USER_PK : {
            OWNER_PK : "owner_pk",
            SUPER_PK : "super_pk",
            ACCOUNT_ID : "account_id"
        }, 
        CREATE_TOKEN : {
            OWNER_PK : "owner_pk",
            SUPER_PK : "super_pk",
            ACTION : "action",
            NAME : "name", 
            SYMBOL : "symbol",
            TOTAL_SUPPLY : "total_supply",
            DECIMAL_POINT : "decimal_point",
            LOCK_TIME_FROM : "lock_time_from",
            LOCK_TIME_TO : "lock_time_to",
            LOCK_TRANSFER : "lock_transfer",
            BLACK_LIST : "decimal_point",
            FUNC : "functions"
        }, 
        CHANGE_TOKEN_PK : {
            OWNER_PK : "owner_pk",
            SUPER_PK : "super_pk",
            ACTION : "action"
        }, 
        CREATE_SC : {
            SC_ACTION : "sc_action",
            ACTION_TARGET : "action_target",
            SC : "sc"
        }
    },
    LOCK_TOKEN_TX : {
        UNLOCK : 0,
        LOCK_ALL : 1,
        LOCK_EXC_OWNER : 2, 
        MAX : 2
    },
    LOCK_TOKEN_TIME : {
        UNLOCK : "0"
    }
}

module.exports.START_MSG = "=================================================="
    + "\n= FINL Block Chain                               ="
    + "\n= [ webApi Ver : " + config.VERSION_INFO + "]                              ="
    + "\n==================================================";

//
// https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
module.exports.REGEX = {
    NEW_LINE_REGEX: /\n+/, 
    WHITE_SPACE_REGEX: /\s/, 
    IP_ADDR_REGEX: /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/, 
    HASH_REGEX: /^[a-z0-9+]{5,65}$/, 
    HEX_STR_REGEX: /^[a-fA-F0-9]+$/, 
    // ID_REGEX: /^(?=.*[A-Z])(?!.*[a-z])(?!.*[\s()|!@#\$%\^&\*])(?=.{4,})/, 
    ID_REGEX: /^([A-Z0-9_]){4,16}$/,
    PW_STRONG_REGEX : /^([a-zA-Z0-9!@$%^~*+=_-]){10,}$/, 
    PW_STRONG_COND_REGEX : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[])(?=.*[!@$%^~*+=_-]).{10,}$/, 
    // PW_STRONG_COND_REGEX : /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?!.*[~#&()<>?:{}])(?=.*[!@$%^~*+=_-]).{10,}$/, 
    PW_MEDIUM_REGEX : /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/, 
    FINL_ADDR_REGEX: /^(FINL){1}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1, }$/, 
    PURE_ADDR_REGEX: /^(PURE){1}[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1, }$/
}

module.exports.FIXED_VAL = { 
    ONE_SEC : 1,
    ONE_SEC_MS : 1000, 
    ONE_MIN_SEC : 60, 
    ONE_MIN_MS : 60000, 
    TEN_MIN_SEC : 600, 
    TEN_MIN_MS : 600000, 
    QUATER_HOUR_SEC : 900, 
    QUATER_HOUR_MS : 900000, 
    ONE_HOUR_SEC : 3600, 
    ONE_HOUR_MS : 3600000, 
    ONE_DAY_SEC : 86400, 
    ONE_DAY_MS  : 86400000, 
    THIRTY_DAY_MS : 2592000000, 

    MAX_PERIOD : 365, 
}

module.exports.INTERVAL = {
    MIN : 'MIN', 
    QUATER : 'QUATER', 
    HOUR : 'HOUR', 
    DAY : 'DAY', 
}

module.exports.COMMON_DEFINE = {
    PADDING_DELIMITER : {
        FRONT : 0,
        BACK : 1
    },
    ENABLED : ENABLED,
    DISABLED : DISABLED
}

module.exports.P2P_DEFINE = {
    P2P_SUBNET_ID_IS : '0001',
    P2P_CLUSTER_ID_IS : '0x000000000001',
    P2P_LEN : 14, // 0x123456789ABC
    P2P_ROOT_SPLIT_INDEX : {
        START : 10,
        END : 14
    },
    P2P_TOPIC_NAME_SPLIT_INDEX : {
        START : 2,
        END : 14
    }, 
    P2P_GPS_DECIMAL_POINT : 2
}
