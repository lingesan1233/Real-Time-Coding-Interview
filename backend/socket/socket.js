module.exports = function (io) {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // =========================
    // JOIN ROOM
    // =========================
    socket.on("join-room", (roomId) => {

      socket.join(roomId);

      console.log(`Socket ${socket.id} joined room ${roomId}`);

      socket.to(roomId).emit("user-joined");

    });


    // =========================
    // ADMIN ASSIGNS TASK
    // =========================
    socket.on("assign-task", (data) => {

      io.to(data.roomId).emit("receive-task", data.task);

    });


    // =========================
    // CANDIDATE SUBMITS CODE
    // =========================
    socket.on("submit-code", (data) => {

      io.to(data.roomId).emit("receive-submission", data);

    });


    // =========================
    // WEBRTC OFFER
    // =========================
    socket.on("offer", (data) => {

      socket.to(data.roomId).emit("offer", data.offer);

    });


    // =========================
    // WEBRTC ANSWER
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


    // =========================
    // END CALL
    // =========================
    socket.on("end-call", (roomId) => {

      console.log("Call ended in room:", roomId);

      socket.to(roomId).emit("call-ended");

    });


    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id);

    });

  });

};