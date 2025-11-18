import { Request, Response } from "express";
import { Player } from "../models/Player.model";



export const createPlayer = async(req: Request, res: Response) => {
  try {
    const { name , ownsRoom } = req.body;  
    const newPlayer = await Player.create({ name, ownsRoom , score: 0, createdAt: new Date() });

    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el jugador", error });
  }
}