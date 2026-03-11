module.exports = function (io) {

  io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    // Join interview room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log("Joined room:", roomId);
    });

    // Live code collaboration
    socket.on("code-change", (data) => {
      socket.to(data.roomId).emit("code-change", data.code);
    });

    // Task update from admin
    socket.on("task-update", (data) => {
      socket.to(data.roomId).emit("task-update", data.task);
    });

    // Chat message
    socket.on("send-message", (data) => {
      socket.to(data.roomId).emit("receive-message", data);
    });

    // Candidate submits code
    socket.on("submit-code", (data) => {
      socket.to(data.roomId).emit("candidate-submitted", data);
    });

    // Admin ends meeting
    socket.on("end-meeting", (roomId) => {
      io.to(roomId).emit("meeting-ended");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

};