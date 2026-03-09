module.exports = (io) => {

 io.on("connection", (socket) => {

  console.log("User connected");

  socket.on("join-room", roomId => {
   socket.join(roomId);
  });

  socket.on("code-change", ({ roomId, code }) => {
   socket.to(roomId).emit("code-update", code);
  });

  socket.on("chat-message", ({ roomId, message }) => {
   io.to(roomId).emit("chat-message", message);
  });

  socket.on("webrtc-signal", data => {
   socket.to(data.roomId).emit("webrtc-signal", data);
  });

  socket.on("disconnect", () => {
   console.log("User disconnected");
  });

 });

};