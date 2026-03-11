const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  interviewId: String,
  question: String,
  solution: String,
  candidateCode: String,
});

module.exports = mongoose.model("Task", taskSchema);