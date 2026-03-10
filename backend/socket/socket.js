module.exports = (io)=>{

io.on("connection",(socket)=>{

console.log("User connected")

socket.on("joinRoom",(room)=>{
socket.join(room)
})

socket.on("codeChange",(data)=>{
socket.to(data.room).emit("codeUpdate",data.code)
})

socket.on("disconnect",()=>{
console.log("User disconnected")
})

})
}