const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const connectDB = require("./config/db");

const dns = require('node:dns/promises')
dns.setServers(['8.8.8.8'],['8.8.4.4']);

const initSocket = require("./socket/socket");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const server = http.createServer(app);

initSocket(server);

server.listen(process.env.PORT, () => {
  console.log("Server running");
});
const User = require("./models/User");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const admin = await User.findOne({ email: "webspirelabs@gmail.com" });

  if (!admin) {
    const hash = await bcrypt.hash("webspirelabs@2026", 10);

    await User.create({
      name: "webspirelabs",
      email: "webspirelabs@gmail.com",
      password: hash,
      role: "admin",
    });

    console.log("Default admin created");
  }
}

createAdmin();