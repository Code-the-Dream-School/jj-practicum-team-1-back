require("dotenv").config();
const connectDB = require("./db/connect");

const { PORT = 8000 } = process.env;
const app = require("./app");

const listener = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listener();
