const express = require("express")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Interview = require("../models/Interview")

const router = express.Router()

// Create Candidate
router.post("/createCandidate", async (req,res)=>{

const {name,email,password} = req.body

try{

const exist = await User.findOne({email})

if(exist){
return res.status(400).json({msg:"User already exists"})
}

const hashed = await bcrypt.hash(password,10)

const candidate = new User({
name,
email,
password:hashed,
role:"candidate"
})

await candidate.save()

res.json(candidate)

}catch(err){
res.status(500).json(err)
}

})


// Get Candidates
router.get("/candidates", async (req,res)=>{

const candidates = await User.find({role:"candidate"})

res.json(candidates)

})


// Create Interview
router.post("/createInterview", async (req,res)=>{

const {candidateId,tasks} = req.body

const roomId = "room_"+Math.random().toString(36).substring(7)

const interview = new Interview({
candidateId,
tasks,
roomId
})

await interview.save()

res.json(interview)

})


// Get Interviews
router.get("/interviews", async (req,res)=>{

const interviews = await Interview
.find()
.populate("candidateId","name email")

res.json(interviews)

})


// End Interview
router.put("/endInterview/:id", async (req,res)=>{

await Interview.findByIdAndUpdate(
req.params.id,
{status:"ended"}
)

res.json({msg:"Interview ended"})

})

module.exports = router