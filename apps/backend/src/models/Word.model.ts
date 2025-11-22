import { model, Schema } from "mongoose"
import { IWord } from "../types/types"


const wordSchema = new Schema<IWord>({
  text: { type: String, required: true },
  language: { type: Schema.Types.ObjectId, ref: "Language", required: true },
  wordLength: { type: Number, required: true },
  difficulty: { type: String, default: "easy" }
},

  { timestamps: true })

export const Word = model("Word", wordSchema)