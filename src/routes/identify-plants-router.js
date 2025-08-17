const express = require("express");
const { identifyPlants } = require("../controllers/identify-plants-controller");
const router = express.Router();

router.route("/").post(identifyPlants);

module.exports = router;
