const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  roomId: String,
  task: String,
  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Interview", InterviewSchema);