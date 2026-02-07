import { Router } from "express";
import { createWord, getRandomWords, getWordsByLanguage } from "../controllers/WordController";

const router = Router();

router.post("/", createWord);
router.get("/:languageId", getWordsByLanguage);
router.get("/:languageId/random", getRandomWords);

export default router;