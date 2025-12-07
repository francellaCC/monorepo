import { io, Socket } from 'socket.io-client';
import type { IDrawAction } from '../pages/boardGamePage/types';
// import { ServerToClientEvents, ClientToServerEvents } from '../../../backend/src/types/socketEvents';

type SocketType = Socket<any, any>;

class SocketManager {
  private static instance: SocketManager;
  private socket: SocketType | null = null;
  private connectionListeners: Array<(socket: SocketType) => void> = [];
  private disconnectionListeners: Array<() => void> = [];

  private constructor() { }

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public connect(): Promise<SocketType> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        // Si ya está conectado, ejecutar los listeners inmediatamente
        this.connectionListeners.forEach(listener => listener(this.socket!));
        resolve(this.socket);
        return;
      }

      // Si hay un socket existente pero desconectado, limpiarlo primero
      if (this.socket && !this.socket.connected) {
        this.socket.removeAllListeners();
        this.socket = null;
      }

      this.socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
        autoConnect: true,
        timeout: 5000,
        transports: ['websocket', 'polling']
      });

      this.socket.on("connect", () => {
        console.log("✅ Conectado al servidor:", this.socket?.id);
        this.connectionListeners.forEach(listener => listener(this.socket!));
        resolve(this.socket!);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("❌ Desconectado del servidor:", reason);
        this.disconnectionListeners.forEach(listener => listener());
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Error de conexión:", error);
        reject(error);
      });
    });
  }

  public getSocket(): SocketType | null {
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public onConnection(listener: (socket: SocketType) => void): void {
    this.connectionListeners.push(listener);
  }

  public onDisconnection(listener: () => void): void {
    this.disconnectionListeners.push(listener);
  }

  public removeConnectionListener(listener: (socket: SocketType) => void): void {
    const index = this.connectionListeners.indexOf(listener);
    if (index > -1) {
      this.connectionListeners.splice(index, 1);
    }
  }

  public removeDisconnectionListener(listener: () => void): void {
    const index = this.disconnectionListeners.indexOf(listener);
    if (index > -1) {
      this.disconnectionListeners.splice(index, 1);
    }
  }

  // Métodos de conveniencia para eventos comunes
  public joinGame(data: { playerId: string; name: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket?.emit("joinGame", data, (response: any) => {
        if (response?.ok) {
          resolve(response);
        } else {
          reject(response);
        }
      });
    });
  }

  // New method to join a room
  public joinRoom(data: { roomCode: string; playerId: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket?.emit("joinRoom", data, (response: any) => {
        if (response?.ok) resolve(response);
        else reject(response);
      });
    });
  }

  public leaveRoom(roomCode: string) {
    this.socket?.emit("leaveRoom", { roomCode });
  }

  public sendMessage(roomCode: string, playerId: string, message: string) {
    console.log("Enviando a backend:", {
      roomCode,
      playerId,
      message
    });
    this.socket?.emit("sendMessage", { roomCode, playerId, message }, (resp: any) => {
      console.log("Respuesta sendMessage:", resp);
    });
  }
  public onMessage(callback: (data: { name: string, message: string, timestamp: number }) => void) {
    this.socket?.off("newMessage");
    this.socket?.on("newMessage", callback);
  }

  public sendDrawAction(roomCode: string, drawActions: IDrawAction[]): void {
    console.log('📤 Enviando acción de dibujo:', drawActions);
    this.socket?.emit('sendDrawAction', { roomCode, drawActions });
  }

  public onDrawAction(callback: (drawActions: IDrawAction[]) => void): void {
    // Remover listener anterior para evitar duplicados
    this.socket?.off('getDraw');
    this.socket?.on('getDraw', callback);
  }

  public sendUserDrawing(roomCode: string, playerId: string) {
    this.socket?.emit("userDrawing", { roomCode, playerId });
  }


  public onUserDrawing(callback: (data: { playerId: string, name: string }) => void) {
    console.log("Registrando listener para userIsDrawing");
 
    this.socket?.off("userIsDrawing");
    this.socket?.on("userIsDrawing", callback);
  }
  public onUpdatePlayers(
    callback: (data: { players: { _id: string; name: string; socketId: string }[] }) => void
  ): void {
    this.socket?.off("updatePlayers");
    this.socket?.on("updatePlayers", callback);
  }

  // Borrar línea
  public eraseLine(roomCode: string, lineId: string) {
    this.socket?.emit("eraseLine", { roomCode, lineId });
  }

  public onLineErased(callback: (data: { lineId: string }) => void) {
    this.socket?.off("lineErased");
    this.socket?.on("lineErased", callback);
  }

  // Limpiar pizarra
  public clearBoard(roomCode: string) {
    this.socket?.emit("clearBoard", { roomCode });
  }

  public onBoardCleared(callback: () => void) {
    this.socket?.off("boardCleared");
    this.socket?.on("boardCleared", callback);
  }


  public offUpdatePlayers(callback: (data: { players: { _id: string; name: string; socketId: string }[] }) => void): void {
    this.socket?.off('updatePlayers', callback);
  }

  public offMessage(callback: (data: { name: string, message: string, timestamp: number }) => void): void {
    this.socket?.off('newMessage', callback);
  }
}

// Hook personalizado para usar el socket manager
export function useSocket() {
  const socketManager = SocketManager.getInstance();

  return {
    connect: () => socketManager.connect(),
    disconnect: () => socketManager.disconnect(),
    getSocket: () => socketManager.getSocket(),
    isConnected: () => socketManager.isConnected(),
    onConnection: (listener: (socket: SocketType) => void) => socketManager.onConnection(listener),
    onDisconnection: (listener: () => void) => socketManager.onDisconnection(listener),
    joinGame: (data: { playerId: string; name: string }) =>
      socketManager.joinGame(data),
    joinRoom: (data: { roomCode: string; playerId: string }) =>
      socketManager.joinRoom(data),
    leaveRoom: (roomCode: string) =>
      socketManager.leaveRoom(roomCode),
    sendMessage: (roomCode: string, playerId: string, message: string) =>
      socketManager.sendMessage(roomCode, playerId, message),
    onUpdatePlayers: (callback: (data: { players: { _id: string; name: string; socketId: string }[] }) => void) => socketManager.onUpdatePlayers(callback),
    onMessage: (callback: (data: { name: string, message: string, timestamp: number }) => void) => socketManager.onMessage(callback),
    offUpdatePlayers: (callback: (data: { players: { _id: string; name: string; socketId: string }[] }) => void) => socketManager.offUpdatePlayers(callback),
    offMessage: (callback: (data: { name: string, message: string, timestamp: number }) => void) => socketManager.offMessage(callback),
    onDrawAction: (callback: (message: IDrawAction[]) => void) => socketManager.onDrawAction(callback),
    sendDrawAction: (roomCode: string, msg: IDrawAction[]) => socketManager.sendDrawAction(roomCode, msg),
    sendUserDrawing: (roomCode: string, playerId: string) => socketManager.sendUserDrawing(roomCode, playerId),
    onUserDrawing: (callback: (data: { playerId: string, name: string }) => void) => socketManager.onUserDrawing(callback),
    eraseLine: (roomCode: string, lineId: string) => socketManager.eraseLine(roomCode, lineId),
    onLineErased: (callback: (data: { lineId: string }) => void) => socketManager.onLineErased(callback),
    clearBoard: (roomCode: string) => socketManager.clearBoard(roomCode),
    onBoardCleared: (callback: () => void) => socketManager.onBoardCleared(callback),
  };
}

export default SocketManager;