const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/login", async (req,res)=>{

const {email,password}=req.body;

const user = await User.findOne({email});

if(!user) return res.json("User not found");

const match = await bcrypt.compare(password,user.password);

if(!match) return res.json("Invalid password");

const token = jwt.sign(
{ id:user._id , role:user.role },
process.env.JWT_SECRET
);

res.json({token,user});

});

module.exports = router;