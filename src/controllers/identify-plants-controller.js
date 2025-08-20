const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");
const FormData = require("form-data");
const axios = require("axios");

const identifyPlants = async (req, res) => {
  if (!req.file) {
    throw new CustomAPIError("No image file provided", StatusCodes.BAD_REQUEST);
  }

  const form = new FormData();
  form.append("organs", "auto");
  form.append("images", req.file.buffer, req.file.originalname);

  const PLANTNET_KEY = process.env.PLANTNET_KEY;

  if (!PLANTNET_KEY) {
    throw new CustomAPIError(
      "No PLANTNET_KEY provided",
      StatusCodes.BAD_REQUEST
    );
  }

  const identifierResponse = await axios.post(
    `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_KEY}`,
    form,
    { headers: form.getHeaders() }
  );

  const scientificName =
    identifierResponse.data?.results?.[0]?.species?.genus?.scientificName;

  if (!scientificName) {
    throw new CustomAPIError(
      "Nothing found from PlantNet",
      StatusCodes.NOT_FOUND
    );
  }

  const scientificNameWithCorrectURLFormat = scientificName.replaceAll(
    " ",
    "+"
  );

  const PERENUAL_KEY = process.env.PERENUAL_KEY;

  if (!PERENUAL_KEY) {
    throw new CustomAPIError(
      "No PERENUAL_KEY provided",
      StatusCodes.BAD_REQUEST
    );
  }

  const scientificNameResponse = await axios.get(
    `https://perenual.com/api/v2/species-list?key=${PERENUAL_KEY}=${scientificNameWithCorrectURLFormat}`
  );

  const { data } = scientificNameResponse;
  console.log("data:", data.total);

  // if (data.total === 0) {
  //   throw new CustomAPIError(
  //     "Sorry, no results were found",
  //     StatusCodes.NOT_FOUND
  //   );
  // }

  res.status(StatusCodes.OK).json({
    plantnet: identifierResponse.data,
    perenual: scientificNameResponse.data,
  });
};

module.exports = { identifyPlants };

//TODO Find the right data from plantnet to plug into perenual
