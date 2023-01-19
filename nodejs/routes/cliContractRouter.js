const express = require("express");
const controller = require("../controllers/cliContractControllers.js");
const router = express.Router();

// POST
//
router.post("/tool/json", controller.toolJson);

// User
router.post("/user/add", controller.addUser);
router.post("/user/change/pubkey", controller.changeUserPubkey);

router.post("/add/user", controller.addUser); // deprecated
router.post("/change/user/pubkey", controller.changeUserPubkey); // deprecated

// Token
router.post("/token/create", controller.createToken);
router.post("/token/change/pubkey", controller.changeTokenPubkey);

router.post("/token/change/lock/Tx", controller.changeTokenLockTx);
router.post("/token/change/lock/Time", controller.changeTokenLockTime);
router.post("/token/change/lock/Wallet", controller.changeTokenLockWallet);

router.post("/token/tx", controller.txToken);
router.post("/token/multiTx", controller.multiTxToken);

router.post("/create/token", controller.createToken); // deprecated
router.post("/change/token/pubkey", controller.changeTokenPubkey); // deprecated

router.post("/change/token/lockTx", controller.changeTokenLockTx); // deprecated
router.post("/change/token/lockTime", controller.changeTokenLockTime); // deprecated
router.post("/change/token/lockWallet/", controller.changeTokenLockWallet); // deprecated

router.post("/tx/token", controller.txToken); // deprecated

// SC
router.post("/sc/create", controller.createSc);
router.post("/sc/tx", controller.txSc); 
router.post("/sc/mint", controller.mintSc); 

router.post("/create/sc", controller.createSc); // deprecated
router.post("/tx/sc", controller.txSc); // deprecated

// GET

module.exports = router;

