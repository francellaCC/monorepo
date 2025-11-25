import { Request, Response } from "express";
import { Language } from "../models/Language.model";
import { GameRoom } from "../models/GameRoom.model";
import { Player } from "../models/Player.model";
import color from "colors";


export const createGameRooom = async (req: Request, res: Response) => {
  try {
    const { code, languageCode, playerId } = req.body;
    console.log(color.bgBlue.black(
      `Creating game room with code: ${code}, language: ${languageCode}, playerId: ${playerId}`
    ));

    const languageId = await Language.findOne({ code: languageCode });

    if (!languageId) {
      return res.status(404).json({ message: "Lenguaje no encontrado" });
    }

    const newRoom = await GameRoom.create({
      code,
      language: languageId._id,
      players: [],
      maxPlayers: 2
    });

    if (newRoom) {
      await Player.updateOne(
        { _id: playerId },
        { $set: { ownsRoom: newRoom._id } }
      );
    }

    return res.status(201).json({
      ok: true,
      room: newRoom
    });

  } catch (error: any) {
    
    return res.status(500).json({
      ok: false,
      message: "Error al crear la sala",
      error: error.message
    });
  }
};
