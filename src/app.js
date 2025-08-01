const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");

const authRouter = require("./routes/authRouter.js");
const plantRouter = require("./routes/plantRouter.js");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/plants", plantRouter);

module.exports = app;
