#!/bin/bash

# bitscribe - Ollama Setup Script
echo "🤖 Setting up Ollama for bitscribe..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the bitscribe root directory${NC}"
    exit 1
fi

# Function to check system resources
check_system_resources() {
    echo -e "${YELLOW}📋 Checking system resources...${NC}"
    
    # Check available RAM (macOS/Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        RAM_GB=$(( $(sysctl -n hw.memsize) / 1024 / 1024 / 1024 ))
    else
        # Linux
        RAM_GB=$(( $(grep MemTotal /proc/meminfo | awk '{print $2}') / 1024 / 1024 ))
    fi
    
    echo -e "${BLUE}💾 Available RAM: ${RAM_GB}GB${NC}"
    
    if [ $RAM_GB -lt 8 ]; then
        echo -e "${YELLOW}⚠️  Warning: Less than 8GB RAM detected. Consider using smaller models or cloud APIs.${NC}"
        return 1
    elif [ $RAM_GB -lt 16 ]; then
        echo -e "${YELLOW}📝 Recommendation: 8-15GB RAM - suitable for 7B models${NC}"
        return 2
    else
        echo -e "${GREEN}✅ 16GB+ RAM - suitable for larger models${NC}"
        return 0
    fi
}

# Check if Ollama is already installed
check_ollama_installation() {
    if command -v ollama &> /dev/null; then
        echo -e "${GREEN}✅ Ollama is already installed${NC}"
        ollama --version
        return 0
    else
        echo -e "${YELLOW}📦 Ollama not found, will install...${NC}"
        return 1
    fi
}

# Install Ollama
install_ollama() {
    echo -e "${YELLOW}📥 Installing Ollama...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - try Homebrew first, then installer
        if command -v brew &> /dev/null; then
            echo -e "${YELLOW}🍺 Installing via Homebrew...${NC}"
            brew install ollama
        else
            echo -e "${YELLOW}📱 Installing via official installer...${NC}"
            curl -fsSL https://ollama.ai/install.sh | sh
        fi
    else
        # Linux
        echo -e "${YELLOW}🐧 Installing on Linux...${NC}"
        curl -fsSL https://ollama.ai/install.sh | sh
    fi
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Failed to install Ollama${NC}"
        echo -e "${YELLOW}💡 Manual installation: https://ollama.ai/download${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Ollama installed successfully${NC}"
}

# Recommend and optionally install models
setup_models() {
    local ram_status=$1
    
    echo -e "${YELLOW}🎯 Recommending models based on your system...${NC}"
    echo ""
    
    if [ $ram_status -eq 1 ]; then
        # Less than 8GB RAM
        echo -e "${YELLOW}💡 Recommended for your system (< 8GB RAM):${NC}"
        echo -e "   • Consider using cloud APIs (OpenAI, Claude) instead"
        echo -e "   • If you want to try local: phi3:mini (3.8GB)"
        echo ""
        
        read -p "Do you want to install phi3:mini model anyway? (y/N): " install_phi
        if [[ $install_phi =~ ^[Yy]$ ]]; then
            echo -e "${YELLOW}📥 Installing phi3:mini...${NC}"
            ollama pull phi3:mini
        fi
        
    elif [ $ram_status -eq 2 ]; then
        # 8-15GB RAM
        echo -e "${YELLOW}💡 Recommended for your system (8-15GB RAM):${NC}"
        echo -e "   • llama3.1:8b (4.7GB) - Good general model"
        echo -e "   • phi3:medium (7.9GB) - Microsoft's efficient model"
        echo -e "   • codellama:7b (3.8GB) - Good for code/technical content"
        echo ""
        
        echo -e "${BLUE}Which model would you like to install?${NC}"
        echo "1) llama3.1:8b (recommended)"
        echo "2) phi3:medium"
        echo "3) codellama:7b (best for code reviews)"
        echo "4) All three"
        echo "5) Skip for now"
        
        read -p "Choose (1-5): " model_choice
        
        case $model_choice in
            1)
                echo -e "${YELLOW}📥 Installing llama3.1:8b...${NC}"
                ollama pull llama3.1:8b
                ;;
            2)
                echo -e "${YELLOW}📥 Installing phi3:medium...${NC}"
                ollama pull phi3:medium
                ;;
            3)
                echo -e "${YELLOW}📥 Installing codellama:7b...${NC}"
                ollama pull codellama:7b
                ;;
            4)
                echo -e "${YELLOW}📥 Installing all recommended models...${NC}"
                ollama pull llama3.1:8b
                ollama pull phi3:medium
                ollama pull codellama:7b
                ;;
            5)
                echo -e "${YELLOW}⏭️  Skipping model installation${NC}"
                ;;
            *)
                echo -e "${YELLOW}🎯 Installing default: llama3.1:8b${NC}"
                ollama pull llama3.1:8b
                ;;
        esac
        
    else
        # 16GB+ RAM
        echo -e "${YELLOW}💡 Recommended for your system (16GB+ RAM):${NC}"
        echo -e "   • llama3.1:8b (4.7GB) - Fast and capable"
        echo -e "   • llama3.1:70b (40GB) - Highest quality"
        echo -e "   • codellama:13b (7.3GB) - Best for code reviews"
        echo ""
        
        echo -e "${BLUE}Which models would you like to install?${NC}"
        echo "1) llama3.1:8b (fast, recommended)"
        echo "2) llama3.1:70b (highest quality, requires 40GB+)"
        echo "3) codellama:13b (best for technical content)"
        echo "4) All recommended"
        echo "5) Skip for now"
        
        read -p "Choose (1-5): " model_choice
        
        case $model_choice in
            1)
                echo -e "${YELLOW}📥 Installing llama3.1:8b...${NC}"
                ollama pull llama3.1:8b
                ;;
            2)
                echo -e "${YELLOW}📥 Installing llama3.1:70b (this will take a while!)...${NC}"
                ollama pull llama3.1:70b
                ;;
            3)
                echo -e "${YELLOW}📥 Installing codellama:13b...${NC}"
                ollama pull codellama:13b
                ;;
            4)
                echo -e "${YELLOW}📥 Installing all recommended models...${NC}"
                ollama pull llama3.1:8b
                ollama pull codellama:13b
                echo -e "${YELLOW}Note: Skipping 70b model due to size. Install manually if needed: ollama pull llama3.1:70b${NC}"
                ;;
            5)
                echo -e "${YELLOW}⏭️  Skipping model installation${NC}"
                ;;
            *)
                echo -e "${YELLOW}🎯 Installing default: llama3.1:8b${NC}"
                ollama pull llama3.1:8b
                ;;
        esac
    fi
}

# Start Ollama service
start_ollama_service() {
    echo -e "${YELLOW}🚀 Starting Ollama service...${NC}"
    
    # Check if already running
    if pgrep -x "ollama" > /dev/null; then
        echo -e "${GREEN}✅ Ollama service is already running${NC}"
        return 0
    fi
    
    # Start Ollama
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null && brew services list | grep -q ollama; then
            brew services start ollama
        else
            ollama serve &
        fi
    else
        # Linux
        if systemctl is-active --quiet ollama; then
            echo -e "${GREEN}✅ Ollama service is already running via systemd${NC}"
        else
            ollama serve &
        fi
    fi
    
    # Wait a moment for service to start
    sleep 3
    
    # Test connection
    if curl -s http://localhost:11434/api/tags > /dev/null; then
        echo -e "${GREEN}✅ Ollama service is running and accessible${NC}"
    else
        echo -e "${YELLOW}⚠️  Ollama service may need a moment to start${NC}"
    fi
}

# Test Ollama installation
test_ollama() {
    echo -e "${YELLOW}🧪 Testing Ollama installation...${NC}"
    
    # List available models
    local models=$(ollama list 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Ollama is working correctly${NC}"
        echo ""
        echo -e "${BLUE}📋 Installed models:${NC}"
        echo "$models"
    else
        echo -e "${YELLOW}⚠️  Ollama may not be ready yet${NC}"
    fi
}

# Main execution
echo ""
check_system_resources
ram_status=$?

echo ""
if ! check_ollama_installation; then
    install_ollama
fi

echo ""
setup_models $ram_status

echo ""
start_ollama_service

echo ""
test_ollama

echo ""
echo -e "${GREEN}🎉 Ollama setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "   1. Configure the app to use Ollama in Settings → LLM Configuration"
echo -e "   2. Set endpoint to: http://localhost:11434"
echo -e "   3. Choose your installed model in the dropdown"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo -e "   • Use 'ollama pull <model>' to install additional models"
echo -e "   • Use 'ollama list' to see installed models"
echo -e "   • Use 'ollama rm <model>' to remove models"
echo ""
echo -e "${YELLOW}🚀 Start the app with: npm run dev${NC}"
echo ""