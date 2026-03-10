module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {

      socket.join(roomId);

      const clients = io.sockets.adapter.rooms.get(roomId);
      const numClients = clients ? clients.size : 0;

      console.log("Users in room:", numClients);

      // when second user joins
      if (numClients === 2) {
        io.to(roomId).emit("ready");
      }

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

  });

};