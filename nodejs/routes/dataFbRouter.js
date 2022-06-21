const express = require("express");
const controller = require("../controllers/dataFbControllers.js");
const router = express.Router();

// GET
router.get("/repl/info", controller.getReplInfo);

module.exports = router;