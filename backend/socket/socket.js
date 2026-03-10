module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("userJoined");
      console.log("User joined room:", roomId);
    });

    socket.on("offer", (data) => {
      socket.to(data.roomId).emit("offer", data.offer);
    });

    socket.on("answer", (data) => {
      socket.to(data.roomId).emit("answer", data.answer);
    });

    socket.on("iceCandidate", (data) => {
      socket.to(data.roomId).emit("iceCandidate", data.candidate);
    });

    socket.on("codeChange", (data) => {
      socket.to(data.roomId).emit("codeUpdate", data.code);
    });

    socket.on("chatMessage", (data) => {
      io.to(data.roomId).emit("chatMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

  });

};