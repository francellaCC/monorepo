import { model, Schema, Types } from "mongoose";
import { IGameRoom } from "../types/types";


const gameRoomSchema = new Schema<IGameRoom>({
  code: { type: String, required: true, unique: true },
  language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
  player: { type: [String], default: [] },
  status: { type: String, default: "waiting" },
}

  , { timestamps: { createdAt: true, updatedAt: false }})

export const GameRoom = model<IGameRoom>("GameRoom", gameRoomSchema)