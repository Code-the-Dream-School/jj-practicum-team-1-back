const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");
const fs = require("node:fs");
const FormData = require("form-data");
const axios = require("axios");
const { log } = require("node:console");

const identifyPlants = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    const form = new FormData();
    form.append("organs", "auto");
    form.append("images", req.file.buffer, req.file.originalname);

    const PLANTNET_KEY = process.env.PLANTNET_KEY || "2b10LvWVdtfZ81WthwYcu2qe";

    const response = await axios.post(
      `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    const { data } = response;

    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    console.error("Error identifying plant:", error.message);
    throw new CustomAPIError(
      "Failed to identify plant",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { identifyPlants };
