require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const dns = require("node:dns/promises");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require("./config/db");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const socketHandler = require("./socket/socket");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- DATABASE ---------------- */

connectDB();

/* ---------------- DEFAULT ADMIN ---------------- */

const createAdmin = async () => {

  try {

    const admin = await User.findOne({ email: "webspirelabs@gmail.com" });

    if (!admin) {

      const hashed = await bcrypt.hash("webspirelabs@2026", 10);

      await User.create({
        name: "webspirelabs",
        email: "webspirelabs@gmail.com",
        password: hashed,
        role: "admin"
      });

      console.log("Default admin created");

    }

  } catch (err) {
    console.log(err);
  }

};

createAdmin();

/* ---------------- ROUTES ---------------- */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/interview", interviewRoutes);

/* ---------------- SOCKET SERVER ---------------- */

const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
});

socketHandler(io);

/* ---------------- START SERVER ---------------- */

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});