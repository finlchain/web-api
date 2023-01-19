const express = require("express");
const controller = require("../controllers/dataAccountControllers.js");
const router = express.Router();

// POST
router.post("/balance", controller.getBalance);

// GET
router.get("/marketsupply", controller.getMarketSupply);
router.get("/trade/day", controller.getTradePerDay);
router.get("/trade/supply", controller.getTradeSupply);

router.get("/richlist", controller.getRichList);

router.get("/subnetid", controller.getSubNetId);
router.get("/list", controller.getAccountList);

router.get("/history", controller.getAccountHistory);

router.get("/chk/info", controller.chkAccountInfo);

router.get("/chk/cnt", controller.chkAccountCnt);

router.get("/nft", controller.chkNftInfo);

module.exports = router;