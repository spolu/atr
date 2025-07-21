#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const transcription_1 = require("./transcription");
const program = new commander_1.Command();
program
    .name("tr")
    .description("Transcribe audio files using various services")
    .requiredOption("-f, --file <path>", "Audio file to transcribe")
    .option("-l, --language <code>", "Language code for transcription", "en")
    .parse(process.argv);
const options = program.opts();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { file, language } = options;
        yield (0, transcription_1.transcribeFile)(file, language);
    });
}
main().catch(console.error);
