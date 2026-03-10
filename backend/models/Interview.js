const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  candidateName: {
    type: String,
    required: true
  },

  roomId: {
    type: String,
    required: true
  },

  task: {
    type: String
  },

  answer: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: ["scheduled", "live", "ended"],
    default: "live"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Interview", interviewSchema);