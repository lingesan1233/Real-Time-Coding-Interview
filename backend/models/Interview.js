const mongoose = require("mongoose")

const interviewSchema = new mongoose.Schema({

candidateId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

roomId:{
type:String,
required:true
},

tasks:[
{
type:String
}
],

status:{
type:String,
default:"scheduled"
},

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Interview",interviewSchema)