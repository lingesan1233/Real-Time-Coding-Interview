module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {

      socket.join(roomId);

      const clients = io.sockets.adapter.rooms.get(roomId);
      const numClients = clients ? clients.size : 0;

      if(numClients > 1){
        socket.to(roomId).emit("userJoined");
      }

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

  });

};