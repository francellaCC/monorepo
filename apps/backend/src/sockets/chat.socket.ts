import { Server, Socket } from "socket.io";
import { Player } from "../models/Player.model";
import { time } from "console";

export const chatSocket = (io: Server, socket: Socket) => {

  socket.on("sendMessage", async ({ roomCode, message, playerId }, callback) => {
    try {
      socket.on("sendMessage", (data) => {
        console.log("📥 EVENTO LLEGÓ AL SERVER:", data);
      });

      const player = await Player.findById(playerId);
      if (!player) {
        return callback({ ok: false, message: "Player not found" });
      }
      const chatMessage = {
        name: player.name,
        playerId,
        message,
        timestamp: Date.now(),
      };
console.log("Salas del socket:", socket.rooms);

      console.log("Nuevo mensaje en sala", roomCode, "de", player.name + ":", message);
      console.log("Nuevo mensaje en sala", roomCode, "de", player.name + ":", message);
      socket.to(roomCode).emit("newMessage", chatMessage);
      return callback({ ok: true });
    } catch (error) {
      console.error("sendMessage error:", error);
      return callback({ ok: false, message: "Internal server error" });
    }
  });
}