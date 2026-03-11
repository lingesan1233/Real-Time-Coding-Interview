const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roomId: String,
  status: {
    type: String,
    default: "scheduled",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Interview", interviewSchema);