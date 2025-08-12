const Plant = require("../models/Plant");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");

const getAllPlants = async (req, res) => {
  const plants = await Plant.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ plants, count: plants.length });
};

const getSinglePlant = async (req, res) => {
  const {
    user: { userId },
    params: { id: plantId },
  } = req;

  const plant = await Plant.findOne({
    _id: plantId,
    createdBy: userId,
  });

  if (!plant) {
    throw new CustomAPIError(
      `No plant with the id ${plantId}`,
      StatusCodes.NOT_FOUND
    );
  }

  res.status(StatusCodes.OK).json({ plant });
};

const updateSinglePlant = async (req, res) => {
  const {
    body: { name, imageURL, notes, location },
    user: { userId },
    params: { id: plantId },
  } = req;

  if (name === "" || imageURL === "" || notes === "" || location === "") {
    throw new CustomAPIError("Fields cannot be empty", StatusCodes.BAD_REQUEST);
  }

  const plant = await Plant.findByIdAndUpdate(
    { _id: plantId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!plant) {
    throw new CustomAPIError(
      `No plant with the id ${plantId}`,
      StatusCodes.NOT_FOUND
    );
  }

  res.status(StatusCodes.OK).json({ plant });
};

const createPlantEntry = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const plant = await Plant.create(req.body);
  res.status(StatusCodes.CREATED).json({ plant });
};

const deleteSinglePlant = async (req, res) => {
  const {
    user: { userId },
    params: { id: plantId },
  } = req;

  const plant = await Plant.findByIdAndDelete({
    _id: plantId,
    createdBy: userId,
  });

  if (!plant) {
    throw new CustomAPIError(`No plant with id ${plantId}`);
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "The entry was successfully deleted" });
};

module.exports = {
  getAllPlants,
  getSinglePlant,
  updateSinglePlant,
  createPlantEntry,
  deleteSinglePlant,
};
