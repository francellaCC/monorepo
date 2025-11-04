export interface ServerToClientEvents {
  updatePlayers: (players:{name:string}[]) => void;
  message: (message: string) => void;
}

export interface ClientToServerEvents {
  joinGame: (name: string) => void;
  sendMessage: (message: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
}