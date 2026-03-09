const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
 candidate: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
 },
 question: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Question"
 },
 code: String,
 result: String,
 score: Number,
 createdAt: {
  type: Date,
  default: Date.now
 }
});

module.exports = mongoose.model("Submission", submissionSchema);