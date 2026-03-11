const { Server } = require("socket.io");

function initSocket(server){

const io = new Server(server,{
cors:{origin:"*"}
});

io.on("connection",(socket)=>{

socket.on("joinRoom",(roomId)=>{
socket.join(roomId);
});

socket.on("offer",(data)=>{
socket.to(data.roomId).emit("offer",data);
});

socket.on("answer",(data)=>{
socket.to(data.roomId).emit("answer",data);
});

socket.on("ice-candidate",(data)=>{
socket.to(data.roomId).emit("ice-candidate",data);
});

});

}

module.exports = initSocket;