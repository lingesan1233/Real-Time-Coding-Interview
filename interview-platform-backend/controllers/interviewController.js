const Interview = require("../models/Interview");
const { v4: uuidv4 } = require("uuid");

exports.createInterview = async (req,res)=>{

 try{

  const { title, description, candidateId } = req.body;

  const interview = new Interview({
   title,
   description,
   interviewer: req.user.id,
   candidate: candidateId,
   roomId: uuidv4()
  });

  await interview.save();

  res.json(interview);

 }catch(err){
  console.log(err);
  res.status(500).json({message:"Server error"});
 }

};


exports.getCandidateInterview = async (req,res)=>{

 try{

  const interview = await Interview.findOne({
   candidate: req.user.id
  });

  res.json(interview);

 }catch(err){
  console.log(err);
  res.status(500).json({message:"Server error"});
 }

};