const Plant = require("../models/Plant");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");
const bucket = require("../firebase");

const getAllPlants = async (req, res) => {
  try {
    const { location, name, sort, fields } = req.query;
    const queryObject = {
      createdBy: req.user.userId,
    };

    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    let result = Plant.find(queryObject);

    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt");
    }

    if (fields) {
      const fieldsList = fields.split(",").join(" ");
      result = result.select(fieldsList);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const plants = await result;
    res.status(200).json({ plants, nbHits: plants.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  if (Object.keys(req.body).length === 0) {
    throw new CustomAPIError("Request is empty", StatusCodes.BAD_REQUEST);
  }

  const {
    user: { userId },
    params: { id: plantId },
  } = req;

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
  try {
    req.body.createdBy = req.user.userId;
    const file = req.file;
    let imageURL = null;

    if (file) {
      const blob = bucket.file(`plants/${Date.now()}-${file.originalname}`);
      const blobStream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
      });

      blobStream.end(file.buffer);

      await new Promise((resolve, reject) => {
        blobStream.on("finish", resolve);
        blobStream.on("error", reject);
      });

      imageURL = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(blob.name)}?alt=media`;
    }

    const plant = await Plant.create({
      name: req.body.name,
      notes: req.body.notes,
      location: req.body.location,
      createdBy: req.user.userId,
      imageURL,
    });

    res.status(StatusCodes.CREATED).json({ plant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
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
    throw new CustomAPIError(
      `No plant with id ${plantId}`,
      StatusCodes.NOT_FOUND
    );
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
