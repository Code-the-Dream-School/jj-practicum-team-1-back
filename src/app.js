require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const notFoundMiddleware = require("./middleware/not-found.js");
const errorHandlerMiddleware = require("./middleware/error-handler.js");
const authRouter = require("./routes/auth-router.js");
const plantsRouter = require("./routes/plants-router.js");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const auth = require("./middleware/authentication.js");
const swaggerDocument = YAML.load("./swagger.yaml");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

app.get("/", (req, res) => {
  res.send('<h1>Plant API</h1><a href="/api-docs">Documentation</a>');
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/plants", auth, plantsRouter);

// error handlers
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

module.exports = app;
