const express = require("express");
const controller = require("../controllers/ctrlNetControllers.js");
const router = express.Router();

// GET
router.get("/cluster/list", controller.clusterList);
router.get("/hub/list", controller.hubList);
// router.get("/revision", controller.netRevision);

router.get("/token/check", controller.tokenCheck);
router.get("/token/list", controller.tokenList); // deprecated

router.get("/system/info", controller.systemInfo);

module.exports = router;