#!/usr/bin/env node

import { Command } from "commander";
import { transcribeFile } from "./transcription";

const program = new Command();

program
  .name("tr")
  .description("Transcribe audio files using various services")
  .requiredOption("-f, --file <path>", "Audio file to transcribe")
  .option("-l, --language <code>", "Language code for transcription", "en")
  .option("-m, --meeting", "Enable meeting mode with speaker detection")
  .parse(process.argv);

const options = program.opts();

async function main() {
  const { file, language, meeting } = options;
  await transcribeFile(file, language, meeting);
}

main().catch(console.error);
