import { Router } from "express";
import { createGameRooom, getGameRoom } from "../controllers/GameRoomController";


const router = Router();

router.post("/", createGameRooom);
router.get("/:code", getGameRoom)

export default router;