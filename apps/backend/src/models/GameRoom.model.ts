import { model, Schema } from "mongoose";


const gameRoomSchema = new Schema({})

export const GameRoom = model("GameRoom", gameRoomSchema)