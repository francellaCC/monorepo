import { model, Schema } from "mongoose";
import { IPlayer } from "../types/types";


const playerSchema = new Schema<IPlayer>(
  {
    id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true,  }, // El nombre del jugador debe ser único
    score: { type: Number, default: 0 },
    ownsRoom: { type: Schema.Types.ObjectId, ref: 'GameRoom', default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Player = model<IPlayer>('Player', playerSchema);