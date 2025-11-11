import { model, Schema, Types } from "mongoose";

export interface IGameRoom {
  code: string //identificador único de la sala
  language: Types.ObjectId //ref a Language
  player: string[] //array de nombres de jugadores
  status: "waiting" | "playing" | "finished" //estado de la sala
  createdAt: Date
}
const gameRoomSchema = new Schema<IGameRoom>({
  code: { type: String, required: true, unique: true },
  language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
  player: { type: [String], default: [] },
  status: { type: String, default: "waiting" },
}

  , { timestamps: { createdAt: true, updatedAt: false }})

export const GameRoom = model<IGameRoom>("GameRoom", gameRoomSchema)