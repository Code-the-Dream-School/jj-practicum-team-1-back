const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const {
  getAllPlants,
  getSinglePlant,
  updateSinglePlant,
  createPlantEntry,
  deleteSinglePlant,
} = require("../controllers/plants-controller");

router
  .route("/")
  .get(getAllPlants)
  .post(upload.single("file"), createPlantEntry);

router
  .route("/:id")
  .get(getSinglePlant)
  .patch(updateSinglePlant)
  .delete(deleteSinglePlant);

module.exports = router;
