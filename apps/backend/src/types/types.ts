import { Types } from "mongoose"

export interface ILanguage {
  code: string //código del lenguaje (ej: "en", "es")
  name: string //nombre del lenguaje (ej: "English", "Español")
}

export interface IGameRoom {
  code: string //identificador único de la sala
  language: Types.ObjectId //ref a Language
  maxPlayers:number
  drawTime: number
  currentDrawer: Types.ObjectId | null //ref al jugador que está dibujando actualmente
  rounds: number
  hints:string
  owner: Types.ObjectId //ref al jugador que creó la sala
  players: string[] //array de nombres de jugadores
  status: "waiting" | "playing" | "finished" //estado de la sala
  createdAt: Date
}

export interface IWord {
  text: string //la palabra en sí (eg: "apple", "manzana")
  language: Types.ObjectId //ref a Language
  wordLength:number
  difficulty: "easy" | "medium" | "hard" //dificultad de la palabra
}

export interface IPlayer {
  id: Types.ObjectId
  name: string //nombre del jugador
  score: number //puntuación del jugador
  socketId:string
  ownsRoom: Types.ObjectId | null //ref a GameRoom si el jugador es el creador de la sala
  createdAt: Date
}