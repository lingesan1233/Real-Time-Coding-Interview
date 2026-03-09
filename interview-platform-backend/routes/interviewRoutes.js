const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
 createInterview,
 getCandidateInterview
} = require("../controllers/interviewController");

router.post("/create",auth,createInterview);

router.get("/candidate",auth,getCandidateInterview);

module.exports = router;