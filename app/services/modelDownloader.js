// Model Downloader Service - Downloads and manages tinydiarize models
const fs = require('fs');
const path = require('path');
const https = require('https');
const { app } = require('electron');

class ModelDownloader {
  constructor() {
    this.modelsDir = this.getModelsDirectory();
    this.models = {
      small: {
        name: 'Small Diarization Model', 
        filename: 'ggml-small.en-tdrz.bin',
        url: 'https://huggingface.co/akashmjn/tinydiarize-whisper.cpp/resolve/main/ggml-small.en-tdrz.bin',
        size: '~488MB',
        description: 'English speaker diarization model - good accuracy for most use cases'
      }
    };
  }

  getModelsDirectory() {
    // Try different possible locations
    const possiblePaths = [
      path.join(__dirname, '../../whisper.cpp/models'),
      path.join(process.cwd(), 'whisper.cpp/models'),
    ];

    // In production, check app resources
    if (app && app.isPackaged) {
      possiblePaths.unshift(path.join(process.resourcesPath, 'whisper.cpp/models'));
    }

    for (const modelPath of possiblePaths) {
      if (fs.existsSync(modelPath)) {
        return modelPath;
      }
    }

    // Default to the first path if none exist
    return possiblePaths[0];
  }

  // Check which models are already installed
  checkInstalledModels() {
    const installed = {};
    
    // First clean up any failed downloads
    this.cleanupFailedDownloads();
    
    for (const [key, model] of Object.entries(this.models)) {
      const modelPath = path.join(this.modelsDir, model.filename);
      const exists = fs.existsSync(modelPath);
      let isValid = false;
      
      if (exists) {
        const stats = fs.statSync(modelPath);
        // Consider file valid if it's larger than 1MB (incomplete downloads are usually much smaller)
        isValid = stats.size > 1024 * 1024;
      }
      
      installed[key] = {
        ...model,
        installed: exists && isValid,
        path: modelPath,
        size: exists && isValid ? this.getFileSize(modelPath) : null
      };
    }
    
    return installed;
  }

  getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return this.formatBytes(stats.size);
    } catch (error) {
      return null;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Download a specific model
  async downloadModel(modelKey, onProgress = null) {
    const model = this.models[modelKey];
    if (!model) {
      throw new Error(`Unknown model: ${modelKey}`);
    }

    const modelPath = path.join(this.modelsDir, model.filename);
    
    // Check if already exists
    if (fs.existsSync(modelPath)) {
      throw new Error(`${model.name} is already installed`);
    }

    // Ensure models directory exists
    if (!fs.existsSync(this.modelsDir)) {
      fs.mkdirSync(this.modelsDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      console.log(`Starting download: ${model.name}`);
      console.log(`URL: ${model.url}`);
      console.log(`Destination: ${modelPath}`);

      const file = fs.createWriteStream(modelPath);
      let downloadedBytes = 0;
      let totalBytes = 0;

      const request = https.get(model.url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          console.log(`Following redirect to: ${redirectUrl}`);
          
          // Close current file stream
          file.close();
          if (fs.existsSync(modelPath)) {
            fs.unlinkSync(modelPath);
          }
          
          // Create new file stream
          const redirectFile = fs.createWriteStream(modelPath);
          
          // Start new request with redirect URL
          const redirectRequest = https.get(redirectUrl, (redirectResponse) => {
            if (redirectResponse.statusCode !== 200) {
              redirectFile.close();
              if (fs.existsSync(modelPath)) {
                fs.unlinkSync(modelPath);
              }
              reject(new Error(`Download failed with status: ${redirectResponse.statusCode}`));
              return;
            }

            totalBytes = parseInt(redirectResponse.headers['content-length']) || 0;
            redirectResponse.pipe(redirectFile);
            
            redirectResponse.on('data', (chunk) => {
              downloadedBytes += chunk.length;
              if (onProgress && totalBytes > 0) {
                const progress = (downloadedBytes / totalBytes) * 100;
                onProgress({
                  model: model.name,
                  progress: Math.round(progress),
                  downloadedBytes: this.formatBytes(downloadedBytes),
                  totalBytes: this.formatBytes(totalBytes)
                });
              }
            });
          });

          redirectRequest.on('error', (error) => {
            redirectFile.close();
            if (fs.existsSync(modelPath)) {
              fs.unlinkSync(modelPath);
            }
            reject(error);
          });

          // Handle redirect file completion
          redirectFile.on('finish', () => {
            redirectFile.close();
            
            // Add a small delay to ensure file system operations complete
            setTimeout(() => {
              // Verify file exists and has content
              if (fs.existsSync(modelPath)) {
                const stats = fs.statSync(modelPath);
                if (stats.size > 0) {
                  console.log(`✅ ${model.name} downloaded successfully (${this.formatBytes(stats.size)})`);
                  resolve({
                    model: model.name,
                    path: modelPath,
                    size: this.formatBytes(stats.size)
                  });
                } else {
                  fs.unlinkSync(modelPath);
                  reject(new Error('Downloaded file is empty'));
                }
              } else {
                reject(new Error('Download completed but file not found'));
              }
            }, 100); // 100ms delay to ensure file system sync
          });

          redirectFile.on('error', (error) => {
            redirectFile.close();
            if (fs.existsSync(modelPath)) {
              fs.unlinkSync(modelPath);
            }
            reject(error);
          });

          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status: ${response.statusCode}`));
          return;
        }

        totalBytes = parseInt(response.headers['content-length']) || 0;
        response.pipe(file);
        
        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          if (onProgress && totalBytes > 0) {
            const progress = (downloadedBytes / totalBytes) * 100;
            onProgress({
              model: model.name,
              progress: Math.round(progress),
              downloadedBytes: this.formatBytes(downloadedBytes),
              totalBytes: this.formatBytes(totalBytes)
            });
          }
        });
      });

      request.on('error', (error) => {
        file.close();
        if (fs.existsSync(modelPath)) {
          fs.unlinkSync(modelPath);
        }
        reject(error);
      });

      file.on('finish', () => {
        file.close();
        
        // Add a small delay to ensure file system operations complete
        setTimeout(() => {
          // Verify file exists and has content
          if (fs.existsSync(modelPath)) {
            const stats = fs.statSync(modelPath);
            if (stats.size > 0) {
              console.log(`✅ ${model.name} downloaded successfully (${this.formatBytes(stats.size)})`);
              resolve({
                model: model.name,
                path: modelPath,
                size: this.formatBytes(stats.size)
              });
            } else {
              fs.unlinkSync(modelPath);
              reject(new Error('Downloaded file is empty'));
            }
          } else {
            reject(new Error('Download completed but file not found'));
          }
        }, 100); // 100ms delay to ensure file system sync
      });

      file.on('error', (error) => {
        file.close();
        if (fs.existsSync(modelPath)) {
          fs.unlinkSync(modelPath);
        }
        reject(error);
      });
    });
  }

  // Download multiple models
  async downloadModels(modelKeys, onProgress = null) {
    const results = [];
    
    for (const modelKey of modelKeys) {
      try {
        const result = await this.downloadModel(modelKey, onProgress);
        results.push({ ...result, success: true });
      } catch (error) {
        results.push({ 
          model: this.models[modelKey]?.name || modelKey, 
          success: false, 
          error: error.message 
        });
      }
    }
    
    return results;
  }

  // Get download recommendations
  getRecommendations() {
    const installed = this.checkInstalledModels();
    const recommendations = [];

    if (!installed.small.installed) {
      recommendations.push({
        type: 'first_install',
        title: 'Enable Speaker Detection',
        description: 'Download the speaker diarization model to identify different speakers',
        models: ['small'],
        primary: true
      });
    }

    return recommendations;
  }

  // Clean up failed downloads
  cleanupFailedDownloads() {
    const cleaned = [];
    
    for (const [key, model] of Object.entries(this.models)) {
      const modelPath = path.join(this.modelsDir, model.filename);
      
      if (fs.existsSync(modelPath)) {
        const stats = fs.statSync(modelPath);
        
        // If file is too small (likely incomplete download), remove it
        if (stats.size < 1024 * 1024) { // Less than 1MB
          try {
            fs.unlinkSync(modelPath);
            cleaned.push(model.name);
          } catch (error) {
            console.error(`Failed to clean up ${model.name}:`, error);
          }
        }
      }
    }
    
    return cleaned;
  }
}

module.exports = ModelDownloader;