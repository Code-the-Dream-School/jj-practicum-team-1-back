const { StatusCodes } = require("http-status-codes");

const register = (req, res) => {
  res.status(StatusCodes.OK).json({ register: "register" });
};

const login = (req, res) => {
  res.status(StatusCodes.OK).json({ login: "log in" });
};

module.exports = { register, login };
