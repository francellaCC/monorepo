
import { io, Socket } from 'socket.io-client';
import './styles.scss'
import { useEffect, useState } from 'react';

function ChatComponent() {

  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState<{ name: string }[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");


  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Conectado al servidor:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Desconectado del servidor");
    });

    // Escuchar eventos del backend
    newSocket.on("updatePlayers", (playerList) => {
      console.log("🧍 Lista actualizada:", playerList);
      setPlayers(playerList);
    });

    newSocket.on("message", (msg) => {
      console.log("💬 Mensaje recibido:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    // Limpieza al desmontar
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 2️⃣ Unirse al juego
  const handleJoin = () => {
    if (!socket || !name.trim()) return;
    socket.emit("joinGame", name);
    setJoined(true);
  };

  // 3️⃣ Enviar mensaje
  const handleSend = () => {
    if (!socket || !message.trim()) return;
    socket.emit("sendMessage", message);
    setMessage("");
  };

  // 4️⃣ Interfaz simple para pruebas
  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>

      {!joined ? (
        <>
          <input
            type="text"
            placeholder="Tu nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleJoin}>Unirse</button>
        </>
      ) : (
        <>
          <h3>Jugadores conectados</h3>
          <ul>
            {players.map((p, i) => (
              <li key={i}>{p.name}</li>
            ))}
          </ul>

          <h3>Chat</h3>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "0.5rem",
              height: "150px",
              overflowY: "auto",
            }}
          >
            {messages.map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </div>

          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSend}>Enviar</button>
        </>
      )}
    </div>
  );
}

export default ChatComponent
