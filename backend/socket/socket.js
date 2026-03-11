const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinRoom", (room) => {
      socket.join(room);
    });

    socket.on("codeChange", ({ room, code }) => {
      socket.to(room).emit("codeUpdate", code);
    });

    socket.on("webrtc-offer", (data) => {
      socket.to(data.room).emit("webrtc-offer", data);
    });

    socket.on("webrtc-answer", (data) => {
      socket.to(data.room).emit("webrtc-answer", data);
    });

    socket.on("ice-candidate", (data) => {
      socket.to(data.room).emit("ice-candidate", data);
    });
  });
}

module.exports = initSocket;