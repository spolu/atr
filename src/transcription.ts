import * as fs from "fs";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribe audio file using OpenAI API
 * @param filePath Path to the audio file
 * @param language Language code for transcription
 */
export async function transcribeFile(
  filePath: string,
  language: string
): Promise<void> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-transcribe",
      language,
    });

    console.log(transcription.text);
  } catch (error) {
    console.error("Error transcribing audio:", error);
    process.exit(1);
  }
}
