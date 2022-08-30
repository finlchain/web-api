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

// 7. 환불을 위한 권한 포기 API
router.post("/refund/node", controller.refundNft);
// 8. tx nft
// router.post("/tx/node", controller.txNft);

module.exports = router;