const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");
const fs = require("node:fs");
const FormData = require("form-data");
const axios = require("axios");

const identifyPlants = async (req, res) => {
  const image = "C:\Users\stuma\Desktop\venus-fly-trap.jpg";

  const form = new FormData();

  form.append("organs", "auto");
  form.append("images", fs.createReadStream(image));

  try {
    const response = await axios.post(
      "https://my-api.plantnet.org/v2/identify/all?api-key=2b10LvWVdtfZ81WthwYcu2qe",
      { body: form }
    );
    const data = response.data;

    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { identifyPlants };
