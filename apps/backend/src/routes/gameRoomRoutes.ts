import { Router } from "express";
import { createGameRooom } from "../controllers/GameRoomController";


const gameRouter = Router();

gameRouter.post("/", createGameRooom);

export default gameRouter;