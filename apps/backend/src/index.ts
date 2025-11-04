import express from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./types/socketEvents";

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server<
  ClientToServerEvents,  // Eventos que el servidor escucha
  ServerToClientEvents,  // Eventos que el servidor emite
  InterServerEvents,     // Eventos entre servidores (cluster)
  SocketData             // Datos almacenados por socket
>(server, {});
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

/* Este es el evento global que se ejecuta cada vez que un nuevo cliente se conecta (por ejemplo, un navegador o una app).
socket representa la conexión específica de ese cliente.
Cada cliente tiene un identificador único socket.id.
📘 En palabras simples:
              “Cuando alguien se conecta, ejecuto esta función y guardo su conexión.” */

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Eventos personalizados

  // Los mensajes con nombre entre clientes y el servidor se manejan mediante eventos personalizados.
  socket.on("joinGame", (playerName) => { // Escuchamos el evento "chat message" enviado por el cliente
    socket.data.name = playerName; // Guardamos el nombre del jugador en los datos del socket
    console.log(`🎮 Jugador unido: ${playerName}`);
    io.emit("updatePlayers", [{ name: playerName }]); // Emitimos a todos los clientes el evento "updatePlayers" con la lista de jugadores
  });


  socket.on("sendMessage", (msg) => {
    console.log(`💬 ${socket.data.name}: ${msg}`);
    io.emit("message", `${socket.data.name}: ${msg}`);
  });

  // Este evento registra cuando un cliente se desconecta: cierra el navegador, pierde la conexión, etc.
  // Sirve para limpiar recursos o notificar a otros usuarios.
  socket.on("disconnect", () => {
    console.log(`🔴 Cliente desconectado: ${socket.id}`);
  });

});


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});