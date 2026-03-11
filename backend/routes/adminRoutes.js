const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/create-candidate", async(req,res)=>{

const {name,email,password}=req.body;

const hash = await bcrypt.hash(password,10);

const user = await User.create({
name,
email,
password:hash,
role:"candidate"
});

res.json(user);

});

router.get("/candidates",async(req,res)=>{

const users = await User.find({role:"candidate"});

res.json(users);

});

module.exports = router;