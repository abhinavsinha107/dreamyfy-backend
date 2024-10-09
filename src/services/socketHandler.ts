import { Server as SocketIOServer } from "socket.io";

const socketHandler = (server: any) => {
  const io = new SocketIOServer(server, {
    pingTimeout: 60000,
    path: "/socket",
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A new user is connected", socket.id);

    socket.emit("connection", "Connected", () => {
      console.log("A client connected");
    });

    socket.on("joinBookingChat", (bookingId) => {
      socket.join(bookingId);
      console.log(`joined branch room: ${bookingId}`);
      console.log("Current rooms:", socket.rooms);
    });

    // New listener for message sending
    socket.on("sendMessage", (bookingId, message) => {
        io.to(bookingId).emit("receiveMessage", message);
      });

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  return io;
};

export default socketHandler;
