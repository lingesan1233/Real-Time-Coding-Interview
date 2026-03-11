const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Interview = require("../models/Interview");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* Create Candidate */
router.post("/create-candidate", auth, async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const candidate = new User({
      name,
      email,
      password: hash,
      role: "candidate",
    });

    await candidate.save();

    res.json(candidate);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/* Create Interview */
router.post("/create-interview", auth, async (req, res) => {

  try {

    const { candidateId } = req.body;

    const roomId = Math.random().toString(36).substring(2,10);

    const interview = new Interview({
      admin: req.user.id,
      candidate: candidateId,
      roomId
    });

    await interview.save();

    res.json(interview);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});
/* Get all candidates */

router.get("/candidates", auth, async (req, res) => {

  try {

    const candidates = await User.find({ role: "candidate" }).select("-password");

    res.json(candidates);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});
module.exports = router;