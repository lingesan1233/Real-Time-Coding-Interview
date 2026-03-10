const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const dns = require('node:dns/promises')
dns.setServers(['8.8.8.8'],['8.8.4.4']);

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/interview",interviewRoutes);

const server = http.createServer(app);

const io = new Server(server,{
cors:{origin:"*"}
});

require("./sockets/socket")(io);

server.listen(process.env.PORT,()=>{
console.log("Server running");
});