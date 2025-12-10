import { Server, Socket } from "socket.io";
import { GameRoom } from "../models/GameRoom.model";
import { loadWordsFromDB } from "../helpers/loadWords";


const roomsWords: Record<string, any[]> = {};
const roomsIndex: Record<string, number> = {};


export const gameRoomSocket = (io: Server, socket: Socket) => {
  socket.on("joinRoom", async ({ roomCode, playerId }, callback) => {
    try {
      const room = await GameRoom.findOne({ code: roomCode });

      if (!room) {
        return callback({ ok: false, message: "Room not found" });
      }

      socket.join(roomCode);
      console.log("Socket joined room:", roomCode, "socketId:", socket.id);


      if (!room.players.includes(playerId)) {
        room.players.push(playerId);
        await room.save();
      }

      await room.populate("players", "name socketId");
      io.to(roomCode).emit("updatePlayers", {
        players: room.players
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

  socket.on("loadWords",async({roomCode})=>{
    try {
      const room = await GameRoom.findOne({ code: roomCode });
      if (!room) {
        socket.emit("wordsLoaded", { ok: false, message: "Room not found" });
        return;
      }
      const languageId = room.language._id;
      const words = await loadWordsFromDB(languageId, 5);
     // Guardamos palabras SOLO en memoria backend
            roomsWords[roomCode] = words;
            roomsIndex[roomCode] = 0;

            // Enviamos solo la PRIMERA palabra
            io.to(roomCode).emit("newWord", {
                word: words[0]
            });
    } catch (error) {
      console.error("loadWords error:", error);
      socket.emit("wordsLoaded", { ok: false, message: "Internal server error" });
    }
  });
}