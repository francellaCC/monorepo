import { Router } from "express";
import { createGameRooom, getGameRoom, getRoomStatus, updateRoomStatus } from "../controllers/GameRoomController";


const router = Router();

router.post("/", createGameRooom);
router.get("/:code", getGameRoom)
router.get("/status/:code",getRoomStatus)
router.post("/status/:code",updateRoomStatus)

export default router;