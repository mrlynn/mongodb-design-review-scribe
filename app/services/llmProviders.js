// LLM Provider Abstraction Layer - Support for multiple AI providers
const https = require('https');
const http = require('http');
const { loadConfig, saveConfig } = require('../config');
const { trackRequest } = require('./usageTracker');

class LLMProviderManager {
  constructor() {
    this.config = loadConfig();
    this.providers = {
      ollama: new OllamaProvider(),
      openai: new OpenAIProvider(),
      gemini: new GeminiProvider(),
      claude: new ClaudeProvider(),
      cohere: new CohereProvider(),
      mistral: new MistralProvider()
    };
  }

  getCurrentProvider() {
    const providerName = this.config.llm.provider || 'ollama';
    return this.providers[providerName];
  }

  async testConnection(providerName = null) {
    const provider = providerName ? this.providers[providerName] : this.getCurrentProvider();
    return await provider.testConnection(this.config);
  }

  async generateCompletion(prompt, options = {}) {
    const provider = this.getCurrentProvider();
    return await provider.generateCompletion(prompt, this.config, options);
  }

  async generateEmbedding(text) {
    const provider = this.getCurrentProvider();
    if (provider.generateEmbedding) {
      return await provider.generateEmbedding(text, this.config);
    } else {
      // Fallback to OpenAI for embedding if current provider doesn't support it
      const openaiProvider = this.providers.openai;
      return await openaiProvider.generateEmbedding(text, this.config);
    }
  }

  async extractTopics(text) {
    console.log('🤖 LLM Manager: Starting topic extraction with provider:', this.config.llm.provider);
    const provider = this.getCurrentProvider();
    console.log('🔧 LLM Manager: Using provider:', provider.getName());
    
    try {
      const result = await provider.extractTopics(text, this.config);
      console.log('✅ LLM Manager: Topic extraction successful:', result);
      
      // Track usage for topic extraction
      const inputTokens = this.estimateTokens(provider.buildTopicsPrompt(text));
      const outputTokens = this.estimateTokens(JSON.stringify(result));
      trackRequest('topicExtraction', inputTokens, outputTokens, this.config.llm.provider, this.config.llm.model);
      
      return result;
    } catch (error) {
      console.error('❌ LLM Manager: Topic extraction failed:', error);
      throw error;
    }
  }

  async generateMeetingNotes(transcript, topics, research) {
    const provider = this.getCurrentProvider();
    const result = await provider.generateMeetingNotes(transcript, topics, research, this.config);
    
    // Track usage for meeting notes
    const inputTokens = this.estimateTokens(provider.buildMeetingNotesPrompt(transcript, topics));
    const outputTokens = this.estimateTokens(JSON.stringify(result));
    trackRequest('meetingNotes', inputTokens, outputTokens, this.config.llm.provider, this.config.llm.model);
    
    return result;
  }

  estimateTokens(text) {
    // Rough estimation: ~4 characters per token for most models
    return Math.ceil(text.length / 4);
  }

  getAvailableProviders() {
    return Object.keys(this.providers).map(key => ({
      id: key,
      name: this.providers[key].getName(),
      description: this.providers[key].getDescription(),
      requiresApiKey: this.providers[key].requiresApiKey(),
      models: this.providers[key].getAvailableModels()
    }));
  }

  updateSettings(newSettings) {
    this.config = { ...this.config, ...newSettings };
    saveConfig(this.config);
    
    // Reload config to ensure fresh data
    this.config = loadConfig();
  }
}

// Base Provider Class
class BaseProvider {
  getName() { throw new Error('getName must be implemented'); }
  getDescription() { throw new Error('getDescription must be implemented'); }
  requiresApiKey() { return true; }
  getAvailableModels() { return []; }
  
  async testConnection(config) { throw new Error('testConnection must be implemented'); }
  async generateCompletion(prompt, config, options) { throw new Error('generateCompletion must be implemented'); }
  
  async extractTopics(text, config) {
    const prompt = this.buildTopicsPrompt(text);
    const response = await this.generateCompletion(prompt, config, { 
      temperature: 0.3,
      format: 'json'
    });
    return this.parseTopicsResponse(response);
  }

  async generateMeetingNotes(transcript, topics, research, config) {
    const prompt = this.buildMeetingNotesPrompt(transcript, topics);
    const response = await this.generateCompletion(prompt, config, { 
      temperature: 0.2,
      format: 'json'
    });
    return this.parseMeetingNotesResponse(response);
  }

  buildTopicsPrompt(text) {
    return `You are an intelligent conversation analyzer focused on extracting meaningful topics for real-time research and recommendations.

Analyze this conversation segment and identify:
1. Main topics being discussed that would benefit from additional context or research
2. Technical concepts, tools, or technologies mentioned
3. Problems or challenges being discussed
4. Questions (explicit or implied) that need answers
5. Business or strategic topics that require deeper insights

Conversation transcript:
"${text}"

Extract topics with these guidelines:
- Focus on concrete, researchable topics (not generic conversation)
- Prioritize technical terms, product names, methodologies, and specific concepts
- Identify pain points or challenges that could benefit from solutions
- Look for decision points where research could help
- Extract entities like company names, technologies, frameworks, or standards

Respond with a JSON object:
{
  "topics": [3-5 main topics worth researching, be specific],
  "questions": [any questions that need answers],
  "terms": [technical terms or jargon needing explanation],
  "entities": [specific products, companies, technologies mentioned],
  "challenges": [problems or pain points discussed]
}

Example for a MongoDB discussion:
{
  "topics": ["MongoDB sharding strategies", "write concern configuration", "replica set elections"],
  "questions": ["How to optimize query performance with compound indexes?"],
  "terms": ["write concern", "read preference", "oplog"],
  "entities": ["MongoDB Atlas", "WiredTiger storage engine"],
  "challenges": ["slow aggregation pipeline performance", "connection pool exhaustion"]
}`;
  }

  buildMeetingNotesPrompt(transcript, topics) {
    return `You are an AI meeting assistant. Analyze the following conversation transcript and generate comprehensive meeting notes.

CONVERSATION TRANSCRIPT:
"${transcript}"

IDENTIFIED TOPICS: ${topics.map(t => t.topics).flat().join(', ')}

Generate meeting notes in the following JSON format:
{
  "summary": "2-3 sentence high-level summary of the meeting",
  "actionItems": [
    {
      "item": "specific action to be taken",
      "assignee": "person responsible (if mentioned)",
      "deadline": "deadline if mentioned, otherwise null",
      "priority": "high/medium/low"
    }
  ],
  "decisions": [
    {
      "decision": "what was decided",
      "context": "why this decision was made",
      "impact": "who/what this affects"
    }
  ],
  "keyPoints": [
    "important discussion point 1",
    "important discussion point 2"
  ],
  "attendees": ["person1", "person2"],
  "nextSteps": [
    "what happens next",
    "follow-up meetings or actions"
  ]
}

Extract specific, actionable items with clear ownership when possible. Only include high-confidence information.`;
  }

  parseTopicsResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        topics: parsed.topics || [],
        questions: parsed.questions || [],
        terms: parsed.terms || [],
        entities: parsed.entities || [],
        challenges: parsed.challenges || []
      };
    } catch (error) {
      console.error('Failed to parse topics response:', error);
      // Try to extract topics from plain text if JSON parsing fails
      const topics = this.extractTopicsFromText(response);
      return { 
        topics: topics, 
        questions: [], 
        terms: [],
        entities: [],
        challenges: []
      };
    }
  }
  
  extractTopicsFromText(text) {
    // Fallback topic extraction using regex patterns
    const topics = [];
    
    // Look for quoted phrases
    const quotedMatches = text.match(/"([^"]+)"/g);
    if (quotedMatches) {
      topics.push(...quotedMatches.map(m => m.replace(/"/g, '')));
    }
    
    // Look for bullet points or numbered lists
    const listMatches = text.match(/(?:^|\n)[-•*\d]+\.?\s+(.+)/gm);
    if (listMatches) {
      topics.push(...listMatches.map(m => m.replace(/^[-•*\d]+\.?\s+/, '').trim()));
    }
    
    return topics.slice(0, 5); // Limit to 5 topics
  }

  parseMeetingNotesResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        summary: parsed.summary || '',
        actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
        decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
        keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
        attendees: Array.isArray(parsed.attendees) ? parsed.attendees : [],
        nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : []
      };
    } catch (error) {
      console.error('Failed to parse meeting notes response:', error);
      return {
        summary: 'Error parsing meeting notes',
        actionItems: [], decisions: [], keyPoints: [], attendees: [], nextSteps: []
      };
    }
  }
}

// Ollama Provider (Local)
class OllamaProvider extends BaseProvider {
  constructor() {
    super();
    this.ollamaManager = null;
  }

  getName() { return 'Ollama (Local)'; }
  getDescription() { return 'Local LLM running via Ollama - privacy-first, no API key required, automatic model management'; }
  requiresApiKey() { return false; }
  
  getAvailableModels() { 
    return [
      'llama3.1:8b',
      'llama3.1:70b', 
      'codellama:7b',
      'codellama:13b',
      'phi3:mini',
      'phi3:medium',
      'mistral:7b',
      'gemma:7b',
      'qwen2.5:7b'
    ]; 
  }

  setOllamaManager(manager) {
    this.ollamaManager = manager;
  }

  async testConnection(config) {
    try {
      // If we have access to the OllamaManager, use it
      if (this.ollamaManager) {
        const status = this.ollamaManager.getStatus();
        return status.isRunning;
      }

      // Fallback to direct API check
      const response = await this.makeRequest(config.llm.endpoint || 'http://localhost:11434', '/api/tags', 'GET');
      return !!(response && response.models);
    } catch (error) {
      console.error('Ollama connection test failed:', error);
      return false;
    }
  }

  async generateCompletion(prompt, config, options = {}) {
    try {
      // If we have access to the OllamaManager, use it (preferred)
      if (this.ollamaManager && this.ollamaManager.getStatus().isRunning) {
        const modelName = config.llm.model || 'llama3.1:8b';
        
        // Ensure the model is available
        await this.ollamaManager.ensureModel(modelName);
        
        // Convert prompt to messages format
        const messages = [
          { role: 'user', content: prompt }
        ];

        // Generate response using OllamaManager
        const response = await this.ollamaManager.generateResponse(messages, {
          temperature: options.temperature || 0.3,
          top_p: options.top_p || 0.9
        });

        return response;
      }

      // Fallback to direct API calls
      console.warn('🤖 OllamaManager not available, falling back to direct API calls');
      return await this.generateCompletionDirect(prompt, config, options);
      
    } catch (error) {
      console.error('Ollama completion failed:', error);
      
      // Try fallback method
      try {
        return await this.generateCompletionDirect(prompt, config, options);
      } catch (fallbackError) {
        throw new Error(`Ollama generation failed: ${error.message}. Fallback also failed: ${fallbackError.message}`);
      }
    }
  }

  async generateCompletionDirect(prompt, config, options = {}) {
    const payload = {
      model: config.llm.model || 'llama3.1:8b',
      prompt: prompt,
      stream: false,
      options: {
        temperature: options.temperature || 0.3,
        top_p: options.top_p || 0.9
      }
    };

    if (options.format === 'json') {
      payload.format = 'json';
    }

    const response = await this.makeRequest(
      config.llm.endpoint || 'http://localhost:11434', 
      '/api/generate', 
      'POST', 
      payload
    );
    
    return response.response;
  }

  async makeRequest(baseUrl, path, method, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(baseUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout for model operations
      };

      const req = client.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
}

// OpenAI Provider
class OpenAIProvider extends BaseProvider {
  getName() { return 'OpenAI'; }
  getDescription() { return 'GPT-4, GPT-3.5 and other OpenAI models'; }
  getAvailableModels() { 
    return ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4o-mini']; 
  }

  async testConnection(config) {
    if (!config.llm.openaiApiKey) return false;
    
    try {
      const response = await this.makeAPIRequest(config, '/models', 'GET');
      return !!(response && response.data);
    } catch (error) {
      console.error('OpenAI connection test failed:', error);
      return false;
    }
  }

  async generateCompletion(prompt, config, options = {}) {
    console.log('🔑 OpenAI: Starting completion with model:', config.llm.model);
    console.log('🔐 OpenAI: API key present:', !!config.llm.openaiApiKey);
    console.log('📝 OpenAI: Prompt length:', prompt.length);
    
    const payload = {
      model: config.llm.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature || 0.3,
      max_tokens: options.maxTokens || 2000
    };

    // Only use JSON format for models that support it (gpt-4o, gpt-4o-mini, gpt-3.5-turbo-1106+)
    const supportsJsonFormat = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo'].includes(config.llm.model);
    
    if (options.format === 'json') {
      if (supportsJsonFormat) {
        payload.response_format = { type: 'json_object' };
        console.log('📋 OpenAI: Requesting JSON format');
      } else {
        console.log('📋 OpenAI: Model does not support JSON format, using text prompt');
      }
      payload.messages[0].content = 'Respond with valid JSON only. ' + prompt;
    }

    try {
      console.log('🌐 OpenAI: Making API request...');
      const response = await this.makeAPIRequest(config, '/chat/completions', 'POST', payload);
      console.log('✅ OpenAI: API request successful');
      
      // Check if we got an error response
      if (response.error) {
        console.error('❌ OpenAI: API returned error:', response.error);
        throw new Error(`OpenAI API error: ${response.error.message}`);
      }
      
      // Check if response has expected structure
      if (!response.choices || !response.choices[0] || !response.choices[0].message) {
        console.error('❌ OpenAI: Unexpected response structure:', JSON.stringify(response, null, 2));
        throw new Error('Unexpected response structure from OpenAI API');
      }
      
      console.log('🔍 OpenAI: Response received successfully');
      return response.choices[0].message.content;
    } catch (error) {
      console.error('❌ OpenAI: API request failed:', error);
      throw error;
    }
  }

  async generateEmbedding(text, config) {
    console.log('🔢 OpenAI: Generating embedding for text length:', text.length);
    
    const payload = {
      model: 'text-embedding-3-small', // Use the small model for cost efficiency
      input: text,
      encoding_format: 'float'
    };

    try {
      const response = await this.makeAPIRequest(config, '/embeddings', 'POST', payload);
      
      if (response.error) {
        console.error('❌ OpenAI Embedding: API returned error:', response.error);
        throw new Error(`OpenAI Embedding API error: ${response.error.message}`);
      }
      
      if (!response.data || !response.data[0] || !response.data[0].embedding) {
        console.error('❌ OpenAI Embedding: Unexpected response structure:', JSON.stringify(response, null, 2));
        throw new Error('Unexpected response structure from OpenAI Embedding API');
      }
      
      console.log('✅ OpenAI: Embedding generated successfully, dimensions:', response.data[0].embedding.length);
      return response.data[0].embedding;
    } catch (error) {
      console.error('❌ OpenAI Embedding: Request failed:', error);
      throw error;
    }
  }

  async makeAPIRequest(config, path, method, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: `/v1${path}`,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.llm.openaiApiKey}`
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
}

// Google Gemini Provider
class GeminiProvider extends BaseProvider {
  getName() { return 'Google Gemini'; }
  getDescription() { return 'Google\'s Gemini Pro and other Gemini models'; }
  getAvailableModels() { 
    return ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-1.5-flash']; 
  }

  async testConnection(config) {
    if (!config.llm.geminiApiKey) return false;
    
    try {
      const response = await this.makeAPIRequest(config, '/models', 'GET');
      return !!(response && response.models);
    } catch (error) {
      console.error('Gemini connection test failed:', error);
      return false;
    }
  }

  async generateCompletion(prompt, config, options = {}) {
    const model = config.llm.model || 'gemini-pro';
    const payload = {
      contents: [{
        parts: [{ text: options.format === 'json' ? 'Respond with valid JSON only. ' + prompt : prompt }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.3,
        maxOutputTokens: options.maxTokens || 2000
      }
    };

    const response = await this.makeAPIRequest(config, `/models/${model}:generateContent`, 'POST', payload);
    return response.candidates[0].content.parts[0].text;
  }

  async makeAPIRequest(config, path, method, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1${path}?key=${config.llm.geminiApiKey}`,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
}

// Anthropic Claude Provider
class ClaudeProvider extends BaseProvider {
  getName() { return 'Anthropic Claude'; }
  getDescription() { return 'Claude 3 Opus, Sonnet, and Haiku models'; }
  getAvailableModels() { 
    return ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-3-5-sonnet-20241022']; 
  }

  async testConnection(config) {
    if (!config.llm.claudeApiKey) return false;
    
    try {
      // Test with a simple message
      await this.generateCompletion('Test', config, { maxTokens: 10 });
      return true;
    } catch (error) {
      console.error('Claude connection test failed:', error);
      return false;
    }
  }

  async generateCompletion(prompt, config, options = {}) {
    const payload = {
      model: config.llm.model || 'claude-3-sonnet-20240229',
      max_tokens: options.maxTokens || 2000,
      temperature: options.temperature || 0.3,
      messages: [{ 
        role: 'user', 
        content: options.format === 'json' ? 'Respond with valid JSON only. ' + prompt : prompt 
      }]
    };

    const response = await this.makeAPIRequest(config, '/messages', 'POST', payload);
    return response.content[0].text;
  }

  async makeAPIRequest(config, path, method, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.anthropic.com',
        port: 443,
        path: `/v1${path}`,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.llm.claudeApiKey,
          'anthropic-version': '2023-06-01'
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
}

// Cohere Provider
class CohereProvider extends BaseProvider {
  getName() { return 'Cohere'; }
  getDescription() { return 'Cohere Command and other models'; }
  getAvailableModels() { 
    return ['command', 'command-nightly', 'command-light', 'command-r', 'command-r-plus']; 
  }

  async testConnection(config) {
    if (!config.llm.cohereApiKey) return false;
    
    try {
      const response = await this.makeAPIRequest(config, '/models', 'GET');
      return response && response.models;
    } catch (error) {
      console.error('Cohere connection test failed:', error);
      return false;
    }
  }

  async generateCompletion(prompt, config, options = {}) {
    const payload = {
      model: config.llm.model || 'command',
      message: options.format === 'json' ? 'Respond with valid JSON only. ' + prompt : prompt,
      temperature: options.temperature || 0.3,
      max_tokens: options.maxTokens || 2000
    };

    const response = await this.makeAPIRequest(config, '/chat', 'POST', payload);
    return response.text;
  }

  async makeAPIRequest(config, path, method, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.cohere.ai',
        port: 443,
        path: `/v1${path}`,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.llm.cohereApiKey}`
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
}

// Mistral Provider
class MistralProvider extends BaseProvider {
  getName() { return 'Mistral AI'; }
  getDescription() { return 'Mistral 7B, Mixtral, and other Mistral models'; }
  getAvailableModels() { 
    return ['mistral-tiny', 'mistral-small', 'mistral-medium', 'mistral-large']; 
  }

  async testConnection(config) {
    if (!config.llm.mistralApiKey) return false;
    
    try {
      const response = await this.makeAPIRequest(config, '/models', 'GET');
      return response && response.data;
    } catch (error) {
      console.error('Mistral connection test failed:', error);
      return false;
    }
  }

  async generateCompletion(prompt, config, options = {}) {
    const payload = {
      model: config.llm.model || 'mistral-tiny',
      messages: [{ 
        role: 'user', 
        content: options.format === 'json' ? 'Respond with valid JSON only. ' + prompt : prompt 
      }],
      temperature: options.temperature || 0.3,
      max_tokens: options.maxTokens || 2000
    };

    const response = await this.makeAPIRequest(config, '/chat/completions', 'POST', payload);
    return response.choices[0].message.content;
  }

  async makeAPIRequest(config, path, method, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'api.mistral.ai',
        port: 443,
        path: `/v1${path}`,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.llm.mistralApiKey}`
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
}

// Create singleton instance
const llmManager = new LLMProviderManager();

module.exports = {
  llmManager,
  testConnection: (provider) => llmManager.testConnection(provider),
  generateCompletion: (prompt, options) => llmManager.generateCompletion(prompt, options),
  generateEmbedding: (text) => llmManager.generateEmbedding(text),
  extractTopics: (text) => llmManager.extractTopics(text),
  generateMeetingNotes: (transcript, topics, research) => llmManager.generateMeetingNotes(transcript, topics, research),
  getAvailableProviders: () => llmManager.getAvailableProviders(),
  updateSettings: (settings) => llmManager.updateSettings(settings)
};