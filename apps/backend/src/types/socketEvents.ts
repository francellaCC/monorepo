export interface ServerToClientEvents {
  updatePlayers: (players: { 
    playerId: string;
    name: string; 
    score: number;
    socketId?: string;
  }[]) => void;

  message: (data: { from: string; message: string }) => void;

  getDraw: (drawActions: any[]) => void;

  roomUpdated: (room: {
    roomId: string;
    players: {
      playerId: string;
      name: string;
      score: number;
    }[]
  }) => void;
}

export interface ClientToServerEvents {
  registerSocket: (data: { playerId: string }) => void;
  
  joinGame: (data: { 
    playerId: string; 
    name: string; 
    roomId?: string;
  }) => void;

  sendMessage: (data: { 
    playerId: string;
    message: string;
  }) => void;

  sendDrawAction: (drawActions: any[]) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  playerId?: string;
  name?: string;
  roomId?: string;
}
