import type { GameRoomRequest, GameRoomResponse, GameRoomStatusResponse } from "../../types";
import { API } from "./axios";

interface GameUpdate {
  ok: boolean;
  status: string;
}

export const createGameRoom = async ({ languageCode, playerId, code }: GameRoomRequest): Promise<GameRoomResponse> => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("Creating game room with data:", { languageCode, playerId, code });
  const response = await API.post<GameRoomResponse>("rooms/", { languageCode, playerId, code });
  return response.data;
}

export const getGameRoom = async (code: GameRoomRequest['code']): Promise<GameRoomResponse> => {
  const response = await API.get<GameRoomResponse>(`rooms/${code}`);
  return response.data
}

export const getRoomStatus = async (code: GameRoomRequest['code']): Promise<GameRoomStatusResponse> => {
  const response = await API.get<GameRoomStatusResponse>(`rooms/status/${code}`);
  return response.data
}

export const updateRoomStatus = async (code: GameRoomRequest['code'], status: string): Promise<GameUpdate> => {
  const response = await API.post<GameUpdate>(`rooms/status/${code}`, { status });
  return response.data
}