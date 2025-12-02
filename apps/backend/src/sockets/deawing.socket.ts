import { Server, Socket } from "socket.io";


export const drawSocket = (io: Server, socket: Socket) => {

  try {
    socket.on("sendDrawAction", ({ roomCode, drawActions }) => {
      socket.to(roomCode).emit("getDraw", drawActions);
    });

    socket.on("userDrawing", ({ roomCode, playerId }) => {
      socket.to(roomCode).emit("userIsDrawing", { playerId });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  } catch (error) {
    console.error("Error in drawSocket:", error);
  }
}