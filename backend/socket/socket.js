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

      console.log("Task assigned:", data.task);

      io.to(data.roomId).emit("receive-task", data.task);

    });


    // =========================
    // CANDIDATE SUBMITS CODE
    // =========================
    socket.on("submit-code", (data) => {

      console.log("Candidate submitted code:", data.code);

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
    // SCREEN SHARE RENEGOTIATION
    // =========================
    socket.on("renegotiate-offer", (data) => {

      socket.to(data.roomId).emit("renegotiate-offer", data.offer);

    });

    socket.on("renegotiate-answer", (data) => {

      socket.to(data.roomId).emit("renegotiate-answer", data.answer);

    });


    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id);

    });

  });

};
socket.on("end-call", (roomId) => {

  socket.to(roomId).emit("call-ended");

});