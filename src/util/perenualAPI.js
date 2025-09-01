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

  //TODO ``** Since I accidentally added the firebase-key.json file to the commit, I need to switch to main, pull from origin, then copy all my files that I changed under my add_explorer branch. Make sure I've included the .gitignore with firebase in it!! Then I can add, commit, and push

  //TODO ``** Filter the data coming back from this request. Make sure it works correctly with the allPlantsData and the identifyImage functions in identify-plants-controllers file

  // return filterData(data);
  return data;
};

module.exports = perenualAPI;

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
