import type { GameRoomRequest, GameRoomResponse } from "../../types";
import { API } from "./axios";



export const createGameRoom = async ({languageCode, playerId, code}: GameRoomRequest): Promise<GameRoomResponse> => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("Creating game room with data:", {languageCode, playerId, code});
  const response = await API.post<GameRoomResponse>("rooms/", {languageCode, playerId, code} );
  return response.data;
}

export const getGameRoom =async(code: GameRoomRequest['code']) : Promise<GameRoomResponse>=>{
   const response = await API.post<GameRoomResponse>("rooms/:roomId", {code} );
   return response.data
}