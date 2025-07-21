# ATR - Audio Transcription CLI

CLI tool for transcribing audio files using OpenAI's Whisper API.

## Installation

```bash
# In .bashrc
export OPENAI_API_KEY="your-api-key-here"

# After cloning
npm run build
npm install -g .
```

## Usage

```bash
atr -f audio.wav
atr -f audio.wav -l en
```

## Bash Helper Functions

Add these functions to your `.bashrc` or `.zshrc` for maximal fun:

```bash
tra() {
  stty -echoctl
  arecord -f cd -t wav /tmp/output.wav 2>/dev/null
  stty echoctl
  echo -e "\033[90mWorking...\033[0m"
  atr -f /tmp/output.wav > /tmp/atr.out
  echo -e "\033[1A\033[K$(cat /tmp/atr.out)"
  cat /tmp/atr.out | pbcopy
}

trc() {
  cat /tmp/atr.out
}
```

Then use:
- `tra` - Record and transcribe and copy
- `trc` - Cat last transcription
