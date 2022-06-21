const express = require("express");
const controller = require("../controllers/dataBlkControllers.js");
const router = express.Router();

// GET
//
router.get("/txcnt", controller.getBlkTxCnt);

router.get("/blkcnt", controller.getBlkCnt);

router.get("/blkinfo", controller.getBlkInfo);

router.get("/latest", controller.getLatestBlks);
router.get("/range", controller.getBlkRange);

module.exports = router;