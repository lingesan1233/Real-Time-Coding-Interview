const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
 title: String,
 description: String,
 difficulty: String,
 testCases: [
  {
   input: String,
   expectedOutput: String
  }
 ]
});

module.exports = mongoose.model("Question", questionSchema);