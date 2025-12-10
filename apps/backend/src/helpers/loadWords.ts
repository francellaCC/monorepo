import { ObjectId } from "mongoose";
import { Word } from "../models/Word.model";

export async function loadWordsFromDB(languageId:any, limit:number =5) {
    const words = await Word.find({ language: languageId}).limit(limit);
    return words;
}