#!/bin/bash

# 🎭 Bitscribe Speaker Detection Setup Script
# This script automatically downloads and configures tinydiarize models for speaker detection

set -e  # Exit on any error

echo "🎭 Bitscribe Speaker Detection Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MODELS_DIR="./whisper.cpp/models"
TEMP_DIR="/tmp/bitscribe-models"

# Model URLs (from Hugging Face)
SMALL_MODEL_URL="https://huggingface.co/akashmjn/tinydiarize-whisper.cpp/resolve/main/ggml-small.en-tdrz.bin"

# Model info
SMALL_MODEL_SIZE="~488MB"

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check if curl/wget is available
    if command -v curl >/dev/null 2>&1; then
        DOWNLOAD_CMD="curl -L -o"
        print_success "Found curl for downloading"
    elif command -v wget >/dev/null 2>&1; then
        DOWNLOAD_CMD="wget -O"
        print_success "Found wget for downloading"
    else
        print_error "Neither curl nor wget found. Please install one of them."
        exit 1
    fi
    
    # Check if models directory exists
    if [ ! -d "$MODELS_DIR" ]; then
        print_error "Models directory not found: $MODELS_DIR"
        print_error "Please run this script from the bitscribe root directory"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

check_existing_models() {
    print_status "Checking for existing models..."
    
    SMALL_EXISTS=false
    
    if [ -f "$MODELS_DIR/ggml-small.en-tdrz.bin" ]; then
        SMALL_EXISTS=true
        print_warning "Diarization model already exists"
    fi
    
    if [ "$SMALL_EXISTS" = true ]; then
        echo ""
        print_success "Speaker diarization model is already installed!"
        echo ""
        echo "🎯 Speaker detection is ready to use:"
        echo "   1. Enable 'Speaker Detection' in Bitscribe settings"
        echo "   2. Start recording"
        echo "   3. See speaker labels like 'Speaker 1:', 'Speaker 2:', etc."
        echo ""
        exit 0
    fi
}

show_model_options() {
    echo ""
    echo "📦 Available Model:"
    echo ""
    echo "1. Speaker Diarization Model"
    echo "   - Size: $SMALL_MODEL_SIZE" 
    echo "   - Language: English only"
    echo "   - Accuracy: Good for most use cases"
    echo "   - Best for: Meeting recordings, interviews, conversations"
    echo ""
}

prompt_model_choice() {
    while true; do
        echo -n "Install the speaker diarization model? [y/n]: "
        read -r choice
        case $choice in
            [Yy]*)
                INSTALL_SMALL=true
                break
                ;;
            [Nn]*)
                print_warning "Skipping model installation"
                exit 0
                ;;
            *)
                print_error "Please enter y or n"
                ;;
        esac
    done
}

create_temp_dir() {
    print_status "Creating temporary directory..."
    mkdir -p "$TEMP_DIR"
    print_success "Temporary directory created: $TEMP_DIR"
}

download_model() {
    local model_name="$1"
    local model_url="$2"
    local model_file="$3"
    local model_size="$4"
    
    print_status "Downloading $model_name ($model_size)..."
    echo "📥 From: $model_url"
    echo "📁 To: $MODELS_DIR/$model_file"
    echo ""
    
    # Download to temp directory first
    local temp_file="$TEMP_DIR/$model_file"
    
    if $DOWNLOAD_CMD "$temp_file" "$model_url"; then
        # Verify download
        if [ -f "$temp_file" ] && [ -s "$temp_file" ]; then
            # Move to final location
            mv "$temp_file" "$MODELS_DIR/$model_file"
            print_success "$model_name downloaded successfully"
            
            # Show file info
            local file_size=$(ls -lh "$MODELS_DIR/$model_file" | awk '{print $5}')
            print_status "File size: $file_size"
        else
            print_error "$model_name download failed (empty file)"
            return 1
        fi
    else
        print_error "$model_name download failed"
        return 1
    fi
}

install_models() {
    print_status "Starting model installation..."
    echo ""
    
    local success_count=0
    local total_count=0
    
    if [ "$INSTALL_SMALL" = true ] && [ "$SMALL_EXISTS" = false ]; then
        total_count=$((total_count + 1))
        if download_model "Speaker Diarization Model" "$SMALL_MODEL_URL" "ggml-small.en-tdrz.bin" "$SMALL_MODEL_SIZE"; then
            success_count=$((success_count + 1))
        fi
        echo ""
    fi
    
    # Cleanup temp directory
    rm -rf "$TEMP_DIR"
    
    if [ $success_count -eq $total_count ] && [ $total_count -gt 0 ]; then
        print_success "Model installed successfully!"
        return 0
    elif [ $total_count -eq 0 ]; then
        print_warning "No new models to install"
        return 0
    else
        print_error "Model installation failed"
        return 1
    fi
}

verify_installation() {
    print_status "Verifying installation..."
    
    local verified_count=0
    
    if [ -f "$MODELS_DIR/ggml-small.en-tdrz.bin" ]; then
        local size=$(ls -lh "$MODELS_DIR/ggml-small.en-tdrz.bin" | awk '{print $5}')
        print_success "Speaker diarization model: ✅ ($size)"
        verified_count=$((verified_count + 1))
    fi
    
    if [ $verified_count -gt 0 ]; then
        echo ""
        print_success "🎉 Speaker detection model installed successfully!"
        echo ""
        echo "🎯 Next Steps:"
        echo "   1. Restart Bitscribe app"
        echo "   2. Enable 'Speaker Detection' in Settings → General"
        echo "   3. Start recording and see speaker labels!"
        echo ""
        echo "📝 Expected Output:"
        echo "   - 'Speaker 1: Hello there'"
        echo "   - 'Speaker 2: How are you?'"
        echo "   - Color-coded speaker chips in transcript"
        echo ""
        return 0
    else
        print_error "No diarization model found after installation"
        return 1
    fi
}

# Main execution
main() {
    echo "🚀 Starting automated setup..."
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "whisper.cpp" ]; then
        print_error "Please run this script from the bitscribe root directory"
        echo "Expected directory structure:"
        echo "  bitscribe/"
        echo "  ├── package.json"
        echo "  ├── whisper.cpp/"
        echo "  └── setup-speaker-detection.sh"
        exit 1
    fi
    
    check_dependencies
    check_existing_models
    show_model_options
    prompt_model_choice
    create_temp_dir
    
    if install_models; then
        verify_installation
        print_success "Setup completed successfully! 🎉"
    else
        print_error "Setup failed. Please check the error messages above."
        exit 1
    fi
}

# Handle script interruption
trap 'echo ""; print_warning "Setup interrupted by user"; rm -rf "$TEMP_DIR"; exit 1' INT

# Run main function
main "$@"