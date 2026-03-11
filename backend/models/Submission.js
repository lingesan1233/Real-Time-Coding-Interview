const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  candidateId: String,
  roomId: String,
  code: String
});

module.exports = mongoose.model("Submission", SubmissionSchema);