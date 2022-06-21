const express = require("express");
const controller = require("../controllers/nodeControllers.js");
const router = express.Router();

// POST

// GET
router.get("/cluster/list", controller.clusterList);

// router.get("/list", controller.nodeList);

// router.get("/num", controller.nodeNum);

module.exports = router;