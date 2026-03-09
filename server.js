const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");

const dns = require('node:dns/promises')
dns.setServers(['8.8.8.8'],['8.8.4.4']);

dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const taskRoutes = require("./routes/taskRoutes");

const socketHandler = require("./socket/socket");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/tasks", taskRoutes);

const createDefaultAdmin = async () => {

 try {

  const adminEmail = "web@gmail.com";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {

   const hashedPassword = await bcrypt.hash("web@123", 10);

   await User.create({
    name: "Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin"
   });

   console.log("Default Admin Created");
  }

 } catch (error) {

  console.log("Admin creation error:", error);

 }

};

const startServer = async () => {

 await connectDB();   // wait for DB connection

 await createDefaultAdmin();  // then create admin

 const server = http.createServer(app);

 const io = new Server(server,{
  cors:{origin:"*"}
 });

 socketHandler(io);

 server.listen(process.env.PORT,()=>{
  console.log("Server running on port",process.env.PORT);
 });

};

startServer();