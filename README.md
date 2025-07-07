# bitscribe

bitscribe is a specialized tool for conducting MongoDB design review interviews with customers. It provides real-time transcription, analysis, and generates comprehensive reports with MongoDB-specific recommendations and best practices.

## Features

- **Real-time Speech Transcription**: Uses whisper.cpp for accurate, local speech-to-text conversion
- **MongoDB Design Analysis**: Specialized analysis for MongoDB schema design, queries, and architecture
- **Design Review Reports**: Generates comprehensive reports with "What we heard", "Issues with the design", "What we recommend", and "References"
- **MongoDB Best Practices**: Built-in knowledge of MongoDB patterns, anti-patterns, and recommendations
- **Privacy-First**: All speech processing and LLM operations run locally on your machine
- **Session Management**: Saves design review sessions with MongoDB-specific insights

## Quick Start

```bash
# 1. Clone and install dependencies
git clone https://github.com/mrlynn/mongodb-design-review-scribe.git
cd mongodb-design-review-scribe
npm install

# 2. Set up dependencies (choose your preference)
./setup-whisper.sh    # For speech recognition
./setup-ollama.sh     # For local AI (optional)

# 3. Start the application
npm start
```

## Setup Options

### Option 1: Fully Automated Setup (Recommended)
The app now handles Ollama automatically! Just run:

```bash
# Set up Whisper for speech recognition
chmod +x setup-whisper.sh && ./setup-whisper.sh

# Ollama will be automatically managed by the app
npm start
```

The app will:
- ✅ Automatically detect if Ollama is running
- ✅ Download and install models as needed
- ✅ Show progress during model downloads
- ✅ Fallback to cloud providers if Ollama unavailable

### Option 2: Manual Ollama Setup (Optional)
If you prefer to set up Ollama manually:

```bash
# Install and configure Ollama manually
chmod +x setup-ollama.sh && ./setup-ollama.sh
```

### Option 3: Cloud-Only Setup
Skip local AI completely and use cloud providers:
1. Get API keys from OpenAI, Claude, or other providers
2. Configure in app Settings → LLM Configuration
3. Only run `./setup-whisper.sh` for speech recognition

### 3. Install Node.js Dependencies

```bash
# Install dependencies
npm install

# Build the UI
npm run build
```

## Configuration

The app uses a configuration file at `~/.research-companion/config.json`. Default configuration:

```json
{
  "llm": {
    "provider": "ollama",
    "model": "llama3",
    "endpoint": "http://localhost:11434"
  },
  "speech_to_text": {
    "method": "whisper.cpp",
    "language": "en"
  },
  "research": {
    "providers": ["wikipedia"],
    "max_results": 3
  },
  "thresholds": {
    "min_words_per_chunk": 25
  }
}
```

### Whisper Configuration

Update the whisper paths in `app/services/stt.js`:
- `whisperBinary`: Path to whisper.cpp main executable
- `modelPath`: Path to downloaded whisper model

### Research Sources (All Free!)

The app comes pre-configured with completely free research sources:

#### ✅ **Currently Active (No Setup Required):**
- **Wikipedia**: Comprehensive encyclopedia entries
- **DuckDuckGo**: Privacy-focused instant answers and definitions  
- **SearXNG**: Aggregated web search results (privacy-focused)

These provide excellent research coverage without any API keys or payment.

#### 🔧 **Custom Configuration:**
Edit `~/.research-companion/config.json` to customize:
```json
{
  "research": {
    "providers": ["wikipedia", "duckduckgo", "searxng"],
    "max_results": 4
  }
}
```

#### 💰 **Google Search (Optional - Requires Payment)**
If you want Google results (not recommended due to cost/complexity):
1. Google requires a billing account even for "free" tier
2. Setup is complex with multiple registration steps
3. Limited to 100 searches/day before charges apply

**Recommendation**: The free sources provide excellent coverage. Google adds minimal value for the complexity and cost.

## Running the Application

1. **Ensure Ollama is running**:
   ```bash
   ollama serve
   ```

2. **Start the application**:
   ```bash
   npm start
   ```

3. **Using the app**:
   - Click "Start" to begin transcription
   - Speak naturally - the app will transcribe your speech
   - Topics and questions will be automatically extracted
   - Research summaries will appear for identified topics
   - Click "Stop" to end the session (automatically saved)

## How It Works

1. **Speech Capture**: Captures audio from your microphone
2. **Transcription**: Processes audio through whisper.cpp for text conversion
3. **Chunking**: Groups transcript into meaningful chunks (25+ words)
4. **Topic Extraction**: Sends chunks to Ollama for intelligent analysis
5. **Research**: Queries Wikipedia (and optionally Google) for relevant information
6. **Display**: Shows transcript, topics, and research in real-time

## Troubleshooting

### Ollama Not Connected
- Ensure Ollama is running: `ollama serve`
- Check if it's accessible: `curl http://localhost:11434`
- Verify you have a model installed: `ollama list`

### No Audio/Transcription
- Check microphone permissions for the Electron app
- Verify whisper.cpp path in `app/services/stt.js`
- Test whisper.cpp directly: `./main -m models/ggml-base.en.bin -f samples/jfk.wav`

### No Topics Extracted
- Check Ollama logs for errors
- Ensure the LLM model supports JSON output
- Try with a different model: `ollama pull mistral`

## Development

### Project Structure
```
auracle/
├── app/
│   ├── main.js          # Electron main process
│   ├── renderer/        # React UI
│   ├── services/        # Core services
│   │   ├── stt.js       # Speech-to-text
│   │   ├── llm.js       # Ollama integration
│   │   ├── research.js  # Web research
│   │   └── processor.js # Conversation pipeline
│   ├── config/          # Configuration
│   └── storage/         # Session persistence
├── whisper.cpp/         # Speech recognition
└── package.json
```

### Building for Production

```bash
npm run package
```

This will create platform-specific distributables in the `dist` folder.

## Privacy & Security

- **Local Processing**: All speech and LLM processing happens on your machine
- **No Cloud Upload**: Audio never leaves your device
- **Research Only**: Only topic searches are sent to external APIs
- **Session Storage**: Conversations are stored locally in JSON format

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.