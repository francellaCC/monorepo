import React, { useEffect, useRef, useState } from "react";
import Canvas from "../../components/canvas";
import { useParams } from "react-router-dom";
import ChatComponent from "../../components/chat";
import PaintTool from "../../components/paintTool";
import Participants from "../../components/Participants";
import WordMistery from "../../components/WordMistery";
import { useSocket } from "../../api/conexion";
import type { IDrawAction } from "./types";
import { Play, Send, Share2 } from "lucide-react";
import { getRoomStatus, updateRoomStatus } from "../../api/gameRoomService";
import type { ChatMessage } from "../../../types";

const BoardGamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [selectedTool, setSelectedTool] = React.useState<string | null>(null);
  const [roomStatus, setRoomStatus] = useState<string>("started");
  const socket = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const [currentDrawing, setCurrentDrawing] = React.useState<IDrawAction[]>([]);
  const [playersRoom, setPlayersRoom] = useState<
    { _id: string; name: string; socketId: string }[]
  >([]);
  const [isSomeoneDrawing, setIsSomeoneDrawing] = useState<string | null>(null);
  const [allLines, setAllLines] = useState<IDrawAction[][]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const playerId = localStorage.getItem("playerId");
  const [wordToGuess, setWordToGuess] = useState<string>("");

  // tools
  const [currentColor, setCurrentColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(2);
  const [isErasing, setIsErasing] = useState(false);

  const handleErase = () => {
    setIsErasing(!isErasing);
    if (!isErasing) {
      setCurrentColor("#FFFFFF");
      // emitir al backend
    } else {
      setCurrentColor("#000000");
    }
  };

  const handlePlayClick = async () => {
    console.log("Iniciar partida");
    // Lógica para iniciar la partida
    const res = await updateRoomStatus(id!, "started");
    console.log("Room status updated:", res);
    setRoomStatus("started");
   
      // Notificar a los jugadores que la partida ha comenzado

   
  };

  useEffect(() => { 
    if (roomStatus == "started") {
      socket.showNewWord(id!);
      socket.onNewWord(({ word }) => {
       setWordToGuess(word)
        console.log("Nueva palabra recibida:", word);
      });
    }
  }, [roomStatus]);
  const handleReciveDrawAction = (drawActions: IDrawAction[]) => {
    setCurrentDrawing(drawActions);
    setAllLines((prev) => [...prev, drawActions]);
  };

  const handleEmitDrawAction = (msg: IDrawAction[]) => {

    setCurrentDrawing(msg);
    socket.sendDrawAction(id!, msg);
    socket.sendUserDrawing(id!, localStorage.getItem("playerId")!);
  };
  const handleShareLink = () => {

    const link = `${window.location.origin}/join/${id}`;

    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("link copiado");
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
      });
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const msgElement = form.elements.namedItem(
      "msg"
    ) as HTMLInputElement | null;
    const rawValue = msgElement?.value ?? "";

    const messageInput = rawValue.toString().trim();
    const roomCode = id!;
    if (messageInput) {

      socket.sendMessage(roomCode, playerId!, messageInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "Tú",
          message: messageInput,
          timestamp: Date.now(),
          playerId: playerId!,
        },
      ]);
      if (msgElement) msgElement.value = "";

      handleGuessWord();
    }
  };

  const handleGuessWord = () => {
    // lógica para adivinar la palabra
    const word = messages.find(msg => msg.message === wordToGuess)?.message;
    
    console.log("Palabra adivinada:", word);
  }

  useEffect(() => {
    const roomCode = id!;

    const getStatus = async () => {
      const statusResp = await getRoomStatus(roomCode);
      setRoomStatus(statusResp.status);
      setIsOwner(statusResp.owner === playerId);
    };
    getStatus();

    const run = async () => {
      const resp = await socket.joinRoom({ roomCode, playerId: playerId! });

      if (resp.ok) {
        setMessages(resp.messages || []);
      }
    };
    socket
      .connect()
      .then(() => {
        socket.onUpdatePlayers(({ players }) => {
          setPlayersRoom(players);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              name: "Sistema",
              message: `: ${players.find((p) => p._id === playerId)?.name || "Desconocido"
                } se ha unido al juego`,
              timestamp: Date.now(),
              playerId: "sistema",
            },
          ]);
        });
        run();
        socket.onMessage(({ name, message, timestamp }) => {

          setMessages((prevMessages) => [
            ...prevMessages,
            { name, message, timestamp, playerId: "" },
          ]);
        });
        socket.onDrawAction(handleReciveDrawAction);
        setIsConnected(true);

        socket.onUserDrawing(({ playerId, name }) => {

          setIsSomeoneDrawing(playerId);

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              name: "",
              message: ` ${name} está dibujando...`,
              timestamp: Date.now(),
              playerId: "sistema",
            },
          ]);
        });
        socket.onLineErased(({ lineId }) => {
          setAllLines((prev) =>
            prev.filter((line) =>
              line.length === 0 ? false : line[0].lineId !== lineId
            )
          );
        });

        socket.onBoardCleared(() => {
          setAllLines([]);
        });
        console.log("✅ Socket conectado en BoardGamePage");
      })
      .catch((error) => {
        console.error("Error al conectar:", error);
      });

    return () => {
      socket.leaveRoom(id!);
      // Limpiar solo el listener de draw action
      const socketInstance = socket.getSocket();
      if (socketInstance) {
        socketInstance.off("drawAction");
      }
    };
  }, []);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleClearBoard = () => {
    socket.clearBoard(id!);
    setAllLines([]);
  };

  if (!id) {
    return <div>Invalid Board Game ID</div>;
  }
  return (
    <div className=" overflow-hidden flex flex-col  ">
      <div className="w-full h-full flex flex-col  mt-0">
        {/* Top Bar */}
        <div className="rounded-3xl bg-white shadow-lg p-4 mb-4 flex justify-between items-center">
          <div>
            <h1 className="font-semibold text-lg">Board Game Page: {id}</h1>
            <WordMistery texto={wordToGuess} show={true} underlineCount={7} />
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="flex flex-1 gap-4 min-h-0 ">
          {/* PARTICIPANTES */}
          <div className="w-60 flex flex-col gap-4">
            {/* Players List */}
            <div className="bg-white rounded-3xl shadow-lg p-4 animate-in fade-in slide-in-from-right duration-300">
              <h3 className="text-sm text-gray-600 mb-3">
                Jugadores {playersRoom.length}
              </h3>
              <div className="space-y-2">
                <Participants participants={playersRoom} />
              </div>
            </div>
          </div>
          {/* CANVAS */}
          <div className="flex flex-col flex-1 min-w-0 gap-4 ">
            <div className="flex-1 min-h-0">
              <Canvas
                selectedTool={selectedTool ?? "NONE"}
                printLineCallback={handleEmitDrawAction}
                allLines={allLines}
                setIsErasing={setIsErasing}
                currentUserDrawing={false}
                newPathToDraw={currentDrawing}
                brushSize={brushSize}
                currentColor={currentColor}
                status={roomStatus.toString()}
                className="w-full h-full bg-white rounded-xl shadow-inner border-4 border-gray-200"
              />
            </div>

            {roomStatus != "waiting" ? (
              <>
                <PaintTool
                  onToolSelect={handleToolSelect}
                  currentColor={currentColor}
                  onColorChange={setCurrentColor}
                  brushSize={brushSize}
                  onBrushSizeChange={setBrushSize}
                  onClear={handleClearBoard}
                  onEraseLine={handleErase}
                  isErasing={isErasing}
                />
              </>
            ) : (
              <>
                {isOwner && (
                  <div className="flex gap-4 animate-in fade-in slide-in-from-bottom duration-500">
                    <button
                      onClick={handleShareLink}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-xl transform hover:scale-[1.02] transition-all shadow-lg"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Invitar amigos</span>
                    </button>

                    <button
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl shadow-lg transition-all 
                                                bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl transform hover:scale-[1.02]"
                      onClick={handlePlayClick}
                    >
                      <Play className="w-5 h-5" />
                      <span>Iniciar partida</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* CHAT */}
          <div className="w-72 h-[600px] bg-white rounded-3xl shadow-lg p-4 flex flex-col ">
            <h3 className="text-sm text-gray-600 mb-3">Chat</h3>
            <div className=" flex-1 overflow-y-scroll overflow-x-hidden">
              <ChatComponent messages={messages} />
            </div>
            <form className="flex gap-2 mt-3" onSubmit={handleSendMessage}>
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage(
                      e.target as unknown as React.FormEvent<HTMLFormElement>
                    );
                  }
                }}
                placeholder="Escribe un mensaje..."
                name="msg"
                className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 text-sm"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-gray-200 text-gray-700 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardGamePage;
