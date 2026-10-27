const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      required: true,
      default: "JavaScript"
    },

    sourceCode: {
      type: String,
      required: true
    },

    totalLines: {
      type: Number,
      required: true
    },

    functions: [String],

    classes: [String],

    imports: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Analysis",
  analysisSchema
);