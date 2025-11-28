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
      players: [playerId],
      maxPlayers: 2,
      owner: playerId
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
      message: "Error creating room",
      error: error.message
    });
  }

};

export const getGameRoom = async (req: Request, res: Response) => {

  try {
    const { code } = req.params;

    console.log(color.bgMagenta("code de params" +  code))

    const room = await GameRoom.findOne({ code})
    if(!room){
      return  res.status(400).json({message: "Room not Found"})
    }

    console.log(color.cyan(`sala encontrada ${room}`))
    if(room.status === "finished"){
      return res.status(410).json({message: "Room Finished"})
    }

    return res.status(200).json({
      ok: true,
      newRoom :{
        id: room._id,
        status: room.status,
        code: room.code
      }
    })
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      message: "Error creating room",
      error: error.message
    });
  }
}


