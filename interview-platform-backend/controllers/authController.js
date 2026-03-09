const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {

 try {

  const { name, email, password, role } = req.body;

  // check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
   return res.status(400).json({ message: "User already exists" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = new User({
   name,
   email,
   password: hashedPassword,
   role
  });

  await user.save();

  res.json({ message: "User Registered Successfully" });

 } catch (error) {

  console.log(error);

  res.status(500).json({ message: "Server error" });

 }

};


exports.login = async (req, res) => {

 try {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
   return res.status(400).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
   return res.status(400).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
   { id: user._id, role: user.role },
   process.env.JWT_SECRET,
   { expiresIn: "1d" }
  );

  res.json({
   token,
   role: user.role
  });

 } catch (error) {

  console.log(error);

  res.status(500).json({ message: "Server error" });

 }

};