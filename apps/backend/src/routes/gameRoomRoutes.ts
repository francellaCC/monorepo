import { Router } from "express";
import { createGameRooom } from "../controllers/GameRoomController";


const router = Router();

router.post("/", createGameRooom);

export default router;