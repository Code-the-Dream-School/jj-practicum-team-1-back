const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomAPIError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new CustomAPIError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
  }
};

module.exports = auth;
