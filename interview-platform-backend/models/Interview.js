const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({

 title: String,

 description: String,

 interviewer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
 },

 candidate: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
 },

 roomId: String,

 scheduledAt: Date

});

module.exports = mongoose.model("Interview", interviewSchema);