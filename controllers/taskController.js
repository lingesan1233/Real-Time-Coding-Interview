const Task = require("../models/Task");

exports.createTask = async(req,res)=>{

 try{

  const {interviewId,candidateId,task} = req.body;

  const newTask = await Task.create({
   interviewId,
   candidate:candidateId,
   task
  });

  res.json(newTask);

 }catch(err){
  res.status(500).json(err);
 }

};


exports.getCandidateTask = async(req,res)=>{

 const tasks = await Task.find({
  candidate:req.user.id
 });

 res.json(tasks);

};


exports.submitAnswer = async(req,res)=>{

 const {taskId,answer} = req.body;

 const task = await Task.findById(taskId);

 task.answer = answer;

 await task.save();

 res.json(task);

};