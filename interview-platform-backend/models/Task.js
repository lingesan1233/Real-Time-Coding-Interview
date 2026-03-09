const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

 interviewId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Interview"
 },

 candidate:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 task:{
  type:String
 },

 answer:{
  type:String
 }

});

module.exports = mongoose.model("Task",taskSchema);