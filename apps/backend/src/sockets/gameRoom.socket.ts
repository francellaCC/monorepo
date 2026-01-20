import { Server, Socket } from "socket.io";
import { GameRoom } from "../models/GameRoom.model";
import { loadWordsFromDB } from "../helpers/loadWords";
import color from "colors";



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

  socket.on("loadWords", async ({ roomCode }) => {
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
      console.log("Palabras cargadas para room", roomCode, ":", words);
      // Enviamos solo la PRIMERA palabra
      io.to(roomCode).emit("newWord", {
        word: words[0].text
      });
    } catch (error) {
      console.error("loadWords error:", error);
      socket.emit("wordsLoaded", { ok: false, message: "Internal server error" });
    }
  });

  socket.on("guessWord", async ({ roomCode, guessedWord, playerId }) => {

    const room = await GameRoom.findOne({ code: roomCode });

    console.log(color.blue(`Socket ${socket.id} guessed word "${guessedWord}" in room ${roomCode} with playerId ${playerId} `));

    if(!roomsWords[roomCode]){
      socket.emit("guessResult", { ok: false, message: "Room words not found" });
      return;
    }

    if(!room?.players.includes(playerId)){
      socket.emit("guessResult", { ok: false, message: "Player not in room" });
      return;
    }

    const words = roomsWords[roomCode];
    const currentIndex = roomsIndex[roomCode];
    if (!words || currentIndex === undefined) {
      socket.emit("guessResult", { ok: false, message: "Words not loaded" });
      return;
    }
    const currentWord = words[currentIndex];
    if (guessedWord.toLowerCase() === currentWord.text.toLowerCase()) {
      // Acierto
      roomsIndex[roomCode] += 1;
      const nextIndex = roomsIndex[roomCode];
      if (nextIndex < words.length) {
        console.log(color.green(`Correct guess! Moving to next word in room ${roomCode}`));
        console.log("Next word:", words[nextIndex].text);
        io.to(roomCode).emit("newWord", {
          word: words[nextIndex].text
        });
      }else{
        io.to(roomCode).emit("gameOver", { message: "All words guessed!" });
        console.log(color.green(`All words guessed in room ${roomCode}. Game over.`));
      }
      socket.emit("guessResult", { ok: true, correct: true, playerId });
    } else {
      // Fallo
      socket.emit("guessResult", { ok: true, correct: false });
    }
  });

}