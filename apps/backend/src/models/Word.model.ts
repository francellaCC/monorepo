import { model, Schema } from "mongoose"


const wordSchema = new Schema({})

export const Word = model("Word", wordSchema)