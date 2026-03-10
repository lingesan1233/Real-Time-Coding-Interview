const router = require("express").Router();
const User = require("../models/User");
const Interview = require("../models/Interview");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");


// CREATE CANDIDATE
router.post("/createCandidate", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const candidate = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "candidate"
    });

    res.json(candidate);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});



// CREATE INTERVIEW (LIVE MEETING)
router.post("/createInterview", async (req, res) => {

  try {

    const { candidateId, candidateName, task } = req.body;

    const roomId = uuidv4();

    const interview = await Interview.create({
      candidateId,
      candidateName,
      task,
      roomId,
      status: "live"
    });

    res.json(interview);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});



// GET ALL INTERVIEWS
router.get("/interviews", async (req, res) => {

  try {

    const interviews = await Interview.find();

    res.json(interviews);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});


module.exports = router;