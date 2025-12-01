import { Server, Socket } from "socket.io";
import { Player } from "../models/Player.model";

export const chatSocket = (io: Server, socket: Socket) => {
  
  socket.on("sendMessage", async ({ roomCode, message, playerId }, callback) => {
    try {

      const player = await Player.findById(playerId);
      if (!player) {
        return callback({ ok: false, message: "Player not found" });
      }
      const chatMessage = {
        name: player.name,
        playerId,
        message,
        
      };
      io.to(roomCode).emit("newMessage", chatMessage);
      return callback({ ok: true });
    } catch (error) {
      console.error("sendMessage error:", error);
      return callback({ ok: false, message: "Internal server error" });
    }
  });
}