import { model, Schema } from "mongoose";
import { IPlayer } from "../types/types";


const playerSchema = new Schema<IPlayer>(
  {
    id: { type: Schema.Types.ObjectId },
    socketId: { type: String, unique: true }, 
    name: { type: String, required: true,  }, 
    score: { type: Number, default: 0 },
    ownsRoom: { type: Schema.Types.ObjectId, ref: 'GameRoom', default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Player = model<IPlayer>('Player', playerSchema);