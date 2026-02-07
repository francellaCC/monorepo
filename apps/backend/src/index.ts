import express , {Request, Response} from 'express';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';


import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./types/socketEvents";
import { connectDB } from './config/database';
import languageRoutes from "./routes/languageRoutes";
import wordRoutes from './routes/wordRoutes';
import gameRoutes from './routes/gameRoomRoutes';
import playerRoutes from './routes/playerRoutes';
import { socketHandler } from './sockets';


dotenv.config();

const app = express();
const server = createServer(app);

connectDB();

app.use(express.json()); 

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/languages", languageRoutes)
app.use("/api/players", playerRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/rooms", gameRoutes);

const io = new Server<
  ClientToServerEvents,  // Eventos que el servidor escucha
  ServerToClientEvents,  // Eventos que el servidor emite
  InterServerEvents,     // Eventos entre servidores (cluster)
  SocketData             // Datos almacenados por socket
>(server, {
  cors: {
    origin: process.env.FrONTEND_URL || "http://localhost:5173", 
    methods: ["GET", "POST"],
  },  
});
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});