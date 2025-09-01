const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  let customError = {
    statusCode:
      err.statusCode || err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    msg:
      err.response?.data?.message ||
      err.response?.statusText ||
      err.message ||
      err.ReferenceError ||
      "Something went wrong. Try again later.",
  };

  // Mongoose validation error
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Mongoose duplicate error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field. Please choose another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Mongoose cast error
  if (err.name === "CastError") {
    let errValue = err.value;

    if (typeof err.value === "object") {
      errValue = err.value._id;
    }

    customError.msg = `No item found with id: ${errValue}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
