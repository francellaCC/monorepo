import { Types } from "mongoose"

export interface ILanguage {
  code: string //código del lenguaje (ej: "en", "es")
  name: string //nombre del lenguaje (ej: "English", "Español")
}

export interface IGameRoom {
  code: string //identificador único de la sala
  language: Types.ObjectId //ref a Language
  player: string[] //array de nombres de jugadores
  status: "waiting" | "playing" | "finished" //estado de la sala
  createdAt: Date
}

export interface IWord {
  text: string //la palabra en sí (eg: "apple", "manzana")
  language: Types.ObjectId //ref a Language
  difficulty: "easy" | "medium" | "hard" //dificultad de la palabra
}