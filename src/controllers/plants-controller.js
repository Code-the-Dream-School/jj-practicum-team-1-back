const Plant = require("../models/Plant");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");

const getAllPlants = (req, res) => {
  res.status(StatusCodes.OK).json({ plants: "all" });
};

const getSinglePlant = (req, res) => {
  res.status(StatusCodes.OK).json({ plants: "single" });
};

const updateSinglePlant = (req, res) => {
  res.status(StatusCodes.OK).json({ plants: "update" });
};

const createPlantEntry = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const plant = await Plant.create(req.body);
  res.status(StatusCodes.CREATED).json({ plant });
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
