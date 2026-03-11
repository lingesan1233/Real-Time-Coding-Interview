module.exports = function(io){

io.on("connection",(socket)=>{

console.log("User Connected");

socket.on("join-room",(roomId)=>{

socket.join(roomId);

});

socket.on("code-change",(data)=>{

socket.to(data.roomId).emit("code-change",data.code);

});

socket.on("task-update",(data)=>{

socket.to(data.roomId).emit("task-update",data.task);

});

socket.on("end-meeting",(roomId)=>{

io.to(roomId).emit("meeting-ended");

});

});

}
socket.on("send-message",(data)=>{
socket.to(data.roomId).emit("receive-message",data)
})

socket.on("submit-code",(data)=>{
socket.to(data.roomId).emit("candidate-submitted",data)
})