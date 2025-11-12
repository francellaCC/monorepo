export interface ServerToClientEvents {
  updatePlayers: (players:{name:string}[]) => void;
  message: (message: string) => void;
  getDraw: (drawActions: any[]) => void;
}

export interface ClientToServerEvents {
  joinGame: (name: string) => void;
  sendMessage: (message: string) => void;
  sendDrawAction: (drawActions: any[]) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
}