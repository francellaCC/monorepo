import { Router } from "express";
import { createLanguage, getLanguages } from "../controllers/LanguageController";


const router = Router();

router.post("/", createLanguage);
router.get("/", getLanguages);


export default router;