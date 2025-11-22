import { Server, Socket } from "socket.io";
import { Player } from "../models/Player.model";


export const playerSocket = (io: Server, socket: Socket) => {

  socket.on("registerSocket", async ({ playerId }) => {
    try {
      await Player.findByIdAndUpdate(playerId, {
        socketId: socket.id,
      });

      console.log(`🧩 Socket registrado para jugador ${playerId}: ${socket.id}`);

    } catch (error) {
      console.error("❌ Error registrando socket:", error);
    }
  });

  socket.on("disconnect", async () => {
    console.log("❌ Socket desconectado:", socket.id);

    await Player.findOneAndUpdate(
      { socketId: socket.id },
      { socketId: null }
    );
  });

};
