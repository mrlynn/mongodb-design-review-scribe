#!/bin/bash

# MongoDB Design Review Scribe - Whisper.cpp Setup Script
echo "🎤 Setting up whisper.cpp for MongoDB Design Review Scribe..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the MongoDB Design Review Scribe root directory${NC}"
    exit 1
fi

# Check dependencies
echo -e "${YELLOW}📋 Checking dependencies...${NC}"

# Check for cmake
if ! command -v cmake &> /dev/null; then
    echo -e "${YELLOW}⚠️  cmake not found. Installing via Homebrew...${NC}"
    if ! command -v brew &> /dev/null; then
        echo -e "${RED}❌ Error: Homebrew not found. Please install Homebrew first: https://brew.sh${NC}"
        exit 1
    fi
    brew install cmake
fi

# Check for portaudio
if ! brew list portaudio &> /dev/null; then
    echo -e "${YELLOW}⚠️  portaudio not found. Installing via Homebrew...${NC}"
    brew install portaudio
fi

echo -e "${GREEN}✅ Dependencies checked${NC}"

# Clone whisper.cpp if it doesn't exist
if [ ! -d "whisper.cpp" ]; then
    echo -e "${YELLOW}📦 Cloning whisper.cpp repository...${NC}"
    git clone https://github.com/ggerganov/whisper.cpp.git
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Failed to clone whisper.cpp repository${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ whisper.cpp cloned successfully${NC}"
else
    echo -e "${GREEN}✅ whisper.cpp directory already exists${NC}"
fi

cd whisper.cpp

# Build whisper.cpp
echo -e "${YELLOW}🔨 Building whisper.cpp...${NC}"

# Use cmake to build
cmake -B build
cmake --build build --config Release
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: Failed to build whisper.cpp${NC}"
    exit 1
fi
echo -e "${GREEN}✅ whisper.cpp built successfully${NC}"

# Create models directory if it doesn't exist
if [ ! -d "models" ]; then
    mkdir models
fi

# Download the base English model if it doesn't exist
if [ ! -f "models/ggml-base.en.bin" ]; then
    echo -e "${YELLOW}📥 Downloading ggml-base.en model (142MB)...${NC}"
    
    # Try to download the model
    if command -v wget &> /dev/null; then
        wget -O models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin
    elif command -v curl &> /dev/null; then
        curl -L -o models/ggml-base.en.bin https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin
    else
        echo -e "${RED}❌ Error: Neither wget nor curl found. Please install one to download the model${NC}"
        echo -e "${YELLOW}💡 Manual download: https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin${NC}"
        echo -e "${YELLOW}   Save to: whisper.cpp/models/ggml-base.en.bin${NC}"
        exit 1
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Failed to download model${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Model downloaded successfully${NC}"
else
    echo -e "${GREEN}✅ Model already exists${NC}"
fi

cd ..

# Verify installation
echo -e "${YELLOW}🔍 Verifying installation...${NC}"

if [ ! -f "whisper.cpp/build/bin/whisper-cli" ] && [ ! -f "whisper.cpp/build/bin/main" ]; then
    echo -e "${RED}❌ Error: whisper binary not found${NC}"
    exit 1
fi

if [ ! -f "whisper.cpp/models/ggml-base.en.bin" ]; then
    echo -e "${RED}❌ Error: Model file not found${NC}"
    exit 1
fi

# Test the installation
echo -e "${YELLOW}🧪 Testing whisper.cpp installation...${NC}"

# Find the correct binary path
WHISPER_BIN=""
if [ -f "whisper.cpp/build/bin/whisper-cli" ]; then
    WHISPER_BIN="whisper.cpp/build/bin/whisper-cli"
elif [ -f "whisper.cpp/build/bin/main" ]; then
    WHISPER_BIN="whisper.cpp/build/bin/main"
fi

if [ -n "$WHISPER_BIN" ]; then
    # Test with a simple command (this will show help/usage)
    ./"$WHISPER_BIN" --help > /dev/null 2>&1
    if [ $? -eq 0 ] || [ $? -eq 1 ]; then  # Exit code 1 is often normal for help
        echo -e "${GREEN}✅ whisper.cpp is working correctly${NC}"
    else
        echo -e "${YELLOW}⚠️  whisper.cpp binary exists but may have issues${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo -e "${GREEN}✅ whisper.cpp is ready for MongoDB Design Review Scribe${NC}"
echo ""
echo -e "${YELLOW}📁 Installation summary:${NC}"
echo -e "   Binary: ${WHISPER_BIN}"
echo -e "   Model:  whisper.cpp/models/ggml-base.en.bin"
echo ""
echo -e "${YELLOW}🚀 You can now start the MongoDB Design Review Scribe app with:${NC}"
echo -e "   npm run dev"
echo ""