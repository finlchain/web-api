const express = require("express");
const controller = require("../controllers/cliUserControllers.js");
const router = express.Router();

// POST
// 4. 지갑 정보 요청 API
router.post("/wallet/info", controller.chkWalletInfo);

module.exports = router;