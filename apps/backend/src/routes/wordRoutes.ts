import { Router } from "express";
import { createWord, getRandomWords, getWordsByLanguage } from "../controllers/WordController";

const wordRouter = Router();

wordRouter.post("/", createWord);
wordRouter.get("/:languageId", getWordsByLanguage);
wordRouter.get("/:languageId/random", getRandomWords);

export default wordRouter;