import React, { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../../api/conexion';
import './styles.scss';

function ChatPage() {
  const socket = useSocket();
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [players, setPlayers] = useState<{ name: string }[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  // Callbacks para eventos de socket
  const handleUpdatePlayers = useCallback((playerList: { name: string }[]) => {
    console.log("🧍 Lista actualizada:", playerList);
    setPlayers(playerList);
  }, []);

  const handleMessage = useCallback((msg: string) => {
    console.log("Mensaje recivido", msg);
    setMessages((prev) => [...prev, msg]);
  }, []);

  const handleConnection = useCallback((connectedSocket: any) => {
    console.log("✅ Conectado al servidor " + connectedSocket.id);
    setIsConnected(true);
  }, []);

  const handleDisconnection = useCallback(() => {
    console.log("❌ Desconectado del servidor");
    setIsConnected(false);
    setJoined(false);
  }, []);

  useEffect(() => {
    // Conectar al socket
    socket.connect().then(() => {
      console.log("✅ Socket conectado en ChatPage");
      setIsConnected(true);
      socket.onUpdatePlayers(handleUpdatePlayers);
      socket.onMessage(handleMessage);
      socket.onConnection(handleConnection);
      socket.onDisconnection(handleDisconnection);
    }).catch((error) => {
      console.error("Error al conectar:", error);
      setIsConnected(false);
    });

    // Limpieza al desmontar el componente
    return () => {
      // Remover todos los listeners de estos eventos específicamente
      const socketInstance = socket.getSocket();
      if (socketInstance) {
        socketInstance.off('updatePlayers');
        socketInstance.off('message');
      }
    };
  }, []); // Solo ejecutar una vez al montar el componente

  // Unirse al juego
  const handleJoin = () => {
    if (!name.trim() || !isConnected) return;
    socket.joinGame(name);
    setJoined(true);
  };

  // Enviar mensaje
  const handleSend = () => {
    if (!message.trim() || !isConnected) return;
    socket.sendMessage(message);
    setMessage("");
  };

  // Manejar Enter en los inputs
  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  const handleMessageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>🎨 Prueba de Socket.IO</h1>
      
      {/* Estado de conexión */}
      <div style={{ marginBottom: "1rem" }}>
        Estado: {isConnected ? 
          <span style={{ color: "green" }}>🟢 Conectado</span> : 
          <span style={{ color: "red" }}>🔴 Desconectado</span>
        }
      </div>

      {!joined ? (
        <>
          <input
            type="text"
            placeholder="Tu nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleNameKeyPress}
            disabled={!isConnected}
          />
          <button 
            onClick={handleJoin}
            disabled={!isConnected || !name.trim()}
          >
            Unirse
          </button>
        </>
      ) : (
        <>
          <h3>Jugadores conectados ({players.length})</h3>
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
              marginBottom: "0.5rem"
            }}
          >
            {messages.map((m, i) => (
              <div key={i}>{m}</div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleMessageKeyPress}
              disabled={!isConnected}
              style={{ flex: 1 }}
            />
            <button 
              onClick={handleSend}
              disabled={!isConnected || !message.trim()}
            >
              Enviar
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatPage;