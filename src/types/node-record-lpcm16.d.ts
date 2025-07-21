declare module "node-record-lpcm16" {
  interface RecordOptions {
    sampleRate?: number;
    channels?: number;
    audioType?: string;
    threshold?: number;
    thresholdStart?: number;
    thresholdEnd?: number;
    silence?: number;
    recorder?: string;
    device?: string;
    recordProgram?: string;
  }

  interface Recording {
    pause(): void;
    stream(): Readable;
    stop(): void;
  }

  export function record(options?: RecordOptions): Recording;
}
