const { Ollama } = require('ollama');
const { EventEmitter } = require('events');

class OllamaManager extends EventEmitter {
  constructor() {
    super();
    this.ollama = null;
    this.isRunning = false;
    this.currentModel = null;
    this.defaultModel = 'llama3.1:8b'; // Good balance of performance and quality
    this.host = 'http://localhost:11434';
  }

  async initialize() {
    try {
      this.ollama = new Ollama({ host: this.host });
      
      // Check if Ollama is already running
      const isAlreadyRunning = await this.checkConnection();
      if (isAlreadyRunning) {
        console.log('🤖 Ollama service already running');
        this.isRunning = true;
        this.emit('status', { type: 'connected', message: 'Connected to existing Ollama service' });
        return true;
      }

      // Start Ollama service
      await this.startService();
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Ollama:', error);
      this.emit('error', { type: 'initialization', error: error.message });
      return false;
    }
  }

  async checkConnection() {
    try {
      const response = await fetch(`${this.host}/api/tags`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async startService() {
    try {
      console.log('🚀 Starting Ollama service...');
      this.emit('status', { type: 'starting', message: 'Starting Ollama service...' });
      
      // Note: The ollama npm package doesn't have a serve() method
      // We need to start the service externally or check if it's running
      
      // Wait for service to be available
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds
      
      while (attempts < maxAttempts) {
        if (await this.checkConnection()) {
          this.isRunning = true;
          console.log('✅ Ollama service is running');
          this.emit('status', { type: 'running', message: 'Ollama service is running' });
          return true;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
        
        if (attempts % 5 === 0) {
          this.emit('status', { 
            type: 'waiting', 
            message: `Waiting for Ollama service... (${attempts}/${maxAttempts})` 
          });
        }
      }
      
      throw new Error('Ollama service failed to start within timeout');
    } catch (error) {
      console.error('❌ Failed to start Ollama service:', error);
      this.emit('error', { type: 'startup', error: error.message });
      throw error;
    }
  }

  async ensureModel(modelName = this.defaultModel) {
    try {
      if (!this.isRunning) {
        throw new Error('Ollama service is not running');
      }

      console.log(`🔍 Checking if model ${modelName} is available...`);
      this.emit('status', { type: 'checking-model', message: `Checking model: ${modelName}` });

      // List available models
      const models = await this.ollama.list();
      const modelExists = models.models.some(model => model.name === modelName);

      if (!modelExists) {
        console.log(`📥 Model ${modelName} not found, downloading...`);
        await this.downloadModel(modelName);
      } else {
        console.log(`✅ Model ${modelName} is available`);
        this.emit('status', { type: 'model-ready', message: `Model ${modelName} is ready` });
      }

      this.currentModel = modelName;
      return true;
    } catch (error) {
      console.error('❌ Failed to ensure model:', error);
      this.emit('error', { type: 'model', error: error.message, model: modelName });
      throw error;
    }
  }

  async downloadModel(modelName) {
    try {
      console.log(`📥 Downloading model: ${modelName}`);
      this.emit('status', { 
        type: 'downloading', 
        message: `Downloading model: ${modelName}`,
        model: modelName 
      });

      // Use the pull method with progress tracking
      const stream = await this.ollama.pull({ 
        model: modelName, 
        stream: true 
      });

      let totalSize = 0;
      let downloadedSize = 0;

      for await (const chunk of stream) {
        if (chunk.total) {
          totalSize = chunk.total;
        }
        if (chunk.completed) {
          downloadedSize = chunk.completed;
        }

        const percentage = totalSize > 0 ? Math.round((downloadedSize / totalSize) * 100) : 0;
        
        this.emit('download-progress', {
          model: modelName,
          status: chunk.status,
          percentage,
          completed: downloadedSize,
          total: totalSize
        });

        if (chunk.status === 'success') {
          console.log(`✅ Model ${modelName} downloaded successfully`);
          this.emit('status', { 
            type: 'model-downloaded', 
            message: `Model ${modelName} downloaded successfully` 
          });
          break;
        }
      }

      return true;
    } catch (error) {
      console.error(`❌ Failed to download model ${modelName}:`, error);
      this.emit('error', { type: 'download', error: error.message, model: modelName });
      throw error;
    }
  }

  async generateResponse(messages, options = {}) {
    try {
      if (!this.isRunning || !this.currentModel) {
        throw new Error('Ollama service is not ready');
      }

      console.log(`🤖 Generating response with model: ${this.currentModel}`);
      
      const response = await this.ollama.chat({
        model: this.currentModel,
        messages: messages,
        stream: false,
        ...options
      });

      return response.message.content;
    } catch (error) {
      console.error('❌ Failed to generate response:', error);
      this.emit('error', { type: 'generation', error: error.message });
      throw error;
    }
  }

  async generateStreamResponse(messages, onChunk, options = {}) {
    try {
      if (!this.isRunning || !this.currentModel) {
        throw new Error('Ollama service is not ready');
      }

      console.log(`🤖 Generating streaming response with model: ${this.currentModel}`);
      
      const stream = await this.ollama.chat({
        model: this.currentModel,
        messages: messages,
        stream: true,
        ...options
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        if (chunk.message?.content) {
          fullResponse += chunk.message.content;
          onChunk(chunk.message.content);
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('❌ Failed to generate streaming response:', error);
      this.emit('error', { type: 'streaming', error: error.message });
      throw error;
    }
  }

  async listModels() {
    try {
      if (!this.isRunning) {
        throw new Error('Ollama service is not running');
      }

      const response = await this.ollama.list();
      return response.models;
    } catch (error) {
      console.error('❌ Failed to list models:', error);
      this.emit('error', { type: 'list-models', error: error.message });
      throw error;
    }
  }

  async deleteModel(modelName) {
    try {
      if (!this.isRunning) {
        throw new Error('Ollama service is not running');
      }

      await this.ollama.delete({ model: modelName });
      console.log(`🗑️ Model ${modelName} deleted`);
      this.emit('status', { type: 'model-deleted', message: `Model ${modelName} deleted` });
      
      if (this.currentModel === modelName) {
        this.currentModel = null;
      }
      
      return true;
    } catch (error) {
      console.error(`❌ Failed to delete model ${modelName}:`, error);
      this.emit('error', { type: 'delete-model', error: error.message, model: modelName });
      throw error;
    }
  }

  async stop() {
    try {
      console.log('🛑 Stopping Ollama manager...');
      this.isRunning = false;
      this.currentModel = null;
      this.ollama = null;
      this.emit('status', { type: 'stopped', message: 'Ollama manager stopped' });
    } catch (error) {
      console.error('❌ Error stopping Ollama manager:', error);
      this.emit('error', { type: 'stop', error: error.message });
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      currentModel: this.currentModel,
      host: this.host
    };
  }

  // Recommended models based on system resources
  static getRecommendedModels(ramGB) {
    if (ramGB < 8) {
      return [
        { name: 'phi3:mini', size: '3.8GB', description: 'Small, efficient model' },
        { name: 'tinyllama', size: '700MB', description: 'Tiny model for testing' }
      ];
    } else if (ramGB < 16) {
      return [
        { name: 'llama3.1:8b', size: '4.7GB', description: 'Recommended general-purpose model' },
        { name: 'phi3:medium', size: '7.9GB', description: 'Microsoft efficient model' },
        { name: 'codellama:7b', size: '3.8GB', description: 'Best for code and technical content' }
      ];
    } else {
      return [
        { name: 'llama3.1:8b', size: '4.7GB', description: 'Fast and capable' },
        { name: 'llama3.1:70b', size: '40GB', description: 'Highest quality (requires 40GB+)' },
        { name: 'codellama:13b', size: '7.3GB', description: 'Best for technical reviews' },
        { name: 'mistral:7b', size: '4.1GB', description: 'Good alternative to Llama' }
      ];
    }
  }
}

module.exports = OllamaManager;