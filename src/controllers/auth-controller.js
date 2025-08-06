const User = require("../models/Auth");
const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("../errors/custom-error");

const register = async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res
      .status(StatusCodes.CREATED)
      .json({ user: { name: user.name, userId: user._id }, token });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email is already registered" });
    }

    console.error("Registration error:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong. Please try again." });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomAPIError(
        "Please provide email and password",
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomAPIError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new CustomAPIError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
    }

    const token = user.createJWT();
    res
      .status(StatusCodes.OK)
      .json({ user: { name: user.name, userId: user._id }, token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
