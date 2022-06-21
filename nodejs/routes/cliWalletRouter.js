const express = require("express");
const controller = require("../controllers/cliWalletControllers.js");
const router = express.Router();

// POST
//
router.post("/tool/json", controller.toolJson);

//
router.post("/key/gen", controller.keyGen);

// GET
//
router.get("/key/get/pubkey", controller.getPubkey);

module.exports = router;
