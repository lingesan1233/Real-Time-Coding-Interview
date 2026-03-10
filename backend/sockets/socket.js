module.exports = (io)=>{

io.on("connection",(socket)=>{

console.log("User connected");

socket.on("joinRoom",(roomId)=>{
socket.join(roomId);
});

socket.on("codeChange",(data)=>{
socket.to(data.roomId).emit("codeUpdate",data.code);
});

socket.on("chat",(data)=>{
socket.to(data.roomId).emit("chat",data.message);
});

socket.on("disconnect",()=>{
console.log("user disconnected");
});

});

}