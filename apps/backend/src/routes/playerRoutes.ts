
import { Router } from "express";
import { createPlayer } from "../controllers/PlayerController";


const router = Router();

router.post("/", createPlayer);

export default router;