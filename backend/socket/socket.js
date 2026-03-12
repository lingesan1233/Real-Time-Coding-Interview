module.exports = function (io) {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // Join interview room
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log("Joined room:", roomId);
      socket.to(roomId).emit("user-joined");
    });

    // =========================
    // TASK ASSIGNMENT (Admin → Candidate)
    // =========================
    socket.on("assign-task", (data) => {

      console.log("Task assigned:", data.task);

      socket.to(data.roomId).emit("receive-task", data.task);

    });

    // =========================
    // CODE SUBMISSION (Candidate → Admin)
    // =========================
    socket.on("submit-code", (data) => {

      console.log("Code submitted");

      socket.to(data.roomId).emit("receive-submission", data);

    });

    // =========================
    // WebRTC OFFER
    // =========================
    socket.on("offer", (data) => {

      socket.to(data.roomId).emit("offer", data.offer);

    });

    // =========================
    // WebRTC ANSWER
    // =========================
    socket.on("answer", (data) => {

      socket.to(data.roomId).emit("answer", data.answer);

    });

    // =========================
    // ICE CANDIDATE
    // =========================
    socket.on("ice-candidate", (data) => {

      socket.to(data.roomId).emit("ice-candidate", data.candidate);

    });

    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id);

    });

  });

};