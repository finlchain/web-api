const express = require("express");
const controller = require("../controllers/ctrlKafkaControllers.js");
const router = express.Router();

// POST

// GET
//
router.get("/broker/list", controller.getBrokerList);

module.exports = router;