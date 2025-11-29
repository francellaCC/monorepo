import { Server, Socket } from "socket.io";
import { GameRoom } from "../models/GameRoom.model";

export const gameRoomSocket = (io: Server, socket: Socket) => {
  socket.on("joinRoom", async ({ roomCode, playerId }, callback) => {
    try {
      const room = await GameRoom.findOne({ code: roomCode });

      if (!room) {
        return callback({ ok: false, message: "Room not found" });
      }

      socket.join(roomCode);
    
      if (!room.players.includes(playerId)) {
        room.players.push(playerId);
        await room.save();
      }
      socket.to(roomCode).emit("playerJoinedRoom", {
        playerId
      });

      return callback({
        ok: true,
        roomId: room._id,
        roomCode
      });

    } catch (error) {
      console.error("joinRoom error:", error);
      return callback({ ok: false, message: "Internal server error" });
    }
  });
}