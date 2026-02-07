import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../../api/conexion";
import type { IDrawAction } from "../types";
import type { ChatMessage } from "../../../../types";

interface UseGameRoomProps {
  roomCode: string;
  playerId: string;
}
export function useGameRoom({ roomCode, playerId }: UseGameRoomProps) {
  const socket = useSocket();

  /* ========================
      STATE
  ========================= */

  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState<
    { _id: string; name: string; socketId: string }[]
  >([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<IDrawAction[]>([]);
  const [allLines, setAllLines] = useState<IDrawAction[][]>([]);
  const [drawingPlayer, setDrawingPlayer] = useState<string | null>(null);
  const [wordToGuess, setWordToGuess] = useState<string>("");
  const playersRef = useRef(players);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  /* ========================
        SOCKET HANDLERS
    ========================= */

  const handleMessage = useCallback(
    (data: { name: string; message: string; timestamp: number; playerId?: string }) => {
      const normalized: ChatMessage = {
        name: data.name,
        message: data.message,
        timestamp: data.timestamp,
        playerId: data.playerId ?? "sistema",
      };
      setMessages((prev) => [...prev, normalized]);
    },
    []
  );

  const handlePlayersUpdate = useCallback(
    (data: { players: { _id: string; name: string; socketId: string }[] }) => {
      setPlayers(data.players);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "Sistema",
          message: `: ${data.players.find((p) => p._id === playerId)?.name || "Desconocido"
            } se ha unido al juego`,
          timestamp: Date.now(),
          playerId: "sistema",
        },
      ]);
    },
    [playerId]
  );

  const handleDraw = useCallback((actions: IDrawAction[]) => {
    setCurrentDrawing(actions);
    setAllLines((prev) => [...prev, actions]);
  }, []);

  const handleUserDrawing = useCallback(
    (data: { playerId: string; name: string }) => {
      setDrawingPlayer(data.playerId);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "",
          message: ` ${data.name} está dibujando...`,
          timestamp: Date.now(),
          playerId: "sistema",
        },
      ]);
    },
    []
  );

  const handleNewWord = useCallback(
    (data: { word: string }) => {
      setWordToGuess(data.word);
    },
    []
  );

  const handleLineErased = useCallback(
    (data: { lineId: string }) => {
      setAllLines((prev) =>
        prev.filter(
          (line) => line.length > 0 && line[0].lineId !== data.lineId
        )
      );
    },
    []
  );

  const handleBoardCleared = useCallback(() => {
    setAllLines([]);
  }, []);

  const handleWordGuessed = useCallback(
    (guessResult: { correct: boolean; playerId: string }) => {
      if (!guessResult.correct) return;
      const winnerName =
        playersRef.current.find((p) => p._id === guessResult.playerId)?.name ||
        "Alguien";
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          name: "Sistema",
          message: ` ${winnerName} ha adivinado la palabra! 🎉`,
          timestamp: Date.now(),
          playerId: "sistema",
        },
      ]);
    },
    []
  );

  /* ========================
      CONNECT & JOIN
  ========================= */

  useEffect(() => {
    if (!roomCode || !playerId) return;
    let mounted = true;

    const init = async () => {
      try {
        await socket.connect();
        if (!mounted) return;

        const resp = await socket.joinRoom({ roomCode, playerId });
        if (resp?.ok && resp?.messages) {
          setMessages(resp.messages);
        }
        setIsConnected(true);

        console.log("players", resp?.players);
        if (resp?.players) {
          handlePlayersUpdate({ players: resp.players });
        }

        if(resp?.status === "started" && resp?.currentWord){
          handleNewWord({ word: resp.currentWord });
        }
        socket.onMessage(handleMessage);
        socket.onUpdatePlayers(handlePlayersUpdate);
        socket.onDrawAction(handleDraw);
        socket.onUserDrawing(handleUserDrawing);
        socket.onNewWord(handleNewWord);
        socket.onLineErased(handleLineErased);
        socket.onBoardCleared(handleBoardCleared);
        socket.onWordGuessed(handleWordGuessed);

        console.log("✅ useGameRoom conectado");
      } catch (err) {
        console.error("❌ useGameRoom error:", err);
      }
    };

    init();

    return () => {
      mounted = false;

      socket.leaveRoom(roomCode);

      socket.offMessage(handleMessage);
      socket.offUpdatePlayers(handlePlayersUpdate);
      const socketInstance = socket.getSocket();
      if (socketInstance) {
        socketInstance.off("getDraw", handleDraw);
        socketInstance.off("userIsDrawing", handleUserDrawing);
        socketInstance.off("newWord", handleNewWord);
        socketInstance.off("lineErased", handleLineErased);
        socketInstance.off("boardCleared", handleBoardCleared);
        socketInstance.off("guessResult", handleWordGuessed);
      }
    };
  }, [
    roomCode,
    playerId,
    handleMessage,
    handlePlayersUpdate,
    handleDraw,
    handleUserDrawing,
    handleNewWord,
    handleLineErased,
    handleBoardCleared,
    handleWordGuessed,
  ]);

  /* ========================
      ACTIONS
  ========================= */

  const sendMessage = useCallback(
    (message: string) => {
      if (!roomCode || !playerId) return;
      socket.sendMessage(roomCode, playerId, message);
    },
    [roomCode, playerId]
  );

  const sendDraw = useCallback(
    (actions: IDrawAction[]) => {
      if (!roomCode || !playerId) return;
      setCurrentDrawing(actions);
      socket.sendDrawAction(roomCode, actions);
      socket.sendUserDrawing(roomCode, playerId);
    },
    [roomCode, playerId]
  );

  const clearBoard = useCallback(() => {
    if (!roomCode) return;
    socket.clearBoard(roomCode);
    setAllLines([]);
  }, [roomCode]);

  const eraseLine = useCallback(
    (lineId: string) => {
      if (!roomCode) return;
      socket.eraseLine(roomCode, lineId);
    },
    [roomCode]
  );

  const loadWord = useCallback(() => {
    if (!roomCode) return;
    socket.showNewWord(roomCode);
  }, [roomCode]);

  const sendGuess = useCallback(
    (guess: string) => {
      if (!roomCode || !playerId) return;
      socket.sendGuess(roomCode, guess, playerId);
    },
    [roomCode, playerId]
  );

  /* ========================
      API
  ========================= */

  return {
    isConnected,
    players,
    messages,
    currentDrawing,
    allLines,
    drawingPlayer,
    wordToGuess,

    sendMessage,
    sendDraw,
    clearBoard,
    eraseLine,
    loadWord,
    sendGuess,
  };
}
