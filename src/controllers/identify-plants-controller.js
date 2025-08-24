const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");
const FormData = require("form-data");
const axios = require("axios");

const PLANTNET_KEY = process.env.PLANTNET_KEY;
const PERENUAL_KEY = process.env.PERENUAL_KEY;

if (!PERENUAL_KEY) {
  throw new CustomAPIError("No PERENUAL_KEY provided", StatusCodes.BAD_REQUEST);
}

if (!PLANTNET_KEY) {
  throw new CustomAPIError("No PLANTNET_KEY provided", StatusCodes.BAD_REQUEST);
}

const identifyPlants = async (req, res) => {
  if (!req.file) {
    throw new CustomAPIError("No image file provided", StatusCodes.BAD_REQUEST);
  }

  const form = new FormData();
  form.append("organs", "auto");
  form.append("images", req.file.buffer, req.file.originalname);

  const plantnetResponse = await axios.post(
    `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_KEY}`,
    form,
    { headers: form.getHeaders() }
  );

  const plantnetCommonName =
    plantnetResponse.data?.results?.[0]?.species?.commonNames?.[0];

  const plantnetScientificName =
    plantnetResponse.data?.results?.[0]?.species?.genus?.scientificName;

  if (!plantnetScientificName && !plantnetCommonName) {
    throw new CustomAPIError(
      "Sorry, no results were found",
      StatusCodes.NOT_FOUND
    );
  }

  const plantnetCommonNameCorrectURLFormat = plantnetCommonName.replaceAll(
    " ",
    "+"
  );

  const plantnetScientificNameCorrectURLFormat =
    plantnetScientificName.replaceAll(" ", "+");

  const perenualCommonNameResponse = await axios.get(
    `https://perenual.com/api/v2/species-list?key=${PERENUAL_KEY}=${plantnetCommonNameCorrectURLFormat}`
  );

  const perenualScientificNameResponse = await axios.get(
    `https://perenual.com/api/v2/species-list?key=${PERENUAL_KEY}=${plantnetScientificNameCorrectURLFormat}`
  );

  if (
    perenualCommonNameResponse.data.total === 0 &&
    perenualScientificNameResponse.data.total === 0
  ) {
    throw new CustomAPIError(
      "Sorry, no results were found",
      StatusCodes.NOT_FOUND
    );
  }

  const combinedResponses = [
    ...perenualCommonNameResponse.data.data,
    ...perenualScientificNameResponse.data.data,
  ];

  // **`` Filters out the duplicates by id
  const reducedResponse = combinedResponses.reduce((total, current) => {
    if (!total.find((item) => item.id === current.id)) {
      total.push(current);
    }
    return total;
  }, []);

  res.status(StatusCodes.OK).json({
    data: reducedResponse,
    length: reducedResponse.length,
  });
};

const plantData = async (req, res) => {
  const { id } = req.params;

  const response = await axios.get(
    `https://perenual.com/api/v2/species/details/${id}?key=${PERENUAL_KEY}`
  );

  const { data } = response;

  res.status(StatusCodes.OK).json({ data });
};

module.exports = { identifyPlants, plantData };
