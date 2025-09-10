const express = require("express");
const multer = require("multer");
const {
  identifyImage,
  singlePlantData,
  allPlantsData,
} = require("../controllers/identify-plants-controller");
const router = express.Router();
const upload = multer();

router
  .route("/")
  .post(upload.single("images"), identifyImage)
  .get(allPlantsData);

router.route("/:id").get(singlePlantData);

module.exports = router;
