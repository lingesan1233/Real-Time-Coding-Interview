const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview"
  },

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  code: {
    type: String
  },

  submittedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Task", taskSchema);