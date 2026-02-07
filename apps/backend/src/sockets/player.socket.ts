import { Server, Socket } from "socket.io";
import { Player } from "../models/Player.model";


export const playerSocket = (io: Server, socket: Socket) => {

 socket.on("joinGame", async (data, callback) => {
  try {
    const { playerId, name } = data;

    console.log("📥 joinGame received:", data);

    // Siempre retornar el documento actualizado
    const updated = await Player.findByIdAndUpdate(
      playerId,
      { socketId: socket.id },
      { new: true }   // 👈 MUY IMPORTANTE
    );

    if (!updated) {
      return callback({
        ok: false,
        message: "Player not found"
      });
    }

    // Guardar datos en el socket
    socket.data.playerId = updated._id.toString();
    socket.data.name = updated.name;

    console.log(`🧩 Socket registered for player ${updated._id}: ${socket.id}`);

    // 👉 Primero responder al cliente que llamó
    callback({
      ok: true,
      socketId: socket.id,
      playerId: updated._id,
      name: updated.name
    });

    // 👉 Luego avisar al resto
    io.emit("playerJoined", { playerId: updated._id, name: updated.name });

  } catch (error) {
    console.error("❌ Error registering socket:", error);
    callback({
      ok: false,
      message: "Internal server error",
    });
  }
});

  socket.on("disconnect", async () => {
    console.log("❌ Socket disconnected:", socket.id);

    await Player.findOneAndUpdate(
      { socketId: socket.id },
      { socketId: null }
    );
  });

};
