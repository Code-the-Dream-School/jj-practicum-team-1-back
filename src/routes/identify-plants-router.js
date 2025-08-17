const express = require("express");
const multer = require("multer");
const { identifyPlants } = require("../controllers/identify-plants-controller");
const router = express.Router();
const upload = multer();

router.route("/").post(upload.single("images"), identifyPlants);

module.exports = router;
