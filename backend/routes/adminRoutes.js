const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createCandidate,
  getAllCandidates
} = require("../controllers/adminController");

router.post("/create-candidate", auth, createCandidate);

router.get("/candidates", auth, getAllCandidates);

module.exports = router;