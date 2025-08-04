require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");
const authRouter = require("./routes/auth-router.js");
const plantRouter = require("./routes/plant-router.js");

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

// error handlers
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

module.exports = app;
