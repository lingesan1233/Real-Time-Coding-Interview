const Interview = require("../models/Interview");
const Task = require("../models/Task");
const { v4: uuidv4 } = require("uuid");


// Create Interview (Admin)
exports.createInterview = async (req, res) => {

  try {

    const { candidateId, task } = req.body;

    const roomId = uuidv4();

    const interview = await Interview.create({
      candidate: candidateId,
      roomId,
      task
    });

    res.json({
      message: "Interview created",
      interview
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Candidate Dashboard Interviews
exports.getCandidateInterview = async (req, res) => {

  try {

    const interviews = await Interview.find({
      candidate: req.user.id
    });

    res.json(interviews);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Admin Dashboard Interviews
exports.getAllInterviews = async (req, res) => {

  try {

    const interviews = await Interview.find()
      .populate("candidate", "name email");

    res.json(interviews);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Candidate Submit Code
exports.submitTask = async (req, res) => {

  try {

    const { interviewId, code } = req.body;

    const task = await Task.create({
      interview: interviewId,
      code,
      candidate: req.user.id
    });

    res.json({
      message: "Task submitted",
      task
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};



// Admin View Candidate Code
exports.getTaskSubmissions = async (req, res) => {

  try {

    const tasks = await Task.find({
      interview: req.params.interviewId
    }).populate("candidate", "name email");

    res.json(tasks);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};