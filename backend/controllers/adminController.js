const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.createCandidate = async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });

    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const candidate = await User.create({
      name,
      email,
      password: hashed,
      role: "candidate"
    });

    res.json({
      message: "Candidate created successfully",
      candidate
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


exports.getAllCandidates = async (req, res) => {

  try {

    const candidates = await User.find({ role: "candidate" }).select("-password");

    res.json(candidates);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};