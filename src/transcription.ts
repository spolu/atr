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
 * @param meetingMode Enable meeting mode with speaker detection
 */
export async function transcribeFile(
  filePath: string,
  language: string,
  meetingMode?: boolean
): Promise<void> {
  try {
    const transcriptionParams: any = {
      file: fs.createReadStream(filePath),
      model: "gpt-4o-transcribe",
      language,
    };

    if (meetingMode) {
      const currentTime = new Date().toLocaleString();
      transcriptionParams.prompt = `The following conversation is a meeting recording (which started at ${currentTime}) including speaker identification. Speaker changes are denoted by [speaker1], [speaker2], ... tags injected in the text when the speaker changes.`;
    }

    const transcription = await openai.audio.transcriptions.create(
      transcriptionParams
    );

    console.log(transcription.text);
  } catch (error) {
    console.error("Error transcribing audio:", error);
    process.exit(1);
  }
}
