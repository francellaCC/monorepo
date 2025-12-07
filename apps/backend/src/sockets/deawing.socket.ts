import { Server, Socket } from "socket.io";
import { Player } from "../models/Player.model";
import color from "colors";


export const drawSocket = (io: Server, socket: Socket) => {

  try {
    socket.on("sendDrawAction", ({ roomCode, drawActions }) => {


      socket.to(roomCode).emit("getDraw", drawActions);
      console.log("BACKEND recibe:", drawActions);

    });

    socket.on("userDrawing", async ({ roomCode, playerId }) => {

      const playerName = await Player.findById(playerId).then(player => player?.name || 'Unknown');
      console.log(`Jugador ${playerName} está dibujando en la sala ${roomCode}`);
      const player = {
        playerId,
        name: playerName
      }

      console.log(color.blue("📥 EVENTO userDrawing LLEGÓ AL SERVER:"), player);
      socket.to(roomCode).emit("userIsDrawing", {
        playerId,
        name: playerName
      });
    });

    socket.on("eraseLine", ({ roomCode, lineId }) => {
      socket.to(roomCode).emit("lineErased", { lineId });
    });


    socket.on("clearBoard", ({ roomCode }) => {
      socket.to(roomCode).emit("boardCleared");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  } catch (error) {
    console.error("Error in drawSocket:", error);
  }
}