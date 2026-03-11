const router = require("express").Router();
const Interview = require("../models/Interview");
const { v4: uuidv4 } = require("uuid");

router.post("/create", async(req,res)=>{

const {candidateId,task}=req.body;

const roomId = uuidv4();

const interview = await Interview.create({
candidateId,
task,
roomId
});

res.json(interview);

});

router.get("/candidate/:id", async(req,res)=>{

const interviews = await Interview.find({
candidateId:req.params.id
});

res.json(interviews);

});

module.exports = router;