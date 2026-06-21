"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function askRockopiAI(prompt: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        text: "Hubungi Developer
          .",
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // PERBAIKAN: Menggunakan tag "-latest" agar dikenali oleh server API Google
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    const systemInstruction = `
      Kamu adalah asisten pintar khusus untuk Owner coffee-shop "Rockopi Warehouse".
      Jawablah pertanyaan dengan sangat singkat, padat, profesional, namun tetap asik.
      Jika diminta menghitung, berikan langsung angkanya.
      Gunakan bahasa Indonesia yang natural.
    `;

    const result = await model.generateContent(
      `${systemInstruction}\n\nOwner bertanya: ${prompt}`,
    );
    const responseText = result.response.text();

    return { success: true, text: responseText };
  } catch (error: any) {
    console.error("AI Error Detail:", error.message);

    // Menampilkan eror asli ke chat agar kita tahu jika ada masalah lain
    return {
      success: false,
      text: `Koneksi Google gagal. Detail: ${error.message}`,
    };
  }
}
