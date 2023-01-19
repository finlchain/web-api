const express = require("express");
const controller = require("../controllers/cliNodeNftContractControllers.js");
const router = express.Router();

// POST
// 0. NFT Heartbeat
router.post("/heartbeat", controller.heartbeat);
// 5. NFT Minting 요청 API
router.post("/mint/node", controller.txMintNode);
// 6. user NFT 결과 확인 API
router.post("/chk/node", controller.chkUserNFT);

module.exports = router;