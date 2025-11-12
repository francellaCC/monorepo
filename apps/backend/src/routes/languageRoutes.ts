import { Router } from "express";
import { createLanguage, getLanguages } from "../controllers/LanguageController";


const languageRouter = Router();

languageRouter.post("/", createLanguage);
languageRouter.post("/", getLanguages);


export default languageRouter;