import type { GameRoomRequest, GameRoomResponse } from "../../types";
import { API } from "./axios";


interface roomStatusResponse {
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

export const getRoomStatus = async (code: GameRoomRequest['code']): Promise<roomStatusResponse> => {
  const response = await API.get<roomStatusResponse>(`rooms/status/${code}`);
  return response.data
}

export const updateRoomStatus = async (code: GameRoomRequest['code'], status: string): Promise<string> => {
  const response = await API.post<string>(`rooms/status/${code}`, { status });
  return response.data
}