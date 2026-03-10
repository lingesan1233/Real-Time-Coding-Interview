const router = require("express").Router();
const Interview = require("../models/Interview");

router.get("/candidate/:id",async(req,res)=>{

const data = await Interview.find({
candidateId:req.params.id
});

res.json(data);

});

router.post("/submit/:id",async(req,res)=>{

const {answer} = req.body;

const interview = await Interview.findByIdAndUpdate(
req.params.id,
{answer}
);

res.json(interview);

});

module.exports = router;