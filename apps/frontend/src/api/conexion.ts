import { io, Socket } from 'socket.io-client';
import type { IDrawAction } from '../pages/boardGamePage/types';
// import { ServerToClientEvents, ClientToServerEvents } from '../../../backend/src/types/socketEvents';

type SocketType = Socket<any, any>;

class SocketManager {
  private static instance: SocketManager;
  private socket: SocketType | null = null;
  private connectionListeners: Array<(socket: SocketType) => void> = [];
  private disconnectionListeners: Array<() => void> = [];

  private constructor() {}

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
  public joinGame(playerName: string): void {
    this.socket?.emit('joinGame', playerName);
  }

  public sendMessage(message: string): void {
    this.socket?.emit('sendMessage', message);
  }

  public sendDrawAction(drawActions: IDrawAction[]): void {
    console.log('📤 Enviando acción de dibujo:', drawActions);
    this.socket?.emit('sendDrawAction', drawActions);
  }

  public onDrawAction(callback: (drawActions: IDrawAction[]) => void): void {
    // Remover listener anterior para evitar duplicados
    this.socket?.off('getDraw');
    this.socket?.on('getDraw', callback);
  }

  public onUpdatePlayers(callback: (players: {name: string}[]) => void): void {
    this.socket?.off('updatePlayers');
    this.socket?.on('updatePlayers', callback);
  }

  public onMessage(callback: (message: string) => void): void {
    this.socket?.off('message');
    this.socket?.on('message', callback);
  }

  public offUpdatePlayers(callback: (players: {name: string}[]) => void): void {
    this.socket?.off('updatePlayers', callback);
  }

  public offMessage(callback: (message: string) => void): void {
    this.socket?.off('message', callback);
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
    joinGame: (name: string) => socketManager.joinGame(name),
    sendMessage: (message: string) => socketManager.sendMessage(message),
    onUpdatePlayers: (callback: (players: {name: string}[]) => void) => socketManager.onUpdatePlayers(callback),
    onMessage: (callback: (message: string) => void) => socketManager.onMessage(callback),
    offUpdatePlayers: (callback: (players: {name: string}[]) => void) => socketManager.offUpdatePlayers(callback),
    offMessage: (callback: (message: string) => void) => socketManager.offMessage(callback),
    onDrawAction: (callback: (message: IDrawAction[]) => void) => socketManager.onDrawAction(callback),
    sendDrawAction: (msg: IDrawAction[]) => socketManager.sendDrawAction(msg),
  };
}

export default SocketManager;