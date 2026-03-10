const express = require("express")
const Interview = require("../models/Interview")

const router = express.Router()

// Get interviews for a candidate
router.get("/interviews/:candidateId", async (req,res)=>{

try{

const interviews = await Interview.find({
candidateId:req.params.candidateId,
status: { $ne: "ended" }   // return all active interviews
})

res.json(interviews)

}catch(err){

res.status(500).json({
message:"Error fetching interviews",
error:err
})

}

})

module.exports = router