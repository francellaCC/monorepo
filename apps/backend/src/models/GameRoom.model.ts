import { model, Schema, Types } from "mongoose";
import { IGameRoom } from "../types/types";


const gameRoomSchema = new Schema<IGameRoom>({
  code: { type: String, required: true, unique: true },
  language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
  maxPlayers: { type: Number, required: true },
  hints:{ type: String, default: "" },
  drawTime: { type: Number, default: 60 },
  currentDrawer: { type: Types.ObjectId, ref: "Player", default: null },
  rounds: { type: Number, default: 1 },
  players: { type: [String], default: [], ref:"Player" },
  status: { type: String, default: "waiting" },
  owner: { type: Schema.Types.ObjectId, ref: "Player", required: true } 
}

  , { timestamps: { createdAt: true, updatedAt: false }})

export const GameRoom = model<IGameRoom>("GameRoom", gameRoomSchema)