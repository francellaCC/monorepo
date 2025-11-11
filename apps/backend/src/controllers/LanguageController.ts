
import { Request, Response } from "express";
import { Language } from "../models/Language.model";

export const createLanguage = async (req: Request, res: Response) => {
  try {
    const { code, name } = req.body;

    const existing = await Language.findOne({ code });
    if (existing) {
      return res.status(400).json({ message: "El idioma ya existe" });
    }

    const newLanguage = await Language.create({ code, name });
    res.status(201).json(newLanguage);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el idioma", error });
  }
};

export const getLanguages = async (_req: Request, res: Response) => {
  try {
    const languages = await Language.find();
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener idiomas", error });
  }
};

