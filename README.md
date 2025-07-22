# ATR - Audio Transcription CLI

CLI tool for transcribing audio files using OpenAI's gpt-4o-transcribe.

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
```

## Bash Helper Functions

Add these functions to your `.bashrc` or `.zshrc` for maximal fun:

```bash
tra() {
  timestamp=$(date +"%Y%m%d_%H%M")
  transcript_dir="$HOME/stash/transcripts/${timestamp}"

  mkdir -p "$transcript_dir"

  wav_file="$transcript_dir/out.wav"
  mp3_file="$transcript_dir/out.mp3"
  txt_file="$transcript_dir/out.txt"

  stty -echoctl
  arecord -D pulse -f cd -t wav "$wav_file" 2>/dev/null
  lame -b 64 "$wav_file" "$mp3_file" 2>/dev/null
  stty echoctl
  echo -e "\033[90mTranscribing...\033[0m"
  atr -f "$mp3_file" > "$txt_file"
  echo -e "\033[1A\033[K$(cat "$txt_file")"
}

trc() {
  latest_dir=$(ls -1t "$HOME/stash/transcripts" | head -1)
  if [ -n "$latest_dir" ] && [ -f "$HOME/stash/transcripts/$latest_dir/out.txt" ]; then
    cat "$HOME/stash/transcripts/$latest_dir/out.txt"
  else
    echo "No transcript found"
  fi
}
```

Then use:
- `tra` - Record and transcribe + store all files
- `trc` - Cat last transcription, eg `trc | pbcopy`
