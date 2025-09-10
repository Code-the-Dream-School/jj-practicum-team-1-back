require("dotenv").config();
const connectDB = require("./db/connect");

const { PORT = 8000 } = process.env;
const app = require("./app");

let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV == "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}

const listener = async () => {
  try {
    await connectDB(mongoURL);

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listener();
