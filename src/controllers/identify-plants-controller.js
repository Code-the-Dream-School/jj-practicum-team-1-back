const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");
const FormData = require("form-data");
const axios = require("axios");
const perenualAPI = require("../util/perenualAPI");

const PLANTNET_KEY = process.env.PLANTNET_KEY;

const identifyImage = async (req, res) => {
  if (!req.file) {
    throw new CustomAPIError("No image file provided", StatusCodes.BAD_REQUEST);
  }

  if (!PLANTNET_KEY) {
    throw new CustomAPIError(
      "No PLANTNET_KEY provided",
      StatusCodes.BAD_REQUEST
    );
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

  const perenualCommonNameResponse = await perenualAPI(
    plantnetCommonNameCorrectURLFormat
  );

  const perenualScientificNameResponse = await perenualAPI(
    plantnetScientificNameCorrectURLFormat
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

const singlePlantData = async (req, res) => {
  const { id } = req.params;

  const response = await perenualAPI(null, id);

  res.status(StatusCodes.OK).json({ response });
};

const allPlantsData = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    throw new CustomAPIError(
      "Missing name query parameter",
      StatusCodes.BAD_REQUEST
    );
  }

  const response = await perenualAPI(name);

  if (response.total === 0) {
    throw new CustomAPIError(
      "Sorry, no results were found",
      StatusCodes.NOT_FOUND
    );
  }

  res.status(StatusCodes.OK).json({ response });
};

module.exports = { identifyImage, singlePlantData, allPlantsData };
