import { Request, Response } from "express";
import { Language } from "../models/Language.model";
import { GameRoom } from "../models/GameRoom.model";


export const createGameRooom= async(req: Request, res: Response) => {

  try {
    const {code, languageCode} = req.body;
    const languageId = await Language.findOne({code: languageCode})
    if(!languageId){
      return res.status(404).json({message: "Lenguaje no encontrado"})
    }

    const newRoom = await GameRoom.create({
      code,
      language:languageId._id,
      players: [],
    })

    res.status(201).json(newRoom)
  } catch (error) {
    res.status(500).json({ message: "Error al crear la sala", error })
  }

  
}