export interface PlayerRequest {
  name: string;

}

export interface PlayerResponse {
  _id: string;
  name: string;
}


export interface GameRoomRequest {
  languageCode: string
  playerId: string;
  code: string;
}
export interface GameRoomResponse {
  ok: Boolean;
  room: {
    language: string;
    status: string;
    _id: string;
    code: string;
  }
}

export interface ChatMessage {
  name: string;
  message: string;
  timestamp: number;
  playerId: string;
}