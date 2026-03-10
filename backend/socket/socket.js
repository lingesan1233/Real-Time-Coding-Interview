module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);


    socket.on("joinRoom", (roomId) => {

      socket.join(roomId);

      console.log("User joined room:", roomId);

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