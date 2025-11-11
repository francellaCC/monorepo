
import { Request, Response } from "express";
import { Word } from "../models/Word.model";
import mongoose, { Types } from "mongoose";

export const createWord = async (req: Request, res: Response) => {
  try {
    const { text, language, difficulty } = req.body;

    const newWord = await Word.create({
      text,
      language: new Types.ObjectId(language),
      difficulty,
    });

    res.status(201).json(newWord);
  } catch (error) {
    res.status(500).json({ message: "Error al crear palabra", error });
  }
};

export const getWordsByLanguage = async (req: Request, res: Response) => {
  try {
    const { languageId } = req.params;
    const words = await Word.find({ language: languageId});
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener palabras", error });
  }
};

export const getRandomWords = async (req: Request, res: Response) => {
  try {
    const { languageId } = req.params;
    const { limit } = req.query;

    const words = await Word.aggregate([
      { $match: { language: new mongoose.Types.ObjectId(languageId) } },
      { $sample: { size: Number(limit) || 3 } },// Default to 3 if limit not provided
    ]);

    res.json(words);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener palabras aleatorias", error });
  }
};
