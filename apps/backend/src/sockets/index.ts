import { Server } from "socket.io";
import { playerSocket } from "./player.socket";
import { gameRoomSocket } from "./gameRoom.socket";


export const socketHandler = (io: Server) => {
  io.on("connect", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);

    playerSocket(io, socket);
    gameRoomSocket(io, socket);
   
  });
};
