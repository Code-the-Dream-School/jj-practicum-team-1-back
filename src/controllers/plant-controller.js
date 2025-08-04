const { StatusCodes } = require("http-status-codes");

const getAllPlants = (req, res) => {
  res.status(StatusCodes.OK).json({ plants: "all" });
};

const getSinglePlant = (req, res) => {
  res.status(StatusCodes.OK).json({ plants: "single" });
};

const updateSinglePlant = (req, res) => {
  res.status(StatusCodes.OK).json({ plants: "update" });
};

const createPlantEntry = (req, res) => {
  res.status(StatusCodes.CREATED).json({ plants: "create" });
};

const deleteSinglePlant = (req, res) => {
  res.status(StatusCodes.NO_CONTENT).json({ plants: "delete" });
};

module.exports = {
  getAllPlants,
  getSinglePlant,
  updateSinglePlant,
  createPlantEntry,
  deleteSinglePlant,
};
