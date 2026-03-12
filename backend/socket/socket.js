module.exports = function (io) {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user-joined");
    });

    // WebRTC offer
    socket.on("offer", (data) => {
      socket.to(data.roomId).emit("offer", data.offer);
    });

    // WebRTC answer
    socket.on("answer", (data) => {
      socket.to(data.roomId).emit("answer", data.answer);
    });

    // ICE candidates
    socket.on("ice-candidate", (data) => {
      socket.to(data.roomId).emit("ice-candidate", data.candidate);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });

  });

};
module.exports = function (io) {

  io.on("connection", (socket) => {

    socket.on("join-room", (roomId) => {
      socket.join(roomId)
      socket.to(roomId).emit("user-joined")
    })

    // TASK ASSIGNMENT
    socket.on("assign-task", (data) => {
      socket.to(data.roomId).emit("receive-task", data.task)
    })

    // CODE SUBMISSION
    socket.on("submit-code", (data) => {
      socket.to(data.roomId).emit("receive-submission", data)
    })

    // WebRTC
    socket.on("offer", (data) => {
      socket.to(data.roomId).emit("offer", data.offer)
    })

    socket.on("answer", (data) => {
      socket.to(data.roomId).emit("answer", data.answer)
    })

    socket.on("ice-candidate", (data) => {
      socket.to(data.roomId).emit("ice-candidate", data.candidate)
    })

  })

}