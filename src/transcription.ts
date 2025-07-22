import * as fs from "fs";
import * as path from "path";
import { OpenAI } from "openai";
import { spawn } from "child_process";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Split audio file into 5-minute chunks using direct spawn
 */
async function splitAudioFile(filePath: string): Promise<string[]> {
  const tempDir = "./atr-chunks-" + Date.now();
  const chunkDuration = 300; // 5 minutes in seconds

  // Create temp directory with proper permissions
  fs.mkdirSync(tempDir);

  return new Promise((resolve, reject) => {
    const outputPattern = path.join(tempDir, "chunk_%03d.mp3");
    const args = [
      "-i",
      filePath,
      "-f",
      "segment",
      "-segment_time",
      chunkDuration.toString(),
      "-c",
      "copy",
      "-y", // Overwrite output files
      outputPattern,
    ];

    // console.log("Running: ffmpeg " + args.join(" "));

    const ffmpegProcess = spawn("ffmpeg", args);

    let stderrOutput = "";

    ffmpegProcess.stderr.on("data", (data) => {
      stderrOutput += data.toString();
    });

    ffmpegProcess.on("close", (code) => {
      if (code !== 0) {
        console.error("FFmpeg stderr:", stderrOutput);
        reject(new Error(`FFmpeg exited with code ${code}`));
        return;
      }

      try {
        const files = fs
          .readdirSync(tempDir)
          .filter((f) => f.startsWith("chunk_"))
          .sort()
          .map((f) => path.join(tempDir, f));
        resolve(files);
      } catch (err) {
        reject(err);
      }
    });

    ffmpegProcess.on("error", (err) => {
      console.error("Failed to spawn ffmpeg:", err);
      reject(err);
    });
  });
}

/**
 * Clean up temporary chunk files
 */
function cleanupChunks(chunkPaths: string[]): void {
  for (const chunkPath of chunkPaths) {
    try {
      fs.unlinkSync(chunkPath);
      const dir = path.dirname(chunkPath);
      if (fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Transcribe audio file using OpenAI API
 * @param filePath Path to the audio file
 * @param language Language code for transcription
 */
export async function transcribeFile(filePath: string): Promise<void> {
  try {
    // Split audio into 5-minute chunks
    const chunkPaths = await splitAudioFile(filePath);
    const transcriptions: string[] = [];

    // console.log(chunkPaths);

    for (let i = 0; i < chunkPaths.length; i++) {
      const chunkPath = chunkPaths[i];
      // console.error(`Processing chunk ${chunkPath}...`);

      const transcriptionParams: any = {
        file: fs.createReadStream(chunkPath),
        model: "gpt-4o-mini-transcribe",
      };

      const transcription = await openai.audio.transcriptions.create(
        transcriptionParams
      );

      transcriptions.push(transcription.text);
    }

    // Clean up temporary files
    cleanupChunks(chunkPaths);

    // Output combined transcription
    console.log(transcriptions.join(" "));
  } catch (error) {
    console.error("Error transcribing audio:", error);
    process.exit(1);
  }
}
