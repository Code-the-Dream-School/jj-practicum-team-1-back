const axios = require("axios");
const CustomAPIError = require("../errors/custom-error");
const { StatusCodes } = require("http-status-codes");

const PERENUAL_KEY = process.env.PERENUAL_KEY;

const perenualAPI = async (name, plantID) => {
  if (!PERENUAL_KEY) {
    throw new CustomAPIError(
      "No PERENUAL_KEY provided",
      StatusCodes.BAD_REQUEST
    );
  }

  let response;

  if (plantID) {
    response = await axios.get(
      `https://perenual.com/api/v2/species/details/${plantID}?key=${PERENUAL_KEY}`
    );

    const { data } = response;

    return filterSinglePlantData(data);
  }

  response = await axios.get(
    `https://perenual.com/api/v2/species-list?key=${PERENUAL_KEY}=${name}`
  );
  const { data } = response;

  return filterAllPlantData(data);
};

module.exports = perenualAPI;

const filterAllPlantData = (dataObj) => {
  let data = [];

  dataObj.data.forEach((entry) => {
    const { id, common_name, scientific_name, default_image } = entry;

    data.push({ id, common_name, scientific_name, default_image });
  });

  return { data, total: data.length };
};

const filterSinglePlantData = (data) => {
  const {
    id,
    common_name,
    scientific_name,
    origin,
    hardiness: hardiness_zones,
    hardiness_location,
    description,
    default_image,
    cycle,
    sunlight,
    growth_rate,
    care_level,
    watering,
    maintenance,
  } = data;

  return {
    id,
    common_name,
    scientific_name,
    origin,
    hardiness_zones,
    hardiness_location,
    description,
    default_image,
    cycle,
    sunlight,
    growth_rate,
    care_level,
    watering,
    maintenance,
  };
};
