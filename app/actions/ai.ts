// app/actions/ai.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function askRockopiAI(prompt: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        text: "Kunci API Gemini belum dipasang di sistem.",
      };
    }

    // Inisialisasi AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Menggunakan model Flash yang super ringan dan secepat kilat
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Kita berikan 'Karakter' atau 'Prompt Engineering' dasar agar AI tahu tugasnya
    const systemInstruction = `
      Kamu adalah asisten pintar khusus untuk Owner "Rockopi Warehouse".
      Jawablah pertanyaan dengan sangat singkat, padat, profesional, namun tetap asik.
      Jika diminta menghitung, berikan langsung angkanya.
      Gunakan bahasa Indonesia yang natural.
    `;

    const result = await model.generateContent(
      `${systemInstruction}\n\nOwner bertanya: ${prompt}`,
    );
    const responseText = result.response.text();

    return { success: true, text: responseText };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      success: false,
      text: "Maaf Bos, sirkuit saya sedang gangguan. Coba lagi nanti ya.",
    };
  }
}
