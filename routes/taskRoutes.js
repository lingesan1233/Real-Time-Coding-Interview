const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
 createTask,
 getCandidateTask,
 submitAnswer
} = require("../controllers/taskController");

router.post("/create",auth,createTask);

router.get("/candidate",auth,getCandidateTask);

router.post("/submit",auth,submitAnswer);

module.exports = router;