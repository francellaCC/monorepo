import { Server } from "socket.io";
import { playerSocket } from "./player.socket";


export const socketHandler = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    playerSocket(io, socket);
   
  });
};
