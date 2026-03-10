require("dotenv").config()

const express = require("express")
const http = require("http")
const cors = require("cors")
const socketio = require("socket.io")
const bcrypt = require("bcryptjs")

const connectDB = require("./config/db")
const User = require("./models/User")

const authRoutes = require("./routes/authRoutes")
const adminRoutes = require("./routes/adminRoutes")
const candidateRoutes = require("./routes/candidateRoutes")

const dns = require("node:dns/promises")
dns.setServers(["8.8.8.8","8.8.4.4"])

const app = express()

app.use(cors())
app.use(express.json())

// =======================
// DATABASE
// =======================
connectDB()

// =======================
// ROUTES
// =======================

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/candidate", candidateRoutes)


// =======================
// SERVER + SOCKET
// =======================

const server = http.createServer(app)

const io = socketio(server,{
cors:{
origin:"*"
}
})

require("./socket/socket")(io)


// =======================
// CREATE DEFAULT ADMIN
// =======================

const createAdmin = async () => {

try{

const admin = await User.findOne({
email:"webspirelabs@gmail.com"
})

if(!admin){

const hashed = await bcrypt.hash("webspirelabs@2026",10)

await User.create({
name:"webspirelabs",
email:"webspirelabs@gmail.com",
password:hashed,
role:"admin"
})

console.log("Default admin created")

}

}catch(err){
console.log(err)
}

}

createAdmin()


// =======================
// START SERVER
// =======================

server.listen(process.env.PORT, () => {
console.log(`Server running on port ${process.env.PORT}`)
})