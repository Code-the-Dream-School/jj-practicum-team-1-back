const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");
const FormData = require("form-data");
const axios = require("axios");

const identifyPlants = async (req, res) => {
  const PLANTNET_KEY = process.env.PLANTNET_KEY;
  const PERENUAL_KEY = process.env.PERENUAL_KEY;

  if (!PERENUAL_KEY) {
    throw new CustomAPIError(
      "No PERENUAL_KEY provided",
      StatusCodes.BAD_REQUEST
    );
  }

  if (!PLANTNET_KEY) {
    throw new CustomAPIError(
      "No PLANTNET_KEY provided",
      StatusCodes.BAD_REQUEST
    );
  }

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
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "Sorry, no results were found" });
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

  //todo **`` Filter out repeat data by ID

  res.status(StatusCodes.OK).json({
    perenualCommonNameResponse: perenualCommonNameResponse.data,
    perenualScientificNameResponse: perenualScientificNameResponse.data,
  });
};

module.exports = { identifyPlants };
