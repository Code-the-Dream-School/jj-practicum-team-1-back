const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    imageURL: {
      type: String,
    },
    notes: {
      type: String,
    },
    location: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Auth",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plant", PlantSchema);
