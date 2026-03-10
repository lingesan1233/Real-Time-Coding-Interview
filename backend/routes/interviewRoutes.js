const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  createInterview,
  getCandidateInterview,
  getAllInterviews,
  submitTask,
  getTaskSubmissions
} = require("../controllers/interviewController");


// Admin creates interview
router.post("/create", auth, createInterview);


// Candidate sees their interviews
router.get("/candidate", auth, getCandidateInterview);


// Admin sees all interviews
router.get("/all", auth, getAllInterviews);


// Candidate submits code
router.post("/submit", auth, submitTask);


// Admin views submissions
router.get("/submissions/:interviewId", auth, getTaskSubmissions);


module.exports = router;