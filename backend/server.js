require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");

const connectDB = require("./config/db");

const dns = require ('node:dns/promises')
dns.setServers(['8.8.8.8'],['8.8.4.4']);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth",require("./routes/authRoutes"));
app.use("/api/admin",require("./routes/adminRoutes"));
app.use("/api/interview",require("./routes/interviewRoutes"));

const server = http.createServer(app);

const io = new Server(server,{
cors:{origin:"*"}
});

require("./socket/socket")(io);

server.listen(process.env.PORT,()=>{
console.log("Server running");
});