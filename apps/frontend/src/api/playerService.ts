import { API } from "./axios";
import type { PlayerResponse , PlayerRequest} from "../../types/index.ts";

export const createPlayer = async (name:string): Promise<PlayerResponse> => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  console.log("Creating player with data:", name);
  const response = await API.post<PlayerResponse>("players/cretePlayer", { name });
  return response.data;
};
