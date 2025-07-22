#!/usr/bin/env node

import { Command } from "commander";
import { transcribeFile } from "./transcription";

const program = new Command();

program
  .name("tr")
  .description("Transcribe audio files using various services")
  .requiredOption("-f, --file <path>", "Audio file to transcribe")
  .parse(process.argv);

const options = program.opts();

async function main() {
  const { file } = options;
  await transcribeFile(file);
}

main().catch(console.error);
