import { Request, Response } from "express";
import { Player } from "../models/Player.model";



export const createPlayer = async(req: Request, res: Response) => {
  try {
    const { name  } = req.body;  
    const newPlayer = await Player.create({ name, score: 0, createdAt: new Date() });

    console.log("Jugador creado:", newPlayer);
    res.status(201).json(newPlayer);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el jugador", error });
  }
}