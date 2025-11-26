// src/seed/seed.ts
import mongoose from "mongoose";
import { Language } from "../models/Language.model";
import { Word } from "../models/Word.model";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/myapp";

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // 🧹 Limpiamos colecciones anteriores
    await Language.deleteMany({});
    await Word.deleteMany({});
    console.log("🧼 Colecciones limpiadas");

    // 🌍 Idiomas base
    const languages = await Language.insertMany([
      { code: "es", name: "Español" },
      { code: "en", name: "Inglés" },
      { code: "fr", name: "Francés" },
    ]);
    console.log("🌐 Idiomas insertados:", languages.map((l) => l.name));

    // 🪶 Palabras para cada idioma
    const words = [
      // Español
      { text: "gato", language: languages[0]._id,wordLength: 4, difficulty: "easy" },
      { text: "perro", language: languages[0]._id, wordLength: 4,difficulty: "easy" },
      { text: "bicicleta", language: languages[0]._id,wordLength: 9 , difficulty: "medium" },
      { text: "astronauta", language: languages[0]._id,wordLength: 10, difficulty: "hard" },
      // Inglés
      { text: "cat", language: languages[1]._id,wordLength: 10, difficulty: "easy" },
      { text: "dog", language: languages[1]._id,wordLength: 10, difficulty: "easy" },
      { text: "bicycle", language: languages[1]._id,wordLength: 10, difficulty: "medium" },
      { text: "astronaut", language: languages[1]._id,wordLength: 10, difficulty: "hard" },
      // Francés
      { text: "chat", language: languages[2]._id,wordLength: 10, difficulty: "easy" },
      { text: "chien", language: languages[2]._id,wordLength: 10, difficulty: "easy" },
      { text: "vélo", language: languages[2]._id,wordLength: 10, difficulty: "medium" },
      { text: "astronaute", language: languages[2]._id,wordLength: 10, difficulty: "hard" },
    ];

    await Word.insertMany(words);
    console.log(`🪶 Se insertaron ${words.length} palabras`);

    console.log("🌱 Seed completado exitosamente ✅");
  } catch (error) {
    console.error("❌ Error ejecutando seed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
}

seedDatabase();
