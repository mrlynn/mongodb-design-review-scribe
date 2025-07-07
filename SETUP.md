# bitscribe - Setup Guide

This guide will help you set up all dependencies for the bitscribe application.

## Prerequisites

- Node.js 18+ 
- Python 3.8+ (for Whisper)
- Git
- 4GB+ RAM recommended
- 2GB+ free disk space

## Quick Start

```bash
# 1. Clone and install dependencies
git clone https://github.com/mrlynn/mongodb-design-review-scribe.git
cd mongodb-design-review-scribe
npm install

# 2. Set up Whisper (see detailed steps below)
./setup-whisper.sh

# 3. Configure your LLM provider (see Configuration section)
# 4. Start the application
npm start
```

## Detailed Setup

### 1. Whisper Setup (Speech-to-Text)

#### Option A: Automated Setup (Recommended)
```bash
# Run the setup script (downloads ~150MB base model)
chmod +x setup-whisper.sh
./setup-whisper.sh
```

#### Option B: Manual Setup
```bash
# Clone Whisper.cpp
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp

# Build Whisper
make

# Download a model (choose one):
# - Base model (150MB, fast, good quality)
bash ./models/download-ggml-model.sh base

# - Small model (500MB, better quality)
bash ./models/download-ggml-model.sh small

# - Medium model (1.5GB, high quality)
bash ./models/download-ggml-model.sh medium

cd ..
```

### 2. LLM Provider Setup

Choose one or more LLM providers:

#### Option A: OpenAI (Easiest)
1. Get API key from https://platform.openai.com/api-keys
2. Add to environment or configure in app settings

#### Option B: Ollama (Local, Private)
```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model (choose based on your hardware):
# For 8GB+ RAM:
ollama pull llama2

# For 16GB+ RAM (better quality):
ollama pull llama2:13b

# For 32GB+ RAM (best quality):
ollama pull llama2:70b

# Start Ollama service
ollama serve
```

#### Option C: Claude (Anthropic)
1. Get API key from https://console.anthropic.com/
2. Configure in app settings

### 3. MongoDB Setup (Optional - for RAG)

#### Option A: MongoDB Atlas (Recommended)
1. Create free cluster at https://cloud.mongodb.com/
2. Enable Vector Search
3. Get connection string

#### Option B: Local MongoDB
```bash
# Install MongoDB Community
# macOS:
brew install mongodb-community

# Ubuntu:
sudo apt install mongodb

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Ubuntu
```

### 4. Environment Configuration

Create `.env` file in the project root:

```env
# LLM Configuration
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_claude_key_here

# MongoDB (optional)
MONGODB_URI=your_mongodb_connection_string

# Whisper Configuration
WHISPER_MODEL=base  # base, small, medium, large
WHISPER_LANGUAGE=auto  # or specific language code

# Application Settings
LOG_LEVEL=info
MAX_MEMORY_MB=2048
```

## Model Recommendations

### Whisper Models (Speech Recognition)
| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| tiny  | 39MB | Fastest | Basic | Testing only |
| base  | 150MB | Fast | Good | General use |
| small | 500MB | Medium | Better | Professional |
| medium| 1.5GB | Slow | High | High accuracy needed |
| large | 3GB | Slowest | Best | Maximum accuracy |

### Ollama Models (AI Analysis)
| Model | RAM Needed | Speed | Quality | Use Case |
|-------|------------|-------|---------|----------|
| llama2:7b | 8GB | Fast | Good | General use |
| llama2:13b | 16GB | Medium | Better | Professional |
| llama2:70b | 32GB+ | Slow | Best | Maximum quality |
| codellama | 8GB+ | Medium | Code-focused | Technical reviews |

## Troubleshooting

### Whisper Issues
```bash
# If Whisper build fails on macOS:
xcode-select --install

# If permission denied:
chmod +x setup-whisper.sh

# Test Whisper installation:
cd whisper.cpp
./main -m models/ggml-base.bin -f samples/jfk.wav
```

### Memory Issues
- Reduce Whisper model size (use `base` instead of `large`)
- Increase Node.js memory: `export NODE_OPTIONS="--max-old-space-size=4096"`
- Close other applications

### Ollama Issues
```bash
# Check if Ollama is running:
ollama list

# Restart Ollama:
pkill ollama
ollama serve

# Test connection:
curl http://localhost:11434/api/tags
```

## Performance Optimization

### For Low-End Hardware (4-8GB RAM)
```env
WHISPER_MODEL=base
NODE_OPTIONS=--max-old-space-size=2048
```
- Use OpenAI API instead of local Ollama
- Enable "Low Memory Mode" in app settings

### For High-End Hardware (16GB+ RAM)
```env
WHISPER_MODEL=medium
NODE_OPTIONS=--max-old-space-size=4096
```
- Use local Ollama with larger models
- Enable all real-time features

## Security Notes

- Keep API keys secure and never commit them to git
- Use environment variables or app settings for sensitive data
- MongoDB Atlas connections are encrypted by default
- Local Ollama keeps all data on your machine

## Getting Help

- **App Issues**: Check the app's built-in diagnostics (Help → System Info)
- **Whisper Issues**: Visit https://github.com/ggerganov/whisper.cpp
- **Ollama Issues**: Visit https://ollama.ai/docs
- **MongoDB Issues**: Visit https://docs.mongodb.com/

## Next Steps

1. Run `npm start` to launch the application
2. Go to Settings → LLM Configuration to set up your AI provider
3. Go to Settings → RAG Documents to upload reference materials
4. Start a recording session to test everything works

Enjoy using bitscribe! 🎉