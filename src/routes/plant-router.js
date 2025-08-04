const express = require("express");
const router = express.Router();
const {
  getAllPlants,
  getSinglePlant,
  updateSinglePlant,
  createPlantEntry,
  deleteSinglePlant,
} = require("../controllers/plant-controller");

router.route("/").get(getAllPlants).post(createPlantEntry);

router
  .route("/:id")
  .get(getSinglePlant)
  .patch(updateSinglePlant)
  .delete(deleteSinglePlant);

module.exports = router;
