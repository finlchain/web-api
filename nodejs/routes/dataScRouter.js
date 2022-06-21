const express = require("express");
const controller = require("../controllers/dataScControllers.js");
const router = express.Router();

// GET
router.get("/txs/all", controller.getScTxsAll);
router.get("/txs/day", controller.getScTxsPerDay);
router.get("/txs/history", controller.getScTxsHistory);
router.get("/txs/info", controller.getTxsInfo);
router.get("/txs/cluster", controller.getTxsCluster);

router.get("/latest", controller.getLatestTxs);
router.get("/range", controller.getRange);

module.exports = router;
