import { model, Schema } from "mongoose";
import { ILanguage } from "../types/types";


const languageSchema = new Schema<ILanguage>({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true }

},
  { timestamps: true }
)

export const Language = model<ILanguage>("Language", languageSchema)