# .claude/commands/session-current.md

```md
Show the current session status by:

1. Check if `.claude/sessions/.current-session` exists
2. If no active session, inform user and suggest starting one
3. If active session exists:
   - Show session name and filename
   - Calculate and show duration since start
   - Show last few updates
   - Show current goals/tasks
   - Remind user of available commands

Keep the output concise and informative.
```

# .claude/commands/session-end.md

```md
End the current development session by:

1. Check `.claude/sessions/.current-session` for the active session
2. If no active session, inform user there's nothing to end
3. If session exists, append a comprehensive summary including:
   - Session duration
   - Git summary:
     * Total files changed (added/modified/deleted)
     * List all changed files with change type
     * Number of commits made (if any)
     * Final git status
   - Todo summary:
     * Total tasks completed/remaining
     * List all completed tasks
     * List any incomplete tasks with status
   - Key accomplishments
   - All features implemented
   - Problems encountered and solutions
   - Breaking changes or important findings
   - Dependencies added/removed
   - Configuration changes
   - Deployment steps taken
   - Lessons learned
   - What wasn't completed
   - Tips for future developers

4. Empty the `.claude/sessions/.current-session` file (don't remove it, just clear its contents)
5. Inform user the session has been documented

The summary should be thorough enough that another developer (or AI) can understand everything that happened without reading the entire session.
```

# .claude/commands/session-help.md

```md
Show help for the session management system:

## Session Management Commands

The session system helps document development work for future reference.

### Available Commands:

- `/project:session-start [name]` - Start a new session with optional name
- `/project:session-update [notes]` - Add notes to current session  
- `/project:session-end` - End session with comprehensive summary
- `/project:session-list` - List all session files
- `/project:session-current` - Show current session status
- `/project:session-help` - Show this help

### How It Works:

1. Sessions are markdown files in `.claude/sessions/`
2. Files use `YYYY-MM-DD-HHMM-name.md` format
3. Only one session can be active at a time
4. Sessions track progress, issues, solutions, and learnings

### Best Practices:

- Start a session when beginning significant work
- Update regularly with important changes or findings
- End with thorough summary for future reference
- Review past sessions before starting similar work

### Example Workflow:

\`\`\`
/project:session-start refactor-auth
/project:session-update Added Google OAuth restriction
/project:session-update Fixed Next.js 15 params Promise issue  
/project:session-end
\`\`\`
```

# .claude/commands/session-list.md

```md
List all development sessions by:

1. Check if `.claude/sessions/` directory exists
2. List all `.md` files (excluding hidden files and `.current-session`)
3. For each session file:
   - Show the filename
   - Extract and show the session title
   - Show the date/time
   - Show first few lines of the overview if available
4. If `.claude/sessions/.current-session` exists, highlight which session is currently active
5. Sort by most recent first

Present in a clean, readable format.
```

# .claude/commands/session-start.md

```md
Start a new development session by creating a session file in `.claude/sessions/` with the format `YYYY-MM-DD-HHMM-$ARGUMENTS.md` (or just `YYYY-MM-DD-HHMM.md` if no name provided).

The session file should begin with:
1. Session name and timestamp as the title
2. Session overview section with start time
3. Goals section (ask user for goals if not clear)
4. Empty progress section ready for updates

After creating the file, create or update `.claude/sessions/.current-session` to track the active session filename.

Confirm the session has started and remind the user they can:
- Update it with `/project:session-update`
- End it with `/project:session-end`
```

# .claude/commands/session-update.md

```md
Update the current development session by:

1. Check if `.claude/sessions/.current-session` exists to find the active session
2. If no active session, inform user to start one with `/project:session-start`
3. If session exists, append to the session file with:
   - Current timestamp
   - The update: $ARGUMENTS (or if no arguments, summarize recent activities)
   - Git status summary:
     * Files added/modified/deleted (from `git status --porcelain`)
     * Current branch and last commit
   - Todo list status:
     * Number of completed/in-progress/pending tasks
     * List any newly completed tasks
   - Any issues encountered
   - Solutions implemented
   - Code changes made

Keep updates concise but comprehensive for future reference.

Example format:
\`\`\`
### Update - 2025-06-16 12:15 PM

**Summary**: Implemented user authentication

**Git Changes**:
- Modified: app/middleware.ts, lib/auth.ts
- Added: app/login/page.tsx
- Current branch: main (commit: abc123)

**Todo Progress**: 3 completed, 1 in progress, 2 pending
- ✓ Completed: Set up auth middleware
- ✓ Completed: Create login page
- ✓ Completed: Add logout functionality

**Details**: [user's update or automatic summary]
\`\`\`
```

# .claude/sessions/.current-session

```

```

# .claude/settings.local.json

```json
{
  "permissions": {
    "allow": [
      "Bash(grep:*)",
      "Bash(ls:*)",
      "Bash(cmake:*)",
      "Bash(npm start)",
      "Bash(rm:*)",
      "Bash(pkill:*)",
      "Bash(./whisper.cpp/build/bin/whisper-cli:*)",
      "Bash(node:*)",
      "Bash(npm install:*)",
      "Bash(rg:*)",
      "WebFetch(domain:raw.githubusercontent.com)",
      "WebFetch(domain:api.github.com)"
    ],
    "deny": []
  }
}
```

# .gitignore

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
out/
*.tgz
*.tar.gz

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# dotenv environment variables file
.env
.env.test
.env.local
.env.production

# parcel-bundler cache
.cache
.parcel-cache

# Temporary folders
tmp/
temp/

# Logs
logs
*.log

# IDEs and editors
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Electron specific
out/

# Whisper models (large files) and embedded git repo
whisper.cpp/
!whisper.cpp/models/for-tests-*.bin

# Data files (sessions, exports)
data/
exports/
session-*.json

# Test files
test-*.js

# Build artifacts
*.dmg
*.pkg
*.deb
*.rpm
*.snap
*.appimage
*.exe
*.msi
*.zip

# Local development
.env.local
.env.development
config/local.json

# Cache directories
.cache/
.parcel-cache/

# MongoDB connection strings and sensitive data
config/production.json
```

# app/config/index.js

```js
// Config Loader
const fs = require('fs');
const os = require('os');
const path = require('path');

const configDir = path.join(os.homedir(), '.research-companion');
const configFile = path.join(configDir, 'config.json');

function loadConfig() {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }
  if (!fs.existsSync(configFile)) {
    // Default config
    const defaultConfig = {
      llm: {
        provider: 'ollama',
        model: 'llama3',
        endpoint: 'http://localhost:11434',
        // API Keys for different providers
        openaiApiKey: '',
        geminiApiKey: '',
        claudeApiKey: '',
        cohereApiKey: '',
        mistralApiKey: '',
        // Provider-specific settings
        temperature: 0.3,
        maxTokens: 2000,
      },
      speech_to_text: {
        method: 'whisper.cpp',
        language: 'en',
      },
      research: {
        // Legacy providers
        providers: ['wikipedia', 'duckduckgo'],
        max_results: 4,
        googleApiKey: '',
        googleSearchEngineId: '',
        
        // Enhanced AI-powered providers
        aiProviders: ['tavily'], // tavily, perplexity, you, serpapi, brave
        academicProviders: ['arxiv', 'semanticscholar'], // arxiv, pubmed, semanticscholar, core, googlescholar
        newsProviders: ['newsapi', 'reddit', 'hackernews'], // newsapi, guardian, nytimes, reddit, hackernews, googlenews
        technicalProviders: ['stackoverflow', 'github', 'npm'], // stackoverflow, github, mdn, npm, pypi, cargo
        
        // API Keys for enhanced providers
        perplexityApiKey: '',
        youApiKey: '',
        tavilyApiKey: '',
        serpApiKey: '',
        braveApiKey: '',
        
        semanticScholarApiKey: '',
        coreApiKey: '',
        
        newsApiKey: '',
        guardianApiKey: '',
        nytApiKey: '',
        
        githubToken: '',
        
        // Research preferences
        cacheTimeout: 300000, // 5 minutes
        maxConcurrentSearches: 5,
        enableAISynthesis: true,
        enableCredibilityScoring: true
      },
      thresholds: {
        min_words_per_chunk: 25,
      },
      ui: {
        theme: 'dark',
        autoExportNotes: false,
        showDebugInfo: false
      },
      realtime: {
        enabled: true,
        insightTypes: ['contradiction', 'jargon', 'suggestion', 'strategic'],
        maxInsightsPerMinute: 8,
        executiveSummaryInterval: 30000, // 30 seconds
        slideGenerationInterval: 300000, // 5 minutes
        confidenceThreshold: 0.75,
        minWordsForAnalysis: 30,
        enableKnowledgeGraph: true,
        enableExecutiveSummary: true,
        enableSlideGeneration: true
      }
    };
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return JSON.parse(fs.readFileSync(configFile));
}

function saveConfig(config) {
  fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}

module.exports = { loadConfig, saveConfig }; 
```

# app/main.js

```js
const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require('electron');

// 🚨 EMERGENCY: Increase memory limit for stability but add monitoring
app.commandLine.appendSwitch('max-old-space-size', '2048'); // Increase to 2GB for stability
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=2048 --expose-gc --optimize-for-size');

// Import emergency debugging system
const EmergencyDebugger = require('../debug-emergency');
const path = require('path');
const fs = require('fs');
const os = require('os');
const stt = require('./services/stt');
const processor = require('./services/processor');
const { testConnection: testLLMConnection } = require('./services/llmProviders');
const { generateMeetingNotes, exportToMarkdown } = require('./services/meetingNotes');
const { getAvailableProviders, testConnection, updateSettings } = require('./services/llmProviders');
const { getDashboardSummary, getCurrentSessionMetrics, exportUsageData, startNewSession } = require('./services/usageTracker');
const { saveSession, loadRecentSessions } = require('./storage');
const { loadConfig, saveConfig } = require('./config');
const { connect: connectMongo, getTemplates, createTemplate, updateTemplate, deleteTemplate, getExportedReports, getExportedReportsByUser, getExportHistory, deleteExportedReport, searchReports, getReportsByDateRange, getFavoriteReports, getStorageStats, saveTemplateVersion, getTemplateHistory, getTemplateVersion, restoreTemplateVersion } = require('./services/mongoStorage');
const { startMemoryMonitoring, stopMemoryMonitoring, getMemoryStats, onMemoryEvent } = require('./services/memoryManager');
const { initializeDatabase, createCustomTemplate, updateCustomTemplate, deleteCustomTemplate, getTemplatesByCategory, searchTemplates, validateTemplateSchema, importTemplate, exportTemplate, exportAllTemplates, importTemplateCollection } = require('./services/templateManager');
const { generateReport, getReport, getSessionReports, getUserReports, updateReport, exportReport } = require('./services/reportGenerator');
const RAGDocumentManager = require('./services/ragDocumentManager');
const RAGEnhancedProcessor = require('./services/ragEnhancedProcessor');
const OllamaManager = require('./services/ollamaManager');

// Import emergency debugging toolkit
const BlankingDebugger = require('../debug-toolkit');

// Import menu builders
const AppMenuBuilder = require('./menu/appMenu');
const ContextMenuBuilder = require('./menu/contextMenu');

let mainWindow;
let splashWindow;
let whisperProc = null;
let currentSession = null;
let powerSaveBlockerId = null;
let emergencyDebugger = null;
let blankingDebugger = null;

// RAG services
let ragDocumentManager = null;
let ragEnhancedProcessor = null;

// Ollama service
let ollamaManager = null;

function createSplashWindow() {
  // Get icon path for splash window
  const baseIconPath = path.resolve(__dirname, '../build/icons');
  let iconPath;
  if (process.platform === 'darwin') {
    iconPath = path.join(baseIconPath, 'mac/icon.icns');
  } else if (process.platform === 'win32') {
    iconPath = path.join(baseIconPath, 'windows/icon.ico');
  } else {
    iconPath = path.join(baseIconPath, 'linux/512x512.png');
  }

  splashWindow = new BrowserWindow({
    width: 400,
    height: 500,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  
  splashWindow.loadFile(path.join(__dirname, 'splash/splash.html'));
  
  // Hide splash window after 5 seconds or when main window is ready
  setTimeout(() => {
    if (splashWindow) {
      closeSplashWindow();
    }
  }, 5000);
  
  return splashWindow;
}

function closeSplashWindow() {
  if (splashWindow) {
    splashWindow.close();
    splashWindow = null;
  }
}

function createWindow() {
  // Initialize emergency debugging toolkit
  blankingDebugger = new BlankingDebugger();
  
  // Determine icon path based on platform
  let iconPath;
  const baseIconPath = path.resolve(__dirname, '../build/icons');
  
  if (process.platform === 'darwin') {
    iconPath = path.join(baseIconPath, 'mac/icon.icns');
  } else if (process.platform === 'win32') {
    iconPath = path.join(baseIconPath, 'windows/icon.ico');
  } else {
    iconPath = path.join(baseIconPath, 'linux/512x512.png');
  }

  // Log icon status for development
  if (process.env.NODE_ENV !== 'production') {
    console.log('🖼️ Using app icon:', fs.existsSync(iconPath) ? iconPath : 'default');
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until splash is done
    icon: fs.existsSync(iconPath) ? iconPath : undefined, // Use icon if it exists
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js'), // Temporarily disable preload
      backgroundThrottling: false, // Prevent background throttling during long sessions
      // Enable additional debugging flags
      webSecurity: false, // Allow debugging tools
      allowRunningInsecureContent: true,
      experimentalFeatures: true,
    },
  });
  
  // Initialize custom app menu
  const menuBuilder = new AppMenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  
  // Initialize context menu
  new ContextMenuBuilder(mainWindow);
  
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  
  // Open DevTools in development
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }
  
  // 🚨 EMERGENCY DEBUGGING DISABLED FOR PERFORMANCE
  // emergencyDebugger = new EmergencyDebugger(mainWindow);
  
  // Set up processor event handlers
  setupProcessorHandlers();
  
  // Test LLM connection after page is ready
  mainWindow.webContents.once('did-finish-load', () => {
    testLLMConnection().then(connected => {
      console.log('Sending llm-status to renderer:', connected);
      mainWindow.webContents.send('ollama-status', connected);
    });
    
    // Start memory monitoring
    startMemoryMonitoring();
    console.log('🧠 Memory monitoring started');
    
    // Inject emergency diagnostic script (disabled in production)
    if (process.env.NODE_ENV === 'development') {
      try {
        const diagnosticScript = fs.readFileSync(path.join(__dirname, '../debug-renderer.js'), 'utf8');
        mainWindow.webContents.executeJavaScript(diagnosticScript);
        console.log('🔍 Emergency renderer debugging script injected');
      } catch (error) {
        console.error('Failed to inject debugging script:', error);
      }
    }
  });
  
  // Check LLM status periodically with recursive timeout to prevent accumulation
  let statusCheckTimeout;
  const checkLLMStatusPeriodically = async () => {
    try {
      const connected = await testLLMConnection();
      console.log('Periodic llm-status check:', connected);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ollama-status', connected);
      }
    } catch (error) {
      console.error('LLM status check error:', error);
    }
    
    // Schedule next check only after current one completes (reduced frequency)
    statusCheckTimeout = setTimeout(checkLLMStatusPeriodically, 30000);
  };
  
  // Start the periodic check
  checkLLMStatusPeriodically();
  
  // Set up memory event handling
  onMemoryEvent((type, data) => {
    if (type === 'critical' || type === 'warning') {
      console.warn('🚨 Memory event:', type, data);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('memory-warning', { type, data });
      }
    }
    if (type === 'cleanup') {
      console.log('🧹 Memory cleanup triggered:', data.type);
      // Trigger cleanup in services
      if (data.type === 'force') {
        // Force cleanup of all services
        processor.clearCache?.();
      }
    }
  });

  // Clean up everything when window is closed
  mainWindow.on('closed', () => {
    if (statusCheckTimeout) {
      clearTimeout(statusCheckTimeout);
      statusCheckTimeout = null;
    }
    
    // Stop memory monitoring
    stopMemoryMonitoring();
    console.log('🧠 Memory monitoring stopped');
    
    // Clean up processor
    if (processor.destroy) {
      processor.destroy();
    }
    
    // Clean up Ollama service
    if (ollamaManager) {
      ollamaManager.stop();
      console.log('🤖 Ollama service cleaned up');
    }
  });
}

function setupProcessorHandlers() {
  // Handle new conversation chunks
  processor.on('chunk', (data) => {
    mainWindow.webContents.send('chunk-processed', data);
  });
  
  // Handle extracted topics
  processor.on('topics', (data) => {
    mainWindow.webContents.send('topics-extracted', data);
    if (currentSession) {
      currentSession.topics.push(data);
    }
  });
  
  // Handle research summaries
  processor.on('research', (data) => {
    mainWindow.webContents.send('research-completed', data);
    if (currentSession) {
      currentSession.research.push(data);
    }
  });
  
  // Handle errors
  processor.on('error', (error) => {
    console.error('Processor error:', error);
    mainWindow.webContents.send('processor-error', error.message);
  });

  // NEW: Handle real-time insights
  processor.on('realtime-insight', (insight) => {
    console.log('🧠 Real-time insight generated:', insight.type);
    mainWindow.webContents.send('realtime-insight', insight);
    if (currentSession) {
      if (!currentSession.realtimeInsights) {
        currentSession.realtimeInsights = [];
      }
      currentSession.realtimeInsights.push(insight);
      // Keep only last 20 insights per session
      if (currentSession.realtimeInsights.length > 20) {
        currentSession.realtimeInsights = currentSession.realtimeInsights.slice(-20);
      }
    }
  });

  // NEW: Handle executive summary updates
  processor.on('executive-summary-updated', (summary) => {
    console.log('📄 Executive summary updated');
    mainWindow.webContents.send('executive-summary-updated', summary);
    if (currentSession) {
      currentSession.executiveSummary = summary;
      currentSession.summaryUpdatedAt = new Date().toISOString();
    }
  });

  // NEW: Handle slides generation
  processor.on('slides-generated', (slides) => {
    console.log('📊 Slides generated:', slides.length, 'slides');
    mainWindow.webContents.send('slides-generated', slides);
    if (currentSession) {
      currentSession.generatedSlides = slides;
      currentSession.slidesGeneratedAt = new Date().toISOString();
    }
  });

  // NEW: Handle knowledge graph updates
  processor.on('knowledge-graph-updated', (graphData) => {
    console.log('🕸️ Knowledge graph updated:', graphData.nodes.length, 'nodes');
    mainWindow.webContents.send('knowledge-graph-updated', graphData);
  });

  // NEW: Handle topic additions to knowledge graph
  processor.on('topic-added', (data) => {
    mainWindow.webContents.send('topic-added', data);
  });

  // NEW: Handle connection additions to knowledge graph
  processor.on('connection-added', (data) => {
    mainWindow.webContents.send('connection-added', data);
  });
}

// Initialize MongoDB connection and default templates
async function initializeServices() {
  try {
    await connectMongo();
    await initializeDatabase();
    
    // Initialize RAG services
    ragDocumentManager = new RAGDocumentManager();
    ragEnhancedProcessor = new RAGEnhancedProcessor();
    
    await ragDocumentManager.connect();
    await ragEnhancedProcessor.initialize();
    
    // Initialize Ollama service
    ollamaManager = new OllamaManager();
    
    // Set up Ollama event handlers
    ollamaManager.on('status', (data) => {
      console.log('🤖 Ollama status:', data.message);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ollama-status-update', data);
      }
    });
    
    ollamaManager.on('error', (data) => {
      console.error('🤖 Ollama error:', data.error);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ollama-error', data);
      }
    });
    
    ollamaManager.on('download-progress', (data) => {
      console.log(`🤖 Download progress: ${data.model} - ${data.percentage}%`);
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ollama-download-progress', data);
      }
    });
    
    // Initialize Ollama (this will check if it's running and ensure default model)
    console.log('🤖 Initializing Ollama service...');
    try {
      await ollamaManager.initialize();
      await ollamaManager.ensureModel(); // Ensures default model is available
      
      // Connect OllamaManager to the LLM provider system
      const { llmManager } = require('./services/llmProviders');
      if (llmManager && llmManager.providers.ollama) {
        llmManager.providers.ollama.setOllamaManager(ollamaManager);
        console.log('🔗 Connected OllamaManager to LLM provider system');
      }
      
      console.log('🤖 Ollama service initialized successfully');
    } catch (error) {
      console.warn('🤖 Ollama service not available, will fallback to other LLM providers:', error.message);
    }
    
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
    // Continue without MongoDB if connection fails
  }
}

app.whenReady().then(() => {
  // Show splash screen first
  createSplashWindow();
  
  // Create main window but don't show it yet
  createWindow();
  
  // Initialize services and show main window when ready
  initializeServices().then(() => {
    // Services loaded, show main window and close splash
    mainWindow.show();
    closeSplashWindow();
  }).catch((error) => {
    console.error('Failed to initialize services:', error);
    // Still show main window even if some services fail
    mainWindow.show();
    closeSplashWindow();
  });
});

app.on('window-all-closed', () => {
  // Clean up power save blocker
  if (powerSaveBlockerId !== null) {
    try {
      powerSaveBlocker.stop(powerSaveBlockerId);
      powerSaveBlockerId = null;
    } catch (error) {
      console.error('Failed to stop power save blocker on exit:', error);
    }
  }
  
  // Clean up Ollama service
  if (ollamaManager) {
    ollamaManager.stop();
    console.log('🤖 Ollama service cleaned up on app exit');
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC: Splash screen handlers
ipcMain.on('splash-loading-complete', () => {
  if (mainWindow) {
    mainWindow.show();
  }
  closeSplashWindow();
});

ipcMain.handle('splash-update-progress', (event, progress) => {
  if (splashWindow) {
    splashWindow.webContents.send('loading-progress', progress);
  }
});

ipcMain.handle('splash-update-status', (event, status) => {
  if (splashWindow) {
    splashWindow.webContents.send('loading-status', status);
  }
});

// IPC: Start transcription
ipcMain.on('start-transcription', (event) => {
  if (whisperProc) return; // Already running
  
  // Prevent system sleep during recording
  try {
    powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
    console.log('Display sleep prevention started');
  } catch (error) {
    console.error('Failed to start power save blocker:', error);
  }
  
  // Create new session
  currentSession = {
    id: Date.now().toString(),
    startTime: new Date().toISOString(),
    transcript: [],
    topics: [],
    research: []
  };
  
  // Clear processor
  processor.clear();
  
  whisperProc = stt.startTranscription((data) => {
    console.log('🎤 Main: Received transcript data:', data);
    
    // Handle new structured transcript data
    if (typeof data === 'string') {
      // Legacy format for backward compatibility
      console.log('🎤 Main: Sending legacy format transcript-update to renderer:', data);
      mainWindow.webContents.send('transcript-update', data);
      if (currentSession) {
        currentSession.transcript.push({
          text: data,
          timestamp: new Date().toISOString()
        });
      }
      processor.addTranscript(data);
    } else if (data.type === 'final') {
      // Final committed text
      console.log('🎤 Main: Sending final transcript-update to renderer:', data.text);
      mainWindow.webContents.send('transcript-update', { type: 'final', text: data.text });
      if (currentSession) {
        currentSession.transcript.push({
          text: data.text,
          timestamp: new Date().toISOString(),
          type: 'final'
        });
      }
      processor.addTranscript(data.text);
    } else if (data.type === 'interim') {
      // Interim text (don't save to session, just display)
      console.log('🎤 Main: Sending interim transcript-update to renderer:', data.text);
      mainWindow.webContents.send('transcript-update', { type: 'interim', text: data.text });
    } else if (data.type === 'error' || data.type === 'system') {
      // System messages
      console.log('🎤 Main: Sending system/error transcript-update to renderer:', data.text);
      mainWindow.webContents.send('transcript-update', { type: data.type, text: data.text });
    }
  });
  
});

// IPC: Handle renderer errors
ipcMain.on('renderer-error', (event, errorData) => {
  console.error('🚨 Renderer error received:', errorData);
  
  // Log the error for debugging
  console.error('Renderer crash details:', {
    message: errorData.message,
    timestamp: errorData.timestamp,
    stack: errorData.stack
  });
  
  // Could implement crash recovery here
  // For now, just log it
});

// IPC: Emergency debugging handlers
ipcMain.on('debug-log', (event, logData) => {
  console.log(`🔍 RENDERER: [${logData.timestamp}] ${logData.level}: ${logData.message}`, logData.data);
});

ipcMain.on('debug-pong', (event, data) => {
  if (emergencyDebugger) {
    emergencyDebugger.receivePong();
  }
  console.log('🔍 Renderer pong received:', data);
});

// Manual debugging commands
ipcMain.handle('debug-force-analysis', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('debug-force-analysis');
  }
  return { success: true };
});

ipcMain.handle('debug-force-recovery', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('debug-force-recovery');
  }
  return { success: true };
});

ipcMain.handle('debug-get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    nodeVersion: process.version
  };
});

// IPC: Stop transcription
ipcMain.on('stop-transcription', async () => {
  if (whisperProc) {
    whisperProc.kill();
    whisperProc = null;
    
    // Allow system sleep again
    if (powerSaveBlockerId !== null) {
      try {
        powerSaveBlocker.stop(powerSaveBlockerId);
        powerSaveBlockerId = null;
        console.log('Display sleep prevention stopped');
      } catch (error) {
        console.error('Failed to stop power save blocker:', error);
      }
    }
    
    // Flush any remaining buffer
    processor.flush();
    
    // Save session
    if (currentSession) {
      currentSession.endTime = new Date().toISOString();
      await saveSession(currentSession);
      currentSession = null;
    }
  }
});

// IPC: Get processor status
ipcMain.handle('get-processor-status', () => {
  return processor.getStatus();
});

// IPC: Get recent sessions
ipcMain.handle('get-recent-sessions', async () => {
  return await loadRecentSessions(5);
});

// IPC: Test LLM connection
ipcMain.handle('test-ollama', async () => {
  return await testLLMConnection();
});

// IPC: Get current configuration
ipcMain.handle('get-config', () => {
  return loadConfig();
});

// IPC: Force process current buffer
ipcMain.on('force-process', () => {
  console.log('🔧 Main: Force processing requested');
  processor.flush();
});

// IPC: Test topic extraction directly
ipcMain.handle('test-topic-extraction', async (_, text) => {
  try {
    console.log('🧪 Main: Testing topic extraction with text:', text?.substring(0, 50));
    const { extractTopics } = require('./services/llmProviders');
    const result = await extractTopics(text || 'This is a test about machine learning and artificial intelligence.');
    console.log('✅ Main: Topic extraction test result:', result);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Main: Topic extraction test failed:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Check LLM status immediately
ipcMain.on('check-ollama-status', async () => {
  const connected = await testLLMConnection();
  console.log('Manual llm-status check:', connected);
  mainWindow.webContents.send('ollama-status', connected);
});

// IPC: Trigger immediate research for current transcript
ipcMain.handle('trigger-immediate-research', async (_, transcript) => {
  console.log('Immediate research triggered for transcript:', transcript?.substring(0, 100));
  
  try {
    const { extractTopics } = require('./services/llmProviders');
    const { fetchResearchSummaries } = require('./services/research/index');
    
    // Extract topics from transcript
    const topicData = await extractTopics(transcript);
    const allTopics = [...topicData.topics, ...topicData.terms.slice(0, 1)];
    
    // Filter out invalid topics
    const validTopics = allTopics.filter(topic => 
      topic && 
      typeof topic === 'string' && 
      topic.length > 2 && 
      !topic.includes('BLANK_AUDIO') && 
      !topic.includes('NULL') && 
      !topic.includes('UNDEFINED')
    );
    
    if (validTopics.length === 0) {
      console.log('No valid topics to research');
      return { success: false, error: 'No valid topics provided' };
    }
    
    // Fetch research summaries
    const summaries = await fetchResearchSummaries(
      validTopics,
      transcript || '',
      [] // No previous research context for manual triggers
    );
    
    console.log(`Research completed for ${validTopics.length} topics, found ${summaries.length} summaries`);
    
    // Emit research-completed event to renderer
    if (summaries.length > 0) {
      mainWindow.webContents.send('research-completed', {
        summaries: summaries,
        timestamp: new Date().toISOString()
      });
      
      // Add to session if available
      if (currentSession) {
        currentSession.research.push({
          summaries: summaries,
          timestamp: new Date().toISOString(),
          triggeredManually: true
        });
      }
    }
    
    return { success: true, summariesCount: summaries.length };
  } catch (error) {
    console.error('Error triggering research:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Trigger research for specific topics (legacy handler)
ipcMain.handle('trigger-research', async (_, data) => {
  console.log('Manual research triggered for topics:', data.topics);
  
  try {
    const { fetchResearchSummaries } = require('./services/research/index');
    
    // Filter out invalid topics
    const validTopics = data.topics.filter(topic => 
      topic && 
      typeof topic === 'string' && 
      topic.length > 2 && 
      !topic.includes('BLANK_AUDIO') && 
      !topic.includes('NULL') && 
      !topic.includes('UNDEFINED')
    );
    
    if (validTopics.length === 0) {
      console.log('No valid topics to research');
      return { success: false, error: 'No valid topics provided' };
    }
    
    // Fetch research summaries
    const summaries = await fetchResearchSummaries(
      validTopics,
      data.transcript || '',
      [] // No previous research context for manual triggers
    );
    
    console.log(`Research completed for ${validTopics.length} topics, found ${summaries.length} summaries`);
    
    // Emit research-completed event to renderer
    if (summaries.length > 0) {
      mainWindow.webContents.send('research-completed', {
        summaries: summaries,
        timestamp: new Date().toISOString()
      });
      
      // Add to session if available
      if (currentSession) {
        currentSession.research.push({
          summaries: summaries,
          timestamp: new Date().toISOString(),
          triggeredManually: true
        });
      }
    }
    
    return { success: true, summariesCount: summaries.length };
  } catch (error) {
    console.error('Error triggering research:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Generate meeting notes
ipcMain.handle('generate-meeting-notes', async (_, uiState) => {
  console.log('Meeting notes generation requested');
  console.log('UI state provided:', !!uiState);
  
  let transcriptText, topicsData, researchData;
  
  if (uiState) {
    // Use UI state directly
    transcriptText = uiState.transcript || '';
    topicsData = uiState.topics || [];
    researchData = uiState.research || [];
    console.log('Using UI state - transcript length:', transcriptText.length);
  } else if (currentSession) {
    // Fallback to session data
    transcriptText = currentSession.transcript
      .map(entry => entry.text)
      .join('\n');
    topicsData = currentSession.topics || [];
    researchData = currentSession.research || [];
    console.log('Using session data - transcript length:', transcriptText.length);
  } else {
    console.log('No data source available');
    return { error: 'No transcript data available to generate notes from' };
  }
  
  try {
    console.log('Full transcript length:', transcriptText.length);
    console.log('First 100 chars of transcript:', transcriptText.substring(0, 100));
    console.log('Topics count:', topicsData.length);
    
    const meetingNotes = await generateMeetingNotes(
      transcriptText, 
      topicsData, 
      researchData
    );
    
    console.log('Generated meeting notes:', JSON.stringify(meetingNotes, null, 2));
    
    // Add meeting notes to session if available
    if (currentSession) {
      currentSession.meetingNotes = meetingNotes;
      currentSession.notesGeneratedAt = new Date().toISOString();
    }
    
    console.log('Meeting notes generated successfully');
    return meetingNotes;
    
  } catch (error) {
    console.error('Error generating meeting notes:', error);
    return { error: error.message };
  }
});

// IPC: Export meeting notes
ipcMain.handle('export-meeting-notes', async (_, meetingNotes) => {
  try {
    const markdown = exportToMarkdown(meetingNotes, currentSession);
    
    // Save to Downloads folder
    const downloadsPath = path.join(os.homedir(), 'Downloads');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `meeting-notes-${timestamp}.md`;
    const filepath = path.join(downloadsPath, filename);
    
    fs.writeFileSync(filepath, markdown);
    
    console.log(`Meeting notes exported to: ${filepath}`);
    return { success: true, filepath };
    
  } catch (error) {
    console.error('Error exporting meeting notes:', error);
    return { error: error.message };
  }
});

// IPC: Get settings
ipcMain.handle('get-settings', async () => {
  try {
    const config = loadConfig();
    return config;
  } catch (error) {
    console.error('Error loading settings:', error);
    return { error: error.message };
  }
});

// IPC: Update settings
ipcMain.handle('update-settings', async (_, newSettings) => {
  try {
    console.log('Updating settings:', newSettings);
    
    // Get current config to check if provider changed
    const currentConfig = loadConfig();
    const oldProvider = currentConfig.llm?.provider;
    const oldModel = currentConfig.llm?.model;
    
    // Merge with existing config
    const updatedConfig = { ...currentConfig, ...newSettings };
    
    // Save to file
    saveConfig(updatedConfig);
    
    // Update LLM provider manager
    updateSettings(updatedConfig);
    
    // Check if provider or model changed - start new usage session if so
    const newProvider = updatedConfig.llm?.provider;
    const newModel = updatedConfig.llm?.model;
    
    if (oldProvider !== newProvider || oldModel !== newModel) {
      console.log(`Provider/model changed from ${oldProvider}/${oldModel} to ${newProvider}/${newModel} - starting new usage session`);
      startNewSession(newProvider, newModel);
    }
    
    console.log('Settings updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { error: error.message };
  }
});

// IPC: Get available LLM providers
ipcMain.handle('get-llm-providers', async () => {
  try {
    const providers = getAvailableProviders();
    return providers;
  } catch (error) {
    console.error('Error getting LLM providers:', error);
    return { error: error.message };
  }
});

// IPC: Test LLM provider connection
ipcMain.handle('test-llm-provider', async (_, providerName) => {
  try {
    console.log('Testing connection for provider:', providerName);
    const connected = await testConnection(providerName);
    console.log('Connection test result:', connected);
    return { connected };
  } catch (error) {
    console.error('Error testing LLM provider:', error);
    return { error: error.message, connected: false };
  }
});

// IPC: Get Ollama status
ipcMain.handle('get-ollama-status', async () => {
  try {
    if (ollamaManager) {
      return { success: true, status: ollamaManager.getStatus() };
    }
    return { success: false, error: 'Ollama not initialized' };
  } catch (error) {
    console.error('Error getting Ollama status:', error);
    return { success: false, error: error.message };
  }
});

// IPC: List available Ollama models
ipcMain.handle('list-ollama-models', async () => {
  try {
    if (ollamaManager) {
      const models = await ollamaManager.listModels();
      return { success: true, models };
    }
    return { success: false, error: 'Ollama not initialized' };
  } catch (error) {
    console.error('Error listing Ollama models:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Download Ollama model
ipcMain.handle('download-ollama-model', async (_, modelName) => {
  try {
    if (ollamaManager) {
      await ollamaManager.downloadModel(modelName);
      return { success: true, message: `Model ${modelName} downloaded successfully` };
    }
    return { success: false, error: 'Ollama not initialized' };
  } catch (error) {
    console.error('Error downloading Ollama model:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Ensure Ollama model
ipcMain.handle('ensure-ollama-model', async (_, modelName) => {
  try {
    if (ollamaManager) {
      await ollamaManager.ensureModel(modelName);
      return { success: true, message: `Model ${modelName} is ready` };
    }
    return { success: false, error: 'Ollama not initialized' };
  } catch (error) {
    console.error('Error ensuring Ollama model:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Delete Ollama model
ipcMain.handle('delete-ollama-model', async (_, modelName) => {
  try {
    if (ollamaManager) {
      await ollamaManager.deleteModel(modelName);
      return { success: true, message: `Model ${modelName} deleted successfully` };
    }
    return { success: false, error: 'Ollama not initialized' };
  } catch (error) {
    console.error('Error deleting Ollama model:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Get recommended Ollama models based on system resources
ipcMain.handle('get-recommended-ollama-models', async () => {
  try {
    const os = require('os');
    const totalMem = Math.round(os.totalmem() / (1024 * 1024 * 1024)); // Convert to GB
    const recommended = OllamaManager.getRecommendedModels(totalMem);
    
    return { 
      success: true, 
      models: recommended,
      systemRamGB: totalMem 
    };
  } catch (error) {
    console.error('Error getting recommended Ollama models:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Generate response with Ollama
ipcMain.handle('ollama-generate', async (_, messages, options = {}) => {
  try {
    if (ollamaManager && ollamaManager.getStatus().isRunning) {
      const response = await ollamaManager.generateResponse(messages, options);
      return { success: true, response };
    }
    return { success: false, error: 'Ollama not running or initialized' };
  } catch (error) {
    console.error('Error generating Ollama response:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Open settings window
ipcMain.on('open-settings', () => {
  mainWindow.webContents.send('show-settings', true);
});

// IPC: Get usage metrics dashboard
ipcMain.handle('get-usage-metrics', async () => {
  try {
    const dashboard = getDashboardSummary();
    return dashboard;
  } catch (error) {
    console.error('Error getting usage metrics:', error);
    return { error: error.message };
  }
});

// IPC: Get current session metrics
ipcMain.handle('get-current-session-metrics', async () => {
  try {
    const metrics = getCurrentSessionMetrics();
    return metrics;
  } catch (error) {
    console.error('Error getting current session metrics:', error);
    return { error: error.message };
  }
});

// IPC: Export usage data
ipcMain.handle('export-usage-data', async () => {
  try {
    const data = exportUsageData();
    
    // Save to Downloads folder
    const downloadsPath = path.join(os.homedir(), 'Downloads');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `auracle-usage-data-${timestamp}.json`;
    const filepath = path.join(downloadsPath, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    
    console.log(`Usage data exported to: ${filepath}`);
    return { success: true, filepath };
    
  } catch (error) {
    console.error('Error exporting usage data:', error);
    return { error: error.message };
  }
});

// IPC: Get all templates
ipcMain.handle('get-templates', async (_, filter = {}) => {
  try {
    const templates = await getTemplates(filter);
    console.log('Retrieved templates from storage:', templates.length);
    // Debug template IDs
    templates.forEach((template, index) => {
      console.log(`Template ${index} ID:`, template._id, 'Type:', typeof template._id, 'Name:', template.name);
    });
    return { success: true, templates };
  } catch (error) {
    console.error('Error getting templates:', error);
    return { error: error.message };
  }
});

// IPC: Get templates by category
ipcMain.handle('get-templates-by-category', async (_, category) => {
  try {
    const templates = await getTemplatesByCategory(category);
    return { success: true, templates };
  } catch (error) {
    console.error('Error getting templates by category:', error);
    return { error: error.message };
  }
});

// IPC: Search templates
ipcMain.handle('search-templates', async (_, searchTerm) => {
  try {
    const templates = await searchTemplates(searchTerm);
    return { success: true, templates };
  } catch (error) {
    console.error('Error searching templates:', error);
    return { error: error.message };
  }
});

// IPC: Create custom template
ipcMain.handle('create-template', async (_, templateData) => {
  try {
    const template = await createCustomTemplate(templateData);
    return { success: true, template };
  } catch (error) {
    console.error('Error creating template:', error);
    return { error: error.message };
  }
});

// IPC: Update template
ipcMain.handle('update-template', async (_, templateId, updates) => {
  try {
    const result = await updateCustomTemplate(templateId, updates);
    return { success: result };
  } catch (error) {
    console.error('Error updating template:', error);
    return { error: error.message };
  }
});

// IPC: Delete template
ipcMain.handle('delete-template', async (_, templateId) => {
  try {
    const result = await deleteCustomTemplate(templateId);
    return { success: result };
  } catch (error) {
    console.error('Error deleting template:', error);
    return { error: error.message };
  }
});

// IPC: Generate report from template
ipcMain.handle('generate-report', async (_, templateId, transcript, variables, sessionId) => {
  try {
    console.log('Generating report with template ID:', templateId);
    console.log('Template ID type:', typeof templateId);
    console.log('Template ID value:', templateId);
    const result = await generateReport(templateId, transcript, variables, sessionId);
    return result;
  } catch (error) {
    console.error('Error generating report:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Get report by ID
ipcMain.handle('get-report', async (_, reportId) => {
  try {
    const result = await getReport(reportId);
    return result;
  } catch (error) {
    console.error('Error getting report:', error);
    return { error: error.message };
  }
});

// IPC: Get reports for session
ipcMain.handle('get-session-reports', async (_, sessionId) => {
  try {
    const result = await getSessionReports(sessionId);
    return result;
  } catch (error) {
    console.error('Error getting session reports:', error);
    return { error: error.message };
  }
});

// IPC: Get user reports
ipcMain.handle('get-user-reports', async (_, filter = {}, options = {}) => {
  try {
    const result = await getUserReports(filter, options);
    return result;
  } catch (error) {
    console.error('Error getting user reports:', error);
    return { error: error.message };
  }
});

// IPC: Update report
ipcMain.handle('update-report', async (_, reportId, updates) => {
  try {
    const result = await updateReport(reportId, updates);
    return result;
  } catch (error) {
    console.error('Error updating report:', error);
    return { error: error.message };
  }
});

// IPC: Export report
ipcMain.handle('export-report', async (_, reportId, format = 'markdown') => {
  try {
    const result = await exportReport(reportId, format);
    
    if (result.success) {
      // Save to Downloads folder
      const downloadsPath = path.join(os.homedir(), 'Downloads');
      const filepath = path.join(downloadsPath, result.filename);
      
      fs.writeFileSync(filepath, result.content);
      
      console.log(`Report exported to: ${filepath}`);
      return { success: true, filepath, filename: result.filename };
    }
    
    return result;
  } catch (error) {
    console.error('Error exporting report:', error);
    return { error: error.message };
  }
});

// IPC: Validate template schema
ipcMain.handle('validate-template-schema', async (_, templateData) => {
  try {
    const errors = validateTemplateSchema(templateData);
    return { success: true, errors };
  } catch (error) {
    console.error('Error validating template schema:', error);
    return { error: error.message };
  }
});

// IPC: Import template from JSON
ipcMain.handle('import-template', async (_, templateJson) => {
  try {
    const result = await importTemplate(templateJson);
    return { success: true, template: result };
  } catch (error) {
    console.error('Error importing template:', error);
    return { error: error.message };
  }
});

// IPC: Export template to JSON
ipcMain.handle('export-template-json', async (_, templateId) => {
  try {
    console.log('Export template IPC called with ID:', templateId, typeof templateId);
    const result = await exportTemplate(templateId);
    console.log('Export template result:', result);
    
    if (result.success) {
      // Save to Downloads folder
      const downloadsPath = path.join(os.homedir(), 'Downloads');
      const filepath = path.join(downloadsPath, result.filename);
      
      fs.writeFileSync(filepath, JSON.stringify(result.template, null, 2));
      
      console.log(`Template exported to: ${filepath}`);
      return { success: true, filepath, filename: result.filename };
    }
    
    return result;
  } catch (error) {
    console.error('Error exporting template:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Export all templates
ipcMain.handle('export-all-templates', async () => {
  try {
    console.log('Export all templates IPC called');
    const result = await exportAllTemplates();
    console.log('Export all templates result:', result);
    
    if (result.success) {
      // Save to Downloads folder
      const downloadsPath = path.join(os.homedir(), 'Downloads');
      const filepath = path.join(downloadsPath, result.filename);
      
      fs.writeFileSync(filepath, JSON.stringify(result.data, null, 2));
      
      console.log(`All templates exported to: ${filepath}`);
      return { success: true, filepath, filename: result.filename };
    }
    
    return result;
  } catch (error) {
    console.error('Error exporting all templates:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Import template collection
ipcMain.handle('import-template-collection', async (_, collectionJson) => {
  try {
    const result = await importTemplateCollection(collectionJson);
    return result;
  } catch (error) {
    console.error('Error importing template collection:', error);
    return { error: error.message };
  }
});

// IPC: Force add MongoDB Design Review template
ipcMain.handle('force-add-mongodb-template', async () => {
  try {
    // Re-initialize database to add MongoDB template
    await initializeDatabase();
    return { success: true };
  } catch (error) {
    console.error('Error adding MongoDB template:', error);
    return { success: false, error: error.message };
  }
});

// IPC: Get exported reports
ipcMain.handle('get-exported-reports', async (_, filter = {}, options = {}) => {
  try {
    const reports = await getExportedReports(filter, options);
    return { success: true, reports };
  } catch (error) {
    console.error('Error getting exported reports:', error);
    return { error: error.message };
  }
});

// IPC: Get exported reports by user
ipcMain.handle('get-exported-reports-by-user', async (_, userId = 'default-user', options = {}) => {
  try {
    const reports = await getExportedReportsByUser(userId, options);
    return { success: true, reports };
  } catch (error) {
    console.error('Error getting exported reports by user:', error);
    return { error: error.message };
  }
});

// IPC: Get export history for a report
ipcMain.handle('get-export-history', async (_, reportId) => {
  try {
    const history = await getExportHistory(reportId);
    return { success: true, history };
  } catch (error) {
    console.error('Error getting export history:', error);
    return { error: error.message };
  }
});

// IPC: Delete exported report
ipcMain.handle('delete-exported-report', async (_, exportId) => {
  try {
    const result = await deleteExportedReport(exportId);
    return { success: true, deleted: result.deletedCount > 0 };
  } catch (error) {
    console.error('Error deleting exported report:', error);
    return { error: error.message };
  }
});

// IPC: Search reports
ipcMain.handle('search-reports', async (_, query, options = {}) => {
  try {
    const reports = await searchReports(query, options);
    return { success: true, reports };
  } catch (error) {
    console.error('Error searching reports:', error);
    return { error: error.message };
  }
});

// IPC: Get reports by date range
ipcMain.handle('get-reports-by-date-range', async (_, startDate, endDate, options = {}) => {
  try {
    const reports = await getReportsByDateRange(startDate, endDate, options);
    return { success: true, reports };
  } catch (error) {
    console.error('Error getting reports by date range:', error);
    return { error: error.message };
  }
});

// IPC: Get favorite reports
ipcMain.handle('get-favorite-reports', async (_, userId = 'default-user', options = {}) => {
  try {
    const reports = await getFavoriteReports(userId, options);
    return { success: true, reports };
  } catch (error) {
    console.error('Error getting favorite reports:', error);
    return { error: error.message };
  }
});

// IPC: Get storage statistics
ipcMain.handle('get-storage-stats', async () => {
  try {
    const stats = await getStorageStats();
    return { success: true, stats };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return { error: error.message };
  }
});

// IPC: Save template version
ipcMain.handle('save-template-version', async (_, templateId, templateData, action = 'updated') => {
  try {
    const result = await saveTemplateVersion(templateId, templateData, action);
    return { success: true, versionId: result.insertedId };
  } catch (error) {
    console.error('Error saving template version:', error);
    return { error: error.message };
  }
});

// IPC: Get template history
ipcMain.handle('get-template-history', async (_, templateId, options = {}) => {
  try {
    const history = await getTemplateHistory(templateId, options);
    return { success: true, history };
  } catch (error) {
    console.error('Error getting template history:', error);
    return { error: error.message };
  }
});

// IPC: Get specific template version
ipcMain.handle('get-template-version', async (_, templateId, version) => {
  try {
    const versionData = await getTemplateVersion(templateId, version);
    return { success: true, versionData };
  } catch (error) {
    console.error('Error getting template version:', error);
    return { error: error.message };
  }
});

// IPC: Restore template version
ipcMain.handle('restore-template-version', async (_, templateId, version) => {
  try {
    const result = await restoreTemplateVersion(templateId, version);
    return { success: true, restoredData: result };
  } catch (error) {
    console.error('Error restoring template version:', error);
    return { error: error.message };
  }
});

// Real-time Analysis IPC Handlers
ipcMain.handle('get-realtime-data', async () => {
  try {
    const data = processor.getRealtimeData();
    return { success: true, data };
  } catch (error) {
    console.error('Error getting real-time data:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-executive-summary', async () => {
  try {
    const summary = processor.getExecutiveSummary();
    return { success: true, summary };
  } catch (error) {
    console.error('Error getting executive summary:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-current-slides', async () => {
  try {
    const slides = processor.getCurrentSlides();
    return { success: true, slides };
  } catch (error) {
    console.error('Error getting current slides:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-knowledge-graph', async (_, options = {}) => {
  try {
    const graphData = processor.getKnowledgeGraph(options);
    return { success: true, graphData };
  } catch (error) {
    console.error('Error getting knowledge graph:', error);
    return { error: error.message };
  }
});

ipcMain.handle('get-recent-insights', async (_, limit = 10) => {
  try {
    const insights = processor.realtimeAnalyzer.getRecentInsights(limit);
    return { success: true, insights };
  } catch (error) {
    console.error('Error getting recent insights:', error);
    return { error: error.message };
  }
});

// Emergency Debug IPC Handlers
ipcMain.handle('debug-generate-report', async () => {
  if (blankingDebugger) {
    const reportPath = blankingDebugger.generateDebugReport();
    console.log('🔧 Debug report generated:', reportPath);
    return { success: true, reportPath };
  }
  return { error: 'Debugger not initialized' };
});

ipcMain.handle('debug-capture-snapshot', async (_, trigger) => {
  if (blankingDebugger) {
    blankingDebugger.captureDebugSnapshot(trigger || 'manual');
    return { success: true };
  }
  return { error: 'Debugger not initialized' };
});

ipcMain.on('debug-emergency-recovery', () => {
  console.log('🚨 Emergency recovery initiated from renderer');
  
  if (mainWindow && !mainWindow.isDestroyed()) {
    // Try to restore window
    mainWindow.show();
    mainWindow.focus();
    
    // Reload the page
    mainWindow.webContents.reload();
    
    // Re-inject diagnostic script after reload
    mainWindow.webContents.once('did-finish-load', () => {
      const diagnosticScript = fs.readFileSync(path.join(__dirname, '../emergency-diagnostic.js'), 'utf8');
      mainWindow.webContents.executeJavaScript(diagnosticScript);
    });
  }
});

// RAG Document Management IPC Handlers
ipcMain.handle('upload-rag-document', async (event, fileData) => {
  try {
    if (!ragDocumentManager) {
      return { success: false, error: 'RAG service not initialized' };
    }
    
    // Handle file upload from renderer
    const { fileName, fileData: bufferData, metadata } = fileData;
    
    // Create a temporary file path
    const tempDir = app.getPath('temp');
    const tempFilePath = path.join(tempDir, `rag_upload_${Date.now()}_${fileName}`);
    
    // Write the buffer to temporary file
    const buffer = Buffer.from(bufferData);
    await fs.promises.writeFile(tempFilePath, buffer);
    
    try {
      // Upload the document using the temp file path
      const result = await ragDocumentManager.uploadDocument(tempFilePath, metadata);
      
      // Clean up temp file
      await fs.promises.unlink(tempFilePath).catch(() => {});
      
      return result;
    } catch (uploadError) {
      // Clean up temp file on error
      await fs.promises.unlink(tempFilePath).catch(() => {});
      throw uploadError;
    }
  } catch (error) {
    console.error('RAG document upload failed:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-rag-documents', async () => {
  try {
    if (!ragDocumentManager) {
      return { success: false, error: 'RAG service not initialized' };
    }
    return await ragDocumentManager.getDocuments();
  } catch (error) {
    console.error('Failed to get RAG documents:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-rag-document', async (event, documentId) => {
  try {
    if (!ragDocumentManager) {
      return { success: false, error: 'RAG service not initialized' };
    }
    return await ragDocumentManager.deleteDocument(documentId);
  } catch (error) {
    console.error('RAG document deletion failed:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-rag-stats', async () => {
  try {
    if (!ragDocumentManager) {
      return { success: false, error: 'RAG service not initialized' };
    }
    return await ragDocumentManager.getDocumentStats();
  } catch (error) {
    console.error('Failed to get RAG stats:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('search-rag-documents', async (event, query, options) => {
  try {
    if (!ragDocumentManager) {
      return { success: false, error: 'RAG service not initialized' };
    }
    return await ragDocumentManager.searchDocuments(query, options);
  } catch (error) {
    console.error('RAG document search failed:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('rag-enhance-analysis', async (event, transcript, analysisType, options) => {
  try {
    if (!ragEnhancedProcessor) {
      return { success: false, error: 'RAG enhancement service not initialized' };
    }
    
    let result = null;
    switch (analysisType) {
      case 'topics':
        result = await ragEnhancedProcessor.enhanceTopicExtraction(transcript);
        break;
      case 'insights':
        result = await ragEnhancedProcessor.enhanceInsightGeneration(transcript, options.currentInsights);
        break;
      case 'notes':
        result = await ragEnhancedProcessor.enhanceMeetingNotes(transcript, options.topics, options.research);
        break;
      default:
        return { success: false, error: 'Invalid analysis type' };
    }
    
    return { success: true, result };
  } catch (error) {
    console.error('RAG-enhanced analysis failed:', error);
    return { success: false, error: error.message };
  }
});
```

# app/menu/appMenu.js

```js
const { Menu, app, shell, dialog, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

class AppMenuBuilder {
  constructor(mainWindow, options = {}) {
    this.mainWindow = mainWindow;
    this.platform = process.platform;
    this.isDev = process.env.NODE_ENV !== 'production';
    this.handlers = options.handlers || {};
  }

  buildMenu() {
    const template = this.platform === 'darwin' 
      ? this.buildDarwinTemplate()
      : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'bitscribe',
      submenu: [
        {
          label: 'About bitscribe',
          selector: 'orderFrontStandardAboutPanel:',
          click: () => this.showAbout()
        },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'Command+,',
          click: () => this.showSettings()
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide bitscribe',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => app.quit()
        }
      ]
    };

    const subMenuFile = this.buildFileMenu();
    const subMenuEdit = this.buildEditMenu();
    const subMenuView = this.buildViewMenu();
    const subMenuTools = this.buildToolsMenu();
    const subMenuWindow = this.buildWindowMenu();
    const subMenuHelp = this.buildHelpMenu();

    return [
      subMenuAbout,
      subMenuFile,
      subMenuEdit,
      subMenuView,
      subMenuTools,
      subMenuWindow,
      subMenuHelp
    ];
  }

  buildDefaultTemplate() {
    return [
      this.buildFileMenu(),
      this.buildEditMenu(),
      this.buildViewMenu(),
      this.buildToolsMenu(),
      this.buildWindowMenu(),
      this.buildHelpMenu()
    ];
  }

  buildFileMenu() {
    return {
      label: '&File',
      submenu: [
        {
          label: 'New Session',
          accelerator: 'CmdOrCtrl+N',
          click: () => this.newSession()
        },
        {
          label: 'Open Session...',
          accelerator: 'CmdOrCtrl+O',
          click: () => this.openSession()
        },
        { type: 'separator' },
        {
          label: 'Save Session',
          accelerator: 'CmdOrCtrl+S',
          click: () => this.saveSession()
        },
        {
          label: 'Save Session As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => this.saveSessionAs()
        },
        { type: 'separator' },
        {
          label: 'Recent Sessions',
          submenu: [
            { label: 'Clear Recent', click: () => this.clearRecent() }
          ]
        },
        { type: 'separator' },
        {
          label: 'Import',
          submenu: [
            {
              label: 'Import Audio File...',
              click: () => this.importAudio()
            },
            {
              label: 'Import Transcript...',
              click: () => this.importTranscript()
            },
            {
              label: 'Import RAG Documents...',
              click: () => this.importRAGDocs()
            }
          ]
        },
        {
          label: 'Export',
          submenu: [
            {
              label: 'Export as Markdown...',
              accelerator: 'CmdOrCtrl+Shift+E',
              click: () => this.exportMarkdown()
            },
            {
              label: 'Export as PDF...',
              click: () => this.exportPDF()
            },
            {
              label: 'Export as DOCX...',
              click: () => this.exportDOCX()
            },
            { type: 'separator' },
            {
              label: 'Export Audio...',
              click: () => this.exportAudio()
            },
            {
              label: 'Export Transcript...',
              click: () => this.exportTranscript()
            }
          ]
        },
        { type: 'separator' },
        ...(this.platform === 'darwin' ? [] : [
          {
            label: 'Preferences...',
            accelerator: 'CmdOrCtrl+,',
            click: () => this.showSettings()
          },
          { type: 'separator' },
          {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: () => app.quit()
          }
        ])
      ]
    };
  }

  buildEditMenu() {
    return {
      label: '&Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:'
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        },
        { type: 'separator' },
        {
          label: 'Find...',
          accelerator: 'CmdOrCtrl+F',
          click: () => this.showFind()
        },
        {
          label: 'Find and Replace...',
          accelerator: 'CmdOrCtrl+Shift+F',
          click: () => this.showFindReplace()
        },
        { type: 'separator' },
        {
          label: 'Edit Transcript',
          accelerator: 'CmdOrCtrl+E',
          click: () => this.editTranscript()
        },
        {
          label: 'Add Note',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => this.addNote()
        },
        {
          label: 'Add Timestamp',
          accelerator: 'CmdOrCtrl+T',
          click: () => this.addTimestamp()
        }
      ]
    };
  }

  buildViewMenu() {
    return {
      label: '&View',
      submenu: [
        {
          label: 'Toggle Recording Controls',
          accelerator: 'CmdOrCtrl+R',
          type: 'checkbox',
          checked: true,
          click: () => this.toggleRecordingControls()
        },
        {
          label: 'Toggle Live Transcript',
          accelerator: 'CmdOrCtrl+L',
          type: 'checkbox',
          checked: true,
          click: () => this.toggleLiveTranscript()
        },
        {
          label: 'Toggle Insights Panel',
          accelerator: 'CmdOrCtrl+I',
          type: 'checkbox',
          checked: true,
          click: () => this.toggleInsights()
        },
        {
          label: 'Toggle Captions',
          accelerator: 'CmdOrCtrl+K',
          type: 'checkbox',
          checked: false,
          click: () => this.toggleCaptions()
        },
        { type: 'separator' },
        {
          label: 'Zoom',
          submenu: [
            {
              label: 'Zoom In',
              accelerator: 'CmdOrCtrl+Plus',
              click: () => this.zoomIn()
            },
            {
              label: 'Zoom Out',
              accelerator: 'CmdOrCtrl+-',
              click: () => this.zoomOut()
            },
            {
              label: 'Reset Zoom',
              accelerator: 'CmdOrCtrl+0',
              click: () => this.resetZoom()
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: this.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
          click: () => this.toggleFullScreen()
        },
        { type: 'separator' },
        {
          label: 'Developer',
          submenu: [
            {
              label: 'Toggle Developer Tools',
              accelerator: this.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
              click: () => this.toggleDevTools()
            },
            {
              label: 'Show Debug Info',
              click: () => this.showDebugInfo()
            },
            ...(this.isDev ? [
              { type: 'separator' },
              {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+Shift+R',
                click: () => this.reload()
              }
            ] : [])
          ]
        }
      ]
    };
  }

  buildToolsMenu() {
    return {
      label: '&Tools',
      submenu: [
        {
          label: 'Generate Report',
          accelerator: 'CmdOrCtrl+G',
          click: () => this.generateReport()
        },
        {
          label: 'Analyze Design Patterns',
          click: () => this.analyzePatterns()
        },
        {
          label: 'Check Best Practices',
          click: () => this.checkBestPractices()
        },
        { type: 'separator' },
        {
          label: 'MongoDB Tools',
          submenu: [
            {
              label: 'Schema Analyzer',
              click: () => this.analyzeSchema()
            },
            {
              label: 'Query Performance Advisor',
              click: () => this.checkQueryPerformance()
            },
            {
              label: 'Index Recommendations',
              click: () => this.recommendIndexes()
            },
            { type: 'separator' },
            {
              label: 'Connect to Atlas',
              click: () => this.connectToAtlas()
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'RAG Documents',
          submenu: [
            {
              label: 'Manage Documents...',
              click: () => this.manageRAGDocs()
            },
            {
              label: 'Refresh Embeddings',
              click: () => this.refreshEmbeddings()
            },
            {
              label: 'Test RAG Search',
              click: () => this.testRAGSearch()
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'Templates',
          submenu: [
            {
              label: 'Manage Templates...',
              click: () => this.manageTemplates()
            },
            {
              label: 'Create Template',
              click: () => this.createTemplate()
            },
            {
              label: 'Import Template...',
              click: () => this.importTemplate()
            }
          ]
        },
        { type: 'separator' },
        {
          label: 'AI Provider Settings',
          click: () => this.showAISettings()
        },
        {
          label: 'Test AI Connection',
          click: () => this.testAIConnection()
        }
      ]
    };
  }

  buildWindowMenu() {
    const menu = {
      label: '&Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    };

    if (this.platform === 'darwin') {
      menu.submenu.push(
        { type: 'separator' },
        { label: 'Bring All to Front', role: 'front' },
        { type: 'separator' },
        {
          label: 'bitscribe',
          type: 'checkbox',
          checked: true,
          click: () => this.mainWindow.show()
        }
      );
    }

    return menu;
  }

  buildHelpMenu() {
    return {
      label: '&Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://github.com/mrlynn/mongodb-design-review-scribe/wiki')
        },
        {
          label: 'MongoDB Best Practices',
          click: () => shell.openExternal('https://www.mongodb.com/docs/manual/core/data-modeling-introduction/')
        },
        {
          label: 'Design Patterns Guide',
          click: () => shell.openExternal('https://www.mongodb.com/blog/post/building-with-patterns-a-summary')
        },
        { type: 'separator' },
        {
          label: 'Keyboard Shortcuts',
          click: () => this.showKeyboardShortcuts()
        },
        {
          label: 'Interactive Tutorial',
          click: () => this.startTutorial()
        },
        { type: 'separator' },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/mrlynn/mongodb-design-review-scribe/issues')
        },
        {
          label: 'Feature Request',
          click: () => shell.openExternal('https://github.com/mrlynn/mongodb-design-review-scribe/discussions')
        },
        { type: 'separator' },
        {
          label: 'Check for Updates...',
          click: () => this.checkForUpdates()
        },
        ...(this.platform !== 'darwin' ? [
          { type: 'separator' },
          {
            label: 'About bitscribe',
            click: () => this.showAbout()
          }
        ] : [])
      ]
    };
  }

  // Handler methods
  showAbout() {
    this.mainWindow.webContents.send('show-about');
  }

  showSettings() {
    this.mainWindow.webContents.send('show-settings', true);
  }

  newSession() {
    this.mainWindow.webContents.send('new-session');
  }

  openSession() {
    this.mainWindow.webContents.send('open-session');
  }

  saveSession() {
    this.mainWindow.webContents.send('save-session');
  }

  saveSessionAs() {
    this.mainWindow.webContents.send('save-session-as');
  }

  clearRecent() {
    this.mainWindow.webContents.send('clear-recent-sessions');
  }

  importAudio() {
    this.mainWindow.webContents.send('import-audio');
  }

  importTranscript() {
    this.mainWindow.webContents.send('import-transcript');
  }

  importRAGDocs() {
    this.mainWindow.webContents.send('show-settings', { tab: 'rag' });
  }

  exportMarkdown() {
    this.mainWindow.webContents.send('export-markdown');
  }

  exportPDF() {
    this.mainWindow.webContents.send('export-pdf');
  }

  exportDOCX() {
    this.mainWindow.webContents.send('export-docx');
  }

  exportAudio() {
    this.mainWindow.webContents.send('export-audio');
  }

  exportTranscript() {
    this.mainWindow.webContents.send('export-transcript');
  }

  showFind() {
    this.mainWindow.webContents.send('show-find');
  }

  showFindReplace() {
    this.mainWindow.webContents.send('show-find-replace');
  }

  editTranscript() {
    this.mainWindow.webContents.send('edit-transcript');
  }

  addNote() {
    this.mainWindow.webContents.send('add-note');
  }

  addTimestamp() {
    this.mainWindow.webContents.send('add-timestamp');
  }

  toggleRecordingControls() {
    this.mainWindow.webContents.send('toggle-recording-controls');
  }

  toggleLiveTranscript() {
    this.mainWindow.webContents.send('toggle-live-transcript');
  }

  toggleInsights() {
    this.mainWindow.webContents.send('toggle-insights');
  }

  toggleCaptions() {
    this.mainWindow.webContents.send('toggle-captions');
  }

  zoomIn() {
    const currentZoom = this.mainWindow.webContents.getZoomFactor();
    this.mainWindow.webContents.setZoomFactor(currentZoom + 0.1);
  }

  zoomOut() {
    const currentZoom = this.mainWindow.webContents.getZoomFactor();
    this.mainWindow.webContents.setZoomFactor(Math.max(0.5, currentZoom - 0.1));
  }

  resetZoom() {
    this.mainWindow.webContents.setZoomFactor(1);
  }

  toggleFullScreen() {
    this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
  }

  toggleDevTools() {
    this.mainWindow.webContents.toggleDevTools();
  }

  showDebugInfo() {
    this.mainWindow.webContents.send('show-debug-info');
  }

  reload() {
    this.mainWindow.webContents.reload();
  }

  generateReport() {
    this.mainWindow.webContents.send('generate-report');
  }

  analyzePatterns() {
    this.mainWindow.webContents.send('analyze-patterns');
  }

  checkBestPractices() {
    this.mainWindow.webContents.send('check-best-practices');
  }

  analyzeSchema() {
    this.mainWindow.webContents.send('analyze-schema');
  }

  checkQueryPerformance() {
    this.mainWindow.webContents.send('check-query-performance');
  }

  recommendIndexes() {
    this.mainWindow.webContents.send('recommend-indexes');
  }

  connectToAtlas() {
    this.mainWindow.webContents.send('connect-to-atlas');
  }

  manageRAGDocs() {
    this.mainWindow.webContents.send('show-settings', { tab: 'rag' });
  }

  refreshEmbeddings() {
    this.mainWindow.webContents.send('refresh-embeddings');
  }

  testRAGSearch() {
    this.mainWindow.webContents.send('test-rag-search');
  }

  manageTemplates() {
    this.mainWindow.webContents.send('show-settings', { tab: 'templates' });
  }

  createTemplate() {
    this.mainWindow.webContents.send('create-template');
  }

  importTemplate() {
    this.mainWindow.webContents.send('import-template');
  }

  showAISettings() {
    this.mainWindow.webContents.send('show-settings', { tab: 'llm' });
  }

  testAIConnection() {
    this.mainWindow.webContents.send('test-ai-connection');
  }

  showKeyboardShortcuts() {
    this.mainWindow.webContents.send('show-keyboard-shortcuts');
  }

  startTutorial() {
    this.mainWindow.webContents.send('start-tutorial');
  }

  checkForUpdates() {
    this.mainWindow.webContents.send('check-for-updates');
  }
}

module.exports = AppMenuBuilder;
```

# app/menu/contextMenu.js

```js
const { Menu, MenuItem, clipboard, shell } = require('electron');

class ContextMenuBuilder {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.setupContextMenu();
  }

  setupContextMenu() {
    this.mainWindow.webContents.on('context-menu', (event, params) => {
      const { x, y, selectionText, linkURL, mediaType } = params;
      const hasSelection = selectionText && selectionText.trim().length > 0;
      
      // Build appropriate context menu based on context
      let menu;
      
      if (linkURL) {
        menu = this.buildLinkMenu(linkURL);
      } else if (hasSelection) {
        menu = this.buildTextSelectionMenu(selectionText);
      } else if (mediaType === 'image') {
        menu = this.buildImageMenu(params);
      } else {
        menu = this.buildDefaultMenu(x, y);
      }
      
      menu.popup({ window: this.mainWindow });
    });
  }

  buildTextSelectionMenu(selectedText) {
    const menu = new Menu();
    
    menu.append(new MenuItem({
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      click: () => clipboard.writeText(selectedText)
    }));
    
    menu.append(new MenuItem({ type: 'separator' }));
    
    // MongoDB-specific actions
    menu.append(new MenuItem({
      label: 'Analyze as Schema',
      click: () => this.analyzeAsSchema(selectedText)
    }));
    
    menu.append(new MenuItem({
      label: 'Analyze as Query',
      click: () => this.analyzeAsQuery(selectedText)
    }));
    
    menu.append(new MenuItem({ type: 'separator' }));
    
    menu.append(new MenuItem({
      label: 'Research Topic',
      click: () => this.researchTopic(selectedText)
    }));
    
    menu.append(new MenuItem({
      label: 'Add to Notes',
      click: () => this.addToNotes(selectedText)
    }));
    
    menu.append(new MenuItem({
      label: 'Create Action Item',
      click: () => this.createActionItem(selectedText)
    }));
    
    menu.append(new MenuItem({ type: 'separator' }));
    
    menu.append(new MenuItem({
      label: 'Search in MongoDB Docs',
      click: () => this.searchInDocs(selectedText)
    }));
    
    menu.append(new MenuItem({
      label: 'Search on Web',
      click: () => this.searchOnWeb(selectedText)
    }));
    
    return menu;
  }

  buildLinkMenu(linkURL) {
    const menu = new Menu();
    
    menu.append(new MenuItem({
      label: 'Open Link',
      click: () => shell.openExternal(linkURL)
    }));
    
    menu.append(new MenuItem({
      label: 'Copy Link',
      click: () => clipboard.writeText(linkURL)
    }));
    
    return menu;
  }

  buildImageMenu(params) {
    const menu = new Menu();
    
    menu.append(new MenuItem({
      label: 'Copy Image',
      click: () => this.mainWindow.webContents.copyImageAt(params.x, params.y)
    }));
    
    menu.append(new MenuItem({
      label: 'Save Image As...',
      click: () => this.saveImage(params)
    }));
    
    return menu;
  }

  buildDefaultMenu(x, y) {
    const menu = new Menu();
    
    // Transcript-specific actions
    menu.append(new MenuItem({
      label: 'Add Note Here',
      click: () => this.addNoteAtPosition(x, y)
    }));
    
    menu.append(new MenuItem({
      label: 'Insert Timestamp',
      click: () => this.insertTimestamp()
    }));
    
    menu.append(new MenuItem({ type: 'separator' }));
    
    menu.append(new MenuItem({
      label: 'Edit Transcript',
      click: () => this.editTranscript()
    }));
    
    menu.append(new MenuItem({ type: 'separator' }));
    
    // Standard actions
    menu.append(new MenuItem({
      label: 'Copy All',
      click: () => this.copyAll()
    }));
    
    menu.append(new MenuItem({
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      click: () => this.paste()
    }));
    
    menu.append(new MenuItem({ type: 'separator' }));
    
    menu.append(new MenuItem({
      label: 'Zoom In',
      accelerator: 'CmdOrCtrl+Plus',
      click: () => this.zoomIn()
    }));
    
    menu.append(new MenuItem({
      label: 'Zoom Out',
      accelerator: 'CmdOrCtrl+-',
      click: () => this.zoomOut()
    }));
    
    menu.append(new MenuItem({
      label: 'Reset Zoom',
      accelerator: 'CmdOrCtrl+0',
      click: () => this.resetZoom()
    }));
    
    return menu;
  }

  // Action handlers
  analyzeAsSchema(text) {
    this.mainWindow.webContents.send('analyze-as-schema', { text });
  }

  analyzeAsQuery(text) {
    this.mainWindow.webContents.send('analyze-as-query', { text });
  }

  researchTopic(text) {
    this.mainWindow.webContents.send('research-topic', { text });
  }

  addToNotes(text) {
    this.mainWindow.webContents.send('add-to-notes', { text });
  }

  createActionItem(text) {
    this.mainWindow.webContents.send('create-action-item', { text });
  }

  searchInDocs(text) {
    const query = encodeURIComponent(text);
    shell.openExternal(`https://www.mongodb.com/docs/search/?q=${query}`);
  }

  searchOnWeb(text) {
    const query = encodeURIComponent(text);
    shell.openExternal(`https://www.google.com/search?q=${query}`);
  }

  saveImage(params) {
    this.mainWindow.webContents.send('save-image', params);
  }

  addNoteAtPosition(x, y) {
    this.mainWindow.webContents.send('add-note-at-position', { x, y });
  }

  insertTimestamp() {
    this.mainWindow.webContents.send('insert-timestamp');
  }

  editTranscript() {
    this.mainWindow.webContents.send('edit-transcript');
  }

  copyAll() {
    this.mainWindow.webContents.selectAll();
    this.mainWindow.webContents.copy();
  }

  paste() {
    this.mainWindow.webContents.paste();
  }

  zoomIn() {
    const currentZoom = this.mainWindow.webContents.getZoomFactor();
    this.mainWindow.webContents.setZoomFactor(currentZoom + 0.1);
  }

  zoomOut() {
    const currentZoom = this.mainWindow.webContents.getZoomFactor();
    this.mainWindow.webContents.setZoomFactor(Math.max(0.5, currentZoom - 0.1));
  }

  resetZoom() {
    this.mainWindow.webContents.setZoomFactor(1);
  }
}

module.exports = ContextMenuBuilder;
```

# app/preload.js

```js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu event listeners
  on: (channel, callback) => {
    const validChannels = [
      // File menu
      'new-session',
      'save-session', 
      'save-session-as',
      'open-session',
      'export-markdown',
      'export-pdf',
      'export-docx',
      'export-transcript',
      
      // Edit menu
      'show-find',
      'edit-transcript',
      'add-note',
      'add-timestamp',
      
      // View menu
      'toggle-recording-controls',
      'toggle-live-transcript',
      'toggle-insights',
      'toggle-captions',
      'show-debug-info',
      
      // Tools menu
      'generate-report',
      'analyze-patterns',
      'check-best-practices',
      'analyze-schema',
      'test-ai-connection',
      
      // Help menu
      'show-keyboard-shortcuts',
      'show-about',
      'start-tutorial',
      
      // Context menu
      'analyze-as-schema',
      'analyze-as-query',
      'research-topic',
      'add-to-notes',
      'create-action-item',
      'add-note-at-position',
      'insert-timestamp',
      
      // System events
      'ollama-status',
      'memory-warning'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, callback);
    }
  },
  
  removeListener: (channel, callback) => {
    ipcRenderer.removeListener(channel, callback);
  },
  
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // Send events to main process
  send: (channel, data) => {
    const validChannels = [
      'get-available-providers',
      'test-llm-connection',
      'update-llm-settings',
      'start-recording',
      'stop-recording',
      'pause-recording',
      'resume-recording',
      'process-transcript',
      'save-session',
      'load-session',
      'export-session',
      'get-recent-sessions',
      'get-dashboard-summary',
      'get-current-metrics',
      'export-usage-data',
      'start-new-session'
    ];
    
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Invoke (request-response pattern)
  invoke: (channel, data) => {
    const validChannels = [
      'get-available-providers',
      'test-llm-connection',
      'update-llm-settings',
      'save-session',
      'load-session',
      'export-session',
      'get-recent-sessions',
      'get-dashboard-summary',
      'get-current-metrics',
      'export-usage-data'
    ];
    
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  }
});

// Also expose the existing require functionality for backward compatibility
// but in a controlled way
contextBridge.exposeInMainWorld('electronRequire', {
  ipcRenderer: {
    on: (channel, callback) => ipcRenderer.on(channel, callback),
    send: (channel, data) => ipcRenderer.send(channel, data),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
  }
});

// For maximum compatibility, also expose a direct ipcRenderer interface
// This allows existing code to work without changes while still being secure
contextBridge.exposeInMainWorld('ipcRenderer', {
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  send: (channel, data) => ipcRenderer.send(channel, data), 
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
```

# app/renderer/components/ErrorBoundary.jsx

```jsx
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and IPC
    console.error('🚨 React Error Boundary caught:', error, errorInfo);
    
    // Send error to main process
    try {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('renderer-error', {
          message: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Failed to send error to main process:', e);
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Reload the page to fully reset
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3
        }}>
          <Paper sx={{ p: 4, maxWidth: 600 }}>
            <Typography variant="h4" color="error" gutterBottom>
              🚨 Application Error
            </Typography>
            <Typography variant="body1" paragraph>
              The application encountered an error and needs to restart.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Error: {this.state.error && this.state.error.toString()}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={this.handleReset}
              >
                Restart Application
              </Button>
            </Box>
            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" component="pre" sx={{ 
                  overflow: 'auto', 
                  bgcolor: 'grey.900',
                  p: 2,
                  borderRadius: 1
                }}>
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

# app/renderer/components/research/EnhancedResearchCard.jsx

```jsx
// Enhanced Research Card Component
// Displays AI-powered research results with synthesis, credibility, and follow-ups
import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Chip, Accordion, AccordionSummary,
  AccordionDetails, Link, IconButton, Tooltip, LinearProgress, Stack,
  Divider, List, ListItem, ListItemText, Button, Badge, Collapse
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  OpenInNew as OpenInNewIcon,
  Psychology as PsychologyIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  QuestionAnswer as QuestionIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Article as ArticleIcon,
  Code as CodeIcon,
  FeedRounded as NewsIcon
} from '@mui/icons-material';

const EnhancedResearchCard = ({ research, onFollowUpClick, onSourceClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [showSources, setShowSources] = useState(false);

  if (!research) return null;

  const { 
    topic, 
    synthesis, 
    sources = [], 
    followUpQuestions = [], 
    context,
    primaryFocus,
    timestamp 
  } = research;

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    switch (confidence?.toLowerCase()) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'error';
      default: return 'info';
    }
  };

  // Get credibility color
  const getCredibilityColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  // Get source type icon
  const getSourceIcon = (type) => {
    switch (type) {
      case 'research-paper':
      case 'academic':
        return <SchoolIcon fontSize="small" />;
      case 'news-article':
      case 'news':
        return <NewsIcon fontSize="small" />;
      case 'q&a':
      case 'technical':
        return <CodeIcon fontSize="small" />;
      case 'ai-synthesis':
        return <PsychologyIcon fontSize="small" />;
      default:
        return <ArticleIcon fontSize="small" />;
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 1,
        transition: 'all 0.2s ease',
        '&:hover': {
          border: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#13AA52',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <PsychologyIcon color="primary" />
              {topic}
            </Typography>
            
            {primaryFocus && (
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Focus: {primaryFocus}
              </Typography>
            )}
          </Box>

          {/* Confidence Indicator */}
          {synthesis?.confidence && (
            <Chip
              label={`${synthesis.confidence} confidence`}
              size="small"
              color={getConfidenceColor(synthesis.confidence)}
              icon={synthesis.confidence === 'high' ? <VerifiedIcon /> : <WarningIcon />}
            />
          )}
        </Box>

        {/* AI Synthesis */}
        {synthesis?.synthesis && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
              {synthesis.synthesis}
            </Typography>

            {/* Key Points */}
            {synthesis.keyPoints && synthesis.keyPoints.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Key Points:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {synthesis.keyPoints.slice(0, 3).map((point, index) => (
                    <Chip
                      key={index}
                      label={point}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                  {synthesis.keyPoints.length > 3 && (
                    <Chip
                      label={`+${synthesis.keyPoints.length - 3} more`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Practical Takeaways */}
            {synthesis.practicalTakeaways && synthesis.practicalTakeaways.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  💡 Practical Takeaways:
                </Typography>
                <List dense sx={{ pl: 2 }}>
                  {synthesis.practicalTakeaways.slice(0, 2).map((takeaway, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={takeaway}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}

        {/* Sources Summary */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Sources:
            </Typography>
            <Badge badgeContent={sources.length} color="primary">
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowSources(!showSources)}
                sx={{ minWidth: 'auto' }}
              >
                {showSources ? 'Hide' : 'Show'}
              </Button>
            </Badge>
          </Box>

          {/* Average Credibility Score */}
          {sources.length > 0 && sources.some(s => s.credibility?.score) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Avg. Credibility:
              </Typography>
              <Chip
                label={`${Math.round(
                  sources
                    .filter(s => s.credibility?.score)
                    .reduce((sum, s) => sum + s.credibility.score, 0) / 
                  sources.filter(s => s.credibility?.score).length
                )}%`}
                size="small"
                color={getCredibilityColor(
                  sources
                    .filter(s => s.credibility?.score)
                    .reduce((sum, s) => sum + s.credibility.score, 0) / 
                  sources.filter(s => s.credibility?.score).length
                )}
              />
            </Box>
          )}
        </Box>

        {/* Sources List */}
        <Collapse in={showSources}>
          <Box sx={{ mb: 2 }}>
            {sources.slice(0, 5).map((source, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  mb: 1,
                  bgcolor: '#F5F7FA',
                  borderRadius: 1,
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#F0F2F5',
                    border: '1px solid rgba(19, 170, 82, 0.2)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ mt: 0.5 }}>
                    {getSourceIcon(source.type)}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
                        {source.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {source.credibility?.score && (
                          <Chip
                            label={`${source.credibility.score}%`}
                            size="small"
                            color={getCredibilityColor(source.credibility.score)}
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        )}
                        
                        <IconButton
                          size="small"
                          onClick={() => window.open(source.url, '_blank')}
                          sx={{ p: 0.5 }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {source.summary?.substring(0, 150)}
                      {source.summary?.length > 150 && '...'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={source.source}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                      
                      <Chip
                        label={source.type}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
            
            {sources.length > 5 && (
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block', mt: 1 }}>
                ... and {sources.length - 5} more sources
              </Typography>
            )}
          </Box>
        </Collapse>

        {/* Follow-up Questions */}
        {followUpQuestions && followUpQuestions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <QuestionIcon fontSize="small" />
              Follow-up Questions:
            </Typography>
            <Stack spacing={1}>
              {followUpQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => onFollowUpClick && onFollowUpClick(question)}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    textTransform: 'none',
                    borderColor: 'rgba(19, 170, 82, 0.3)',
                    '&:hover': {
                      borderColor: '#13AA52',
                      bgcolor: 'rgba(19, 170, 82, 0.04)'
                    }
                  }}
                >
                  {question}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Researched {new Date(timestamp).toLocaleTimeString()}
          </Typography>
          
          {synthesis?.deeperExploration && synthesis.deeperExploration.length > 0 && (
            <Tooltip title="Areas for deeper exploration">
              <Chip
                icon={<TrendingUpIcon />}
                label={`${synthesis.deeperExploration.length} deeper topics`}
                size="small"
                variant="outlined"
                color="info"
              />
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnhancedResearchCard;
```

# app/renderer/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Real-time Conversational Research Companion</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html> 
```

# app/renderer/index.jsx

```jsx
import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  CssBaseline, Typography, Box, Chip, 
  Alert, AlertTitle, Link, Stack, Card,
  AppBar, Toolbar, Fab, Fade, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, 
  IconButton, Snackbar, FormControl, Select, MenuItem,
  Tabs, Tab, Paper, List, ListItem, ListItemText,
  ListItemSecondaryAction, Switch, TextField, CircularProgress,
  Divider, Grid
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import custom components
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { setupMenuHandlers, showKeyboardShortcuts } from './menuHandlers.js';

// Use the old require method temporarily
const { ipcRenderer } = window.require('electron');

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// MongoDB Atlas-inspired theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#13AA52',
      light: '#1CC45F',
      dark: '#0E7C3A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3E4E50',
      light: '#5A6C6F',
      dark: '#2A3638',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F7FA',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#3E4E50',
    },
    success: {
      main: '#13AA52',
      light: '#1CC45F',
    },
    warning: {
      main: '#FFA500',
      light: '#FFB84D',
    },
    error: {
      main: '#D32F2F',
      light: '#E57373',
    },
    info: {
      main: '#0084FF',
      light: '#4DA3FF',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Helvetica Neue", "Inter", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.75rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 500 },
    h4: { fontSize: '1.25rem', fontWeight: 500 },
    h5: { fontSize: '1rem', fontWeight: 500 },
    h6: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#128A42', // slightly darker MongoDB green
          },
        },
        outlinedPrimary: {
          border: '1px solid #13AA52',
          color: '#13AA52',
          '&:hover': {
            backgroundColor: 'rgba(19, 170, 82, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16, // pill style
          fontSize: '0.75rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#13AA52',
          height: 3,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#13AA52',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(19, 170, 82, 0.08)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#0084FF',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

const MongoCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.12)',
  }
}));

const ScrollableBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#F5F7FA',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.3)',
    }
  },
}));

const PulsingDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${theme.palette.success.main}`,
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 10px rgba(16, 185, 129, 0)`,
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 rgba(16, 185, 129, 0)`,
    },
  },
}));

const RecordButton = styled(Fab)(({ theme, recording }) => ({
  width: 72,
  height: 72,
  backgroundColor: recording ? '#D32F2F' : '#13AA52',
  color: 'white',
  fontSize: '24px',
  fontWeight: 600,
  boxShadow: recording
    ? '0 4px 12px rgba(211, 47, 47, 0.3)'
    : '0 4px 12px rgba(19, 170, 82, 0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: recording ? '#B71C1C' : '#0E7C3A',
    boxShadow: recording
      ? '0 6px 16px rgba(211, 47, 47, 0.4)'
      : '0 6px 16px rgba(19, 170, 82, 0.4)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  }
}));

const StatusIndicator = styled(Box)(({ theme, connected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 2),
  borderRadius: 16,
  backgroundColor: connected ? '#E8F5E9' : '#FFF3E0',
  border: `1px solid ${connected ? '#C8E6C9' : '#FFE0B2'}`,
  fontSize: '14px',
  fontWeight: 500,
  color: connected ? '#2E7D32' : '#F57C00',
}));

// Audiogram Component
function Audiogram({ isListening }) {
  const [spectrumData, setSpectrumData] = useState(Array(16).fill(0));
  const [waveformHistory, setWaveformHistory] = useState(Array(60).fill(0));
  const [voiceActivity, setVoiceActivity] = useState(false);
  const [realAudioLevels, setRealAudioLevels] = useState(null);
  
  // Frequency band labels for professional display
  const frequencyBands = ['60Hz', '170Hz', '310Hz', '600Hz', '1kHz', '3kHz', '6kHz', '12kHz'];
  
  // Set up professional spectrum analysis with Web Audio API
  useEffect(() => {
    if (isListening && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          
          // Professional audio analysis settings
          analyser.fftSize = 512; // Higher resolution for better frequency analysis
          analyser.smoothingTimeConstant = 0.8; // Smooth transitions
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          const timeDomainArray = new Uint8Array(bufferLength);
          
          microphone.connect(analyser);
          
          const updateSpectrum = () => {
            if (isListening) {
              // Get frequency data for spectrum analysis
              analyser.getByteFrequencyData(dataArray);
              // Get time domain data for waveform and voice activity detection
              analyser.getByteTimeDomainData(timeDomainArray);
              
              // Create logarithmic frequency bands (more realistic for human hearing)
              const bands = 16;
              const spectrum = new Array(bands).fill(0);
              
              for (let i = 0; i < bands; i++) {
                const start = Math.floor((i / bands) * bufferLength);
                const end = Math.floor(((i + 1) / bands) * bufferLength);
                let sum = 0;
                for (let j = start; j < end; j++) {
                  sum += dataArray[j];
                }
                spectrum[i] = sum / (end - start) / 255; // Normalize to 0-1
              }
              
              // Voice activity detection based on amplitude and frequency content
              const rms = Math.sqrt(timeDomainArray.reduce((sum, val) => sum + Math.pow((val - 128) / 128, 2), 0) / timeDomainArray.length);
              const highFreqEnergy = spectrum.slice(6, 12).reduce((sum, val) => sum + val, 0) / 6;
              const isVoiceActive = rms > 0.003 && highFreqEnergy > 0.03;
              
              setSpectrumData(spectrum);
              setVoiceActivity(isVoiceActive);
              
              // Update waveform history
              setWaveformHistory(prev => {
                const newHistory = [...prev.slice(1)];
                newHistory.push(rms);
                return newHistory;
              });
              
              requestAnimationFrame(updateSpectrum);
            }
          };
          
          updateSpectrum();
          setRealAudioLevels({ audioContext, stream });
        })
        .catch(err => {
          console.log('Microphone access denied, using simulated levels:', err);
          // Professional fallback simulation
          const interval = setInterval(() => {
            const simulatedSpectrum = Array(16).fill(0).map((_, i) => {
              // Simulate speech-like frequency distribution
              const speechFreq = i >= 2 && i <= 8 ? Math.random() * 0.7 + 0.1 : Math.random() * 0.3;
              return speechFreq;
            });
            setSpectrumData(simulatedSpectrum);
            setVoiceActivity(Math.random() > 0.3);
            
            setWaveformHistory(prev => {
              const newHistory = [...prev.slice(1)];
              newHistory.push(Math.random() * 0.5);
              return newHistory;
            });
          }, 100);
          
          setRealAudioLevels({ interval });
        });
    }
    
    return () => {
      if (realAudioLevels) {
        if (realAudioLevels.audioContext && realAudioLevels.audioContext.state !== 'closed') {
          realAudioLevels.audioContext.close();
        }
        if (realAudioLevels.stream) {
          realAudioLevels.stream.getTracks().forEach(track => track.stop());
        }
        if (realAudioLevels.interval) {
          clearInterval(realAudioLevels.interval);
        }
      }
    };
  }, [isListening]);
  
  return (
    <Box sx={{ 
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      backgroundColor: '#F8F9FA',
      borderRadius: 2
    }}>
      {/* Voice Activity Indicator */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 1,
        height: 20
      }}>
        <Box sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: voiceActivity ? '#13AA52' : '#94A3B8',
          transition: 'all 0.2s ease'
        }} />
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          {voiceActivity ? 'Voice Detected' : 'Listening...'}
        </Typography>
      </Box>
      
      {/* Real-time Spectrum Analyzer */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        gap: 0.5,
        height: 90,
        mb: 2
      }}>
        {spectrumData.map((amplitude, index) => (
          <Box
            key={index}
            sx={{
              width: 14,
              height: `${Math.max(2, amplitude * 200)}px`,
              backgroundColor: isListening 
                ? (voiceActivity 
                    ? (index >= 2 && index <= 8 ? '#13AA52' : '#1CC45F') // Highlight speech frequencies
                    : '#94A3B8'
                  )
                : '#E2E8F0',
              borderRadius: 1,
              transition: 'all 0.15s ease',
              opacity: amplitude > 0.02 ? 1 : 0.3
            }}
          />
        ))}
      </Box>
      
      {/* Waveform History */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
        p: 1,
        gap: 1
      }}>
        {waveformHistory.map((amplitude, index) => (
          <Box
            key={index}
            sx={{
              width: 2,
              height: `${Math.max(1, amplitude * 30)}px`,
              backgroundColor: voiceActivity && index > 50 ? '#13AA52' : '#CBD5E1',
              borderRadius: 0.5,
              opacity: index > 50 ? 1 : 0.3 + (index / 50) * 0.7
            }}
          />
        ))}
      </Box>
      
      {/* Frequency Labels */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        mt: 1,
        px: 1
      }}>
        {frequencyBands.map((freq, index) => (
          <Typography 
            key={index} 
            variant="caption" 
            sx={{ 
              color: '#94A3B8',
              fontSize: '0.7rem'
            }}
          >
            {freq}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

// Live Captions Component
function LiveCaptions({ captions }) {
  return (
    <Box sx={{ 
      height: 150,
      overflow: 'hidden',
      p: 2,
      backgroundColor: '#F8F9FA',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }}>
      {captions.slice(-3).map((caption, index) => {
        const recentCaptions = captions.slice(-3);
        const isLatest = index === recentCaptions.length - 1;
        return (
          <Typography
            key={caption.timestamp || index}
            variant="body1"
            sx={{
              fontSize: isLatest ? '18px' : '16px',
              fontWeight: isLatest ? 600 : 400,
              color: isLatest ? '#1F2937' : '#6B7280',
              opacity: 1 - (recentCaptions.length - 1 - index) * 0.3,
              mb: 1,
              lineHeight: 1.4
            }}
          >
            {caption.text}
          </Typography>
        );
      })}
      {captions.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Live captions will appear here...
        </Typography>
      )}
    </Box>
  );
}

function App() {
  // Debug logging for renderer startup
  console.log('🚀 App component mounting');
  console.log('🔍 Available APIs:', {
    require: !!window.require,
    ipcRenderer: !!ipcRenderer
  });

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState('audiogram'); // 'transcript', 'captions', 'audiogram'
  const [recentCaptions, setRecentCaptions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [research, setResearch] = useState([]);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [meetingNotes, setMeetingNotes] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(null);
  const [llmProviders, setLlmProviders] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [testingConnection, setTestingConnection] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Metrics state
  const [usageMetrics, setUsageMetrics] = useState(null);
  const [currentSessionMetrics, setCurrentSessionMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  
  // Template state
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDialog, setTemplateDialog] = useState({ open: false, mode: 'view', template: null });
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Report state
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  
  // Exported Reports state
  const [exportedReports, setExportedReports] = useState([]);
  const [loadingExportedReports, setLoadingExportedReports] = useState(false);
  const [reportViewMode, setReportViewMode] = useState('generated'); // 'generated' | 'exported' | 'favorites'
  
  // Report editing state
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [editedReportName, setEditedReportName] = useState('');
  const [editedReportContent, setEditedReportContent] = useState('');
  const [savingReport, setSavingReport] = useState(false);
  
  // Real-time insights state
  const [realtimeInsights, setRealtimeInsights] = useState([]);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [currentSlides, setCurrentSlides] = useState([]);
  const [knowledgeGraph, setKnowledgeGraph] = useState(null);
  const [showInsightsPanel, setShowInsightsPanel] = useState(true);

  // RAG state
  const [ragDocuments, setRAGDocuments] = useState([]);
  const [loadingRAGDocuments, setLoadingRAGDocuments] = useState(false);
  const [ragStats, setRAGStats] = useState(null);
  
  // Ref for auto-scrolling transcript
  const transcriptRef = useRef(null);
  
  // Auto-scroll transcript when it updates
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);


  // Load settings data when dialog opens
  useEffect(() => {
    if (showSettings) {
      loadTemplates();
      loadMetrics();
      if (reportViewMode === 'generated') {
        loadUserReports();
      } else if (reportViewMode === 'exported') {
        loadExportedReports();
      } else if (reportViewMode === 'favorites') {
        loadFavoriteReports();
      }
    }
  }, [showSettings, reportViewMode]);

  useEffect(() => {
    let isMounted = true;
    console.log('Setting up IPC listeners...');
    console.log('🔍 ipcRenderer available:', !!ipcRenderer);
    
    // Set up menu handlers only if ipcRenderer is available
    try {
      setupMenuHandlers();
      console.log('✅ Menu handlers set up successfully');
    } catch (error) {
      console.error('❌ Failed to set up menu handlers:', error);
    }
    
    // Set up custom event listeners for menu actions
    const handleGenerateReport = () => {
      if (selectedTemplate) {
        handleGenerateClick();
      } else {
        setShowReportDialog(true);
      }
    };
    
    const handleShowKeyboardShortcuts = () => {
      const shortcutsHTML = showKeyboardShortcuts();
      setAlert({
        severity: 'info',
        title: 'Keyboard Shortcuts',
        message: shortcutsHTML
      });
    };
    
    const handleToggleCaptions = () => {
      setCaptionsEnabled(prev => !prev);
    };
    
    const handleShowAbout = () => {
      setAlert({
        severity: 'info',
        title: 'About bitscribe',
        message: `
          <div style="text-align: center;">
            <h3>bitscribe</h3>
            <p>Version 1.0.0</p>
            <p>AI-powered transcription and analysis tool for MongoDB design reviews</p>
            <br>
            <p><strong>Features:</strong></p>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
              <li>Real-time speech transcription</li>
              <li>AI-powered conversation analysis</li>
              <li>MongoDB-specific best practices detection</li>
              <li>RAG-enhanced insights</li>
              <li>Professional report generation</li>
            </ul>
            <br>
            <p>© 2025 MongoDB. All rights reserved.</p>
          </div>
        `
      });
    };
    
    // Add event listeners
    window.addEventListener('generate-report', handleGenerateReport);
    window.addEventListener('show-keyboard-shortcuts', handleShowKeyboardShortcuts);
    window.addEventListener('toggle-captions', handleToggleCaptions);
    window.addEventListener('show-about', handleShowAbout);
    window.addEventListener('show-settings', () => setShowSettings(true));
    window.addEventListener('toggle-recording-controls', () => {
      // Toggle recording controls visibility
      setAlert({ severity: 'info', message: 'Recording controls toggled' });
    });
    window.addEventListener('edit-transcript', () => {
      setAlert({ severity: 'info', message: 'Transcript editing mode activated' });
    });
    
    // Transcript updates with AGGRESSIVE memory management
    const MAX_TRANSCRIPT_LENGTH = 8000; // 8KB limit - FURTHER REDUCED
    const MAX_TRANSCRIPT_LINES = 80; // Max lines - FURTHER REDUCED
    const MAX_CAPTIONS = 5; // Reduce captions memory footprint
    
    const transcriptHandler = (_, data) => {
      if (!isMounted) return; // Prevent updates after unmount
      
      console.log('🎤 Renderer: Received transcript-update:', data);
      
      if (typeof data === 'string') {
        // Legacy format
        setTranscript((prev) => {
          // Memory management: truncate if too large
          let managedPrev = prev;
          if (prev.length > MAX_TRANSCRIPT_LENGTH) {
            const lines = prev.split('\n');
            managedPrev = lines.slice(-Math.floor(MAX_TRANSCRIPT_LINES / 2)).join('\n');
            console.warn('Transcript truncated due to memory limits');
          }
          
          const newTranscript = managedPrev + (managedPrev ? '\n' : '') + data;
          setWordCount(newTranscript.split(/\s+/).filter(word => word.length > 0).length);
          return newTranscript;
        });
        
        // Add to captions for live view (legacy format)
        setRecentCaptions(prev => {
          const newCaptions = [...prev, { 
            text: data, 
            timestamp: Date.now() 
          }];
          // Keep only last 5 captions for memory efficiency
          return newCaptions.slice(-MAX_CAPTIONS);
        });
      } else if (data.type === 'final') {
        // Committed text - add permanently
        setTranscript((prev) => {
          // Memory management: truncate if too large
          let managedPrev = prev;
          if (prev.length > MAX_TRANSCRIPT_LENGTH) {
            const lines = prev.split('\n');
            managedPrev = lines.slice(-Math.floor(MAX_TRANSCRIPT_LINES / 2)).join('\n');
            console.warn('Transcript truncated due to memory limits');
          }
          
          const newTranscript = managedPrev + (managedPrev ? '\n' : '') + data.text;
          setWordCount(newTranscript.split(/\s+/).filter(word => word.length > 0).length);
          return newTranscript;
        });
        
        // Add to captions for live view
        setRecentCaptions(prev => {
          const newCaptions = [...prev, { 
            text: data.text, 
            timestamp: Date.now() 
          }];
          // Keep only last 5 captions for memory efficiency
          return newCaptions.slice(-MAX_CAPTIONS);
        });
      } else if (data.type === 'interim') {
        // Interim text - show temporarily but don't save
        setTranscript((prev) => {
          // Memory management for interim updates
          let managedPrev = prev;
          if (prev.length > MAX_TRANSCRIPT_LENGTH) {
            const lines = prev.split('\n');
            managedPrev = lines.slice(-Math.floor(MAX_TRANSCRIPT_LINES / 2)).join('\n');
          }
          
          // Remove any previous interim text and add new interim
          const lines = managedPrev.split('\n');
          const finalLines = lines.filter(line => !line.startsWith('〉'));
          const newTranscript = finalLines.join('\n') + (finalLines.length > 0 ? '\n' : '') + '〉 ' + data.text;
          return newTranscript;
        });
      } else if (data.type === 'error' || data.type === 'system') {
        // System messages
        setTranscript((prev) => {
          const newTranscript = prev + (prev ? '\n' : '') + data.text;
          return newTranscript;
        });
      }
    };
    
    // Topics extracted with deduplication and limits
    const topicsHandler = (_, data) => {
      if (!isMounted) return;
      setTopics((prev) => {
        // Add new data and deduplicate by timestamp
        const newTopics = [...prev, data];
        const uniqueTopics = newTopics.filter((topic, index, array) => 
          array.findIndex(t => t.timestamp === topic.timestamp) === index
        );
        
        // Keep only last 10 topic entries - REDUCED for extreme memory pressure
        const limitedTopics = uniqueTopics.slice(-10);
        
        if (limitedTopics.length < uniqueTopics.length) {
          console.warn(`Topics truncated: ${uniqueTopics.length} -> ${limitedTopics.length}`);
        }
        
        return limitedTopics;
      });
    };
    
    // Research completed with deduplication and limits
    const researchHandler = (_, data) => {
      if (!isMounted) return;
      setResearch((prev) => {
        // Add new summaries and deduplicate by topic
        const newResearch = [...prev, ...data.summaries];
        const uniqueResearch = newResearch.filter((research, index, array) => 
          array.findIndex(r => r.topic === research.topic && r.timestamp === research.timestamp) === index
        );
        
        // Keep only last 5 research items - REDUCED for extreme memory pressure
        const limitedResearch = uniqueResearch.slice(-5);
        
        if (limitedResearch.length < uniqueResearch.length) {
          console.warn(`Research truncated: ${uniqueResearch.length} -> ${limitedResearch.length}`);
        }
        
        return limitedResearch;
      });
    };
    
    // Ollama status
    const ollamaHandler = (_, connected) => {
      if (!isMounted) return;
      console.log('Received ollama-status update:', connected);
      setOllamaConnected(connected);
    };
    
    // Processing status
    const chunkHandler = () => {
      if (!isMounted) return;
      setProcessingStatus('Processing chunk...');
      setTimeout(() => {
        if (isMounted) setProcessingStatus(null);
      }, 1000);
    };
    
    // Error handler
    const errorHandler = (_, error) => {
      if (!isMounted) return;
      console.error('IPC Error:', error);
    };

    // Register all handlers with error handling
    if (!ipcRenderer) {
      console.error('❌ ipcRenderer not available, skipping IPC setup');
      return;
    }
    
    try {
      console.log('Registering IPC event handlers...');
      ipcRenderer.on('transcript-update', transcriptHandler);
      ipcRenderer.on('topics-extracted', topicsHandler);
      ipcRenderer.on('research-completed', researchHandler);
      ipcRenderer.on('ollama-status', ollamaHandler);
      ipcRenderer.on('chunk-processed', chunkHandler);
      ipcRenderer.on('processor-error', errorHandler);
      
      // Real-time event handlers
      ipcRenderer.on('realtime-insight', (_, insight) => {
        if (!isMounted) return;
        setRealtimeInsights(prev => [...prev.slice(-9), insight]); // Keep last 10
      });

      ipcRenderer.on('executive-summary-updated', (_, summary) => {
        if (!isMounted) return;
        setExecutiveSummary(summary);
      });

      ipcRenderer.on('slides-generated', (_, slides) => {
        if (!isMounted) return;
        setCurrentSlides(slides);
      });

      ipcRenderer.on('knowledge-graph-updated', (_, graphData) => {
        if (!isMounted) return;
        setKnowledgeGraph(graphData);
      });
      
      // Check Ollama status after handlers are registered
      setTimeout(() => {
        if (isMounted) {
          console.log('Sending check-ollama-status request...');
          ipcRenderer.send('check-ollama-status');
        }
      }, 100);
    } catch (error) {
      console.error('Failed to set up IPC listeners:', error);
    }
    
    return () => {
      isMounted = false;
      console.log('Cleaning up IPC listeners...');
      
      // Remove all listeners - more thorough cleanup
      try {
        ipcRenderer.removeListener('transcript-update', transcriptHandler);
        ipcRenderer.removeListener('topics-extracted', topicsHandler);
        ipcRenderer.removeListener('research-completed', researchHandler);
        ipcRenderer.removeListener('ollama-status', ollamaHandler);
        ipcRenderer.removeListener('chunk-processed', chunkHandler);
        ipcRenderer.removeListener('processor-error', errorHandler);
        ipcRenderer.removeAllListeners('realtime-insight');
        ipcRenderer.removeAllListeners('executive-summary-updated');
        ipcRenderer.removeAllListeners('slides-generated');
        ipcRenderer.removeAllListeners('knowledge-graph-updated');
        
        // Clean up custom event listeners
        window.removeEventListener('generate-report', handleGenerateReport);
        window.removeEventListener('show-keyboard-shortcuts', handleShowKeyboardShortcuts);
        window.removeEventListener('toggle-captions', handleToggleCaptions);
        window.removeEventListener('show-about', handleShowAbout);
      } catch (error) {
        console.error('Error during IPC cleanup:', error);
      }
    };
  }, []);

  // Emergency memory recovery system
  useEffect(() => {
    let memoryCheckInterval;
    
    // Monitor memory usage and perform emergency cleanup if needed
    const checkMemoryUsage = () => {
      try {
        // Check if performance.memory is available (Chromium/Electron)
        if (window.performance && window.performance.memory) {
          const memoryInfo = window.performance.memory;
          const usedMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
          const limitMB = memoryInfo.jsHeapSizeLimit / (1024 * 1024);
          
          console.log(`Memory usage: ${usedMB.toFixed(1)}MB / ${limitMB.toFixed(1)}MB`);
          
          // Emergency cleanup if memory usage is too high - MORE AGGRESSIVE
          if (usedMB > 100 || (usedMB / limitMB) > 0.7) {
            console.warn('🚨 High memory usage detected, performing emergency cleanup');
            
            // Aggressive state cleanup - batch updates to prevent React unmounting
            React.startTransition(() => {
              setTopics(prev => prev.slice(-5)); // Even more aggressive
              setResearch(prev => prev.slice(-3));
              setTranscript(prev => {
                const lines = prev.split('\n');
                return lines.slice(-50).join('\n'); // Keep only last 50 lines
              });
              
              // Clear any pending updates
              setProcessingStatus(null);
              setWordCount(0);
            });
            
            // Force garbage collection if available
            if (window.gc) {
              window.gc();
            }
          }
        }
      } catch (error) {
        console.error('Memory check error:', error);
      }
    };
    
    // Check every 30 seconds
    memoryCheckInterval = setInterval(checkMemoryUsage, 30000);
    
    return () => {
      if (memoryCheckInterval) {
        clearInterval(memoryCheckInterval);
      }
    };
  }, []);

  // Global error boundary for renderer crashes
  useEffect(() => {
    const handleError = (error) => {
      console.error('🚨 Renderer error detected:', error);
      try {
        // Send crash report to main process
        ipcRenderer.send('renderer-error', {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error('Failed to send error report:', e);
      }
    };
    
    const handleUnhandledRejection = (event) => {
      console.error('🚨 Unhandled promise rejection:', event.reason);
      handleError(new Error(`Unhandled rejection: ${event.reason}`));
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const startTranscription = () => {
    setTranscript('');
    setTopics([]);
    setResearch([]);
    setRecentCaptions([]);
    setWordCount(0);
    setMeetingNotes(null);
    
    // Force garbage collection before starting
    if (window.gc) {
      window.gc();
    }
    
    ipcRenderer.send('start-transcription');
    setIsListening(true);
  };
  
  const stopTranscription = () => {
    ipcRenderer.send('stop-transcription');
    setIsListening(false);
    
    // Force garbage collection after stopping
    setTimeout(() => {
      if (window.gc) {
        window.gc();
      }
    }, 1000);
    
    // Show post-recording dialog if we have sufficient transcript
    if (transcript.length > 50) {
      // Load templates first
      loadTemplates();
      // Show the report generation dialog
      setShowTemplateSelection(true);
    }
  };

  const triggerResearchForTopic = async (topicData) => {
    if (!topicData || !topicData.topics || topicData.topics.length === 0) {
      console.warn('No topics available for research');
      return;
    }

    console.log('Triggering research for topics:', topicData.topics);
    
    try {
      // Send research request to main process
      const result = await ipcRenderer.invoke('trigger-research', {
        topics: topicData.topics,
        questions: topicData.questions || [],
        terms: topicData.terms || [],
        transcript: transcript,
        timestamp: topicData.timestamp
      });
      
      if (result.success) {
        console.log('Research triggered successfully');
        // Research results will be received via the research-completed event
      } else {
        console.error('Failed to trigger research:', result.error);
      }
    } catch (error) {
      console.error('Error triggering research:', error);
    }
  };

  const generateMeetingNotes = async () => {
    if (notesLoading) return;
    
    console.log('Generate meeting notes button clicked');
    console.log('Current transcript length:', transcript.length);
    console.log('Current topics:', topics);
    
    setNotesLoading(true);
    try {
      // Send current UI state to main process for generation
      const result = await ipcRenderer.invoke('generate-meeting-notes', {
        transcript,
        topics,
        research
      });
      console.log('Meeting notes result:', result);
      if (result.error) {
        console.error('Error generating meeting notes:', result.error);
      } else {
        setMeetingNotes(result);
        console.log('Meeting notes set successfully');
      }
    } catch (error) {
      console.error('Failed to generate meeting notes:', error);
    } finally {
      setNotesLoading(false);
    }
  };

  const exportMeetingNotes = async () => {
    if (!meetingNotes) return;
    
    try {
      const result = await ipcRenderer.invoke('export-meeting-notes', meetingNotes);
      if (result.success) {
        // Could show a toast notification here
        console.log('Meeting notes exported to:', result.filepath);
      } else {
        console.error('Export failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to export meeting notes:', error);
    }
  };

  const clearMeetingNotes = () => {
    setMeetingNotes(null);
  };

  // Helper functions for insight styling
  const getInsightBackgroundColor = (type) => {
    const colors = {
      contradiction: 'rgba(239, 68, 68, 0.1)',
      jargon: 'rgba(59, 130, 246, 0.1)',
      suggestion: 'rgba(16, 185, 129, 0.1)',
      insight: 'rgba(19, 170, 82, 0.1)',
      example: 'rgba(139, 92, 246, 0.1)',
      strategic: 'rgba(245, 158, 11, 0.1)',
      perspective: 'rgba(236, 72, 153, 0.1)',
      question: 'rgba(6, 182, 212, 0.1)'
    };
    return colors[type] || 'rgba(148, 163, 184, 0.1)';
  };

  const getInsightBorderColor = (type) => {
    const colors = {
      contradiction: 'rgba(239, 68, 68, 0.3)',
      jargon: 'rgba(59, 130, 246, 0.3)',
      suggestion: 'rgba(16, 185, 129, 0.3)',
      insight: 'rgba(19, 170, 82, 0.3)',
      example: 'rgba(139, 92, 246, 0.3)',
      strategic: 'rgba(245, 158, 11, 0.3)',
      perspective: 'rgba(236, 72, 153, 0.3)',
      question: 'rgba(6, 182, 212, 0.3)'
    };
    return colors[type] || 'rgba(148, 163, 184, 0.3)';
  };

  const getInsightTextColor = (type) => {
    const colors = {
      contradiction: '#ef4444',
      jargon: '#3b82f6',
      suggestion: '#10b981',
      insight: '#6366f1',
      example: '#8b5cf6',
      strategic: '#f59e0b',
      perspective: '#ec4899',
      question: '#06b6d4'
    };
    return colors[type] || '#94a3b8';
  };

  const getInsightIcon = (type) => {
    const icons = {
      contradiction: '⚠️',
      jargon: '📖',
      suggestion: '💡',
      insight: '🧠',
      example: '📋',
      strategic: '🎯',
      perspective: '👥',
      question: '❓'
    };
    return icons[type] || '💭';
  };

  // Settings functions
  const loadSettings = async () => {
    try {
      const config = await ipcRenderer.invoke('get-settings');
      const providers = await ipcRenderer.invoke('get-llm-providers');
      setSettings(config);
      setLlmProviders(providers);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const result = await ipcRenderer.invoke('update-settings', newSettings);
      if (result.success) {
        setSettings(prev => ({ ...prev, ...newSettings }));
        setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
    }
  };

  const handleSettingsUpdate = (newSettings) => {
    // Update local state immediately for responsive UI
    setSettings(newSettings);
    // Save to backend
    saveSettings(newSettings);
  };

  const testProviderConnection = async (providerName) => {
    setTestingConnection(true);
    try {
      const result = await ipcRenderer.invoke('test-llm-provider', providerName);
      if (result.connected) {
        setSnackbar({ open: true, message: `${providerName} connected successfully!`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: `Failed to connect to ${providerName}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setSnackbar({ open: true, message: 'Connection test failed', severity: 'error' });
    } finally {
      setTestingConnection(false);
    }
  };

  // RAG functions
  const handleRAGFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      try {
        setSnackbar({ open: true, message: `Uploading ${file.name}...`, severity: 'info' });
        
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        const result = await ipcRenderer.invoke('upload-rag-document', {
          fileName: file.name,
          fileData: arrayBuffer,
          metadata: {
            type: 'best-practices',
            category: 'general'
          }
        });

        if (result.success) {
          setSnackbar({ open: true, message: `${file.name} uploaded successfully!`, severity: 'success' });
          loadRAGDocuments(); // Refresh the list
        } else {
          setSnackbar({ open: true, message: `Failed to upload ${file.name}: ${result.error}`, severity: 'error' });
        }
      } catch (error) {
        console.error('File upload failed:', error);
        setSnackbar({ open: true, message: `Failed to upload ${file.name}: ${error.message}`, severity: 'error' });
      }
    }
  };

  const loadRAGDocuments = async () => {
    setLoadingRAGDocuments(true);
    try {
      const [documentsResult, statsResult] = await Promise.all([
        ipcRenderer.invoke('get-rag-documents'),
        ipcRenderer.invoke('get-rag-stats')
      ]);

      if (documentsResult.success) {
        setRAGDocuments(documentsResult.documents);
      }

      if (statsResult.success) {
        setRAGStats(statsResult.stats);
      }
    } catch (error) {
      console.error('Failed to load RAG documents:', error);
      setSnackbar({ open: true, message: 'Failed to load documents', severity: 'error' });
    } finally {
      setLoadingRAGDocuments(false);
    }
  };

  const deleteRAGDocument = async (documentId) => {
    try {
      const result = await ipcRenderer.invoke('delete-rag-document', documentId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Document deleted successfully!', severity: 'success' });
        loadRAGDocuments(); // Refresh the list
      } else {
        setSnackbar({ open: true, message: 'Failed to delete document', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      setSnackbar({ open: true, message: 'Failed to delete document', severity: 'error' });
    }
  };

  const openSettings = () => {
    loadSettings();
    loadMetrics();
    loadUserReports();
    loadExportedReports();
    loadRAGDocuments();
    setShowSettings(true);
  };

  const loadMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const [usage, current] = await Promise.all([
        ipcRenderer.invoke('get-usage-metrics'),
        ipcRenderer.invoke('get-current-session-metrics')
      ]);
      setUsageMetrics(usage);
      setCurrentSessionMetrics(current);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const exportUsageData = async () => {
    try {
      const result = await ipcRenderer.invoke('export-usage-data');
      if (result.success) {
        setSnackbar({ open: true, message: 'Usage data exported successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to export usage data', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to export usage data:', error);
      setSnackbar({ open: true, message: 'Failed to export usage data', severity: 'error' });
    }
  };

  // Template functions
  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const result = await ipcRenderer.invoke('get-templates');
      if (result.success) {
        setTemplates(result.templates);
        
        // Auto-select MongoDB Design Review template if no template is selected
        if (!selectedTemplate && result.templates.length > 0) {
          const mongoDBTemplate = result.templates.find(t => 
            t.name === 'MongoDB Design Review Report' || 
            t.isDefault === true
          );
          if (mongoDBTemplate) {
            setSelectedTemplate(mongoDBTemplate);
          } else {
            // Fallback to first template
            setSelectedTemplate(result.templates[0]);
          }
        }
      } else {
        setSnackbar({ open: true, message: 'Failed to load templates', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      setSnackbar({ open: true, message: 'Failed to load templates', severity: 'error' });
    } finally {
      setLoadingTemplates(false);
    }
  };

  const generateReport = async (templateId) => {
    try {
      setSnackbar({ open: true, message: 'Generating report...', severity: 'info' });
      const result = await ipcRenderer.invoke('generate-report', templateId, transcript, {}, Date.now().toString());
      if (result.success) {
        setSnackbar({ open: true, message: 'Report generated successfully!', severity: 'success' });
        // Store the generated report and show it
        setGeneratedReport({
          id: result.reportId,
          content: result.content,
          metadata: result.metadata,
          templateId: templateId,
          template: templates.find(t => t._id === templateId),
          generatedAt: new Date()
        });
        setShowReportDialog(true);
        // Refresh user reports list
        loadUserReports();
      } else {
        setSnackbar({ open: true, message: `Failed to generate report: ${result.error}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      setSnackbar({ open: true, message: 'Failed to generate report', severity: 'error' });
    }
  };

  const triggerResearchForCurrentTranscript = async () => {
    if (!transcript || transcript.length < 50) return;
    
    try {
      setSnackbar({ open: true, message: 'Researching current transcript...', severity: 'info' });
      
      // Extract topics from current transcript
      const result = await ipcRenderer.invoke('trigger-immediate-research', transcript);
      if (result.success) {
        setSnackbar({ open: true, message: 'Research completed!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Research failed', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to trigger research:', error);
      setSnackbar({ open: true, message: 'Research failed', severity: 'error' });
    }
  };

  const generateQuickReport = async () => {
    if (!transcript || transcript.length < 50) return;
    
    try {
      setSnackbar({ open: true, message: 'Generating quick report...', severity: 'info' });
      
      // Generate meeting notes without template selection
      const result = await ipcRenderer.invoke('generate-meeting-notes', transcript);
      if (result.success) {
        setMeetingNotes(result.notes);
        setSnackbar({ open: true, message: 'Quick report generated!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Report generation failed', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate quick report:', error);
      setSnackbar({ open: true, message: 'Report generation failed', severity: 'error' });
    }
  };

  const generateReportFromSelection = async (templateId) => {
    setGeneratingReport(true);
    setShowTemplateSelection(false);
    
    try {
      setSnackbar({ open: true, message: 'Generating report from template...', severity: 'info' });
      const result = await ipcRenderer.invoke('generate-report', templateId, transcript, {}, Date.now().toString());
      if (result.success) {
        setSnackbar({ open: true, message: 'Report generated successfully!', severity: 'success' });
        // Store the generated report and show it
        setGeneratedReport({
          id: result.reportId,
          content: result.content,
          metadata: result.metadata,
          templateId: templateId,
          template: templates.find(t => t._id === templateId),
          generatedAt: new Date()
        });
        setShowReportDialog(true);
        // Refresh user reports list
        loadUserReports();
      } else {
        setSnackbar({ open: true, message: `Failed to generate report: ${result.error}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      setSnackbar({ open: true, message: 'Failed to generate report', severity: 'error' });
    } finally {
      setGeneratingReport(false);
    }
  };

  const exportTemplate = async (templateId) => {
    try {
      const result = await ipcRenderer.invoke('export-template-json', templateId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Template exported successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to export template', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to export template:', error);
      setSnackbar({ open: true, message: 'Failed to export template', severity: 'error' });
    }
  };

  const exportAllTemplates = async () => {
    try {
      const result = await ipcRenderer.invoke('export-all-templates');
      if (result.success) {
        setSnackbar({ open: true, message: 'All templates exported successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to export templates', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to export all templates:', error);
      setSnackbar({ open: true, message: 'Failed to export templates', severity: 'error' });
    }
  };

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // Load settings and LLM providers on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Report management functions
  const loadUserReports = async () => {
    setLoadingReports(true);
    try {
      const result = await ipcRenderer.invoke('get-user-reports');
      if (result.success) {
        setUserReports(result.reports);
      } else {
        console.error('Failed to load user reports:', result.error);
      }
    } catch (error) {
      console.error('Failed to load user reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const exportGeneratedReport = async (reportId) => {
    try {
      const result = await ipcRenderer.invoke('export-report', reportId, 'markdown');
      if (result.success) {
        setSnackbar({ open: true, message: `Report exported to ${result.filename}`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to export report', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to export report:', error);
      setSnackbar({ open: true, message: 'Failed to export report', severity: 'error' });
    }
  };

  const viewReport = async (reportId) => {
    try {
      const result = await ipcRenderer.invoke('get-report', reportId);
      if (result.success) {
        setGeneratedReport({
          id: result.report._id,
          content: result.report.content,
          metadata: result.report.metadata,
          templateId: result.report.templateId,
          template: { name: result.report.templateName },
          generatedAt: new Date(result.report.generatedAt)
        });
        setShowReportDialog(true);
      } else {
        setSnackbar({ open: true, message: 'Failed to load report', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to load report:', error);
      setSnackbar({ open: true, message: 'Failed to load report', severity: 'error' });
    }
  };

  // Exported Reports functions
  const loadExportedReports = async () => {
    setLoadingExportedReports(true);
    try {
      const result = await ipcRenderer.invoke('get-exported-reports-by-user', 'default-user');
      if (result.success) {
        setExportedReports(result.reports);
      } else {
        console.error('Failed to load exported reports:', result.error);
        setSnackbar({ open: true, message: 'Failed to load exported reports', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to load exported reports:', error);
      setSnackbar({ open: true, message: 'Failed to load exported reports', severity: 'error' });
    } finally {
      setLoadingExportedReports(false);
    }
  };

  const loadFavoriteReports = async () => {
    setLoadingReports(true);
    try {
      const result = await ipcRenderer.invoke('get-favorite-reports', 'default-user');
      if (result.success) {
        setUserReports(result.reports);
      } else {
        console.error('Failed to load favorite reports:', result.error);
        setSnackbar({ open: true, message: 'Failed to load favorite reports', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to load favorite reports:', error);
      setSnackbar({ open: true, message: 'Failed to load favorite reports', severity: 'error' });
    } finally {
      setLoadingReports(false);
    }
  };

  const deleteExportedReport = async (exportId) => {
    try {
      const result = await ipcRenderer.invoke('delete-exported-report', exportId);
      if (result.success && result.deleted) {
        setSnackbar({ open: true, message: 'Exported report deleted successfully', severity: 'success' });
        loadExportedReports(); // Refresh list
      } else {
        setSnackbar({ open: true, message: 'Failed to delete exported report', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete exported report:', error);
      setSnackbar({ open: true, message: 'Failed to delete exported report', severity: 'error' });
    }
  };

  // Report editing functions
  const startEditingReport = () => {
    if (generatedReport) {
      setIsEditingReport(true);
      setEditedReportName(generatedReport.template?.name || '');
      setEditedReportContent(generatedReport.content);
    }
  };

  const cancelEditingReport = () => {
    setIsEditingReport(false);
    setEditedReportName('');
    setEditedReportContent('');
  };

  const saveReportEdits = async () => {
    if (!generatedReport) return;
    
    setSavingReport(true);
    try {
      const updates = {
        templateName: editedReportName,
        content: editedReportContent
      };
      
      const result = await ipcRenderer.invoke('update-report', generatedReport.id, updates);
      if (result.success) {
        setSnackbar({ open: true, message: 'Report updated successfully', severity: 'success' });
        
        // Update the local state
        setGeneratedReport(prev => ({
          ...prev,
          template: { ...prev.template, name: editedReportName },
          content: editedReportContent
        }));
        
        // Refresh reports list
        loadUserReports();
        setIsEditingReport(false);
      } else {
        setSnackbar({ open: true, message: 'Failed to update report', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to save report edits:', error);
      setSnackbar({ open: true, message: 'Failed to update report', severity: 'error' });
    } finally {
      setSavingReport(false);
    }
  };

  const renderMeetingNotes = () => {
    if (!meetingNotes) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            📝 No meeting notes generated yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate AI-powered meeting summary with action items
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Chip 
              label={notesLoading ? "Generating..." : "Generate Notes"}
              onClick={generateMeetingNotes}
              disabled={notesLoading || transcript.length < 10}
              sx={{ 
                backgroundColor: notesLoading ? 'rgba(19, 170, 82, 0.3)' : '#13AA52',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: notesLoading ? 'rgba(19, 170, 82, 0.3)' : '#128A42',
                }
              }}
            />
            <Chip 
              label="Test Generate"
              onClick={() => {
                console.log('Test button clicked');
                // Add some test data for testing
                setTranscript('We discussed the quarterly budget and decided to increase marketing spend by 20%. John will prepare the budget proposal by Friday. Sarah mentioned that we need to hire two new developers. The team agreed to implement the new API by end of March.');
                setTopics([{
                  topics: ['budget', 'marketing', 'hiring', 'API development'],
                  questions: ['When should we start hiring?'],
                  terms: ['quarterly budget', 'API'],
                  timestamp: new Date().toISOString()
                }]);
                setTimeout(() => generateMeetingNotes(), 500);
              }}
              sx={{ 
                backgroundColor: '#FFFFFF',
                border: '2px solid #13AA52',
                color: '#13AA52',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 2,
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(19, 170, 82, 0.08)',
                }
              }}
            />
          </Box>
        </Box>
      );
    }

    return (
      <Box>
        {/* Header with Export Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.light' }}>
            📋 Meeting Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label="Export"
              size="small"
              onClick={exportMeetingNotes}
              sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '11px'
              }}
            />
            <Chip 
              label="Clear"
              size="small"
              onClick={clearMeetingNotes}
              sx={{ 
                background: 'rgba(239, 68, 68, 0.8)',
                color: 'white',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '11px'
              }}
            />
          </Box>
        </Box>

        <Stack spacing={2}>
          {/* Summary */}
          {meetingNotes.summary && (
            <Box sx={{ 
              p: 3, 
              bgcolor: '#FFFFFF', 
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#13AA52' }}>
                📄 Summary
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {meetingNotes.summary}
              </Typography>
            </Box>
          )}

          {/* Action Items */}
          {meetingNotes.actionItems && meetingNotes.actionItems.length > 0 && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(245, 158, 11, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(245, 158, 11, 0.1)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'warning.light' }}>
                ✅ Action Items ({meetingNotes.actionItems.length})
              </Typography>
              {meetingNotes.actionItems.map((item, index) => (
                <Box key={index} sx={{ mb: 1, ml: 1 }}>
                  <Typography variant="caption" sx={{ 
                    color: 'text.primary', 
                    fontWeight: 500,
                    display: 'block'
                  }}>
                    {index + 1}. {item.item}
                  </Typography>
                  {(item.assignee || item.deadline || item.priority) && (
                    <Box sx={{ ml: 1, mt: 0.5 }}>
                      {item.assignee && (
                        <Chip label={`@${item.assignee}`} size="small" sx={{ 
                          mr: 0.5, fontSize: '10px', height: '18px'
                        }} />
                      )}
                      {item.priority && (
                        <Chip 
                          label={item.priority} 
                          size="small" 
                          sx={{ 
                            mr: 0.5, 
                            fontSize: '10px', 
                            height: '18px',
                            background: item.priority === 'high' ? 'rgba(239, 68, 68, 0.8)' :
                                       item.priority === 'medium' ? 'rgba(245, 158, 11, 0.8)' :
                                       'rgba(107, 114, 128, 0.8)',
                            color: 'white'
                          }} 
                        />
                      )}
                      {item.deadline && (
                        <Typography variant="caption" color="text.secondary">
                          Due: {item.deadline}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Decisions */}
          {meetingNotes.decisions && meetingNotes.decisions.length > 0 && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(6, 182, 212, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(6, 182, 212, 0.1)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'secondary.light' }}>
                🎯 Decisions ({meetingNotes.decisions.length})
              </Typography>
              {meetingNotes.decisions.map((decision, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ 
                    color: 'text.primary', 
                    fontWeight: 500,
                    display: 'block'
                  }}>
                    {decision.decision}
                  </Typography>
                  {decision.context && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      Context: {decision.context}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Key Points */}
          {meetingNotes.keyPoints && meetingNotes.keyPoints.length > 0 && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(16, 185, 129, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'success.light' }}>
                💡 Key Points
              </Typography>
              {meetingNotes.keyPoints.map((point, index) => (
                <Typography key={index} variant="caption" sx={{ 
                  color: 'text.secondary', 
                  display: 'block',
                  mb: 0.5,
                  ml: 1
                }}>
                  • {point}
                </Typography>
              ))}
            </Box>
          )}
        </Stack>
      </Box>
    );
  };

  const renderTopics = () => {
    if (topics.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            🔍 No topics detected yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start speaking to see AI-extracted topics appear
          </Typography>
        </Box>
      );
    }
    
    return (
      <Stack spacing={2}>
        {topics.map((topicData, index) => (
          <Fade in={true} key={index} style={{ transitionDelay: `${index * 100}ms` }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: '#FFFFFF', 
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                border: '1px solid rgba(19, 170, 82, 0.2)',
              }
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                mb: 1.5,
                fontWeight: 500
              }}>
                ⏰ {new Date(topicData.timestamp).toLocaleTimeString()}
              </Typography>
              
              {topicData.topics.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.light' }}>
                    💡 Topics
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {topicData.topics.map((topic, i) => (
                      <Chip 
                        key={i} 
                        label={topic} 
                        size="small" 
                        sx={{
                          backgroundColor: '#13AA52',
                          color: 'white',
                          fontWeight: 500,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#128A42',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {topicData.questions.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'secondary.light' }}>
                    ❓ Questions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {topicData.questions.map((question, i) => (
                      <Chip 
                        key={i} 
                        label={question} 
                        size="small" 
                        sx={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                          color: 'white',
                          fontWeight: 500,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {topicData.terms.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                    🔤 Terms
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {topicData.terms.map((term, i) => (
                      <Chip 
                        key={i} 
                        label={term} 
                        size="small" 
                        variant="outlined"
                        sx={{
                          borderColor: 'text.secondary',
                          color: 'text.secondary',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: 'text.primary',
                            color: 'text.primary',
                            bgcolor: 'rgba(148, 163, 184, 0.1)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Fade>
        ))}
      </Stack>
    );
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Clean background - no decoration needed for MongoDB Atlas style */}

        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ 
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <img 
                src="./build/icon.png" 
                alt="bitscribe icon"
                style={{ 
                  width: 40,
                  height: 40,
                  borderRadius: '50%'
                }} 
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Bitscribe
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
                  AI Research Assistant
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StatusIndicator 
                connected={ollamaConnected}
                onClick={() => ipcRenderer.send('check-ollama-status')}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                {ollamaConnected ? <PulsingDot /> : <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />}
                <Typography variant="body2">
                  {ollamaConnected ? 'AI Connected' : 'AI Disconnected'}
                </Typography>
              </StatusIndicator>

              {/* LLM Provider Selector */}
              {settings && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={settings?.llm?.provider || 'ollama'}
                    onChange={(e) => {
                      const newProvider = e.target.value;
                      const newSettings = {
                        ...settings,
                        llm: { ...(settings?.llm || {}), provider: newProvider }
                      };
                      setSettings(newSettings);
                      handleSettingsUpdate(newSettings);
                    }}
                  displayEmpty
                  variant="outlined"
                  sx={{
                    height: 32,
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 1,
                    color: 'primary.light',
                    fontSize: '13px',
                    '& .MuiSelect-select': {
                      py: 0.5,
                      px: 1.5
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.15)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  {llmProviders.map(provider => (
                    <MenuItem key={provider.id} value={provider.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '13px' }}>
                          {provider.name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              )}
              
              {wordCount > 0 && (
                <Chip 
                  label={`${wordCount} words`} 
                  size="small" 
                  variant="outlined"
                  sx={{ borderColor: 'primary.main', color: 'primary.light' }}
                />
              )}
              
              <IconButton 
                onClick={openSettings}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.light' }
                }}
                title="Settings"
              >
                ⚙️
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area with New Layout */}
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          {!ollamaConnected && (
            <Fade in={!ollamaConnected}>
              <Alert 
                severity="warning" 
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  right: 16,
                  zIndex: 10,
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'warning.light',
                  '& .MuiAlert-icon': { color: 'warning.main' }
                }}
              >
                Ollama AI is not connected. Please ensure Ollama is running locally on port 11434.
              </Alert>
            </Fade>
          )}

          {/* Left Panel: Conversation Topics */}
          <Box sx={{ 
            width: '360px', 
            display: 'flex', 
            flexDirection: 'column', 
            backgroundColor: '#F5F7FA',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            p: 4,
            gap: 3,
            overflow: 'hidden'
          }}>
            {/* Action Buttons Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={triggerResearchForCurrentTranscript}
                disabled={!transcript || transcript.length < 50}
                sx={{ 
                  flex: 1,
                  fontSize: '12px',
                  py: 0.75,
                  borderColor: 'secondary.main',
                  color: 'secondary.light',
                  '&:hover': { 
                    bgcolor: 'rgba(6, 182, 212, 0.1)',
                    borderColor: 'secondary.light'
                  },
                  '&:disabled': {
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    color: 'text.disabled'
                  }
                }}
              >
                🔍 Research Now
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={generateQuickReport}
                disabled={!transcript || transcript.length < 50}
                sx={{ 
                  flex: 1,
                  fontSize: '12px',
                  py: 0.75,
                  borderColor: 'success.main',
                  color: 'success.light',
                  '&:hover': { 
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'success.light'
                  },
                  '&:disabled': {
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    color: 'text.disabled'
                  }
                }}
              >
                📝 Quick Report
              </Button>
            </Box>

            {/* Recording Status - Compact */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <RecordButton
                recording={isListening}
                onClick={isListening ? stopTranscription : startTranscription}
                sx={{ width: 48, height: 48 }}
              >
                {isListening ? '⏹' : '🎤'}
              </RecordButton>
              
              <Box sx={{ flex: 1 }}>
                {isListening && (
                  <Chip 
                    label="🔴 LIVE" 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#D32F2F',
                      color: 'white',
                      fontWeight: 600,
                      animation: 'pulse 2s infinite',
                      fontSize: '11px',
                      borderRadius: 2
                    }}
                  />
                )}
                
                {topics.length > 0 && (
                  <Chip 
                    label={`${topics.length} topics`} 
                    size="small" 
                    sx={{ 
                      ml: 1,
                      backgroundColor: '#13AA52',
                      color: 'white',
                      fontSize: '11px',
                      borderRadius: 2
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Primary Action: Generate Report Button */}
            {transcript.length > 50 && !isListening && (
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => {
                    loadTemplates();
                    setShowTemplateSelection(true);
                  }}
                  sx={{ 
                    py: 2,
                    background: 'linear-gradient(135deg, #13AA52 0%, #1CC45F 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '16px',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(19, 170, 82, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0E7C3A 0%, #13AA52 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(19, 170, 82, 0.4)'
                    }
                  }}
                  startIcon={<Typography sx={{ fontSize: '24px' }}>📋</Typography>}
                >
                  Generate Report from Transcript
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  Transform your {transcript.split(' ').length} words into a comprehensive report
                </Typography>
              </Box>
            )}

            {/* Conversation Topics Section */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>
                🎯 Conversation Topics
              </Typography>
              
              {topics.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  border: '2px dashed rgba(148, 163, 184, 0.2)',
                  borderRadius: 2,
                  bgcolor: 'rgba(148, 163, 184, 0.05)'
                }}>
                  <Typography color="text.secondary" sx={{ mb: 1, fontSize: '14px' }}>
                    🎤 Start recording to extract topics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                    Topics will appear here in real-time
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {topics.map((topicData, index) => (
                    <Card key={index} sx={{ 
                      p: 2,
                      background: 'rgba(99, 102, 241, 0.03)',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
                          ⏰ {new Date(topicData.timestamp).toLocaleTimeString()}
                        </Typography>
                        <Chip 
                          label={`${topicData.topics?.length || 0}`} 
                          size="small" 
                          sx={{ 
                            height: '20px',
                            fontSize: '10px',
                            bgcolor: 'primary.main',
                            color: 'white'
                          }}
                        />
                      </Box>
                      
                      {topicData.topics && topicData.topics.length > 0 && (
                        <Box sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {topicData.topics.slice(0, 3).map((topic, i) => (
                              <Chip 
                                key={i} 
                                label={topic} 
                                size="small" 
                                variant="outlined"
                                sx={{ 
                                  height: '24px',
                                  fontSize: '11px',
                                  borderColor: 'primary.main',
                                  color: 'primary.light',
                                  bgcolor: 'rgba(99, 102, 241, 0.05)'
                                }}
                              />
                            ))}
                            {topicData.topics.length > 3 && (
                              <Chip 
                                label={`+${topicData.topics.length - 3}`} 
                                size="small" 
                                sx={{ 
                                  height: '24px',
                                  fontSize: '10px',
                                  bgcolor: 'rgba(148, 163, 184, 0.1)',
                                  color: 'text.secondary'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => triggerResearchForTopic(topicData)}
                          sx={{ 
                            fontSize: '10px', 
                            py: 0.5,
                            px: 1.5,
                            flex: 1,
                            borderColor: 'rgba(6, 182, 212, 0.3)',
                            color: 'secondary.light',
                            '&:hover': { 
                              bgcolor: 'rgba(6, 182, 212, 0.1)',
                              borderColor: 'secondary.main'
                            }
                          }}
                        >
                          🔍 Research
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => {
                            loadTemplates();
                            setShowTemplateSelection(true);
                          }}
                          sx={{ 
                            fontSize: '10px', 
                            py: 0.5,
                            px: 1.5,
                            flex: 1,
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                            color: 'success.main',
                            '&:hover': { 
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              borderColor: 'success.main'
                            }
                          }}
                        >
                          📝 Report
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: 3,
            gap: 2,
            overflow: 'hidden'
          }}>
            {/* Main conversation content - with view mode toggle */}
            <Card sx={{ 
              flex: 1,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0 // Important for flexbox children
            }}>
              {/* Header with view mode toggle */}
              <Box sx={{ 
                p: 3, 
                pb: 0,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexShrink: 0
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {viewMode === 'transcript' && '📝 Live Transcript'}
                  {viewMode === 'captions' && '💬 Live Captions'}
                  {viewMode === 'audiogram' && '🎵 Audio Visualization'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label="Audiogram"
                    size="small"
                    color={viewMode === 'audiogram' ? 'primary' : 'default'}
                    onClick={() => setViewMode('audiogram')}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="Captions"
                    size="small"
                    color={viewMode === 'captions' ? 'primary' : 'default'}
                    onClick={() => setViewMode('captions')}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="Full Text"
                    size="small"
                    color={viewMode === 'transcript' ? 'primary' : 'default'}
                    onClick={() => setViewMode('transcript')}
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>
              </Box>

              {/* Content area */}
              <Box sx={{ flex: 1, minHeight: 0, p: 3, pt: 2 }}>
                {viewMode === 'audiogram' && (
                  <Audiogram isListening={isListening} />
                )}
                
                {viewMode === 'captions' && (
                  <LiveCaptions captions={recentCaptions} />
                )}
                
                {viewMode === 'transcript' && (
                  <Box 
                    ref={transcriptRef}
                    sx={{ 
                      height: '100%',
                      overflow: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      color: 'text.primary',
                      backgroundColor: '#F8F9FA',
                      p: 2,
                      borderRadius: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(148, 163, 184, 0.1)',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(148, 163, 184, 0.3)',
                        borderRadius: '4px',
                        '&:hover': {
                          background: 'rgba(148, 163, 184, 0.5)',
                        }
                      }
                    }}
                  >
                    {transcript || 'Full transcript will appear here when you start recording...'}
                  </Box>
                )}
              </Box>
            </Card>
          </Box>

          {/* Right Sidebar: Research & Notes */}
          <Box sx={{ 
            width: '380px', 
            display: 'flex', 
            flexDirection: 'column', 
            borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
            bgcolor: '#F5F7FA',
            overflow: 'hidden',
            p: 4,
            gap: 3,
            height: '100vh' // Ensure full height
          }}>
            {/* Real-time Insights Section */}
            <Box sx={{ 
              flexGrow: 1, 
              minHeight: '300px', // Minimum height to prevent crushing
              maxHeight: 'calc(100vh - 400px)', // Leave space for Notes section
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  🧠 Live Insights
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setShowInsightsPanel(!showInsightsPanel)}
                  sx={{ color: 'text.secondary' }}
                >
                  {showInsightsPanel ? '👁️' : '👁️‍🗨️'}
                </IconButton>
              </Box>
              
              {showInsightsPanel && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {realtimeInsights.length === 0 && research.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 3,
                      border: '2px dashed rgba(148, 163, 184, 0.2)',
                      borderRadius: 2,
                      bgcolor: 'rgba(148, 163, 184, 0.05)'
                    }}>
                      <Typography color="text.secondary" sx={{ mb: 1, fontSize: '14px' }}>
                        🔍 Real-time insights will appear here
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                        AI is analyzing your conversation...
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1.5}>
                      {/* Real-time insights */}
                      {realtimeInsights.slice(-5).map((insight, index) => (
                        <Card 
                          key={`insight-${insight.timestamp}-${index}`}
                          sx={{ 
                            p: 1.5, 
                            bgcolor: getInsightBackgroundColor(insight.type),
                            border: `1px solid ${getInsightBorderColor(insight.type)}`,
                            borderRadius: 2,
                            opacity: 0.95,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': { opacity: 1, transform: 'translateY(-1px)' }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ 
                              fontSize: '10px',
                              fontWeight: 600,
                              color: getInsightTextColor(insight.type),
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {getInsightIcon(insight.type)} {insight.type}
                            </Typography>
                            <Box sx={{ flex: 1 }} />
                            <Chip 
                              label={`${Math.round(insight.confidence * 100)}%`}
                              size="small"
                              sx={{ 
                                height: '16px',
                                fontSize: '9px',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'text.primary'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ 
                            fontSize: '12px',
                            lineHeight: 1.4,
                            color: 'text.primary'
                          }}>
                            {insight.content}
                          </Typography>
                          {insight.action && (
                            <Typography variant="caption" sx={{ 
                              fontSize: '11px',
                              color: 'text.secondary',
                              fontStyle: 'italic',
                              mt: 0.5,
                              display: 'block'
                            }}>
                              💡 {insight.action}
                            </Typography>
                          )}
                        </Card>
                      ))}
                      
                      {/* Traditional research insights */}
                      {research.slice(-2).map((item, index) => (
                        <Card 
                          key={`research-${index}`}
                          sx={{ 
                            p: 1.5, 
                            bgcolor: 'rgba(6, 182, 212, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(6, 182, 212, 0.1)',
                          }}
                        >
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            mb: 0.5, 
                            color: 'secondary.light',
                            fontSize: '12px'
                          }}>
                            🔍 {item.topic || 'Research'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '11px' }}>
                            {item.summary || (item.sources && item.sources[0]?.summary) || 'Research insight available'}
                          </Typography>
                        </Card>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}
            </Box>

            {/* Quick Notes & Summary Section */}
            <Box sx={{ 
              flexShrink: 0, // Prevent shrinking
              height: '320px', // Fixed height to prevent overlap
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              p: 2
            }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label="📋 Notes" 
                  size="small" 
                  onClick={() => setActiveTab(0)}
                  variant={activeTab === 0 ? "filled" : "outlined"}
                  sx={{ fontSize: '12px' }}
                />
                <Chip 
                  label="📄 Summary" 
                  size="small" 
                  onClick={() => setActiveTab(1)}
                  variant={activeTab === 1 ? "filled" : "outlined"}
                  sx={{ fontSize: '12px' }}
                />
                <Chip 
                  label="📊 Slides" 
                  size="small" 
                  onClick={() => setActiveTab(2)}
                  variant={activeTab === 2 ? "filled" : "outlined"}
                  sx={{ fontSize: '12px' }}
                />
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {activeTab === 0 && renderMeetingNotes()}
                
                {activeTab === 1 && (
                  <Box sx={{ 
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#F8F9FA',
                    height: '100%'
                  }}>
                    {executiveSummary ? (
                      <Typography variant="body2" sx={{ 
                        fontSize: '12px',
                        lineHeight: 1.4,
                        color: 'text.primary'
                      }}>
                        {executiveSummary}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary" sx={{ fontSize: '12px', fontStyle: 'italic' }}>
                        Executive summary will appear as conversation progresses...
                      </Typography>
                    )}
                  </Box>
                )}
                
                {activeTab === 2 && (
                  <Box sx={{ 
                    height: '100%',
                    overflow: 'auto'
                  }}>
                    {currentSlides.length > 0 ? (
                      <Stack spacing={1}>
                        {currentSlides.map((slide, index) => (
                          <Card key={index} sx={{ p: 1.5, bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
                            <Typography variant="subtitle2" sx={{ 
                              fontSize: '13px', 
                              fontWeight: 600, 
                              mb: 1,
                              color: 'primary.main'
                            }}>
                              {slide.title}
                            </Typography>
                            {slide.bullets.map((bullet, bulletIndex) => (
                              <Typography key={bulletIndex} variant="body2" sx={{ 
                                fontSize: '11px',
                                lineHeight: 1.3,
                                color: 'text.secondary',
                                ml: 1,
                                mb: 0.5
                              }}>
                                • {bullet}
                              </Typography>
                            ))}
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary" sx={{ fontSize: '12px', fontStyle: 'italic' }}>
                        Slide points will be generated every 5 minutes...
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Recent Section */}
            <Box sx={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>
                📝 Recent
              </Typography>
              
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: 2,
                p: 2,
                bgcolor: '#F5F7FA'
              }}>
                {transcript ? (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap',
                      color: 'text.secondary'
                    }}
                  >
                    {transcript.split('\n').slice(-10).join('\n')}
                  </Typography>
                ) : (
                  <Typography color="text.secondary" sx={{ fontSize: '12px', fontStyle: 'italic' }}>
                    Recent transcript will appear here...
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Settings and Other Dialogs */}
        {showSettings && (
          <Dialog
            open={true}
            onClose={() => setShowSettings(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                minHeight: '80vh'
              }
            }}
          >
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ⚙️ Settings
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="General" />
                  <Tab label="AI Providers" />
                  <Tab label="RAG Documents" />
                  <Tab label="Templates" />
                  <Tab label="Reports" />
                  <Tab label="Metrics" />
                  <Tab label="Advanced" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                {/* General Settings */}
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>General Settings</Typography>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Auto-save transcripts"
                          secondary="Automatically save conversation transcripts"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings?.autoSave || false}
                            onChange={(e) => handleSettingsUpdate({
                              ...settings,
                              autoSave: e.target.checked
                            })}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Dark mode"
                          secondary="Use dark theme (currently always on)"
                        />
                        <ListItemSecondaryAction>
                          <Switch checked={true} disabled />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                {/* AI Providers */}
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>AI Provider Configuration</Typography>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>Active Provider</Typography>
                      <Select
                        value={settings?.llm?.provider || 'ollama'}
                        onChange={(e) => handleSettingsUpdate({
                          ...settings,
                          llm: { ...(settings?.llm || {}), provider: e.target.value }
                        })}
                      >
                        {llmProviders.map(provider => (
                          <MenuItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" gutterBottom>Provider Status</Typography>
                      {llmProviders.map(provider => (
                        <Box key={provider.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2">{provider.name}</Typography>
                            <Button
                              size="small"
                              onClick={() => testProviderConnection(provider.id)}
                              disabled={testingConnection}
                            >
                              Test Connection
                            </Button>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {provider.id === 'ollama' && 'Local Ollama instance'}
                            {provider.id === 'openai' && 'OpenAI API'}
                            {provider.id === 'anthropic' && 'Anthropic Claude API'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                {/* RAG Documents */}
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>📚 RAG Document Management</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Upload best practice documents to enhance AI analysis with your organization's knowledge
                    </Typography>

                    {/* Document Upload Section */}
                    <Paper sx={{ p: 3, mb: 3, border: '2px dashed', borderColor: 'primary.main', borderRadius: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>📤 Upload Documents</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Supported formats: PDF, DOCX, TXT, MD
                        </Typography>
                        <input
                          type="file"
                          id="rag-file-upload"
                          multiple
                          accept=".pdf,.docx,.txt,.md"
                          style={{ display: 'none' }}
                          onChange={(e) => handleRAGFileUpload(e.target.files)}
                        />
                        <Button
                          variant="contained"
                          onClick={() => document.getElementById('rag-file-upload').click()}
                          startIcon="📁"
                        >
                          Choose Files
                        </Button>
                      </Box>
                    </Paper>

                    {/* RAG Settings */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>⚙️ RAG Settings</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Typography variant="body2" gutterBottom>Enable RAG Enhancement</Typography>
                          <Switch
                            checked={settings?.rag?.enabled || false}
                            onChange={(e) => handleSettingsUpdate({
                              ...settings,
                              rag: { ...settings?.rag, enabled: e.target.checked }
                            })}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" gutterBottom>
                            Relevance Threshold: {settings?.rag?.threshold || 0.7}
                          </Typography>
                          <TextField
                            type="number"
                            size="small"
                            inputProps={{ min: 0.1, max: 1.0, step: 0.1 }}
                            value={settings?.rag?.threshold || 0.7}
                            onChange={(e) => handleSettingsUpdate({
                              ...settings,
                              rag: { ...settings?.rag, threshold: parseFloat(e.target.value) }
                            })}
                          />
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Document List */}
                    <Paper sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">📋 Uploaded Documents</Typography>
                        <Button size="small" onClick={() => loadRAGDocuments()}>
                          Refresh
                        </Button>
                      </Box>
                      
                      {loadingRAGDocuments ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : ragDocuments.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                          No documents uploaded yet
                        </Typography>
                      ) : (
                        <List>
                          {ragDocuments.map((doc) => (
                            <ListItem key={doc.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                              <ListItemText
                                primary={doc.fileName}
                                secondary={`${doc.wordCount} words • ${doc.fileType} • ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                              />
                              <ListItemSecondaryAction>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => deleteRAGDocument(doc.id)}
                                >
                                  Delete
                                </Button>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Paper>

                    {/* RAG Stats */}
                    {ragStats && (
                      <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>📊 RAG Statistics</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">Total Documents</Typography>
                            <Typography variant="h4">{ragStats.totalDocuments}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">Total Chunks</Typography>
                            <Typography variant="h4">{ragStats.totalChunks}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">Avg Chunks/Doc</Typography>
                            <Typography variant="h4">{ragStats.avgChunksPerDoc}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                {/* Templates */}
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Report Templates</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" onClick={() => loadTemplates()}>
                        Refresh
                      </Button>
                      <Button size="small" onClick={() => exportAllTemplates()}>
                        Export All
                      </Button>
                      <Button 
                        size="small" 
                        onClick={async () => {
                          const result = await ipcRenderer.invoke('force-add-mongodb-template');
                          if (result.success) {
                            setSnackbar({ open: true, message: 'MongoDB template added!', severity: 'success' });
                            loadTemplates();
                          } else {
                            setSnackbar({ open: true, message: 'Failed to add MongoDB template', severity: 'error' });
                          }
                        }}
                        sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                      >
                        Add MongoDB Template
                      </Button>
                    </Box>
                  </Box>

                  {loadingTemplates ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {templates.map((template) => (
                        <ListItem key={template._id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                          <ListItemText
                            primary={template.name}
                            secondary={template.description}
                          />
                          <ListItemSecondaryAction>
                            <IconButton size="small" onClick={() => exportTemplate(template._id)}>
                              📤
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={4}>
                {/* Reports */}
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Generated Reports</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant={reportViewMode === 'generated' ? 'contained' : 'outlined'}
                        onClick={() => setReportViewMode('generated')}
                      >
                        Generated
                      </Button>
                      <Button 
                        size="small"
                        variant={reportViewMode === 'exported' ? 'contained' : 'outlined'}
                        onClick={() => setReportViewMode('exported')}
                      >
                        Exported
                      </Button>
                      <Button 
                        size="small"
                        variant={reportViewMode === 'favorites' ? 'contained' : 'outlined'}
                        onClick={() => setReportViewMode('favorites')}
                      >
                        Favorites
                      </Button>
                    </Box>
                  </Box>

                  {loadingReports || loadingExportedReports ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {(reportViewMode === 'generated' ? userReports : exportedReports).map((report) => (
                        <ListItem key={report._id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                          <ListItemText
                            primary={report.metadata?.title || report.templateName || 'Untitled Report'}
                            secondary={report.createdAt || report.generatedAt || report.timestamp ? 
                              new Date(report.createdAt || report.generatedAt || report.timestamp).toLocaleString() : 
                              'Date not available'}
                          />
                          <ListItemSecondaryAction>
                            <IconButton size="small" onClick={() => viewReport(report._id)}>
                              👁️
                            </IconButton>
                            {reportViewMode === 'generated' && (
                              <IconButton size="small" onClick={() => exportGeneratedReport(report._id)}>
                                📤
                              </IconButton>
                            )}
                            {reportViewMode === 'exported' && (
                              <IconButton size="small" onClick={() => deleteExportedReport(report._id)}>
                                🗑️
                              </IconButton>
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={5}>
                {/* Metrics */}
                <Stack spacing={3}>
                  <Typography variant="h6">Usage Metrics</Typography>
                  
                  {loadingMetrics ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : usageMetrics ? (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">Total Sessions</Typography>
                          <Typography variant="h4">{usageMetrics.totalSessions || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">Total Requests</Typography>
                          <Typography variant="h4">{usageMetrics.totalRequests || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">Avg Requests/Session</Typography>
                          <Typography variant="h4">{usageMetrics.averageRequestsPerSession?.toFixed(1) || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">Current Provider</Typography>
                          <Typography variant="h6">{usageMetrics.currentProvider || 'None'}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">No metrics available</Typography>
                  )}

                  <Box sx={{ mt: 3 }}>
                    <Button variant="outlined" onClick={() => exportUsageData()}>
                      Export Usage Data
                    </Button>
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={6}>
                {/* Advanced Settings */}
                <Stack spacing={3}>
                  <Typography variant="h6">Advanced Settings</Typography>
                  
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>MongoDB Connection String</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={settings?.mongodb?.uri || ''}
                      onChange={(e) => handleSettingsUpdate({
                        ...settings,
                        mongodb: { ...(settings?.mongodb || {}), uri: e.target.value }
                      })}
                      placeholder="mongodb://localhost:27017/auracle"
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>Processing Buffer Size (ms)</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={settings?.processing?.bufferSize || 5000}
                      onChange={(e) => handleSettingsUpdate({
                        ...settings,
                        processing: { ...(settings?.processing || {}), bufferSize: parseInt(e.target.value) }
                      })}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>Max Transcript Length</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={settings?.limits?.transcriptLength || 10000}
                      onChange={(e) => handleSettingsUpdate({
                        ...settings,
                        limits: { ...(settings?.limits || {}), transcriptLength: parseInt(e.target.value) }
                      })}
                    />
                  </Box>
                </Stack>
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSettings(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}


        {/* Post-Recording Report Generation Dialog */}
        {showTemplateSelection && (
          <Dialog
            open={showTemplateSelection}
            onClose={() => setShowTemplateSelection(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
              }
            }}
          >
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #13AA52 0%, #1CC45F 100%)',
              color: 'white',
              py: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  📋 Generate Your Report
                </Typography>
                <Chip 
                  label={`${transcript.split(' ').length} words captured`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500
                  }} 
                />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Transform your conversation into a comprehensive report using AI-powered templates
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                {/* RAG Enhancement Status */}
                {settings?.rag?.enabled && (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <AlertTitle>🧠 RAG Enhancement Active</AlertTitle>
                    Your report will be enhanced with insights from {ragDocuments.length} knowledge documents
                  </Alert>
                )}

                {/* Quick Stats */}
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="h4">{topics.length}</Typography>
                      <Typography variant="body2">Topics Identified</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                      <Typography variant="h4">{Math.ceil(transcript.split(' ').length / 250)}</Typography>
                      <Typography variant="body2">Minutes Recorded</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                      <Typography variant="h4">{templates.length}</Typography>
                      <Typography variant="body2">Templates Available</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Template Selection */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Choose a Report Template
                  </Typography>
                  {loadingTemplates ? (
                    <CircularProgress />
                  ) : templates.length === 0 ? (
                    <Alert severity="warning">No templates available. Please create a template first.</Alert>
                  ) : (
                    <Grid container spacing={2}>
                      {templates.map((template) => (
                        <Grid item xs={12} sm={6} key={template._id}>
                          <Card 
                            sx={{ 
                              p: 2, 
                              cursor: 'pointer',
                              border: selectedTemplate?._id === template._id ? '2px solid' : '1px solid',
                              borderColor: selectedTemplate?._id === template._id ? 'primary.main' : 'divider',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 2
                              }
                            }}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Box sx={{ 
                                width: 48, 
                                height: 48, 
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: selectedTemplate?._id === template._id ? 'primary.main' : 'primary.light',
                                color: 'white',
                                fontSize: '24px'
                              }}>
                                {template.icon || (
                                  template.category === 'Technology' ? '💻' :
                                  template.category === 'interview' ? '🎤' : 
                                  template.category === 'meeting' ? '📅' : 
                                  template.category === 'research' ? '🔬' : 
                                  template.category === 'Business' ? '💼' : '📄'
                                )}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {template.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {template.description}
                                </Typography>
                                <Chip 
                                  label={template.category} 
                                  size="small" 
                                  sx={{ mt: 0.5 }}
                                  color={selectedTemplate?._id === template._id ? 'primary' : 'default'}
                                />
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowTemplateSelection(false)}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      if (selectedTemplate) {
                        generateReport(selectedTemplate._id);
                        setShowTemplateSelection(false);
                      }
                    }}
                    disabled={!selectedTemplate || generatingReport}
                    size="large"
                    sx={{ px: 4 }}
                    startIcon={generatingReport ? <CircularProgress size={20} /> : '✨'}
                  >
                    {generatingReport ? 'Generating...' : 'Generate Report'}
                  </Button>
                </Box>
              </Stack>
            </DialogContent>
          </Dialog>
        )}

        {/* Report Viewer Dialog */}
        {showReportDialog && generatedReport && (
          <Dialog
            open={showReportDialog}
            onClose={() => setShowReportDialog(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                height: '90vh',
                maxHeight: '90vh'
              }
            }}
          >
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">
                  📄 {generatedReport.metadata?.title || 'Generated Report'}
                </Typography>
                <Chip 
                  label={generatedReport.template?.name || 'Report'} 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
              <IconButton
                size="small"
                onClick={() => setShowReportDialog(false)}
                sx={{ color: 'white' }}
              >
                ✕
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0, height: 'calc(100% - 120px)', overflow: 'auto' }}>
              <Box sx={{ p: 4, bgcolor: 'background.default' }}>
                <Paper sx={{ p: 4, maxWidth: '900px', mx: 'auto' }}>
                  <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      Generated on {generatedReport.generatedAt ? new Date(generatedReport.generatedAt).toLocaleString() : 'Just now'}
                    </Typography>
                  </Box>
                  
                  {/* Render Markdown content */}
                  <Box sx={{ 
                    '& h1': { fontSize: '2rem', fontWeight: 600, mt: 3, mb: 2 },
                    '& h2': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 2 },
                    '& h3': { fontSize: '1.25rem', fontWeight: 500, mt: 2, mb: 1 },
                    '& p': { mb: 1.5, lineHeight: 1.6 },
                    '& ul, & ol': { mb: 2, pl: 3 },
                    '& li': { mb: 0.5 },
                    '& blockquote': { 
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      pl: 2,
                      ml: 0,
                      fontStyle: 'italic',
                      color: 'text.secondary'
                    },
                    '& code': { 
                      bgcolor: 'grey.100',
                      p: 0.5,
                      borderRadius: 0.5,
                      fontFamily: 'monospace',
                      fontSize: '0.9em'
                    },
                    '& pre': {
                      bgcolor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      overflow: 'auto',
                      mb: 2,
                      '& code': {
                        bgcolor: 'transparent',
                        p: 0
                      }
                    },
                    '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 2,
                      '& th, & td': {
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1
                      },
                      '& th': {
                        bgcolor: 'grey.100',
                        fontWeight: 600
                      }
                    },
                    '& a': {
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }
                  }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {generatedReport.content}
                    </ReactMarkdown>
                  </Box>
                </Paper>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Button onClick={() => setShowReportDialog(false)}>
                Close
              </Button>
              <Button 
                variant="contained" 
                startIcon="📤"
                onClick={async () => {
                  if (generatedReport.id) {
                    await exportGeneratedReport(generatedReport.id);
                  }
                }}
              >
                Export Report
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Box>
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
); 
```

# app/renderer/menuHandlers.js

```js
// Menu event handlers for the renderer process

export function setupMenuHandlers() {
  // Check if require is available (old API)
  if (!window.require) {
    console.warn('window.require not available, menu handlers not initialized');
    return;
  }

  const { ipcRenderer } = window.require('electron');
  
  // File menu handlers
  ipcRenderer.on('new-session', () => {
    if (confirm('Start a new session? Current session will be saved.')) {
      window.dispatchEvent(new CustomEvent('new-session'));
    }
  });

  ipcRenderer.on('save-session', () => {
    window.dispatchEvent(new CustomEvent('save-session'));
  });

  ipcRenderer.on('save-session-as', () => {
    window.dispatchEvent(new CustomEvent('save-session-as'));
  });

  ipcRenderer.on('open-session', () => {
    window.dispatchEvent(new CustomEvent('open-session'));
  });

  ipcRenderer.on('export-markdown', () => {
    window.dispatchEvent(new CustomEvent('export-markdown'));
  });

  ipcRenderer.on('export-pdf', () => {
    window.dispatchEvent(new CustomEvent('export-pdf'));
  });

  ipcRenderer.on('export-docx', () => {
    window.dispatchEvent(new CustomEvent('export-docx'));
  });

  ipcRenderer.on('export-transcript', () => {
    window.dispatchEvent(new CustomEvent('export-transcript'));
  });

  // Edit menu handlers
  ipcRenderer.on('show-find', () => {
    window.dispatchEvent(new CustomEvent('show-find'));
  });

  ipcRenderer.on('edit-transcript', () => {
    window.dispatchEvent(new CustomEvent('edit-transcript'));
  });

  ipcRenderer.on('add-note', () => {
    window.dispatchEvent(new CustomEvent('add-note'));
  });

  ipcRenderer.on('add-timestamp', () => {
    window.dispatchEvent(new CustomEvent('add-timestamp'));
  });

  // View menu handlers
  ipcRenderer.on('toggle-recording-controls', () => {
    window.dispatchEvent(new CustomEvent('toggle-recording-controls'));
  });

  ipcRenderer.on('toggle-live-transcript', () => {
    window.dispatchEvent(new CustomEvent('toggle-live-transcript'));
  });

  ipcRenderer.on('toggle-insights', () => {
    window.dispatchEvent(new CustomEvent('toggle-insights'));
  });

  ipcRenderer.on('toggle-captions', () => {
    window.dispatchEvent(new CustomEvent('toggle-captions'));
  });

  ipcRenderer.on('show-debug-info', () => {
    window.dispatchEvent(new CustomEvent('show-debug-info'));
  });

  // Tools menu handlers
  ipcRenderer.on('generate-report', () => {
    window.dispatchEvent(new CustomEvent('generate-report'));
  });

  ipcRenderer.on('analyze-patterns', () => {
    window.dispatchEvent(new CustomEvent('analyze-patterns'));
  });

  ipcRenderer.on('check-best-practices', () => {
    window.dispatchEvent(new CustomEvent('check-best-practices'));
  });

  ipcRenderer.on('analyze-schema', () => {
    window.dispatchEvent(new CustomEvent('analyze-schema'));
  });

  ipcRenderer.on('test-ai-connection', () => {
    window.dispatchEvent(new CustomEvent('test-ai-connection'));
  });

  // Help menu handlers
  ipcRenderer.on('show-keyboard-shortcuts', () => {
    window.dispatchEvent(new CustomEvent('show-keyboard-shortcuts'));
  });

  ipcRenderer.on('show-about', () => {
    window.dispatchEvent(new CustomEvent('show-about'));
  });

  ipcRenderer.on('start-tutorial', () => {
    window.dispatchEvent(new CustomEvent('start-tutorial'));
  });

  // Context menu handlers
  ipcRenderer.on('analyze-as-schema', (data) => {
    window.dispatchEvent(new CustomEvent('analyze-as-schema', { detail: data }));
  });

  ipcRenderer.on('analyze-as-query', (data) => {
    window.dispatchEvent(new CustomEvent('analyze-as-query', { detail: data }));
  });

  ipcRenderer.on('research-topic', (data) => {
    window.dispatchEvent(new CustomEvent('research-topic', { detail: data }));
  });

  ipcRenderer.on('add-to-notes', (data) => {
    window.dispatchEvent(new CustomEvent('add-to-notes', { detail: data }));
  });

  ipcRenderer.on('create-action-item', (data) => {
    window.dispatchEvent(new CustomEvent('create-action-item', { detail: data }));
  });

  ipcRenderer.on('add-note-at-position', (data) => {
    window.dispatchEvent(new CustomEvent('add-note-at-position', { detail: data }));
  });

  ipcRenderer.on('insert-timestamp', () => {
    window.dispatchEvent(new CustomEvent('insert-timestamp'));
  });
}

// Helper function to show keyboard shortcuts
export function showKeyboardShortcuts() {
  const shortcuts = `
    <h3>Keyboard Shortcuts</h3>
    
    <h4>File Operations</h4>
    <ul>
      <li><kbd>Cmd/Ctrl + N</kbd> - New Session</li>
      <li><kbd>Cmd/Ctrl + O</kbd> - Open Session</li>
      <li><kbd>Cmd/Ctrl + S</kbd> - Save Session</li>
      <li><kbd>Cmd/Ctrl + Shift + S</kbd> - Save Session As</li>
      <li><kbd>Cmd/Ctrl + Shift + E</kbd> - Export as Markdown</li>
    </ul>
    
    <h4>Recording Controls</h4>
    <ul>
      <li><kbd>Space</kbd> - Start/Stop Recording</li>
      <li><kbd>P</kbd> - Pause/Resume Recording</li>
      <li><kbd>Cmd/Ctrl + R</kbd> - Toggle Recording Controls</li>
    </ul>
    
    <h4>View Controls</h4>
    <ul>
      <li><kbd>Cmd/Ctrl + L</kbd> - Toggle Live Transcript</li>
      <li><kbd>Cmd/Ctrl + I</kbd> - Toggle Insights Panel</li>
      <li><kbd>Cmd/Ctrl + K</kbd> - Toggle Captions</li>
      <li><kbd>Cmd/Ctrl + Plus</kbd> - Zoom In</li>
      <li><kbd>Cmd/Ctrl + Minus</kbd> - Zoom Out</li>
      <li><kbd>Cmd/Ctrl + 0</kbd> - Reset Zoom</li>
      <li><kbd>F11 / Ctrl+Cmd+F</kbd> - Full Screen</li>
    </ul>
    
    <h4>Edit Operations</h4>
    <ul>
      <li><kbd>Cmd/Ctrl + F</kbd> - Find</li>
      <li><kbd>Cmd/Ctrl + E</kbd> - Edit Transcript</li>
      <li><kbd>Cmd/Ctrl + Shift + N</kbd> - Add Note</li>
      <li><kbd>Cmd/Ctrl + T</kbd> - Add Timestamp</li>
    </ul>
    
    <h4>Tools</h4>
    <ul>
      <li><kbd>Cmd/Ctrl + G</kbd> - Generate Report</li>
      <li><kbd>Cmd/Ctrl + ,</kbd> - Preferences</li>
    </ul>
    
    <h4>Developer</h4>
    <ul>
      <li><kbd>Cmd/Ctrl + Shift + I</kbd> - Developer Tools</li>
      <li><kbd>Cmd/Ctrl + Shift + R</kbd> - Reload (Dev Mode)</li>
    </ul>
  `;
  
  return shortcuts;
}
```

# app/renderer/package.json

```json
{
  "name": "mongodb-design-review-scribe-renderer",
  "version": "1.0.0",
  "main": "index.jsx",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@mui/material": "^5.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  }
} 
```

# app/services/aiResearchAgent.js

```js
// AI-Powered Research Agent
// Provides intelligent, context-aware research capabilities
const { generateCompletion } = require('./llmProviders');
const { trackRequest } = require('./usageTracker');
const EventEmitter = require('events');

class AIResearchAgent extends EventEmitter {
  constructor() {
    super();
    this.conversationContext = [];
    this.researchHistory = [];
    this.userPreferences = this.loadUserPreferences();
  }

  // Analyze conversation context to understand research needs
  async analyzeContext(transcript, currentTopics, previousResearch) {
    const prompt = `You are an expert research assistant. Analyze this conversation and determine the most valuable research directions.

CONVERSATION TRANSCRIPT:
${transcript.slice(-500)} // Last 500 chars for context

CURRENT TOPICS:
${currentTopics.map(t => `- ${t}`).join('\n')}

PREVIOUS RESEARCH:
${previousResearch.slice(-3).map(r => `- ${r.topic}: ${r.sources.length} sources`).join('\n')}

Based on the conversation context:
1. What are the most important aspects to research?
2. What type of information would be most valuable (technical details, examples, comparisons, tutorials)?
3. What knowledge gaps need to be filled?
4. What follow-up questions might the user have?

Respond with a JSON object:
{
  "primaryFocus": "main research focus",
  "researchQueries": ["specific search query 1", "specific search query 2", ...],
  "informationType": "technical|tutorial|comparison|explanation|current_events|academic",
  "knowledgeGaps": ["gap 1", "gap 2"],
  "suggestedFollowUps": ["follow-up question 1", "follow-up question 2"],
  "contextSummary": "brief summary of what the conversation is about"
}`

    try {
      const response = await generateCompletion(prompt, { 
        temperature: 0.3,
        format: 'json'
      });
      
      // Track usage
      trackRequest('researchAnalysis', 
        this.estimateTokens(prompt), 
        this.estimateTokens(response),
        'ai-research',
        'context-analysis'
      );

      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing context:', error);
      return this.getFallbackAnalysis(currentTopics);
    }
  }

  // Generate intelligent research queries based on context
  async generateResearchQueries(topic, context, informationType) {
    // Skip invalid topics
    if (!topic || topic.length < 2 || 
        topic.includes('BLANK_AUDIO') || 
        topic.includes('NULL') || 
        topic.includes('UNDEFINED')) {
      console.log('Skipping query generation for invalid topic:', topic);
      return [{ 
        query: 'general information', 
        purpose: 'Fallback query',
        sourceType: 'general'
      }];
    }

    const prompt = `Generate highly specific search queries for researching "${topic}".

Context: ${context.contextSummary || 'General discussion'}
Information Type Needed: ${informationType}
User Expertise Level: ${this.userPreferences.expertiseLevel || 'intermediate'}

Generate 5 search queries that will find the most relevant and valuable information.
Consider different angles: technical documentation, tutorials, comparisons, recent developments, best practices.

Respond with a JSON array of query objects:
[
  {
    "query": "specific search query",
    "purpose": "what this query will find",
    "sourceType": "academic|technical|news|tutorial|general"
  }
]`;

    try {
      const response = await generateCompletion(prompt, {
        temperature: 0.4,
        format: 'json'
      });
      
      const parsed = JSON.parse(response);
      
      // Handle both array and object responses
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed.queries && Array.isArray(parsed.queries)) {
        return parsed.queries;
      } else {
        console.log('Unexpected query response format:', parsed);
        return [{ 
          query: topic, 
          purpose: 'General information',
          sourceType: 'general'
        }];
      }
    } catch (error) {
      console.error('Error generating queries:', error);
      return [{ 
        query: topic, 
        purpose: 'General information',
        sourceType: 'general'
      }];
    }
  }

  // Synthesize research results into coherent insights
  async synthesizeResearch(topic, searchResults, context) {
    if (!searchResults || searchResults.length === 0) {
      console.log('No search results to synthesize for topic:', topic);
      return null;
    }

    // Skip synthesis for invalid topics
    if (!topic || topic.length < 2 || 
        topic.includes('BLANK_AUDIO') || 
        topic.includes('NULL') || 
        topic.includes('UNDEFINED')) {
      console.log('Skipping synthesis for invalid topic:', topic);
      return null;
    }

    const prompt = `You are a research synthesis expert. Analyze these search results and create a comprehensive insight.

TOPIC: ${topic}
CONTEXT: ${context.contextSummary || 'General research'}

SEARCH RESULTS:
${searchResults.map((r, i) => `
Source ${i + 1}: ${r.source}
Title: ${r.title}
Summary: ${r.summary}
URL: ${r.url}
`).join('\n')}

Create a synthesized insight that:
1. Combines information from multiple sources
2. Highlights key points relevant to the context
3. Identifies any conflicting information
4. Suggests areas for deeper exploration
5. Provides practical takeaways

Respond with a JSON object:
{
  "synthesis": "comprehensive summary combining all sources",
  "keyPoints": ["key point 1", "key point 2", ...],
  "conflicts": ["any conflicting information"],
  "practicalTakeaways": ["actionable insight 1", "actionable insight 2"],
  "deeperExploration": ["suggested follow-up topic 1", "suggested follow-up topic 2"],
  "confidence": "high|medium|low",
  "sourcesUsed": [0, 1, 2] // indices of sources that contributed
}`;

    try {
      const response = await generateCompletion(prompt, {
        temperature: 0.2,
        format: 'json'
      });

      const synthesis = JSON.parse(response);
      
      // Track usage
      trackRequest('researchSynthesis',
        this.estimateTokens(prompt),
        this.estimateTokens(response),
        'ai-research',
        'synthesis'
      );

      return synthesis;
    } catch (error) {
      console.error('Error synthesizing research:', error);
      return null;
    }
  }

  // Evaluate source credibility
  async evaluateCredibility(source, content) {
    const prompt = `Evaluate the credibility of this information source.

SOURCE: ${source.source}
TITLE: ${source.title}
URL: ${source.url}
CONTENT PREVIEW: ${source.summary}

Evaluate based on:
1. Source reputation
2. Content quality
3. Recency (if applicable)
4. Objectivity
5. Evidence/citations

Respond with JSON:
{
  "credibilityScore": 0-100,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "biasIndicators": ["potential bias 1"],
  "recommendation": "highly reliable|generally reliable|use with caution|unreliable"
}`;

    try {
      const response = await generateCompletion(prompt, {
        temperature: 0.2,
        format: 'json'
      });

      return JSON.parse(response);
    } catch (error) {
      console.error('Error evaluating credibility:', error);
      return {
        credibilityScore: 50,
        strengths: ['Source available'],
        weaknesses: ['Unable to verify'],
        biasIndicators: [],
        recommendation: 'use with caution'
      };
    }
  }

  // Generate follow-up questions based on research
  async generateFollowUpQuestions(topic, research, context) {
    // Handle null or undefined research
    if (!research) {
      console.log('No research data provided for follow-up questions');
      return [];
    }

    const prompt = `Based on this research, generate insightful follow-up questions.

TOPIC: ${topic}
RESEARCH SUMMARY: ${research.synthesis || 'Research conducted on ' + topic}
KEY POINTS: ${research.keyPoints?.join(', ') || 'Various aspects explored'}

Generate 3-5 follow-up questions that:
1. Explore deeper aspects
2. Clarify important points
3. Connect to related topics
4. Address practical applications

Return as JSON array of strings.`;

    try {
      const response = await generateCompletion(prompt, {
        temperature: 0.5,
        format: 'json'
      });

      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      return [];
    }
  }

  // Identify knowledge gaps
  async identifyKnowledgeGaps(topics, researchDone) {
    const prompt = `Identify knowledge gaps in the current research.

TOPICS DISCUSSED: ${topics.join(', ')}
RESEARCH COMPLETED: ${researchDone.map(r => r.topic).join(', ')}

What important related topics or aspects haven't been researched yet?
What connections between topics should be explored?

Return as JSON:
{
  "gaps": ["gap 1", "gap 2"],
  "connections": ["connection to explore 1"],
  "recommendations": ["recommended research area 1"]
}`;

    try {
      const response = await generateCompletion(prompt, {
        temperature: 0.4,
        format: 'json'
      });

      return JSON.parse(response);
    } catch (error) {
      console.error('Error identifying gaps:', error);
      return { gaps: [], connections: [], recommendations: [] };
    }
  }

  // Create research brief
  async createResearchBrief(topic, allResearch) {
    const prompt = `Create an executive research brief on "${topic}".

RESEARCH DATA:
${JSON.stringify(allResearch, null, 2).slice(0, 2000)}

Create a professional brief with:
1. Executive Summary (2-3 sentences)
2. Key Findings (bullet points)
3. Implications
4. Recommendations
5. Areas for Further Research

Format as JSON with these sections.`;

    try {
      const response = await generateCompletion(prompt, {
        temperature: 0.3,
        format: 'json'
      });

      return JSON.parse(response);
    } catch (error) {
      console.error('Error creating brief:', error);
      return null;
    }
  }

  // Helper methods
  estimateTokens(text) {
    return Math.ceil(text.length / 4);
  }

  getFallbackAnalysis(topics) {
    return {
      primaryFocus: topics[0] || 'general research',
      researchQueries: topics.slice(0, 3),
      informationType: 'general',
      knowledgeGaps: [],
      suggestedFollowUps: [],
      contextSummary: 'General research on provided topics'
    };
  }

  loadUserPreferences() {
    // TODO: Load from persistent storage
    return {
      expertiseLevel: 'intermediate',
      preferredSources: ['academic', 'technical', 'tutorial'],
      detailLevel: 'balanced'
    };
  }

  updateConversationContext(transcript, topics) {
    this.conversationContext.push({
      timestamp: new Date(),
      transcript: transcript.slice(-500),
      topics
    });

    // Keep only last 10 entries
    if (this.conversationContext.length > 10) {
      this.conversationContext.shift();
    }
  }

  addToHistory(research) {
    this.researchHistory.push({
      timestamp: new Date(),
      ...research
    });

    // Keep only last 50 entries
    if (this.researchHistory.length > 50) {
      this.researchHistory.shift();
    }
  }
}

// Create singleton instance
const aiResearchAgent = new AIResearchAgent();

module.exports = {
  aiResearchAgent,
  analyzeContext: (transcript, topics, research) => 
    aiResearchAgent.analyzeContext(transcript, topics, research),
  generateResearchQueries: (topic, context, type) => 
    aiResearchAgent.generateResearchQueries(topic, context, type),
  synthesizeResearch: (topic, results, context) => 
    aiResearchAgent.synthesizeResearch(topic, results, context),
  evaluateCredibility: (source, content) => 
    aiResearchAgent.evaluateCredibility(source, content),
  generateFollowUpQuestions: (topic, research, context) =>
    aiResearchAgent.generateFollowUpQuestions(topic, research, context),
  identifyKnowledgeGaps: (topics, research) =>
    aiResearchAgent.identifyKnowledgeGaps(topics, research),
  createResearchBrief: (topic, research) =>
    aiResearchAgent.createResearchBrief(topic, research)
};
```

# app/services/insightGenerator.js

```js
const { generateCompletion } = require('./llmProviders');

class InsightGenerator {
  constructor() {
    this.insightTypes = {
      CONTRADICTION: 'contradiction',
      JARGON: 'jargon',
      SUGGESTION: 'suggestion',
      EXAMPLE: 'example',
      COUNTERPOINT: 'counterpoint',
      STRATEGIC: 'strategic',
      PERSPECTIVE: 'perspective',
      QUESTION: 'question'
    };

    this.prompts = this.initializePrompts();
    this.cache = new Map();
    this.confidenceThreshold = 0.7;
  }

  initializePrompts() {
    return {
      [this.insightTypes.CONTRADICTION]: `Analyze this conversation for contradictions or inconsistencies:

RECENT CONTEXT: {recentContext}
NEW STATEMENT: {newStatement}

Identify any contradictions between what was said before and now. Consider:
- Factual inconsistencies
- Changed opinions or positions
- Conflicting data or numbers
- Logical contradictions

If found, explain the contradiction clearly and suggest clarification questions.
Respond with JSON: {"found": boolean, "contradiction": "description", "clarification": "question", "confidence": 0.0-1.0}`,

      [this.insightTypes.JARGON]: `Identify technical terms or jargon in this text that may need explanation:

TEXT: {text}

For each term found:
1. Provide a simple, one-sentence explanation
2. Give a relatable analogy if helpful
3. Rate complexity (1-5)

Focus on terms that are industry-specific or highly technical.
Respond with JSON: {"terms": [{"term": "word", "explanation": "simple explanation", "analogy": "optional", "complexity": 1-5}]}`,

      [this.insightTypes.SUGGESTION]: `Based on this conversation segment, suggest actionable improvements or opportunities:

CONTEXT: {context}
CURRENT DISCUSSION: {text}

Provide 2-3 specific, actionable suggestions that could:
- Improve the discussed approach
- Address potential issues
- Leverage opportunities mentioned
- Enhance outcomes

Respond with JSON: {"suggestions": [{"title": "brief title", "description": "detailed suggestion", "rationale": "why this helps", "confidence": 0.0-1.0}]}`,

      [this.insightTypes.EXAMPLE]: `Find relevant examples or case studies for this discussion:

TOPIC: {topic}
CONTEXT: {context}

Suggest 1-2 relevant examples that would illustrate or support the points being discussed:
- Real-world case studies
- Historical precedents
- Industry examples
- Analogous situations

Respond with JSON: {"examples": [{"title": "example name", "description": "brief description", "relevance": "how it applies", "source": "where to find more info", "confidence": 0.0-1.0}]}`,

      [this.insightTypes.COUNTERPOINT]: `Generate thoughtful counterpoints or alternative perspectives:

CURRENT POSITION: {position}
CONTEXT: {context}

Identify 1-2 legitimate counterarguments or alternative viewpoints that should be considered:
- Different approaches
- Potential risks or downsides
- Alternative interpretations
- Missing considerations

Respond with JSON: {"counterpoints": [{"perspective": "alternative view", "reasoning": "supporting logic", "implications": "what this means", "confidence": 0.0-1.0}]}`,

      [this.insightTypes.STRATEGIC]: `Analyze this discussion for strategic implications:

DISCUSSION: {text}
BUSINESS CONTEXT: {context}

Identify strategic opportunities, risks, or considerations:
- Market implications
- Competitive advantages/disadvantages
- Resource requirements
- Timeline considerations
- Success metrics

Respond with JSON: {"strategic_insights": [{"type": "opportunity|risk|consideration", "insight": "description", "impact": "potential impact", "action": "recommended action", "confidence": 0.0-1.0}]}`,

      [this.insightTypes.PERSPECTIVE]: `Identify missing perspectives or blind spots in this discussion:

DISCUSSION: {text}
PARTICIPANTS: {participants}

What important viewpoints or stakeholders might be missing:
- Underrepresented groups
- Different departments/functions
- External stakeholders
- Alternative approaches
- Long-term vs short-term views

Respond with JSON: {"missing_perspectives": [{"stakeholder": "who is missing", "viewpoint": "their likely perspective", "value": "why this matters", "confidence": 0.0-1.0}]}`,

      [this.insightTypes.QUESTION]: `Generate insightful follow-up questions for this discussion:

DISCUSSION: {text}
KEY TOPICS: {topics}

Create 2-3 thought-provoking questions that would:
- Deepen understanding
- Uncover assumptions
- Explore implications
- Drive decision-making

Respond with JSON: {"questions": [{"question": "the question", "purpose": "what it reveals", "category": "clarifying|strategic|operational|creative", "confidence": 0.0-1.0}]}`
    };
  }

  async generateInsight(type, context, options = {}) {
    const prompt = this.prompts[type];
    if (!prompt) {
      throw new Error(`Unknown insight type: ${type}`);
    }

    // Create cache key
    const cacheKey = `${type}:${this.hashContext(context)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Replace template variables
      const processedPrompt = this.processPromptTemplate(prompt, context);
      
      // Generate completion
      const response = await generateCompletion(processedPrompt);
      const result = JSON.parse(response);

      // Process and validate result
      const insight = this.processInsightResult(type, result, context);
      
      // Cache successful results
      if (insight && insight.confidence >= this.confidenceThreshold) {
        this.cache.set(cacheKey, insight);
        
        // Limit cache size
        if (this.cache.size > 100) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
      }

      return insight;

    } catch (error) {
      console.error(`Error generating ${type} insight:`, error);
      return null;
    }
  }

  processPromptTemplate(prompt, context) {
    let processed = prompt;
    
    // Replace common template variables
    const replacements = {
      '{text}': context.text || '',
      '{recentContext}': context.recentContext || '',
      '{newStatement}': context.newStatement || '',
      '{context}': context.context || '',
      '{topic}': context.topic || '',
      '{position}': context.position || '',
      '{participants}': context.participants || 'participants',
      '{topics}': Array.isArray(context.topics) ? context.topics.join(', ') : (context.topics || '')
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      processed = processed.replace(new RegExp(placeholder, 'g'), value);
    }

    return processed;
  }

  processInsightResult(type, result, originalContext) {
    const baseInsight = {
      type,
      timestamp: Date.now(),
      context: originalContext.text?.slice(-500) || '',
      confidence: 0
    };

    switch (type) {
      case this.insightTypes.CONTRADICTION:
        if (result.found) {
          return {
            ...baseInsight,
            content: result.contradiction,
            action: result.clarification,
            confidence: result.confidence || 0.8
          };
        }
        return null;

      case this.insightTypes.JARGON:
        if (result.terms && result.terms.length > 0) {
          const complexTerms = result.terms.filter(term => term.complexity >= 3);
          if (complexTerms.length > 0) {
            return {
              ...baseInsight,
              content: `${complexTerms.length} technical term(s) explained`,
              details: complexTerms,
              confidence: 0.9
            };
          }
        }
        return null;

      case this.insightTypes.SUGGESTION:
        if (result.suggestions && result.suggestions.length > 0) {
          const highConfidenceSuggestions = result.suggestions.filter(s => s.confidence >= this.confidenceThreshold);
          if (highConfidenceSuggestions.length > 0) {
            return {
              ...baseInsight,
              content: `${highConfidenceSuggestions.length} suggestion(s) for improvement`,
              details: highConfidenceSuggestions,
              confidence: Math.max(...highConfidenceSuggestions.map(s => s.confidence))
            };
          }
        }
        return null;

      case this.insightTypes.EXAMPLE:
        if (result.examples && result.examples.length > 0) {
          const relevantExamples = result.examples.filter(e => e.confidence >= this.confidenceThreshold);
          if (relevantExamples.length > 0) {
            return {
              ...baseInsight,
              content: `${relevantExamples.length} relevant example(s) found`,
              details: relevantExamples,
              confidence: Math.max(...relevantExamples.map(e => e.confidence))
            };
          }
        }
        return null;

      case this.insightTypes.COUNTERPOINT:
        if (result.counterpoints && result.counterpoints.length > 0) {
          const validCounterpoints = result.counterpoints.filter(c => c.confidence >= this.confidenceThreshold);
          if (validCounterpoints.length > 0) {
            return {
              ...baseInsight,
              content: `${validCounterpoints.length} alternative perspective(s) to consider`,
              details: validCounterpoints,
              confidence: Math.max(...validCounterpoints.map(c => c.confidence))
            };
          }
        }
        return null;

      case this.insightTypes.STRATEGIC:
        if (result.strategic_insights && result.strategic_insights.length > 0) {
          const actionableInsights = result.strategic_insights.filter(i => i.confidence >= this.confidenceThreshold);
          if (actionableInsights.length > 0) {
            return {
              ...baseInsight,
              content: `${actionableInsights.length} strategic insight(s) identified`,
              details: actionableInsights,
              confidence: Math.max(...actionableInsights.map(i => i.confidence))
            };
          }
        }
        return null;

      case this.insightTypes.PERSPECTIVE:
        if (result.missing_perspectives && result.missing_perspectives.length > 0) {
          const importantPerspectives = result.missing_perspectives.filter(p => p.confidence >= this.confidenceThreshold);
          if (importantPerspectives.length > 0) {
            return {
              ...baseInsight,
              content: `${importantPerspectives.length} missing perspective(s) identified`,
              details: importantPerspectives,
              confidence: Math.max(...importantPerspectives.map(p => p.confidence))
            };
          }
        }
        return null;

      case this.insightTypes.QUESTION:
        if (result.questions && result.questions.length > 0) {
          const valuableQuestions = result.questions.filter(q => q.confidence >= this.confidenceThreshold);
          if (valuableQuestions.length > 0) {
            return {
              ...baseInsight,
              content: `${valuableQuestions.length} insightful question(s) suggested`,
              details: valuableQuestions,
              confidence: Math.max(...valuableQuestions.map(q => q.confidence))
            };
          }
        }
        return null;

      default:
        return null;
    }
  }

  hashContext(context) {
    // Simple hash function for caching
    const str = JSON.stringify(context);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  async generateMultipleInsights(types, context, options = {}) {
    const promises = types.map(type => 
      this.generateInsight(type, context, options)
        .catch(error => {
          console.error(`Failed to generate ${type} insight:`, error);
          return null;
        })
    );

    const results = await Promise.all(promises);
    return results.filter(result => result !== null);
  }

  getInsightTypeColor(type) {
    const colors = {
      [this.insightTypes.CONTRADICTION]: 'error',
      [this.insightTypes.JARGON]: 'info',
      [this.insightTypes.SUGGESTION]: 'success',
      [this.insightTypes.EXAMPLE]: 'primary',
      [this.insightTypes.COUNTERPOINT]: 'warning',
      [this.insightTypes.STRATEGIC]: 'secondary',
      [this.insightTypes.PERSPECTIVE]: 'info',
      [this.insightTypes.QUESTION]: 'primary'
    };
    return colors[type] || 'default';
  }

  getInsightTypeIcon(type) {
    const icons = {
      [this.insightTypes.CONTRADICTION]: '⚠️',
      [this.insightTypes.JARGON]: '📖',
      [this.insightTypes.SUGGESTION]: '💡',
      [this.insightTypes.EXAMPLE]: '📋',
      [this.insightTypes.COUNTERPOINT]: '🤔',
      [this.insightTypes.STRATEGIC]: '🎯',
      [this.insightTypes.PERSPECTIVE]: '👥',
      [this.insightTypes.QUESTION]: '❓'
    };
    return icons[type] || '💭';
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: 100,
      hitRate: 0 // Could track this if needed
    };
  }
}

module.exports = InsightGenerator;
```

# app/services/knowledgeGraphBuilder.js

```js
const EventEmitter = require('events');

class KnowledgeGraphBuilder extends EventEmitter {
  constructor() {
    super();
    
    this.nodes = new Map(); // topic -> { id, label, weight, category, confidence }
    this.edges = new Map(); // "nodeA-nodeB" -> { weight, type, confidence, timestamps }
    this.categories = new Set(); // track different topic categories
    this.maxNodes = 100; // Limit graph size for performance
    this.decayFactor = 0.95; // Gradually reduce old connection weights
    
    // Start periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.performMaintenance();
    }, 300000); // 5 minutes
  }

  addTopic(topic, category = 'general', confidence = 0.8) {
    const topicKey = topic.toLowerCase();
    
    if (!this.nodes.has(topicKey)) {
      this.nodes.set(topicKey, {
        id: topicKey,
        label: topic,
        weight: 1,
        category,
        confidence,
        firstSeen: Date.now(),
        lastMentioned: Date.now(),
        connections: new Set()
      });
      this.categories.add(category);
    } else {
      // Update existing topic
      const node = this.nodes.get(topicKey);
      node.weight += 1;
      node.lastMentioned = Date.now();
      node.confidence = Math.max(node.confidence, confidence);
    }

    this.emit('topic-added', { topic: topicKey, category, confidence });
    return topicKey;
  }

  addConnection(topicA, topicB, relationshipType = 'related', confidence = 0.8) {
    const keyA = topicA.toLowerCase();
    const keyB = topicB.toLowerCase();
    
    // Ensure both topics exist
    if (!this.nodes.has(keyA)) {
      this.addTopic(topicA);
    }
    if (!this.nodes.has(keyB)) {
      this.addTopic(topicB);
    }

    // Create sorted edge key to avoid duplicates
    const edgeKey = [keyA, keyB].sort().join('→');
    
    if (!this.edges.has(edgeKey)) {
      this.edges.set(edgeKey, {
        source: keyA,
        target: keyB,
        weight: 1,
        type: relationshipType,
        confidence,
        timestamps: [Date.now()],
        strengthening: true
      });
    } else {
      // Strengthen existing connection
      const edge = this.edges.get(edgeKey);
      edge.weight += 1;
      edge.confidence = Math.max(edge.confidence, confidence);
      edge.timestamps.push(Date.now());
      edge.strengthening = true;
      
      // Keep only recent timestamps (last 10)
      if (edge.timestamps.length > 10) {
        edge.timestamps = edge.timestamps.slice(-10);
      }
    }

    // Update node connections
    this.nodes.get(keyA).connections.add(keyB);
    this.nodes.get(keyB).connections.add(keyA);

    this.emit('connection-added', { 
      from: keyA, 
      to: keyB, 
      type: relationshipType, 
      confidence 
    });

    return edgeKey;
  }

  addTopicsFromText(topics, connections = []) {
    // Add all topics first
    const addedTopics = topics.map(topic => {
      const category = this.inferCategory(topic);
      return this.addTopic(topic, category);
    });

    // Add explicit connections
    connections.forEach(conn => {
      this.addConnection(conn.from, conn.to, conn.relationship, conn.confidence || 0.8);
    });

    // Add implicit connections (topics mentioned together)
    for (let i = 0; i < addedTopics.length; i++) {
      for (let j = i + 1; j < addedTopics.length; j++) {
        this.addConnection(addedTopics[i], addedTopics[j], 'co-mentioned', 0.6);
      }
    }

    this.emit('topics-batch-added', { topics: addedTopics, connections });
  }

  inferCategory(topic) {
    const topicLower = topic.toLowerCase();
    
    // Simple categorization based on keywords
    if (topicLower.includes('tech') || topicLower.includes('software') || 
        topicLower.includes('ai') || topicLower.includes('data')) {
      return 'technology';
    }
    
    if (topicLower.includes('business') || topicLower.includes('strategy') || 
        topicLower.includes('market') || topicLower.includes('revenue')) {
      return 'business';
    }
    
    if (topicLower.includes('user') || topicLower.includes('customer') || 
        topicLower.includes('experience') || topicLower.includes('design')) {
      return 'user-experience';
    }
    
    if (topicLower.includes('process') || topicLower.includes('workflow') || 
        topicLower.includes('operations') || topicLower.includes('management')) {
      return 'operations';
    }
    
    return 'general';
  }

  getStrongestConnections(topic, limit = 5) {
    const topicKey = topic.toLowerCase();
    const node = this.nodes.get(topicKey);
    
    if (!node) return [];

    const connections = Array.from(this.edges.values())
      .filter(edge => edge.source === topicKey || edge.target === topicKey)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit)
      .map(edge => ({
        target: edge.source === topicKey ? edge.target : edge.source,
        weight: edge.weight,
        type: edge.type,
        confidence: edge.confidence
      }));

    return connections;
  }

  getTopicsByCategory(category) {
    return Array.from(this.nodes.values())
      .filter(node => node.category === category)
      .sort((a, b) => b.weight - a.weight);
  }

  getMostConnectedTopics(limit = 10) {
    return Array.from(this.nodes.values())
      .sort((a, b) => b.connections.size - a.connections.size)
      .slice(0, limit);
  }

  getRecentlyActiveTopics(timeWindow = 300000, limit = 10) { // 5 minutes
    const now = Date.now();
    return Array.from(this.nodes.values())
      .filter(node => now - node.lastMentioned < timeWindow)
      .sort((a, b) => b.lastMentioned - a.lastMentioned)
      .slice(0, limit);
  }

  findShortestPath(topicA, topicB) {
    const keyA = topicA.toLowerCase();
    const keyB = topicB.toLowerCase();
    
    if (!this.nodes.has(keyA) || !this.nodes.has(keyB)) {
      return null;
    }

    // Simple BFS to find shortest path
    const queue = [[keyA]];
    const visited = new Set([keyA]);

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === keyB) {
        return path.map(key => this.nodes.get(key).label);
      }

      const currentNode = this.nodes.get(current);
      for (const neighbor of currentNode.connections) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return null; // No path found
  }

  getClusterAroundTopic(topic, depth = 2) {
    const topicKey = topic.toLowerCase();
    if (!this.nodes.has(topicKey)) return null;

    const cluster = new Set([topicKey]);
    const toExplore = [{ key: topicKey, level: 0 }];

    while (toExplore.length > 0) {
      const { key, level } = toExplore.shift();
      
      if (level < depth) {
        const node = this.nodes.get(key);
        for (const neighbor of node.connections) {
          if (!cluster.has(neighbor)) {
            cluster.add(neighbor);
            toExplore.push({ key: neighbor, level: level + 1 });
          }
        }
      }
    }

    // Get subgraph
    const clusterNodes = Array.from(cluster).map(key => this.nodes.get(key));
    const clusterEdges = Array.from(this.edges.values())
      .filter(edge => cluster.has(edge.source) && cluster.has(edge.target));

    return {
      centerTopic: topic,
      nodes: clusterNodes,
      edges: clusterEdges,
      size: cluster.size
    };
  }

  getGraphData(options = {}) {
    const {
      minWeight = 1,
      maxNodes = this.maxNodes,
      includeCategories = true,
      timeWindow = null
    } = options;

    let nodes = Array.from(this.nodes.values());
    let edges = Array.from(this.edges.values());

    // Filter by time window if specified
    if (timeWindow) {
      const cutoff = Date.now() - timeWindow;
      nodes = nodes.filter(node => node.lastMentioned > cutoff);
      const validNodeKeys = new Set(nodes.map(n => n.id));
      edges = edges.filter(edge => 
        validNodeKeys.has(edge.source) && validNodeKeys.has(edge.target)
      );
    }

    // Filter by weight
    edges = edges.filter(edge => edge.weight >= minWeight);
    const connectedNodeKeys = new Set();
    edges.forEach(edge => {
      connectedNodeKeys.add(edge.source);
      connectedNodeKeys.add(edge.target);
    });
    nodes = nodes.filter(node => connectedNodeKeys.has(node.id));

    // Limit number of nodes (keep highest weight)
    if (nodes.length > maxNodes) {
      nodes = nodes
        .sort((a, b) => b.weight - a.weight)
        .slice(0, maxNodes);
      
      const validNodeKeys = new Set(nodes.map(n => n.id));
      edges = edges.filter(edge => 
        validNodeKeys.has(edge.source) && validNodeKeys.has(edge.target)
      );
    }

    const result = { nodes, edges };
    
    if (includeCategories) {
      result.categories = Array.from(this.categories);
      result.stats = this.getGraphStats();
    }

    return result;
  }

  getGraphStats() {
    return {
      totalNodes: this.nodes.size,
      totalEdges: this.edges.size,
      categories: Array.from(this.categories).map(cat => ({
        name: cat,
        count: this.getTopicsByCategory(cat).length
      })),
      mostConnected: this.getMostConnectedTopics(5).map(node => ({
        topic: node.label,
        connections: node.connections.size,
        weight: node.weight
      })),
      recentlyActive: this.getRecentlyActiveTopics(300000, 5).map(node => ({
        topic: node.label,
        lastMentioned: node.lastMentioned,
        weight: node.weight
      }))
    };
  }

  performMaintenance() {
    const now = Date.now();
    const oneHour = 3600000;
    const oneDay = 86400000;

    // Decay old connections
    this.edges.forEach((edge, key) => {
      const timeSinceLastUpdate = now - Math.max(...edge.timestamps);
      
      if (timeSinceLastUpdate > oneHour) {
        edge.weight *= this.decayFactor;
        edge.strengthening = false;
        
        // Remove very weak connections
        if (edge.weight < 0.1) {
          this.edges.delete(key);
        }
      }
    });

    // Remove isolated nodes (no connections)
    this.nodes.forEach((node, key) => {
      const hasConnections = Array.from(this.edges.values())
        .some(edge => edge.source === key || edge.target === key);
      
      if (!hasConnections && now - node.lastMentioned > oneDay) {
        this.nodes.delete(key);
      }
    });

    // Limit total size
    if (this.nodes.size > this.maxNodes) {
      const sortedNodes = Array.from(this.nodes.values())
        .sort((a, b) => a.lastMentioned - b.lastMentioned);
      
      const toRemove = sortedNodes.slice(0, this.nodes.size - this.maxNodes);
      toRemove.forEach(node => {
        this.nodes.delete(node.id);
        // Remove edges involving this node
        this.edges.forEach((edge, key) => {
          if (edge.source === node.id || edge.target === node.id) {
            this.edges.delete(key);
          }
        });
      });
    }

    this.emit('maintenance-completed', {
      nodes: this.nodes.size,
      edges: this.edges.size,
      categoriesCount: this.categories.size
    });
  }

  exportGraph() {
    return {
      nodes: Array.from(this.nodes.entries()),
      edges: Array.from(this.edges.entries()),
      categories: Array.from(this.categories),
      timestamp: Date.now()
    };
  }

  importGraph(data) {
    this.clear();
    
    this.nodes = new Map(data.nodes);
    this.edges = new Map(data.edges);
    this.categories = new Set(data.categories);
    
    this.emit('graph-imported', {
      nodes: this.nodes.size,
      edges: this.edges.size
    });
  }

  clear() {
    this.nodes.clear();
    this.edges.clear();
    this.categories.clear();
    this.emit('graph-cleared');
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.removeAllListeners();
    this.clear();
  }
}

module.exports = KnowledgeGraphBuilder;
```

# app/services/llm.js

```js
// LLM Service - Ollama Integration for Topic Extraction
const http = require('http');
const { loadConfig } = require('../config');

class OllamaService {
  constructor() {
    this.config = loadConfig();
    this.endpoint = this.config.llm.endpoint;
    this.model = this.config.llm.model;
  }

  async extractTopics(text) {
    if (!text || text.trim().length < 10) {
      return { topics: [], questions: [] };
    }

    const prompt = `You are analyzing a conversation transcript. Extract the main topics, questions, and unknown terms that would benefit from research.

Conversation transcript:
"${text}"

Respond with a JSON object containing:
1. "topics": array of 1-3 main topics or concepts discussed (short phrases)
2. "questions": array of any questions asked or implied (if any)
3. "terms": array of technical terms or concepts that might need explanation

Be selective - only extract truly important topics worth researching. If the conversation is casual small talk, return empty arrays.

Example response:
{"topics": ["machine learning algorithms", "neural networks"], "questions": ["How does backpropagation work?"], "terms": ["gradient descent", "loss function"]}`;

    try {
      const response = await this.callOllama(prompt);
      return this.parseTopicsResponse(response);
    } catch (error) {
      console.error('Failed to extract topics:', error);
      return { topics: [], questions: [], terms: [] };
    }
  }

  async callOllama(prompt) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.3,
          top_p: 0.9
        }
      });

      const url = new URL(this.endpoint);
      const options = {
        hostname: url.hostname,
        port: url.port || 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.response) {
              resolve(response.response);
            } else {
              reject(new Error('Invalid Ollama response'));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  parseTopicsResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        topics: parsed.topics || [],
        questions: parsed.questions || [],
        terms: parsed.terms || []
      };
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      // Fallback: try to extract topics using simple patterns
      return this.fallbackTopicExtraction(response);
    }
  }

  fallbackTopicExtraction(text) {
    // Simple fallback if JSON parsing fails
    const topics = [];
    const questions = [];
    
    // Look for question marks
    const sentences = text.split(/[.!?]+/);
    sentences.forEach(sentence => {
      if (sentence.includes('?')) {
        questions.push(sentence.trim());
      }
    });

    return { topics, questions, terms: [] };
  }

  async callOllamaSimple(prompt) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        model: this.model,
        prompt: prompt,
        stream: false,
        // No JSON format for simple calls
        options: {
          temperature: 0.3,
          top_p: 0.9
        }
      });

      const url = new URL(this.endpoint);
      const options = {
        hostname: url.hostname,
        port: url.port || 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.response) {
              resolve(response.response);
            } else {
              reject(new Error('Invalid Ollama response'));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  async testConnection() {
    return new Promise((resolve) => {
      console.log('Testing Ollama connection...');
      
      const postData = JSON.stringify({
        model: this.model,
        prompt: 'OK',
        stream: false
      });

      const url = new URL(this.endpoint);
      const options = {
        hostname: url.hostname,
        port: url.port || 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 3000
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const connected = response.response && typeof response.response === 'string';
            console.log('Ollama connection test result:', connected);
            resolve(connected);
          } catch (e) {
            console.error('Ollama response parse error:', e);
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.error('Ollama connection error:', error.message);
        resolve(false);
      });

      req.on('timeout', () => {
        console.error('Ollama connection timeout');
        req.destroy();
        resolve(false);
      });

      req.write(postData);
      req.end();
    });
  }
}

// Create singleton instance
const ollamaService = new OllamaService();

// Export main functions
module.exports = {
  extractTopics: (text) => ollamaService.extractTopics(text),
  testOllamaConnection: () => ollamaService.testConnection()
}; 
```

# app/services/llmProviders.js

```js
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
    return `You are analyzing a conversation transcript. Extract the main topics, questions, and unknown terms that would benefit from research.

Conversation transcript:
"${text}"

Respond with a JSON object containing:
1. "topics": array of 1-3 main topics or concepts discussed (short phrases)
2. "questions": array of any questions asked or implied (if any)
3. "terms": array of technical terms or concepts that might need explanation

Be selective - only extract truly important topics worth researching.

Example response:
{"topics": ["machine learning algorithms", "neural networks"], "questions": ["How does backpropagation work?"], "terms": ["gradient descent", "loss function"]}`;
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
        terms: parsed.terms || []
      };
    } catch (error) {
      console.error('Failed to parse topics response:', error);
      return { topics: [], questions: [], terms: [] };
    }
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
```

# app/services/localTemplateStorage.js

```js
// Local Template Storage - Fallback for when MongoDB is not available
const fs = require('fs');
const path = require('path');
const os = require('os');

class LocalTemplateStorage {
  constructor() {
    this.dataDir = path.join(os.homedir(), '.research-companion');
    this.templatesFile = path.join(this.dataDir, 'local-templates.json');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  loadTemplates() {
    try {
      if (fs.existsSync(this.templatesFile)) {
        const data = fs.readFileSync(this.templatesFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading local templates:', error);
    }
    return [];
  }

  saveTemplates(templates) {
    try {
      fs.writeFileSync(this.templatesFile, JSON.stringify(templates, null, 2));
    } catch (error) {
      console.error('Error saving local templates:', error);
    }
  }

  async createTemplate(template) {
    const templates = this.loadTemplates();
    const newTemplate = {
      ...template,
      _id: Date.now().toString(), // Simple ID generation
      metadata: {
        ...template.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        rating: 0
      }
    };
    
    templates.push(newTemplate);
    this.saveTemplates(templates);
    return newTemplate;
  }

  async getTemplates(filter = {}) {
    const templates = this.loadTemplates();
    
    if (Object.keys(filter).length === 0) {
      return templates;
    }
    
    // Simple filtering (supports name and category)
    return templates.filter(template => {
      if (filter.name && template.name !== filter.name) {
        return false;
      }
      if (filter.category && template.category !== filter.category) {
        return false;
      }
      return true;
    });
  }

  async getTemplateById(id) {
    const templates = this.loadTemplates();
    
    // Normalize the ID for comparison
    let searchId = id;
    if (typeof id === 'object' && id.toString) {
      searchId = id.toString();
    } else if (typeof id !== 'string') {
      searchId = String(id);
    }
    
    return templates.find(template => 
      template._id === searchId || 
      template._id === id ||
      String(template._id) === searchId
    );
  }

  async updateTemplate(id, updates) {
    const templates = this.loadTemplates();
    
    // Normalize the ID for comparison
    let searchId = id;
    if (typeof id === 'object' && id.toString) {
      searchId = id.toString();
    } else if (typeof id !== 'string') {
      searchId = String(id);
    }
    
    const index = templates.findIndex(template => 
      template._id === searchId || 
      template._id === id ||
      String(template._id) === searchId
    );
    
    if (index >= 0) {
      templates[index] = {
        ...templates[index],
        ...updates,
        metadata: {
          ...templates[index].metadata,
          ...updates.metadata,
          updatedAt: new Date().toISOString()
        }
      };
      this.saveTemplates(templates);
      return true;
    }
    return false;
  }

  async deleteTemplate(id) {
    const templates = this.loadTemplates();
    
    // Normalize the ID for comparison
    let searchId = id;
    if (typeof id === 'object' && id.toString) {
      searchId = id.toString();
    } else if (typeof id !== 'string') {
      searchId = String(id);
    }
    
    const filteredTemplates = templates.filter(template => 
      template._id !== searchId && 
      template._id !== id &&
      String(template._id) !== searchId
    );
    
    if (filteredTemplates.length < templates.length) {
      this.saveTemplates(filteredTemplates);
      return true;
    }
    return false;
  }

  async incrementTemplateUsage(id) {
    const templates = this.loadTemplates();
    
    // Normalize the ID for comparison
    let searchId = id;
    if (typeof id === 'object' && id.toString) {
      searchId = id.toString();
    } else if (typeof id !== 'string') {
      searchId = String(id);
    }
    
    const template = templates.find(t => 
      t._id === searchId || 
      t._id === id ||
      String(t._id) === searchId
    );
    
    if (template) {
      template.metadata.usageCount = (template.metadata.usageCount || 0) + 1;
      template.metadata.lastUsedAt = new Date().toISOString();
      this.saveTemplates(templates);
    }
  }
}

// Create singleton instance
const localTemplateStorage = new LocalTemplateStorage();

module.exports = {
  localTemplateStorage,
  // Exported functions that match the MongoDB interface
  createTemplate: (template) => localTemplateStorage.createTemplate(template),
  getTemplates: (filter) => localTemplateStorage.getTemplates(filter),
  getTemplateById: (id) => localTemplateStorage.getTemplateById(id),
  updateTemplate: (id, updates) => localTemplateStorage.updateTemplate(id, updates),
  deleteTemplate: (id) => localTemplateStorage.deleteTemplate(id),
  incrementTemplateUsage: (id) => localTemplateStorage.incrementTemplateUsage(id)
};
```

# app/services/meetingNotes.js

```js
// Meeting Notes Service - AI-powered meeting summarization and action item extraction
const { loadConfig } = require('../config');
const { generateMeetingNotes: generateMeetingNotesWithProvider } = require('./llmProviders');

class MeetingNotesService {
  constructor() {
    this.config = loadConfig();
    this.endpoint = this.config.llm.endpoint;
    this.model = this.config.llm.model;
  }

  async generateMeetingNotes(transcript, topics = [], research = []) {
    console.log('Meeting notes service called with transcript length:', transcript?.length || 0);
    
    if (!transcript || transcript.trim().length < 50) {
      console.log('Transcript too short, returning empty notes');
      return {
        summary: '',
        actionItems: [],
        decisions: [],
        keyPoints: [],
        attendees: [],
        nextSteps: []
      };
    }

    try {
      console.log('Using LLM provider for meeting notes generation...');
      const result = await generateMeetingNotesWithProvider(transcript, topics, research);
      console.log('Meeting notes generated:', result);
      return result;
    } catch (error) {
      console.error('Failed to generate meeting notes:', error);
      return {
        summary: 'Error generating meeting summary',
        actionItems: [],
        decisions: [],
        keyPoints: [],
        attendees: [],
        nextSteps: []
      };
    }
  }


  // Export meeting notes to different formats
  exportToMarkdown(meetingNotes, sessionInfo = {}) {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    let markdown = `# Meeting Notes\n\n`;
    markdown += `**Date:** ${date}\n`;
    markdown += `**Time:** ${time}\n`;
    
    if (meetingNotes.attendees.length > 0) {
      markdown += `**Attendees:** ${meetingNotes.attendees.join(', ')}\n`;
    }
    
    markdown += `\n## Summary\n\n${meetingNotes.summary}\n\n`;
    
    if (meetingNotes.keyPoints.length > 0) {
      markdown += `## Key Discussion Points\n\n`;
      meetingNotes.keyPoints.forEach(point => {
        markdown += `- ${point}\n`;
      });
      markdown += `\n`;
    }
    
    if (meetingNotes.decisions.length > 0) {
      markdown += `## Decisions Made\n\n`;
      meetingNotes.decisions.forEach(decision => {
        markdown += `### ${decision.decision}\n`;
        markdown += `- **Context:** ${decision.context}\n`;
        markdown += `- **Impact:** ${decision.impact}\n\n`;
      });
    }
    
    if (meetingNotes.actionItems.length > 0) {
      markdown += `## Action Items\n\n`;
      meetingNotes.actionItems.forEach((item, index) => {
        markdown += `${index + 1}. **${item.item}**\n`;
        if (item.assignee) markdown += `   - **Assigned to:** ${item.assignee}\n`;
        if (item.deadline) markdown += `   - **Deadline:** ${item.deadline}\n`;
        markdown += `   - **Priority:** ${item.priority}\n\n`;
      });
    }
    
    if (meetingNotes.nextSteps.length > 0) {
      markdown += `## Next Steps\n\n`;
      meetingNotes.nextSteps.forEach(step => {
        markdown += `- ${step}\n`;
      });
    }
    
    return markdown;
  }
}

// Create singleton instance
const meetingNotesService = new MeetingNotesService();

module.exports = {
  generateMeetingNotes: (transcript, topics, research) => 
    meetingNotesService.generateMeetingNotes(transcript, topics, research),
  exportToMarkdown: (meetingNotes, sessionInfo) => 
    meetingNotesService.exportToMarkdown(meetingNotes, sessionInfo)
};
```

# app/services/memoryManager.js

```js
// Memory Management Service for bitscribe
const os = require('os');

class MemoryManager {
  constructor() {
    this.isMonitoring = false;
    this.memoryTimer = null;
    this.warningThreshold = 2000 * 1024 * 1024; // 2GB - much more reasonable
    this.criticalThreshold = 1000 * 1024 * 1024; // 1GB
    this.listeners = [];
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🧠 Memory Manager: Starting monitoring');
    
    // Check memory every 30 seconds to reduce overhead
    this.memoryTimer = setInterval(() => {
      this.checkMemory();
    }, 30000);
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    console.log('🧠 Memory Manager: Stopping monitoring');
    
    if (this.memoryTimer) {
      clearInterval(this.memoryTimer);
      this.memoryTimer = null;
    }
  }

  checkMemory() {
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const usagePercent = (usedMem / totalMem) * 100;

    const memInfo = {
      free: Math.floor(freeMem / 1024 / 1024), // MB
      total: Math.floor(totalMem / 1024 / 1024), // MB
      used: Math.floor(usedMem / 1024 / 1024), // MB
      usagePercent: Math.floor(usagePercent)
    };

    // Emit warnings based on thresholds
    if (freeMem < this.criticalThreshold) {
      this.emitMemoryEvent('critical', memInfo);
      this.forceCleanup();
    } else if (freeMem < this.warningThreshold) {
      this.emitMemoryEvent('warning', memInfo);
      this.performCleanup();
    }

    return memInfo;
  }

  performCleanup() {
    console.log('🧹 Memory Manager: Performing cleanup');
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    this.emitMemoryEvent('cleanup', { type: 'soft' });
  }

  forceCleanup() {
    console.log('🚨 Memory Manager: Performing FORCE cleanup');
    
    // Multiple garbage collection cycles for critical situations
    if (global.gc) {
      global.gc();
      setTimeout(() => global.gc(), 100);
      setTimeout(() => global.gc(), 500);
      setTimeout(() => global.gc(), 1000);
      setTimeout(() => global.gc(), 2000);
    }
    
    // Emergency memory cleanup
    this.emergencyCleanup();
    
    this.emitMemoryEvent('cleanup', { type: 'force' });
  }

  emergencyCleanup() {
    console.log('🆘 Emergency memory cleanup initiated');
    
    try {
      // Clear any large buffers or caches
      if (global.whisperCache) {
        global.whisperCache.clear();
      }
      
      // Clear require cache for non-essential modules (except core modules)
      Object.keys(require.cache).forEach(key => {
        if (key.includes('node_modules') && !key.includes('electron')) {
          try {
            delete require.cache[key];
          } catch (e) {
            // Ignore errors during cleanup
          }
        }
      });
      
      // Force memory reclaim
      if (process.memoryUsage) {
        const usage = process.memoryUsage();
        console.log('📊 Process memory:', {
          rss: Math.floor(usage.rss / 1024 / 1024) + 'MB',
          heapUsed: Math.floor(usage.heapUsed / 1024 / 1024) + 'MB',
          heapTotal: Math.floor(usage.heapTotal / 1024 / 1024) + 'MB'
        });
      }
      
    } catch (error) {
      console.error('Emergency cleanup error:', error);
    }
  }

  onMemoryEvent(callback) {
    this.listeners.push(callback);
  }

  emitMemoryEvent(type, data) {
    this.listeners.forEach(callback => {
      try {
        callback(type, data);
      } catch (error) {
        console.error('Memory event listener error:', error);
      }
    });
  }

  getMemoryStats() {
    const process = require('process');
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const processMemory = process.memoryUsage();

    return {
      system: {
        free: Math.floor(freeMem / 1024 / 1024),
        total: Math.floor(totalMem / 1024 / 1024),
        used: Math.floor((totalMem - freeMem) / 1024 / 1024),
        usagePercent: Math.floor(((totalMem - freeMem) / totalMem) * 100)
      },
      process: {
        rss: Math.floor(processMemory.rss / 1024 / 1024),
        heapTotal: Math.floor(processMemory.heapTotal / 1024 / 1024),
        heapUsed: Math.floor(processMemory.heapUsed / 1024 / 1024),
        external: Math.floor(processMemory.external / 1024 / 1024)
      }
    };
  }

  destroy() {
    this.stopMonitoring();
    this.listeners = [];
  }
}

// Create singleton instance
const memoryManager = new MemoryManager();

module.exports = {
  memoryManager,
  startMemoryMonitoring: () => memoryManager.startMonitoring(),
  stopMemoryMonitoring: () => memoryManager.stopMonitoring(),
  getMemoryStats: () => memoryManager.getMemoryStats(),
  onMemoryEvent: (callback) => memoryManager.onMemoryEvent(callback)
};
```

# app/services/mongoStorage.js

```js
// MongoDB Storage Service - Handles all database operations for templates and reports
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

class MongoStorageService {
  constructor() {
    this.client = null;
    this.db = null;
    this.templates = null;
    this.reports = null;
    this.isConnected = false;
  }

  // Helper method to convert various ID formats to ObjectId
  convertToObjectId(id) {
    try {
      // Handle null/undefined
      if (!id) {
        throw new Error('ID is null or undefined');
      }

      // Log the ID for debugging
      console.log('Converting ID:', typeof id, id);

      // If it's already a string and valid ObjectId format
      if (typeof id === 'string') {
        if (id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
          return new ObjectId(id);
        } else {
          throw new Error(`String ID must be 24 character hex string, got: ${id} (length: ${id.length})`);
        }
      } 
      
      // If it's already an ObjectId
      else if (id instanceof ObjectId) {
        return id;
      } 
      
      // Handle buffer/Uint8Array case
      else if (id && (id.buffer || ArrayBuffer.isView(id) || Array.isArray(id))) {
        let bytes;
        
        if (id.buffer) {
          bytes = Array.from(new Uint8Array(id.buffer));
        } else if (ArrayBuffer.isView(id)) {
          bytes = Array.from(id);
        } else if (Array.isArray(id)) {
          bytes = id;
        }
        
        // ObjectId should be exactly 12 bytes
        if (bytes.length !== 12) {
          throw new Error(`Buffer must be exactly 12 bytes, got: ${bytes.length} bytes`);
        }
        
        const hexString = bytes
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
          
        console.log('Converted buffer to hex:', hexString);
        return new ObjectId(hexString);
      } 
      
      // Handle object with _id property
      else if (id && typeof id === 'object' && id._id) {
        return this.convertToObjectId(id._id);
      }
      
      // Last resort - try to convert to string
      else {
        const stringId = String(id);
        console.log('Converting to string:', stringId);
        
        // Check if String() produced the useless "[object Object]"
        if (stringId === '[object Object]') {
          // Try to extract useful info from the object
          if (id.id) {
            return this.convertToObjectId(id.id);
          } else if (id.toString && typeof id.toString === 'function') {
            const toStringResult = id.toString();
            if (toStringResult !== '[object Object]') {
              return this.convertToObjectId(toStringResult);
            }
          }
          
          // If we can't extract anything useful, show the object structure
          try {
            const objectInfo = JSON.stringify(id, null, 2);
            throw new Error(`Cannot convert object to ID - object structure: ${objectInfo}`);
          } catch (jsonError) {
            throw new Error(`Cannot convert complex object to ID: ${typeof id}`);
          }
        }
        
        return this.convertToObjectId(stringId);
      }
      
    } catch (error) {
      console.error('Error converting ID:', error.message, 'Original ID:', typeof id, id);
      throw new Error(`Invalid ID: ${error.message}`);
    }
  }

  async connect() {
    if (this.isConnected) return;

    try {
      const uri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
      
      if (!uri) {
        console.error('MongoDB URI not found in environment variables');
        throw new Error('MongoDB connection string not configured');
      }

      this.client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });

      await this.client.connect();
      console.log('Connected to MongoDB Atlas');

      // Initialize database and collections
      this.db = this.client.db('auracle');
      this.templates = this.db.collection('templates');
      this.reports = this.db.collection('reports');
      this.exportedReports = this.db.collection('exported_reports');
      this.templateHistory = this.db.collection('template_history');
      this.reportHistory = this.db.collection('report_history');

      // Create indexes
      await this.createIndexes();
      
      this.isConnected = true;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async createIndexes() {
    try {
      // Template indexes
      await this.templates.createIndex({ name: 1 });
      await this.templates.createIndex({ category: 1 });
      await this.templates.createIndex({ 'metadata.createdAt': -1 });
      await this.templates.createIndex({ 'metadata.usageCount': -1 });

      // Report indexes
      await this.reports.createIndex({ sessionId: 1 });
      await this.reports.createIndex({ templateId: 1 });
      await this.reports.createIndex({ generatedAt: -1 });
      
      // Exported reports indexes
      await this.exportedReports.createIndex({ userId: 1 });
      await this.exportedReports.createIndex({ reportId: 1 });
      await this.exportedReports.createIndex({ exportedAt: -1 });
      await this.exportedReports.createIndex({ format: 1 });
      await this.exportedReports.createIndex({ 'metadata.size': 1 });
      
      // Template history indexes
      await this.templateHistory.createIndex({ templateId: 1 });
      await this.templateHistory.createIndex({ version: -1 });
      await this.templateHistory.createIndex({ createdAt: -1 });
      await this.templateHistory.createIndex({ action: 1 });
      
      // Report history indexes
      await this.reportHistory.createIndex({ reportId: 1 });
      await this.reportHistory.createIndex({ action: 1 });
      await this.reportHistory.createIndex({ timestamp: -1 });
      await this.reportHistory.createIndex({ userId: 1 });

      console.log('MongoDB indexes created successfully');
    } catch (error) {
      console.error('Error creating indexes:', error);
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    }
  }

  // Template Operations
  async createTemplate(template) {
    await this.ensureConnected();
    
    const doc = {
      ...template,
      metadata: {
        ...template.metadata,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        rating: 0
      }
    };

    const result = await this.templates.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async getTemplates(filter = {}, options = {}) {
    await this.ensureConnected();
    
    const defaultOptions = {
      sort: { 'metadata.usageCount': -1 },
      limit: 50
    };

    const templates = await this.templates
      .find(filter)
      .sort(options.sort || defaultOptions.sort)
      .limit(options.limit || defaultOptions.limit)
      .toArray();

    return templates;
  }

  async getTemplateById(id) {
    await this.ensureConnected();
    
    const objectId = this.convertToObjectId(id);
    const template = await this.templates.findOne({ 
      _id: objectId 
    });
    
    return template;
  }

  async updateTemplate(id, updates) {
    await this.ensureConnected();
    
    const objectId = this.convertToObjectId(id);
    const result = await this.templates.updateOne(
      { _id: objectId },
      { 
        $set: {
          ...updates,
          'metadata.updatedAt': new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  }

  async deleteTemplate(id) {
    await this.ensureConnected();
    
    const objectId = this.convertToObjectId(id);
    const result = await this.templates.deleteOne({ 
      _id: objectId 
    });
    
    return result.deletedCount > 0;
  }

  async incrementTemplateUsage(id) {
    await this.ensureConnected();
    
    const objectId = this.convertToObjectId(id);
    await this.templates.updateOne(
      { _id: objectId },
      { 
        $inc: { 'metadata.usageCount': 1 },
        $set: { 'metadata.lastUsedAt': new Date() }
      }
    );
  }

  // Report Operations
  async createReport(report) {
    await this.ensureConnected();
    
    const doc = {
      ...report,
      generatedAt: new Date()
    };

    const result = await this.reports.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async getReports(filter = {}, options = {}) {
    await this.ensureConnected();
    
    const defaultOptions = {
      sort: { generatedAt: -1 },
      limit: 50
    };

    const reports = await this.reports
      .find(filter)
      .sort(options.sort || defaultOptions.sort)
      .limit(options.limit || defaultOptions.limit)
      .toArray();

    return reports;
  }

  async getReportById(id) {
    await this.ensureConnected();
    
    const objectId = this.convertToObjectId(id);
    const report = await this.reports.findOne({ 
      _id: objectId 
    });
    
    return report;
  }

  async getReportsBySession(sessionId) {
    await this.ensureConnected();
    
    const reports = await this.reports
      .find({ sessionId })
      .sort({ generatedAt: -1 })
      .toArray();

    return reports;
  }

  async updateReport(id, updates) {
    await this.ensureConnected();
    
    const objectId = this.convertToObjectId(id);
    const result = await this.reports.updateOne(
      { _id: objectId },
      { 
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  }

  async deleteReport(id) {
    await this.ensureConnected();
    
    const objectId = this.convertToObjectId(id);
    const result = await this.reports.deleteOne({ 
      _id: objectId 
    });
    
    return result.deletedCount > 0;
  }

  // Aggregation Operations
  async getTemplateStats() {
    await this.ensureConnected();
    
    const stats = await this.templates.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalUsage: { $sum: '$metadata.usageCount' },
          avgRating: { $avg: '$metadata.rating' }
        }
      },
      {
        $sort: { totalUsage: -1 }
      }
    ]).toArray();

    return stats;
  }

  async getPopularTemplates(limit = 10) {
    await this.ensureConnected();
    
    return await this.getTemplates({}, {
      sort: { 'metadata.usageCount': -1 },
      limit
    });
  }

  // Helper method to ensure connection
  async ensureConnected() {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  // Exported Reports Operations
  async saveExportedReport(exportData) {
    await this.ensureConnected();
    
    const exportRecord = {
      reportId: this.convertToObjectId(exportData.reportId),
      userId: exportData.userId || 'default-user',
      format: exportData.format,
      fileName: exportData.fileName,
      filePath: exportData.filePath,
      fileSize: exportData.fileSize,
      exportedAt: new Date(),
      metadata: {
        originalReport: exportData.originalReport,
        exportSettings: exportData.exportSettings,
        version: exportData.version || '1.0'
      }
    };

    const result = await this.exportedReports.insertOne(exportRecord);
    
    // Also log in report history
    await this.logReportAction(exportData.reportId, 'exported', {
      format: exportData.format,
      fileName: exportData.fileName,
      exportId: result.insertedId
    });

    return result;
  }

  async getExportedReports(filter = {}, options = {}) {
    await this.ensureConnected();
    
    // Set default sort by export date (newest first)
    const defaultSort = { exportedAt: -1 };
    const finalOptions = {
      sort: defaultSort,
      ...options
    };

    return await this.exportedReports.find(filter, finalOptions).toArray();
  }

  async getExportedReportsByUser(userId, options = {}) {
    return await this.getExportedReports({ userId }, options);
  }

  async getExportHistory(reportId) {
    await this.ensureConnected();
    
    return await this.exportedReports
      .find({ reportId: this.convertToObjectId(reportId) })
      .sort({ exportedAt: -1 })
      .toArray();
  }

  async deleteExportedReport(exportId) {
    await this.ensureConnected();
    
    const exportRecord = await this.exportedReports.findOne({ 
      _id: this.convertToObjectId(exportId) 
    });
    
    if (exportRecord) {
      // Log deletion in report history
      await this.logReportAction(exportRecord.reportId, 'export_deleted', {
        exportId: exportId,
        fileName: exportRecord.fileName
      });
    }

    return await this.exportedReports.deleteOne({ 
      _id: this.convertToObjectId(exportId) 
    });
  }

  // Template History Operations
  async saveTemplateVersion(templateId, templateData, action = 'updated') {
    await this.ensureConnected();
    
    // Get current version number
    const latestVersion = await this.templateHistory
      .findOne(
        { templateId: this.convertToObjectId(templateId) },
        { sort: { version: -1 } }
      );
    
    const version = latestVersion ? latestVersion.version + 1 : 1;

    const historyRecord = {
      templateId: this.convertToObjectId(templateId),
      version: version,
      action: action,
      templateData: templateData,
      createdAt: new Date(),
      metadata: {
        changes: this.detectTemplateChanges(latestVersion?.templateData, templateData),
        size: JSON.stringify(templateData).length
      }
    };

    return await this.templateHistory.insertOne(historyRecord);
  }

  async getTemplateHistory(templateId, options = {}) {
    await this.ensureConnected();
    
    const defaultSort = { version: -1 };
    const finalOptions = {
      sort: defaultSort,
      ...options
    };

    return await this.templateHistory
      .find({ templateId: this.convertToObjectId(templateId) }, finalOptions)
      .toArray();
  }

  async getTemplateVersion(templateId, version) {
    await this.ensureConnected();
    
    return await this.templateHistory.findOne({
      templateId: this.convertToObjectId(templateId),
      version: version
    });
  }

  async restoreTemplateVersion(templateId, version) {
    await this.ensureConnected();
    
    const versionData = await this.getTemplateVersion(templateId, version);
    if (!versionData) {
      throw new Error(`Template version ${version} not found`);
    }

    // Update the current template with the historical version
    await this.updateTemplate(templateId, versionData.templateData);
    
    // Save this as a new version with restore action
    await this.saveTemplateVersion(templateId, versionData.templateData, 'restored');
    
    return versionData;
  }

  // Report History Operations
  async logReportAction(reportId, action, details = {}) {
    await this.ensureConnected();
    
    const historyRecord = {
      reportId: this.convertToObjectId(reportId),
      action: action,
      details: details,
      timestamp: new Date(),
      userId: details.userId || 'default-user'
    };

    return await this.reportHistory.insertOne(historyRecord);
  }

  async getReportHistory(reportId, options = {}) {
    await this.ensureConnected();
    
    const defaultSort = { timestamp: -1 };
    const finalOptions = {
      sort: defaultSort,
      ...options
    };

    return await this.reportHistory
      .find({ reportId: this.convertToObjectId(reportId) }, finalOptions)
      .toArray();
  }

  async getReportActivitySummary(filter = {}, options = {}) {
    await this.ensureConnected();
    
    return await this.reportHistory.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          lastActivity: { $max: '$timestamp' },
          reports: { $addToSet: '$reportId' }
        }
      },
      {
        $project: {
          action: '$_id',
          count: 1,
          lastActivity: 1,
          uniqueReports: { $size: '$reports' },
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
  }

  // Report Management and Search
  async searchReports(query, options = {}) {
    await this.ensureConnected();
    
    const searchFilter = {
      $or: [
        { templateName: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { 'metadata.tags': { $in: [new RegExp(query, 'i')] } }
      ]
    };

    return await this.getReports(searchFilter, options);
  }

  async getReportsByDateRange(startDate, endDate, options = {}) {
    await this.ensureConnected();
    
    const dateFilter = {
      generatedAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    return await this.getReports(dateFilter, options);
  }

  async getFavoriteReports(userId = 'default-user', options = {}) {
    await this.ensureConnected();
    
    // Get reports that have been exported multiple times (indicating user value)
    const favoriteExports = await this.exportedReports.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$reportId',
          exportCount: { $sum: 1 },
          lastExport: { $max: '$exportedAt' }
        }
      },
      { $match: { exportCount: { $gte: 2 } } },
      { $sort: { exportCount: -1, lastExport: -1 } }
    ]).toArray();

    const favoriteReportIds = favoriteExports.map(f => f._id);
    
    if (favoriteReportIds.length === 0) {
      return [];
    }

    return await this.getReports(
      { _id: { $in: favoriteReportIds } },
      options
    );
  }

  // Helper method to detect changes between template versions
  detectTemplateChanges(oldTemplate, newTemplate) {
    if (!oldTemplate) return ['created'];
    
    const changes = [];
    
    if (oldTemplate.name !== newTemplate.name) changes.push('name');
    if (oldTemplate.description !== newTemplate.description) changes.push('description');
    if (oldTemplate.category !== newTemplate.category) changes.push('category');
    if (JSON.stringify(oldTemplate.prompt) !== JSON.stringify(newTemplate.prompt)) changes.push('prompt');
    if (oldTemplate.outputFormat !== newTemplate.outputFormat) changes.push('outputFormat');
    if (JSON.stringify(oldTemplate.variables) !== JSON.stringify(newTemplate.variables)) changes.push('variables');
    
    return changes.length > 0 ? changes : ['minor_update'];
  }

  // Cleanup and Maintenance
  async cleanupOldExports(daysToKeep = 30) {
    await this.ensureConnected();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.exportedReports.deleteMany({
      exportedAt: { $lt: cutoffDate }
    });

    console.log(`Cleaned up ${result.deletedCount} old export records`);
    return result;
  }

  async getStorageStats() {
    await this.ensureConnected();
    
    const stats = await Promise.all([
      this.templates.countDocuments(),
      this.reports.countDocuments(),
      this.exportedReports.countDocuments(),
      this.templateHistory.countDocuments(),
      this.reportHistory.countDocuments()
    ]);

    return {
      templates: stats[0],
      reports: stats[1],
      exportedReports: stats[2],
      templateHistory: stats[3],
      reportHistory: stats[4],
      total: stats.reduce((sum, count) => sum + count, 0)
    };
  }
}

// Create singleton instance
const mongoStorage = new MongoStorageService();

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoStorage.disconnect();
  process.exit(0);
});

module.exports = {
  mongoStorage,
  ObjectId,
  // Exported functions
  connect: () => mongoStorage.connect(),
  disconnect: () => mongoStorage.disconnect(),
  // Templates
  createTemplate: (template) => mongoStorage.createTemplate(template),
  getTemplates: (filter, options) => mongoStorage.getTemplates(filter, options),
  getTemplateById: (id) => mongoStorage.getTemplateById(id),
  updateTemplate: (id, updates) => mongoStorage.updateTemplate(id, updates),
  deleteTemplate: (id) => mongoStorage.deleteTemplate(id),
  incrementTemplateUsage: (id) => mongoStorage.incrementTemplateUsage(id),
  // Reports
  createReport: (report) => mongoStorage.createReport(report),
  getReports: (filter, options) => mongoStorage.getReports(filter, options),
  getReportById: (id) => mongoStorage.getReportById(id),
  getReportsBySession: (sessionId) => mongoStorage.getReportsBySession(sessionId),
  updateReport: (id, updates) => mongoStorage.updateReport(id, updates),
  deleteReport: (id) => mongoStorage.deleteReport(id),
  // Exported Reports
  saveExportedReport: (exportData) => mongoStorage.saveExportedReport(exportData),
  getExportedReports: (filter, options) => mongoStorage.getExportedReports(filter, options),
  getExportedReportsByUser: (userId, options) => mongoStorage.getExportedReportsByUser(userId, options),
  getExportHistory: (reportId) => mongoStorage.getExportHistory(reportId),
  deleteExportedReport: (exportId) => mongoStorage.deleteExportedReport(exportId),
  // Template History
  saveTemplateVersion: (templateId, templateData, action) => mongoStorage.saveTemplateVersion(templateId, templateData, action),
  getTemplateHistory: (templateId, options) => mongoStorage.getTemplateHistory(templateId, options),
  getTemplateVersion: (templateId, version) => mongoStorage.getTemplateVersion(templateId, version),
  restoreTemplateVersion: (templateId, version) => mongoStorage.restoreTemplateVersion(templateId, version),
  // Report History
  logReportAction: (reportId, action, details) => mongoStorage.logReportAction(reportId, action, details),
  getReportHistory: (reportId, options) => mongoStorage.getReportHistory(reportId, options),
  getReportActivitySummary: (filter, options) => mongoStorage.getReportActivitySummary(filter, options),
  // Advanced Report Operations
  searchReports: (query, options) => mongoStorage.searchReports(query, options),
  getReportsByDateRange: (startDate, endDate, options) => mongoStorage.getReportsByDateRange(startDate, endDate, options),
  getFavoriteReports: (userId, options) => mongoStorage.getFavoriteReports(userId, options),
  // Maintenance
  cleanupOldExports: (daysToKeep) => mongoStorage.cleanupOldExports(daysToKeep),
  getStorageStats: () => mongoStorage.getStorageStats(),
  // Stats
  getTemplateStats: () => mongoStorage.getTemplateStats(),
  getPopularTemplates: (limit) => mongoStorage.getPopularTemplates(limit)
};
```

# app/services/ollamaManager.js

```js
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
```

# app/services/processor.js

```js
// Conversation Processing Pipeline
const EventEmitter = require('events');
const { extractTopics } = require('./llmProviders');
const { fetchResearchSummaries } = require('./research/index');
const { loadConfig } = require('../config');
const RealtimeAnalyzer = require('./realtimeAnalyzer');
const KnowledgeGraphBuilder = require('./knowledgeGraphBuilder');
const RAGEnhancedProcessor = require('./ragEnhancedProcessor');

class ConversationProcessor extends EventEmitter {
  constructor() {
    super();
    this.config = loadConfig();
    this.transcriptBuffer = '';
    this.wordCount = 0;
    this.lastProcessedTime = Date.now();
    this.processingQueue = [];
    this.isProcessing = false;
    this.previousResearch = []; // Track previous research for context
    
    // Configuration - lowered for testing
    this.minWordsPerChunk = this.config.thresholds.min_words_per_chunk || 5; // Lowered from 25 to 5
    this.maxBufferWords = 100; // Process if buffer gets too large
    this.idleTimeout = 5000; // Process after 5 seconds of silence
    
    // Initialize real-time analysis components
    this.realtimeAnalyzer = new RealtimeAnalyzer({
      minWordsForAnalysis: 30, // Slightly higher for real-time to avoid noise
      maxInsightsPerMinute: 8,
      confidenceThreshold: 0.75
    });
    
    this.knowledgeGraph = new KnowledgeGraphBuilder();
    
    // Initialize RAG processor
    this.ragProcessor = new RAGEnhancedProcessor();
    this.ragProcessor.initialize().catch(error => {
      console.log('RAG processor initialization failed (optional):', error.message);
    });
    
    // Set up real-time event handlers
    this.setupRealtimeHandlers();
  }

  setupRealtimeHandlers() {
    // Forward real-time insights to main processor events
    this.realtimeAnalyzer.on('realtime-insight', (insight) => {
      this.emit('realtime-insight', insight);
    });

    this.realtimeAnalyzer.on('executive-summary-updated', (summary) => {
      this.emit('executive-summary-updated', summary);
    });

    this.realtimeAnalyzer.on('slides-generated', (slides) => {
      this.emit('slides-generated', slides);
    });

    this.realtimeAnalyzer.on('knowledge-graph-updated', (graphData) => {
      this.emit('knowledge-graph-updated', graphData);
    });

    // Forward knowledge graph events
    this.knowledgeGraph.on('topic-added', (data) => {
      this.emit('topic-added', data);
    });

    this.knowledgeGraph.on('connection-added', (data) => {
      this.emit('connection-added', data);
    });
  }

  // Add new transcript text to the buffer
  addTranscript(text) {
    if (!text || text.trim().length === 0) return;
    
    console.log('📝 Processor: Adding transcript text:', text.substring(0, 50) + '...');
    this.transcriptBuffer += ' ' + text;
    this.wordCount += text.split(/\s+/).filter(word => word.length > 0).length;
    console.log('📊 Processor: Buffer now has', this.wordCount, 'words, min required:', this.minWordsPerChunk);
    
    // NEW: Feed to real-time analyzer for immediate insights
    this.realtimeAnalyzer.processFragment(text);
    
    // Check if we should process
    if (this.shouldProcess()) {
      console.log('✅ Processor: Should process - triggering chunk processing');
      this.processChunk();
    } else {
      console.log('⏳ Processor: Not enough words yet, waiting...');
    }
    
    // Reset idle timer
    this.resetIdleTimer();
  }

  shouldProcess() {
    // Process if we have enough words
    if (this.wordCount >= this.minWordsPerChunk) {
      return true;
    }
    
    // Process if buffer is getting too large
    if (this.wordCount >= this.maxBufferWords) {
      return true;
    }
    
    return false;
  }

  resetIdleTimer() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    
    this.idleTimer = setTimeout(() => {
      if (this.wordCount > 0) {
        this.processChunk();
      }
    }, this.idleTimeout);
  }

  async processChunk() {
    if (this.isProcessing || this.wordCount === 0) return;
    
    // Extract chunk to process
    const chunk = this.transcriptBuffer.trim();
    this.transcriptBuffer = '';
    this.wordCount = 0;
    this.lastProcessedTime = Date.now();
    
    // Add to processing queue
    this.processingQueue.push(chunk);
    
    // Process queue
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.processingQueue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    // More aggressive queue management to prevent memory exhaustion
    if (this.processingQueue.length > 10) {
      console.warn(`Processing queue overflow: ${this.processingQueue.length} items, dropping to 5`);
      this.processingQueue = this.processingQueue.slice(-5);
    }
    
    this.isProcessing = true;
    const chunk = this.processingQueue.shift();
    
    try {
      // Emit chunk event
      console.log('🔄 Processor: Emitting chunk event');
      this.emit('chunk', {
        text: chunk,
        timestamp: new Date().toISOString()
      });
      
      // Extract topics using LLM
      console.log('🧠 Processor: Extracting topics from chunk:', chunk.substring(0, 100) + '...');
      const topicData = await extractTopics(chunk);
      console.log('🎯 Processor: Topic extraction result:', topicData);
      
      // Enhance with RAG if available
      let ragEnhancedTopics = null;
      try {
        ragEnhancedTopics = await this.ragProcessor.enhanceTopicExtraction(chunk);
        if (ragEnhancedTopics) {
          console.log('🧠 RAG Enhanced topics:', ragEnhancedTopics);
        }
      } catch (error) {
        console.log('RAG topic enhancement failed (optional):', error.message);
      }
      
      if (topicData.topics.length > 0 || topicData.questions.length > 0 || topicData.terms.length > 0) {
        console.log('✨ Processor: Topics found! Emitting topics event');
        
        // NEW: Add topics to knowledge graph
        this.knowledgeGraph.addTopicsFromText(
          [...topicData.topics, ...topicData.terms],
          [] // Will be enhanced with relationship detection later
        );
        
        // Emit topics event
        this.emit('topics', {
          topics: topicData.topics,
          questions: topicData.questions,
          terms: topicData.terms,
          chunkText: chunk,
          timestamp: new Date().toISOString(),
          ragEnhanced: ragEnhancedTopics // Include RAG enhanced data
        });
        
        // Fetch research summaries - filter out invalid topics
        const allTopics = [
          ...topicData.topics,
          ...topicData.questions.slice(0, 1), // Include first question
          ...topicData.terms.slice(0, 1) // Include first term
        ].filter(topic => 
          topic && 
          typeof topic === 'string' && 
          topic.length > 2 && 
          !topic.includes('BLANK_AUDIO') && 
          !topic.includes('NULL') && 
          !topic.includes('UNDEFINED') &&
          !topic.includes('[object Object]')
        );
        
        if (allTopics.length > 0) {
          console.log('🔍 Processor: Fetching research for topics:', allTopics);
          // Pass transcript context for AI-powered research
          const summaries = await fetchResearchSummaries(
            allTopics, 
            this.transcriptBuffer, 
            this.previousResearch || []
          );
          console.log('📚 Processor: Research summaries:', summaries.length, 'found');
          
          if (summaries.length > 0) {
            console.log('📡 Processor: Emitting research event');
            // Store research for future context with aggressive memory management
            this.previousResearch.push(...summaries);
            // Keep only last 5 research items for context (reduced from 15)
            if (this.previousResearch.length > 5) {
              this.previousResearch = this.previousResearch.slice(-5);
              console.warn(`Research context truncated to ${this.previousResearch.length} items`);
            }
            
            // Emit research event
            this.emit('research', {
              summaries: summaries,
              timestamp: new Date().toISOString()
            });
          }
        }
      } else {
        console.log('🤷 Processor: No topics found in this chunk');
      }
    } catch (error) {
      console.error('❌ Processor: Error processing chunk:', error);
      this.emit('error', error);
    }
    
    // Process next item in queue with better timing
    // Use longer delay to prevent CPU overload during extended sessions
    setTimeout(() => this.processQueue(), 2000);
  }

  // Force processing of current buffer
  flush() {
    if (this.wordCount > 0) {
      this.processChunk();
    }
  }

  // Clear all buffers and stop processing
  clear() {
    this.transcriptBuffer = '';
    this.wordCount = 0;
    this.processingQueue = [];
    this.isProcessing = false;
    this.previousResearch = []; // Clear research context
    
    // Clear real-time components
    this.realtimeAnalyzer.clear();
    this.knowledgeGraph.clear();
    
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }

  // Get current status
  getStatus() {
    return {
      bufferWordCount: this.wordCount,
      queueLength: this.processingQueue.length,
      isProcessing: this.isProcessing,
      lastProcessedTime: this.lastProcessedTime,
      realtimeInsights: this.realtimeAnalyzer.getRecentInsights(5),
      knowledgeGraphStats: this.knowledgeGraph.getGraphStats()
    };
  }

  // Get real-time data for UI
  getRealtimeData() {
    return {
      insights: this.realtimeAnalyzer.getRecentInsights(10),
      executiveSummary: this.realtimeAnalyzer.executiveSummary,
      slides: this.realtimeAnalyzer.slidePoints,
      knowledgeGraph: this.knowledgeGraph.getGraphData({
        maxNodes: 50,
        minWeight: 1
      })
    };
  }

  // Get executive summary
  getExecutiveSummary() {
    return this.realtimeAnalyzer.executiveSummary;
  }

  // Get current slides
  getCurrentSlides() {
    return this.realtimeAnalyzer.slidePoints;
  }

  // Get knowledge graph data
  getKnowledgeGraph(options = {}) {
    return this.knowledgeGraph.getGraphData(options);
  }

  // Destroy processor and clean up
  destroy() {
    this.clear();
    this.realtimeAnalyzer.destroy();
    this.knowledgeGraph.destroy();
    this.removeAllListeners();
  }
}

// Create singleton instance
const processor = new ConversationProcessor();

module.exports = processor;
```

# app/services/ragDocumentManager.js

```js
// RAG Document Management Service for bitscribe
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class RAGDocumentManager {
  constructor() {
    this.client = null;
    this.db = null;
    this.documentsCollection = null;
    this.vectorCollection = null;
    this.isConnected = false;
    this.connectionString = process.env.MONGODB_URI;
    this.embeddingModel = 'text-embedding-3-small'; // OpenAI embedding model
  }

  async connect() {
    if (this.isConnected) return;

    try {
      if (!this.connectionString) {
        throw new Error('MongoDB connection string not provided');
      }

      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      
      this.db = this.client.db('design-review-scribe');
      this.documentsCollection = this.db.collection('rag_documents');
      this.vectorCollection = this.db.collection('document_vectors');
      
      // Create vector search index if it doesn't exist
      await this.createVectorSearchIndex();
      
      this.isConnected = true;
      console.log('🔗 RAG Document Manager connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect RAG Document Manager:', error);
      throw error;
    }
  }

  async createVectorSearchIndex() {
    try {
      // Check if vector search index exists
      const indexes = await this.vectorCollection.listIndexes().toArray();
      const vectorIndexExists = indexes.some(index => index.name === 'vector_index');

      if (!vectorIndexExists) {
        // Create Atlas Vector Search index
        await this.vectorCollection.createSearchIndex({
          name: 'vector_index',
          definition: {
            fields: [
              {
                type: 'vector',
                path: 'embedding',
                numDimensions: 1536, // OpenAI text-embedding-3-small dimensions
                similarity: 'cosine'
              },
              {
                type: 'filter',
                path: 'documentId'
              },
              {
                type: 'filter', 
                path: 'documentType'
              }
            ]
          }
        });
        console.log('✅ Vector search index created');
      }
    } catch (error) {
      console.log('ℹ️ Vector search index creation skipped (may already exist):', error.message);
    }
  }

  async uploadDocument(filePath, metadata = {}) {
    await this.connect();

    try {
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath).toLowerCase();
      
      // Read and parse document content
      let content = '';
      switch (fileExtension) {
        case '.txt':
          content = await fs.promises.readFile(filePath, 'utf8');
          break;
        case '.pdf':
          const pdfBuffer = await fs.promises.readFile(filePath);
          const pdfData = await pdf(pdfBuffer);
          content = pdfData.text;
          break;
        case '.docx':
          const docxBuffer = await fs.promises.readFile(filePath);
          const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
          content = docxResult.value;
          break;
        case '.md':
          content = await fs.promises.readFile(filePath, 'utf8');
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      if (!content || content.trim().length === 0) {
        throw new Error('Document appears to be empty');
      }

      // Create document record
      const document = {
        fileName,
        fileType: fileExtension,
        content,
        metadata: {
          ...metadata,
          uploadedAt: new Date(),
          size: content.length,
          wordCount: content.split(/\s+/).length
        },
        isActive: true
      };

      // Insert document
      const result = await this.documentsCollection.insertOne(document);
      const documentId = result.insertedId;

      // Process document for vector storage
      await this.processDocumentForVectorSearch(documentId, content, metadata);

      console.log(`📄 Document uploaded: ${fileName} (${document.metadata.wordCount} words)`);
      return {
        success: true,
        documentId,
        fileName,
        wordCount: document.metadata.wordCount
      };

    } catch (error) {
      console.error('Document upload failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async processDocumentForVectorSearch(documentId, content, metadata) {
    // Split content into chunks for better retrieval
    const chunks = this.splitIntoChunks(content, 1000, 200); // 1000 chars with 200 char overlap
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      try {
        // Generate embedding (you'll need to implement this with your LLM provider)
        const embedding = await this.generateEmbedding(chunk);
        
        // Store vector with metadata
        await this.vectorCollection.insertOne({
          documentId,
          chunkIndex: i,
          content: chunk,
          embedding,
          documentType: metadata.type || 'general',
          category: metadata.category || 'uncategorized',
          createdAt: new Date()
        });
      } catch (error) {
        console.error(`Failed to process chunk ${i} for document ${documentId}:`, error);
      }
    }
  }

  splitIntoChunks(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunk = text.slice(start, end);
      
      // Try to break at word boundaries
      if (end < text.length && chunk.lastIndexOf(' ') > chunk.length - 100) {
        const lastSpace = chunk.lastIndexOf(' ');
        chunks.push(chunk.slice(0, lastSpace));
        start += lastSpace - overlap;
      } else {
        chunks.push(chunk);
        start += chunkSize - overlap;
      }
    }
    
    return chunks.filter(chunk => chunk.trim().length > 0);
  }

  async generateEmbedding(text) {
    // This will be integrated with your existing LLM providers
    // For now, return a placeholder - you'll implement this with OpenAI/other providers
    const { generateEmbedding } = require('./llmProviders');
    return await generateEmbedding(text);
  }

  async searchDocuments(query, options = {}) {
    await this.connect();

    try {
      const {
        limit = 5,
        documentType = null,
        category = null,
        threshold = 0.7
      } = options;

      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);

      // Build vector search pipeline
      const pipeline = [
        {
          $vectorSearch: {
            index: 'vector_index',
            path: 'embedding',
            queryVector: queryEmbedding,
            numCandidates: 100,
            limit: limit * 2 // Get more candidates for filtering
          }
        },
        {
          $addFields: {
            score: { $meta: 'vectorSearchScore' }
          }
        }
      ];

      // Add filters if specified
      const matchStage = {};
      if (documentType) matchStage.documentType = documentType;
      if (category) matchStage.category = category;
      
      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });
      }

      // Filter by similarity threshold
      pipeline.push({
        $match: {
          score: { $gte: threshold }
        }
      });

      // Limit results
      pipeline.push({ $limit: limit });

      // Lookup document metadata
      pipeline.push({
        $lookup: {
          from: 'rag_documents',
          localField: 'documentId',
          foreignField: '_id',
          as: 'document'
        }
      });

      const results = await this.vectorCollection.aggregate(pipeline).toArray();

      return {
        success: true,
        results: results.map(result => ({
          content: result.content,
          score: result.score,
          documentId: result.documentId,
          fileName: result.document[0]?.fileName || 'Unknown',
          chunkIndex: result.chunkIndex,
          documentType: result.documentType,
          category: result.category
        }))
      };

    } catch (error) {
      console.error('Document search failed:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  async getDocuments() {
    await this.connect();

    try {
      const documents = await this.documentsCollection
        .find({ isActive: true })
        .sort({ 'metadata.uploadedAt': -1 })
        .toArray();

      return {
        success: true,
        documents: documents.map(doc => ({
          id: doc._id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          wordCount: doc.metadata.wordCount,
          uploadedAt: doc.metadata.uploadedAt,
          type: doc.metadata.type || 'general',
          category: doc.metadata.category || 'uncategorized'
        }))
      };
    } catch (error) {
      console.error('Failed to retrieve documents:', error);
      return {
        success: false,
        error: error.message,
        documents: []
      };
    }
  }

  async deleteDocument(documentId) {
    await this.connect();

    try {
      // Mark document as inactive
      await this.documentsCollection.updateOne(
        { _id: documentId },
        { $set: { isActive: false, deletedAt: new Date() } }
      );

      // Remove vectors
      await this.vectorCollection.deleteMany({ documentId });

      return { success: true };
    } catch (error) {
      console.error('Failed to delete document:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getDocumentStats() {
    await this.connect();

    try {
      const [docCount, vectorCount] = await Promise.all([
        this.documentsCollection.countDocuments({ isActive: true }),
        this.vectorCollection.countDocuments()
      ]);

      return {
        success: true,
        stats: {
          totalDocuments: docCount,
          totalChunks: vectorCount,
          avgChunksPerDoc: docCount > 0 ? Math.round(vectorCount / docCount) : 0
        }
      };
    } catch (error) {
      console.error('Failed to get document stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.isConnected = false;
      console.log('🔌 RAG Document Manager disconnected');
    }
  }
}

module.exports = RAGDocumentManager;
```

# app/services/ragEnhancedProcessor.js

```js
// RAG-Enhanced Transcript Processor
const RAGDocumentManager = require('./ragDocumentManager');
const { generateCompletion } = require('./llmProviders');

class RAGEnhancedProcessor {
  constructor() {
    this.ragManager = new RAGDocumentManager();
    this.isEnabled = false;
    this.contextLimit = 3; // Number of relevant documents to include
    this.relevanceThreshold = 0.7; // Minimum similarity score
  }

  async initialize() {
    try {
      await this.ragManager.connect();
      this.isEnabled = true;
      console.log('🧠 RAG Enhanced Processor initialized');
    } catch (error) {
      console.error('Failed to initialize RAG processor:', error);
      this.isEnabled = false;
    }
  }

  async enhanceTopicExtraction(transcript) {
    if (!this.isEnabled) {
      return null;
    }

    try {
      // Search for relevant documents
      const relevantDocs = await this.ragManager.searchDocuments(
        transcript,
        {
          limit: this.contextLimit,
          threshold: this.relevanceThreshold,
          documentType: 'best-practices'
        }
      );

      if (!relevantDocs.success || relevantDocs.results.length === 0) {
        return null;
      }

      // Build enhanced context
      const context = this.buildRAGContext(relevantDocs.results);
      
      // Enhanced topic extraction prompt
      const prompt = `You are analyzing a conversation transcript with access to relevant best practices documentation.

RELEVANT DOCUMENTATION CONTEXT:
${context}

CONVERSATION TRANSCRIPT:
${transcript}

Based on the conversation and the relevant documentation, extract:
1. Key topics discussed
2. Best practice violations or concerns
3. Recommended actions based on the documentation
4. Questions that should be asked based on best practices

Respond with JSON only:
{
  "topics": ["topic1", "topic2"],
  "bestPracticeViolations": [
    {
      "issue": "description of violation",
      "recommendation": "specific recommendation from docs",
      "documentSource": "source document name"
    }
  ],
  "recommendedActions": ["action1", "action2"],
  "suggestedQuestions": ["question1", "question2"],
  "documentSources": ["doc1", "doc2"]
}`;

      const response = await generateCompletion(prompt, { format: 'json' });
      const result = JSON.parse(response);

      console.log('✅ RAG Enhanced topic extraction completed');
      return result;

    } catch (error) {
      console.error('RAG enhanced topic extraction failed:', error);
      return null;
    }
  }

  async enhanceInsightGeneration(transcript, currentInsights = []) {
    if (!this.isEnabled) {
      return null;
    }

    try {
      // Search for relevant documents for insight generation
      const relevantDocs = await this.ragManager.searchDocuments(
        transcript,
        {
          limit: this.contextLimit,
          threshold: this.relevanceThreshold
        }
      );

      if (!relevantDocs.success || relevantDocs.results.length === 0) {
        return null;
      }

      const context = this.buildRAGContext(relevantDocs.results);

      const prompt = `You are generating insights for a conversation with access to relevant documentation.

RELEVANT DOCUMENTATION:
${context}

CONVERSATION TRANSCRIPT:
${transcript}

CURRENT INSIGHTS:
${currentInsights.map(insight => `- ${insight.content}`).join('\n')}

Generate new insights that:
1. Reference the documentation when relevant
2. Provide actionable guidance
3. Highlight potential issues or opportunities
4. Don't repeat existing insights

Respond with JSON only:
{
  "insights": [
    {
      "type": "strategic|tactical|warning|opportunity",
      "content": "insight text with documentation reference",
      "confidence": 0.8,
      "documentSource": "source document name",
      "actionable": true,
      "priority": "high|medium|low"
    }
  ]
}`;

      const response = await generateCompletion(prompt, { format: 'json' });
      const result = JSON.parse(response);

      console.log('✅ RAG Enhanced insights generated');
      return result.insights || [];

    } catch (error) {
      console.error('RAG enhanced insight generation failed:', error);
      return [];
    }
  }

  async enhanceMeetingNotes(transcript, topics, research) {
    if (!this.isEnabled) {
      return null;
    }

    try {
      // Search for documents relevant to the meeting content
      const searchQuery = `${topics.join(' ')} ${transcript.substring(0, 500)}`;
      const relevantDocs = await this.ragManager.searchDocuments(
        searchQuery,
        {
          limit: 5,
          threshold: 0.6
        }
      );

      if (!relevantDocs.success || relevantDocs.results.length === 0) {
        return null;
      }

      const context = this.buildRAGContext(relevantDocs.results);

      const prompt = `Generate comprehensive meeting notes with best practice recommendations.

RELEVANT BEST PRACTICES DOCUMENTATION:
${context}

MEETING TRANSCRIPT:
${transcript}

IDENTIFIED TOPICS:
${topics.join(', ')}

RESEARCH CONTEXT:
${research.map(r => `${r.topic}: ${r.summary}`).join('\n')}

Create detailed meeting notes that include:
1. Executive summary with key decisions
2. Action items with ownership and deadlines
3. Best practice recommendations based on documentation
4. Risk assessments based on documented guidelines
5. Follow-up questions and next steps

Respond with JSON only:
{
  "executiveSummary": "2-3 sentence summary",
  "keyDecisions": ["decision1", "decision2"],
  "actionItems": [
    {
      "task": "specific task",
      "owner": "suggested owner or role",
      "deadline": "suggested timeline",
      "priority": "high|medium|low",
      "bestPracticeRef": "reference to documentation if applicable"
    }
  ],
  "riskAssessments": [
    {
      "risk": "identified risk",
      "severity": "high|medium|low",
      "mitigation": "recommended mitigation from docs",
      "documentSource": "source document"
    }
  ],
  "bestPracticeRecommendations": [
    {
      "recommendation": "specific recommendation",
      "reasoning": "why this applies",
      "documentSource": "source document",
      "implementation": "how to implement"
    }
  ],
  "followUpQuestions": ["question1", "question2"],
  "documentSources": ["doc1", "doc2"]
}`;

      const response = await generateCompletion(prompt, { format: 'json' });
      const result = JSON.parse(response);

      console.log('✅ RAG Enhanced meeting notes generated');
      return result;

    } catch (error) {
      console.error('RAG enhanced meeting notes generation failed:', error);
      return null;
    }
  }

  buildRAGContext(relevantDocs) {
    return relevantDocs.map((doc, index) => 
      `[Document ${index + 1}: ${doc.fileName} (Score: ${doc.score.toFixed(2)})]\n${doc.content}\n`
    ).join('\n---\n');
  }

  async searchRelevantContext(query, options = {}) {
    if (!this.isEnabled) {
      return { success: false, results: [] };
    }

    return await this.ragManager.searchDocuments(query, options);
  }

  async getDocumentStats() {
    if (!this.isEnabled) {
      return { success: false, stats: {} };
    }

    return await this.ragManager.getDocumentStats();
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    console.log(`🧠 RAG Enhanced Processor ${enabled ? 'enabled' : 'disabled'}`);
  }

  setRelevanceThreshold(threshold) {
    this.relevanceThreshold = Math.max(0.1, Math.min(1.0, threshold));
    console.log(`🎯 RAG relevance threshold set to: ${this.relevanceThreshold}`);
  }

  setContextLimit(limit) {
    this.contextLimit = Math.max(1, Math.min(10, limit));
    console.log(`📚 RAG context limit set to: ${this.contextLimit}`);
  }
}

module.exports = RAGEnhancedProcessor;
```

# app/services/realtimeAnalyzer.js

```js
const EventEmitter = require('events');
const { generateCompletion } = require('./llmProviders');

class RealtimeAnalyzer extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.buffer = '';
    this.lastAnalysis = null;
    this.analysisQueue = [];
    this.insights = new Map();
    this.knowledgeGraph = new Map();
    this.executiveSummary = '';
    this.slidePoints = [];
    this.recentContext = [];
    this.jargonCache = new Map();
    
    // Configuration
    this.config = {
      minWordsForAnalysis: 50,
      maxInsightsPerMinute: 10,
      confidenceThreshold: 0.7,
      executiveSummaryInterval: 30000, // 30 seconds
      slideGenerationInterval: 300000, // 5 minutes
      contextWindowSize: 500, // characters
      ...options
    };
    
    // Throttling
    this.insightCount = 0;
    this.lastInsightReset = Date.now();
    this.processing = false;
    
    // Timers
    this.summaryTimer = null;
    this.slideTimer = null;
    
    this.startTimers();
  }

  startTimers() {
    // Executive summary update timer - reduced frequency for memory relief
    this.summaryTimer = setInterval(() => {
      if (this.buffer.trim()) {
        this.updateExecutiveSummary();
      }
    }, this.config.executiveSummaryInterval * 2);

    // Slide generation timer - reduced frequency for memory relief
    this.slideTimer = setInterval(() => {
      if (this.buffer.trim()) {
        this.generateSlides();
      }
    }, this.config.slideGenerationInterval * 2);
  }

  async processFragment(fragment) {
    this.buffer += fragment + ' ';
    this.recentContext.push({
      text: fragment,
      timestamp: Date.now()
    });

    // Keep context window manageable - reduce for memory relief
    if (this.recentContext.length > 10) {
      this.recentContext = this.recentContext.slice(-8);
    }

    // Check if we should trigger analysis
    const wordCount = this.buffer.split(' ').filter(w => w.length > 0).length;
    if (wordCount >= this.config.minWordsForAnalysis && !this.processing) {
      this.queueAnalysis();
    }
  }

  async queueAnalysis() {
    if (this.processing || !this.canProcessMoreInsights()) {
      return;
    }

    this.processing = true;
    
    try {
      // Run parallel analysis tasks
      const tasks = [
        this.detectContradictions(),
        this.explainJargon(),
        this.generateInsights(),
        this.buildKnowledgeConnections()
      ];

      const results = await Promise.allSettled(tasks);
      
      // Process results and emit insights
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          this.emitInsight(result.value);
        }
      });

    } catch (error) {
      console.error('Real-time analysis error:', error);
    } finally {
      this.processing = false;
      this.clearOldBuffer();
    }
  }

  async detectContradictions() {
    if (this.recentContext.length < 2) return null;

    const recentText = this.recentContext.slice(-5).map(c => c.text).join(' ');
    const olderText = this.recentContext.slice(-10, -5).map(c => c.text).join(' ');

    if (!olderText.trim()) return null;

    const prompt = `Analyze this conversation for contradictions or inconsistencies:

EARLIER CONTEXT: ${olderText}
RECENT STATEMENTS: ${recentText}

Identify any contradictions between what was said before and now. Consider:
- Factual inconsistencies
- Changed opinions or positions  
- Conflicting data or numbers
- Logical contradictions

If found, explain clearly and suggest clarification questions.
Respond with JSON: {"found": boolean, "contradiction": "description", "clarification": "suggested question", "confidence": 0.0-1.0}

If no contradictions found, respond: {"found": false}`;

    try {
      const response = await generateCompletion(prompt);
      // Try to extract JSON from response if it's embedded in text
      let jsonStr = response;
      if (!response.trim().startsWith('{')) {
        const jsonMatch = response.match(/\{[^}]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        } else {
          // If no JSON found, return empty result
          return null;
        }
      }
      const result = JSON.parse(jsonStr);
      
      if (result.found && result.confidence >= this.config.confidenceThreshold) {
        return {
          type: 'contradiction',
          content: result.contradiction,
          action: result.clarification,
          confidence: result.confidence,
          timestamp: Date.now(),
          context: recentText.slice(-this.config.contextWindowSize)
        };
      }
    } catch (error) {
      console.error('Contradiction detection error:', error);
    }

    return null;
  }

  async explainJargon() {
    const recentText = this.recentContext.slice(-3).map(c => c.text).join(' ');
    
    if (!recentText.trim()) return null;

    const prompt = `Identify technical terms or jargon that may need explanation:

TEXT: ${recentText}

For each term found:
1. Provide a simple, one-sentence explanation
2. Give a relatable analogy if helpful
3. Rate complexity (1-5, where 5 is very technical)

Focus on industry-specific or highly technical terms that a general audience might not understand.
Respond with JSON: {"terms": [{"term": "word", "explanation": "simple explanation", "analogy": "optional analogy", "complexity": 1-5}]}

If no jargon found, respond: {"terms": []}`;

    try {
      const response = await generateCompletion(prompt);
      // Try to extract JSON from response if it's embedded in text
      let jsonStr = response;
      if (!response.trim().startsWith('{')) {
        const jsonMatch = response.match(/\{[^}]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        } else {
          // If no JSON found, return empty result
          return null;
        }
      }
      const result = JSON.parse(jsonStr);
      
      if (result.terms && result.terms.length > 0) {
        // Filter for high-complexity terms not already cached
        const newTerms = result.terms.filter(term => 
          term.complexity >= 3 && !this.jargonCache.has(term.term.toLowerCase())
        );

        if (newTerms.length > 0) {
          // Cache the explanations
          newTerms.forEach(term => {
            this.jargonCache.set(term.term.toLowerCase(), term);
          });

          return {
            type: 'jargon',
            content: `Explained ${newTerms.length} technical term(s)`,
            details: newTerms,
            confidence: 0.9,
            timestamp: Date.now(),
            context: recentText.slice(-this.config.contextWindowSize)
          };
        }
      }
    } catch (error) {
      console.error('Jargon explanation error:', error);
    }

    return null;
  }

  async generateInsights() {
    const recentText = this.recentContext.slice(-5).map(c => c.text).join(' ');
    
    if (!recentText.trim()) return null;

    const prompt = `Analyze this conversation segment and provide proactive insights:

TEXT: ${recentText}

Generate insights that would help the participants:
1. Strategic implications or opportunities
2. Missing perspectives or blind spots
3. Relevant examples or case studies to mention
4. Questions to explore deeper

Provide 1-2 most valuable insights.
Respond with JSON: {"insights": [{"type": "strategic|perspective|example|question", "content": "insight text", "value": "why this helps", "confidence": 0.0-1.0}]}`;

    try {
      const response = await generateCompletion(prompt);
      // Try to extract JSON from response if it's embedded in text
      let jsonStr = response;
      if (!response.trim().startsWith('{')) {
        const jsonMatch = response.match(/\{[^}]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        } else {
          // If no JSON found, return empty result
          return null;
        }
      }
      const result = JSON.parse(jsonStr);
      
      if (result.insights && result.insights.length > 0) {
        const highValueInsights = result.insights.filter(insight => 
          insight.confidence >= this.config.confidenceThreshold
        );

        if (highValueInsights.length > 0) {
          return {
            type: 'insight',
            content: `${highValueInsights.length} strategic insight(s) available`,
            details: highValueInsights,
            confidence: Math.max(...highValueInsights.map(i => i.confidence)),
            timestamp: Date.now(),
            context: recentText.slice(-this.config.contextWindowSize)
          };
        }
      }
    } catch (error) {
      console.error('Insight generation error:', error);
    }

    return null;
  }

  async buildKnowledgeConnections() {
    // Extract topics from recent context
    const recentText = this.recentContext.slice(-3).map(c => c.text).join(' ');
    
    if (!recentText.trim()) return null;

    const prompt = `Extract key topics and their relationships from this text:

TEXT: ${recentText}

Identify:
1. Main topics/concepts discussed
2. How they relate to each other
3. Any cause-effect relationships

Respond with JSON: {"topics": ["topic1", "topic2"], "connections": [{"from": "topic1", "to": "topic2", "relationship": "causes|enables|contradicts|supports"}]}`;

    try {
      const response = await generateCompletion(prompt);
      const result = JSON.parse(response);
      
      if (result.topics && result.connections) {
        // Update knowledge graph
        result.topics.forEach(topic => {
          if (!this.knowledgeGraph.has(topic)) {
            this.knowledgeGraph.set(topic, { connections: new Set(), weight: 0 });
          }
          this.knowledgeGraph.get(topic).weight += 1;
        });

        result.connections.forEach(conn => {
          if (this.knowledgeGraph.has(conn.from)) {
            this.knowledgeGraph.get(conn.from).connections.add({
              to: conn.to,
              type: conn.relationship
            });
          }
        });

        this.emit('knowledge-graph-updated', this.getKnowledgeGraphData());
      }
    } catch (error) {
      console.error('Knowledge connection error:', error);
    }

    return null;
  }

  async updateExecutiveSummary() {
    if (!this.buffer.trim()) return;

    const prompt = `Update this executive summary with new conversation content:

PREVIOUS SUMMARY: ${this.executiveSummary || 'No previous summary'}
NEW CONTENT: ${this.buffer.slice(-1000)} // Last 1000 chars

Rules:
- Keep summary under 200 words
- Highlight what's NEW or CHANGED since last update
- Focus on key decisions, conclusions, and action items
- Maintain chronological flow

Respond with plain text summary:`;

    try {
      const response = await generateCompletion(prompt);
      this.executiveSummary = response.trim();
      this.emit('executive-summary-updated', this.executiveSummary);
    } catch (error) {
      console.error('Executive summary error:', error);
    }
  }

  async generateSlides() {
    if (!this.buffer.trim()) return;

    const prompt = `Create slide bullet points from this conversation segment:

TRANSCRIPT: ${this.buffer.slice(-2000)} // Last 2000 chars

Generate exactly 3 slides:
1. Key Points (3-4 bullets)
2. Insights & Implications (3-4 bullets)
3. Next Steps or Questions (3-4 bullets)

Make bullets concise, actionable, and presentation-ready.
Respond with JSON: {"slides": [{"title": "slide title", "bullets": ["bullet 1", "bullet 2"]}]}`;

    try {
      const response = await generateCompletion(prompt);
      const result = JSON.parse(response);
      
      if (result.slides) {
        this.slidePoints = result.slides;
        this.emit('slides-generated', this.slidePoints);
      }
    } catch (error) {
      console.error('Slide generation error:', error);
    }
  }

  emitInsight(insight) {
    if (!insight) return;

    this.insights.set(insight.timestamp, insight);
    this.insightCount++;
    
    this.emit('realtime-insight', insight);
    
    // Clean up old insights (keep last 50)
    if (this.insights.size > 50) {
      const oldestKey = Math.min(...this.insights.keys());
      this.insights.delete(oldestKey);
    }
  }

  canProcessMoreInsights() {
    const now = Date.now();
    
    // Reset counter every minute
    if (now - this.lastInsightReset > 60000) {
      this.insightCount = 0;
      this.lastInsightReset = now;
    }

    return this.insightCount < this.config.maxInsightsPerMinute;
  }

  clearOldBuffer() {
    // Keep last 3000 characters to maintain context
    if (this.buffer.length > 5000) {
      this.buffer = this.buffer.slice(-3000);
    }
  }

  getKnowledgeGraphData() {
    const nodes = Array.from(this.knowledgeGraph.entries()).map(([topic, data]) => ({
      id: topic,
      label: topic,
      weight: data.weight
    }));

    const edges = [];
    this.knowledgeGraph.forEach((data, fromTopic) => {
      data.connections.forEach(conn => {
        edges.push({
          source: fromTopic,
          target: conn.to,
          type: conn.type
        });
      });
    });

    return { nodes, edges };
  }

  getRecentInsights(limit = 10) {
    const recentInsights = Array.from(this.insights.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
    
    return recentInsights;
  }

  clear() {
    this.buffer = '';
    this.recentContext = [];
    this.insights.clear();
    this.executiveSummary = '';
    this.slidePoints = [];
  }

  destroy() {
    if (this.summaryTimer) {
      clearInterval(this.summaryTimer);
    }
    if (this.slideTimer) {
      clearInterval(this.slideTimer);
    }
    this.removeAllListeners();
  }
}

module.exports = RealtimeAnalyzer;
```

# app/services/reportGenerator.js

```js
// Report Generator Service - Handles report generation using OpenAI and template processing
const https = require('https');
const { createReport, getReports, getReportById, getReportsBySession, updateReport, saveExportedReport } = require('./mongoStorage');
const { getTemplateForUse, substituteVariables, validateVariables } = require('./templateManager');
const { trackRequest } = require('./usageTracker');

class ReportGeneratorService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.defaultModel = 'gpt-4-turbo-preview';
    this.maxTokens = 4000;
  }

  async generateReport(templateId, transcript, variables = {}, sessionId = null) {
    try {
      // 1. Get template and validate
      const template = await getTemplateForUse(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // 2. Validate required variables
      const validationErrors = validateVariables(template, variables);
      if (validationErrors.length > 0) {
        throw new Error(`Validation errors: ${validationErrors.join(', ')}`);
      }

      // 3. Substitute variables in prompt
      const processedPrompt = substituteVariables(template, {
        ...variables,
        transcript: transcript
      });

      console.log('Generating report with template:', template.name);
      console.log('Prompt length:', processedPrompt.length);

      // 4. Call OpenAI API
      const response = await this.callOpenAI(processedPrompt, template.outputFormat);
      
      // 5. Process response based on output format
      const processedContent = this.processOutput(response.content, template.outputFormat);

      // 6. Calculate tokens and cost
      const inputTokens = this.estimateTokens(processedPrompt);
      const outputTokens = this.estimateTokens(response.content);
      const cost = this.calculateCost(inputTokens, outputTokens, response.model);

      // 7. Track usage
      trackRequest('reportGeneration', inputTokens, outputTokens, 'openai', response.model);

      // 8. Save report to database
      const reportData = {
        sessionId: sessionId,
        templateId: template._id,
        templateName: template.name,
        transcript: transcript,
        variables: variables,
        content: processedContent,
        format: template.outputFormat,
        metadata: {
          tokensUsed: inputTokens + outputTokens,
          cost: cost,
          provider: 'openai',
          model: response.model,
          inputTokens,
          outputTokens
        }
      };

      const savedReport = await createReport(reportData);

      console.log('Report generated successfully:', savedReport._id);

      return {
        success: true,
        reportId: savedReport._id,
        content: processedContent,
        metadata: savedReport.metadata
      };

    } catch (error) {
      console.error('Error generating report:', error);
      
      return {
        success: false,
        error: error.message,
        details: error.stack
      };
    }
  }

  async callOpenAI(prompt, outputFormat) {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    return new Promise((resolve, reject) => {
      const systemPrompt = this.buildSystemPrompt(outputFormat);
      
      const payload = {
        model: this.defaultModel,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.maxTokens,
        temperature: 0.3,
        response_format: outputFormat === 'json' ? { type: 'json_object' } : undefined
      };

      const data = JSON.stringify(payload);

      const options = {
        hostname: 'api.openai.com',
        port: 443,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Length': Buffer.byteLength(data)
        }
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            
            if (response.error) {
              reject(new Error(`OpenAI API Error: ${response.error.message}`));
              return;
            }

            if (!response.choices || response.choices.length === 0) {
              reject(new Error('No response from OpenAI'));
              return;
            }

            resolve({
              content: response.choices[0].message.content,
              model: response.model,
              usage: response.usage
            });
          } catch (e) {
            reject(new Error(`Failed to parse OpenAI response: ${e.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`OpenAI request failed: ${error.message}`));
      });

      req.write(data);
      req.end();
    });
  }

  buildSystemPrompt(outputFormat) {
    const basePrompt = `You are a professional report writer and analyst. Your task is to create well-structured, comprehensive reports based on transcripts and specific instructions.

Guidelines:
1. Be accurate and only include information present in the transcript
2. Maintain a professional tone throughout
3. Structure information clearly with appropriate headers and sections
4. Extract actionable insights where relevant
5. Be concise but thorough`;

    switch (outputFormat) {
      case 'json':
        return `${basePrompt}

Output your response as valid JSON with clear structure and appropriate field names.`;
      
      case 'html':
        return `${basePrompt}

Format your response as clean HTML with proper semantic markup, headers, and styling classes.`;
      
      case 'markdown':
      default:
        return `${basePrompt}

Format your response using clean Markdown with proper headers, lists, and emphasis. Use ## for main sections and ### for subsections.`;
    }
  }

  processOutput(content, format) {
    switch (format) {
      case 'json':
        try {
          // Validate and pretty-print JSON
          const parsed = JSON.parse(content);
          return JSON.stringify(parsed, null, 2);
        } catch (e) {
          console.warn('Invalid JSON response, returning as text');
          return content;
        }
      
      case 'html':
        // Basic HTML validation and cleanup
        return content.trim();
      
      case 'markdown':
      default:
        // Clean up markdown formatting
        return content.trim();
    }
  }

  calculateCost(inputTokens, outputTokens, model = 'gpt-4-turbo-preview') {
    // OpenAI pricing per 1M tokens (as of 2024)
    const pricing = {
      'gpt-4-turbo-preview': { input: 10, output: 30 },
      'gpt-4': { input: 30, output: 60 },
      'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
      'gpt-4o': { input: 5, output: 15 },
      'gpt-4o-mini': { input: 0.15, output: 0.6 }
    };

    const modelPricing = pricing[model] || pricing['gpt-4-turbo-preview'];
    
    const inputCost = (inputTokens / 1000000) * modelPricing.input;
    const outputCost = (outputTokens / 1000000) * modelPricing.output;
    
    return inputCost + outputCost;
  }

  estimateTokens(text) {
    // Rough estimation: ~4 characters per token for GPT models
    return Math.ceil(text.length / 4);
  }

  // Report management functions
  async getReport(reportId) {
    try {
      const report = await getReportById(reportId);
      return {
        success: true,
        report: report
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getSessionReports(sessionId) {
    try {
      const reports = await getReportsBySession(sessionId);
      return {
        success: true,
        reports: reports
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getUserReports(filter = {}, options = {}) {
    try {
      const reports = await getReports(filter, options);
      return {
        success: true,
        reports: reports
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateReport(reportId, updates) {
    try {
      const result = await updateReport(reportId, updates);
      return {
        success: true,
        updated: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Export functions
  async exportReport(reportId, format = 'markdown') {
    try {
      const report = await getReportById(reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }

      let exportContent;
      let filename;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

      switch (format) {
        case 'markdown':
          exportContent = this.exportToMarkdown(report);
          filename = `report-${report.templateName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.md`;
          break;
        
        case 'html':
          exportContent = this.exportToHTML(report);
          filename = `report-${report.templateName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.html`;
          break;
        
        case 'json':
          exportContent = JSON.stringify(report, null, 2);
          filename = `report-${report.templateName.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.json`;
          break;
        
        default:
          throw new Error('Unsupported export format');
      }

      // Save export record to MongoDB
      try {
        await saveExportedReport({
          reportId: reportId,
          format: format,
          fileName: filename,
          filePath: null, // Will be set by main process when saved to disk
          fileSize: Buffer.byteLength(exportContent, 'utf8'),
          originalReport: {
            templateName: report.templateName,
            generatedAt: report.generatedAt,
            sessionId: report.sessionId
          },
          exportSettings: {
            format: format,
            timestamp: timestamp
          }
        });
        console.log(`Export record saved for report ${reportId}`);
      } catch (error) {
        console.error('Failed to save export record:', error);
        // Don't fail the export if MongoDB save fails
      }

      return {
        success: true,
        content: exportContent,
        filename: filename,
        mimeType: this.getMimeType(format),
        reportId: reportId,
        fileSize: Buffer.byteLength(exportContent, 'utf8')
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  exportToMarkdown(report) {
    const date = new Date(report.generatedAt).toLocaleDateString();
    const time = new Date(report.generatedAt).toLocaleTimeString();

    return `# ${report.templateName}

**Generated:** ${date} at ${time}
**Template:** ${report.templateName}
${report.sessionId ? `**Session:** ${report.sessionId}` : ''}

---

${report.content}

---

*Report generated by bitscribe*
*Tokens used: ${report.metadata.tokensUsed} | Cost: $${report.metadata.cost.toFixed(4)}*`;
  }

  exportToHTML(report) {
    const date = new Date(report.generatedAt).toLocaleDateString();
    const time = new Date(report.generatedAt).toLocaleTimeString();

    // Convert markdown to HTML (basic conversion)
    let htmlContent = report.content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${report.templateName}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
        .footer { border-top: 1px solid #ccc; margin-top: 30px; padding-top: 10px; font-size: 0.9em; color: #666; }
        h1, h2, h3 { color: #333; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${report.templateName}</h1>
        <p><strong>Generated:</strong> ${date} at ${time}</p>
        <p><strong>Template:</strong> ${report.templateName}</p>
        ${report.sessionId ? `<p><strong>Session:</strong> ${report.sessionId}</p>` : ''}
    </div>
    
    <div class="content">
        ${htmlContent}
    </div>
    
    <div class="footer">
        <p><em>Report generated by bitscribe</em></p>
        <p><em>Tokens used: ${report.metadata.tokensUsed} | Cost: $${report.metadata.cost.toFixed(4)}</em></p>
    </div>
</body>
</html>`;
  }

  getMimeType(format) {
    const mimeTypes = {
      'markdown': 'text/markdown',
      'html': 'text/html',
      'json': 'application/json'
    };
    return mimeTypes[format] || 'text/plain';
  }
}

// Create singleton instance
const reportGenerator = new ReportGeneratorService();

module.exports = {
  reportGenerator,
  generateReport: (templateId, transcript, variables, sessionId) => 
    reportGenerator.generateReport(templateId, transcript, variables, sessionId),
  getReport: (reportId) => reportGenerator.getReport(reportId),
  getSessionReports: (sessionId) => reportGenerator.getSessionReports(sessionId),
  getUserReports: (filter, options) => reportGenerator.getUserReports(filter, options),
  updateReport: (reportId, updates) => reportGenerator.updateReport(reportId, updates),
  exportReport: (reportId, format) => reportGenerator.exportReport(reportId, format)
};
```

# app/services/research.js

```js
// Research Service - Google and Wikipedia Integration
const https = require('https');
const { loadConfig } = require('../config');

class ResearchService {
  constructor() {
    this.config = loadConfig();
    this.maxResults = this.config.research.max_results || 3;
    this.providers = this.config.research.providers || ['wikipedia'];
  }

  async fetchResearchSummaries(topics) {
    if (!topics || topics.length === 0) {
      return [];
    }

    const summaries = [];
    
    // Process each topic
    for (const topic of topics.slice(0, 3)) { // Limit to 3 topics
      try {
        const results = await this.researchTopic(topic);
        if (results.length > 0) {
          summaries.push({
            topic: topic,
            sources: results,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error(`Failed to research topic "${topic}":`, error);
      }
    }

    return summaries;
  }

  async researchTopic(topic) {
    const results = [];

    // Research from enabled providers
    if (this.providers.includes('wikipedia')) {
      const wikiResult = await this.searchWikipedia(topic);
      if (wikiResult) results.push(wikiResult);
    }

    if (this.providers.includes('duckduckgo')) {
      const ddgResult = await this.searchDuckDuckGo(topic);
      if (ddgResult) results.push(ddgResult);
    }

    if (this.providers.includes('searxng')) {
      const searxResults = await this.searchSearXNG(topic);
      results.push(...searxResults);
    }

    if (this.providers.includes('google')) {
      const googleResults = await this.searchGoogle(topic);
      results.push(...googleResults);
    }

    return results.slice(0, this.maxResults);
  }

  async searchWikipedia(query) {
    return new Promise((resolve) => {
      const encodedQuery = encodeURIComponent(query);
      const options = {
        hostname: 'en.wikipedia.org',
        path: `/w/api.php?action=query&format=json&prop=extracts&exintro=true&explaintext=true&titles=${encodedQuery}`,
        method: 'GET',
        headers: {
          'User-Agent': 'ResearchCompanion/1.0'
        }
      };

      https.get(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const pages = response.query.pages;
            const pageId = Object.keys(pages)[0];
            
            if (pageId !== '-1' && pages[pageId].extract) {
              const extract = pages[pageId].extract;
              const summary = extract.length > 300 
                ? extract.substring(0, 297) + '...' 
                : extract;
              
              resolve({
                source: 'Wikipedia',
                title: pages[pageId].title,
                summary: summary,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pages[pageId].title.replace(/ /g, '_'))}`
              });
            } else {
              resolve(null);
            }
          } catch (error) {
            console.error('Wikipedia parse error:', error);
            resolve(null);
          }
        });
      }).on('error', (error) => {
        console.error('Wikipedia request error:', error);
        resolve(null);
      });
    });
  }

  async searchGoogle(query) {
    const apiKey = this.config.research.googleApiKey;
    const searchEngineId = this.config.research.googleSearchEngineId;
    
    // Check if API credentials are configured
    if (!apiKey || !searchEngineId || 
        apiKey === 'YOUR_GOOGLE_API_KEY_HERE' || 
        searchEngineId === 'YOUR_SEARCH_ENGINE_ID_HERE') {
      console.log('Google search not configured - please add API credentials to config');
      return [];
    }

    return new Promise((resolve) => {
      const encodedQuery = encodeURIComponent(query);
      const options = {
        hostname: 'www.googleapis.com',
        path: `/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodedQuery}&num=2`,
        method: 'GET'
      };

      https.get(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.items) {
              response.items.forEach(item => {
                results.push({
                  source: 'Google',
                  title: item.title,
                  summary: item.snippet,
                  url: item.link
                });
              });
            } else if (response.error) {
              console.error('Google API error:', response.error.message);
            }
            
            resolve(results);
          } catch (error) {
            console.error('Google search parse error:', error);
            resolve([]);
          }
        });
      }).on('error', (error) => {
        console.error('Google search request error:', error);
        resolve([]);
      });
    });
  }

  // Free alternative search sources
  async searchDuckDuckGo(query) {
    // DuckDuckGo Instant Answer API (free, no registration)
    return new Promise((resolve) => {
      const encodedQuery = encodeURIComponent(query);
      const options = {
        hostname: 'api.duckduckgo.com',
        path: `/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-ResearchCompanion/1.0'
        }
      };

      https.get(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            
            // Try Abstract first (best results)
            if (response.AbstractText && response.AbstractText.length > 10) {
              const summary = response.AbstractText.length > 300 
                ? response.AbstractText.substring(0, 297) + '...' 
                : response.AbstractText;
              
              resolve({
                source: 'DuckDuckGo',
                title: response.Heading || query,
                summary: summary,
                url: response.AbstractURL || `https://duckduckgo.com/?q=${encodedQuery}`
              });
              return;
            }

            // Try Definition if available
            if (response.Definition && response.Definition.length > 10) {
              const summary = response.Definition.length > 300 
                ? response.Definition.substring(0, 297) + '...' 
                : response.Definition;
              
              resolve({
                source: 'DuckDuckGo',
                title: response.DefinitionSource || query,
                summary: summary,
                url: response.DefinitionURL || `https://duckduckgo.com/?q=${encodedQuery}`
              });
              return;
            }

            // Try Answer (for quick facts)
            if (response.Answer && response.Answer.length > 5) {
              resolve({
                source: 'DuckDuckGo',
                title: `${query} (Quick Answer)`,
                summary: response.Answer,
                url: `https://duckduckgo.com/?q=${encodedQuery}`
              });
              return;
            }

            resolve(null);
          } catch (error) {
            console.error('DuckDuckGo parse error:', error);
            resolve(null);
          }
        });
      }).on('error', (error) => {
        console.error('DuckDuckGo request error:', error);
        resolve(null);
      });
    });
  }

  // Alternative: Search using SearXNG (privacy-focused metasearch)
  async searchSearXNG(query) {
    // Using public SearXNG instance (completely free)
    return new Promise((resolve) => {
      const encodedQuery = encodeURIComponent(query);
      const options = {
        hostname: 'searx.be',  // Public SearXNG instance
        path: `/search?q=${encodedQuery}&format=json&categories=general`,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-ResearchCompanion/1.0'
        },
        timeout: 5000
      };

      https.get(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.results && response.results.length > 0) {
              // Get top 2 results
              response.results.slice(0, 2).forEach(item => {
                if (item.content && item.content.length > 20) {
                  const summary = item.content.length > 300 
                    ? item.content.substring(0, 297) + '...' 
                    : item.content;
                  
                  results.push({
                    source: 'Web Search',
                    title: item.title || query,
                    summary: summary.replace(/<[^>]*>/g, ''), // Remove HTML tags
                    url: item.url
                  });
                }
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('SearXNG parse error:', error);
            resolve([]);
          }
        });
      }).on('error', (error) => {
        console.error('SearXNG request error:', error);
        resolve([]);
      });
    });
  }
}

// Create singleton instance
const researchService = new ResearchService();

// Export main functions
module.exports = {
  fetchResearchSummaries: (topics) => researchService.fetchResearchSummaries(topics),
  researchTopic: (topic) => researchService.researchTopic(topic)
}; 
```

# app/services/research/index.js

```js
// Enhanced Research Service - Main Orchestrator
// Coordinates AI-powered research across multiple providers
const EventEmitter = require('events');
const { loadConfig } = require('../../config');

// Import AI Research Agent
const { 
  analyzeContext, 
  generateResearchQueries, 
  synthesizeResearch,
  evaluateCredibility,
  generateFollowUpQuestions,
  identifyKnowledgeGaps 
} = require('../aiResearchAgent');

// Import research providers
const { searchAI } = require('./providers/aiPowered');
const { searchAcademic } = require('./providers/academic');
const { searchNews } = require('./providers/news');
const { searchTechnical } = require('./providers/technical');

// Import legacy providers
const oldResearch = require('../research');

class EnhancedResearchService extends EventEmitter {
  constructor() {
    super();
    this.config = loadConfig();
    this.researchCache = new Map();
    this.activeSearches = new Set();
    
    // Periodic cache cleanup to prevent memory leaks during long sessions
    this.cacheCleanupInterval = setInterval(() => {
      this.cleanupExpiredCache();
    }, 2 * 60 * 1000); // Clean every 2 minutes
  }
  
  // Clean up expired cache entries
  cleanupExpiredCache() {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, value] of this.researchCache.entries()) {
      if (now - value.timestamp > 5 * 60 * 1000) { // 5 minute TTL
        this.researchCache.delete(key);
        cleaned++;
      }
    }
    
    // Also limit total cache size to prevent unbounded growth
    if (this.researchCache.size > 100) {
      const entries = Array.from(this.researchCache.entries());
      // Sort by timestamp and keep only the 50 most recent
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      this.researchCache.clear();
      entries.slice(0, 50).forEach(([key, value]) => {
        this.researchCache.set(key, value);
      });
      cleaned += entries.length - 50;
    }
    
    if (cleaned > 0) {
      console.log(`🗑️ Research cache: cleaned ${cleaned} expired entries, ${this.researchCache.size} remaining`);
    }
  }

  // Main research method - AI-powered and context-aware
  async research(topics, transcript, previousResearch = []) {
    if (!topics || topics.length === 0) {
      return [];
    }

    console.log('🧠 Enhanced Research: Starting AI-powered research for topics:', topics);

    try {
      // Step 1: Analyze context with AI
      const context = await analyzeContext(
        transcript || topics.join('. '), 
        topics, 
        previousResearch
      );
      console.log('📊 Research context analyzed:', context.primaryFocus);

      // Step 2: Generate smart queries for each topic
      const researchPromises = topics.slice(0, 5).map(async (topic) => {
        try {
          // Skip invalid or system topics
          if (!topic || topic.length < 2 || 
              topic.includes('BLANK_AUDIO') || 
              topic.includes('NULL') || 
              topic.includes('UNDEFINED')) {
            console.log('🚫 Skipping invalid topic:', topic);
            return null;
          }

          // Check cache first
          const cacheKey = `${topic}-${context.informationType}`;
          if (this.researchCache.has(cacheKey)) {
            const cached = this.researchCache.get(cacheKey);
            if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minute cache
              console.log('📦 Using cached research for:', topic);
              return cached.data;
            }
          }

          // Generate intelligent queries
          const queries = await generateResearchQueries(topic, context, context.informationType);
          console.log(`🔍 Generated ${queries.length} queries for topic:`, topic);

          // Execute searches in parallel across providers
          const searchResults = await this.executeSearches(topic, queries, context);
          console.log(`📚 Found ${searchResults.length} results for:`, topic);

          // Synthesize results with AI
          const synthesis = await synthesizeResearch(topic, searchResults, context);
          
          // Evaluate credibility of sources
          const credibilityPromises = searchResults.slice(0, 3).map(result => 
            evaluateCredibility(result, result.summary)
          );
          const credibilityScores = await Promise.all(credibilityPromises);

          // Generate follow-up questions (only if synthesis exists)
          const followUpQuestions = synthesis ? 
            await generateFollowUpQuestions(topic, synthesis, context) : [];

          // Combine everything into enhanced research result
          const enhancedResult = {
            topic,
            context: context.contextSummary,
            primaryFocus: context.primaryFocus,
            sources: searchResults.map((result, index) => ({
              ...result,
              credibility: credibilityScores[index] || { score: 50, recommendation: 'use with caution' }
            })),
            synthesis: synthesis || {
              synthesis: searchResults.map(r => r.summary).join(' '),
              keyPoints: [],
              confidence: 'low'
            },
            followUpQuestions,
            timestamp: new Date().toISOString()
          };

          // Cache the result
          this.researchCache.set(cacheKey, {
            data: enhancedResult,
            timestamp: Date.now()
          });

          // Emit progress event
          this.emit('research-progress', {
            topic,
            status: 'completed',
            resultCount: searchResults.length
          });

          return enhancedResult;

        } catch (error) {
          console.error(`Error researching topic "${topic}":`, error);
          this.emit('research-error', { topic, error: error.message });
          return null;
        }
      });

      // Wait for all research to complete
      const results = await Promise.all(researchPromises);
      const validResults = results.filter(r => r !== null);

      // Identify knowledge gaps across all topics
      if (validResults.length > 0) {
        const gaps = await identifyKnowledgeGaps(topics, validResults);
        this.emit('knowledge-gaps', gaps);
      }

      console.log(`✅ Enhanced research completed: ${validResults.length} topics researched`);
      return validResults;

    } catch (error) {
      console.error('Enhanced research error:', error);
      this.emit('research-error', { error: error.message });
      return [];
    }
  }

  // Execute searches across multiple providers
  async executeSearches(topic, queries, context) {
    const searchPromises = [];
    const maxResultsPerProvider = 3;

    // Determine which providers to use based on context
    const providers = this.selectProviders(context.informationType);
    
    // Execute queries across selected providers
    queries.forEach(queryObj => {
      const { query, sourceType } = queryObj;
      
      if (providers.includes('ai') && ['general', 'ai-synthesis'].includes(sourceType)) {
        searchPromises.push(searchAI(query, { 
          maxResults: maxResultsPerProvider,
          depth: 'advanced' 
        }));
      }
      
      if (providers.includes('academic') && ['academic', 'technical'].includes(sourceType)) {
        searchPromises.push(searchAcademic(query, { 
          maxResults: maxResultsPerProvider 
        }));
      }
      
      if (providers.includes('news') && ['news', 'current_events'].includes(sourceType)) {
        searchPromises.push(searchNews(query, { 
          maxResults: maxResultsPerProvider,
          sortBy: 'relevancy' 
        }));
      }
      
      if (providers.includes('technical') && ['technical', 'tutorial'].includes(sourceType)) {
        searchPromises.push(searchTechnical(query, { 
          maxResults: maxResultsPerProvider 
        }));
      }
      
      // Also use legacy providers
      if (providers.includes('wikipedia')) {
        searchPromises.push(oldResearch.researchTopic(topic));
      }
    });

    try {
      const results = await Promise.all(searchPromises);
      // Flatten, remove duplicates, and sort by relevance
      const allResults = results.flat().filter(r => r !== null);
      return this.deduplicateAndRank(allResults);
    } catch (error) {
      console.error('Search execution error:', error);
      return [];
    }
  }

  // Select providers based on information type and availability
  selectProviders(informationType) {
    // Start with free/reliable providers
    const baseProviders = ['wikipedia'];
    
    // Check which enhanced providers are configured
    const availableProviders = this.getAvailableProviders();
    
    const providerMap = {
      'technical': [...baseProviders, 'technical'],
      'tutorial': [...baseProviders, 'technical'],
      'comparison': [...baseProviders, 'technical'],
      'explanation': [...baseProviders],
      'current_events': [...baseProviders, 'news'],
      'academic': [...baseProviders, 'academic'],
      'general': [...baseProviders]
    };

    let selectedProviders = providerMap[informationType] || baseProviders;
    
    // Add AI providers if available
    if (availableProviders.includes('ai')) {
      selectedProviders.unshift('ai');
    }
    
    return selectedProviders;
  }

  // Check which providers have valid configuration
  getAvailableProviders() {
    const available = [];
    
    // Check AI providers
    if (this.config.research?.tavilyApiKey) {
      available.push('ai');
    }
    
    // Check academic providers (many are free)
    if (this.config.research?.academicProviders?.length > 0) {
      available.push('academic');
    }
    
    // Check technical providers (Stack Overflow is free)
    if (this.config.research?.technicalProviders?.length > 0) {
      available.push('technical');
    }
    
    // Check news providers (Reddit/HN are free)
    if (this.config.research?.newsProviders?.length > 0) {
      available.push('news');
    }
    
    return available;
  }

  // Deduplicate and rank results
  deduplicateAndRank(results) {
    // Remove exact duplicates based on URL
    const uniqueResults = [];
    const seenUrls = new Set();
    
    results.forEach(result => {
      if (!seenUrls.has(result.url)) {
        seenUrls.add(result.url);
        uniqueResults.push(result);
      }
    });

    // Rank by multiple factors
    return uniqueResults.sort((a, b) => {
      // Prioritize AI synthesis
      if (a.type === 'ai-synthesis' && b.type !== 'ai-synthesis') return -1;
      if (b.type === 'ai-synthesis' && a.type !== 'ai-synthesis') return 1;
      
      // Then by relevance score if available
      const scoreA = a.relevanceScore || a.score || 0;
      const scoreB = b.relevanceScore || b.score || 0;
      if (scoreA !== scoreB) return scoreB - scoreA;
      
      // Then by recency
      const dateA = new Date(a.publishedAt || a.timestamp);
      const dateB = new Date(b.publishedAt || b.timestamp);
      return dateB - dateA;
    }).slice(0, 10); // Limit to top 10 results
  }

  // Quick search for immediate results
  async quickSearch(query, options = {}) {
    console.log('⚡ Quick search for:', query);
    
    try {
      const searchPromises = [
        searchAI(query, { maxResults: 2 }),
        oldResearch.researchTopic(query)
      ];

      const results = await Promise.all(searchPromises);
      return results.flat().filter(r => r !== null).slice(0, 5);
    } catch (error) {
      console.error('Quick search error:', error);
      return [];
    }
  }

  // Search with specific provider
  async searchWithProvider(query, provider, options = {}) {
    switch (provider) {
      case 'ai':
        return searchAI(query, options);
      case 'academic':
        return searchAcademic(query, options);
      case 'news':
        return searchNews(query, options);
      case 'technical':
        return searchTechnical(query, options);
      default:
        return oldResearch.researchTopic(query);
    }
  }

  // Clear cache
  clearCache() {
    this.researchCache.clear();
    console.log('🗑️ Research cache cleared');
  }
  
  // Cleanup when service is destroyed
  destroy() {
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
      this.cacheCleanupInterval = null;
    }
    this.clearCache();
    this.activeSearches.clear();
    console.log('🔥 Enhanced research service destroyed');
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.researchCache.size,
      entries: Array.from(this.researchCache.entries()).map(([key, value]) => ({
        key,
        timestamp: new Date(value.timestamp).toISOString(),
        age: Date.now() - value.timestamp
      }))
    };
  }
}

// Create singleton instance
const enhancedResearch = new EnhancedResearchService();

// Export enhanced research functions
module.exports = {
  // Main research function
  fetchResearchSummaries: (topics, transcript, previousResearch) => 
    enhancedResearch.research(topics, transcript, previousResearch),
  
  // Quick search
  quickSearch: (query, options) => 
    enhancedResearch.quickSearch(query, options),
  
  // Provider-specific searches
  searchWithProvider: (query, provider, options) => 
    enhancedResearch.searchWithProvider(query, provider, options),
  
  // Cache management
  clearResearchCache: () => enhancedResearch.clearCache(),
  getResearchCacheStats: () => enhancedResearch.getCacheStats(),
  
  // Event emitter for progress tracking
  researchEmitter: enhancedResearch,
  
  // Legacy compatibility
  researchTopic: (topic) => oldResearch.researchTopic(topic)
};
```

# app/services/research/providers/academic.js

```js
// Academic Research Provider
// Searches scholarly sources, research papers, and academic databases
const https = require('https');
const { loadConfig } = require('../../../config');

class AcademicResearchProvider {
  constructor() {
    this.config = loadConfig();
  }

  // ArXiv API - Free access to scientific papers
  async searchArXiv(query, options = {}) {
    return new Promise((resolve) => {
      const encodedQuery = encodeURIComponent(query);
      const maxResults = options.maxResults || 5;
      
      const requestOptions = {
        hostname: 'export.arxiv.org',
        path: `/api/query?search_query=all:${encodedQuery}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-Research/1.0'
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const results = [];
            
            // Parse XML response (simplified - in production use xml2js)
            const entries = data.match(/<entry>([\s\S]*?)<\/entry>/g) || [];
            
            entries.forEach(entry => {
              const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1]?.trim();
              const summary = (entry.match(/<summary>([\s\S]*?)<\/summary>/) || [])[1]?.trim();
              const authors = entry.match(/<name>([\s\S]*?)<\/name>/g)?.map(a => 
                a.replace(/<\/?name>/g, '').trim()
              ) || [];
              const link = (entry.match(/<id>([\s\S]*?)<\/id>/) || [])[1]?.trim();
              const published = (entry.match(/<published>([\s\S]*?)<\/published>/) || [])[1]?.trim();
              
              if (title && summary) {
                results.push({
                  source: 'ArXiv',
                  title: title,
                  summary: summary.length > 300 ? summary.substring(0, 297) + '...' : summary,
                  fullAbstract: summary,
                  authors: authors,
                  url: link?.replace('http://arxiv.org/abs/', 'https://arxiv.org/abs/'),
                  pdfUrl: link?.replace('http://arxiv.org/abs/', 'https://arxiv.org/pdf/') + '.pdf',
                  type: 'research-paper',
                  publishedDate: published,
                  timestamp: new Date().toISOString()
                });
              }
            });
            
            resolve(results);
          } catch (error) {
            console.error('ArXiv parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('ArXiv request error:', error);
        resolve([]);
      });
    });
  }

  // PubMed API - Biomedical literature
  async searchPubMed(query, options = {}) {
    return new Promise(async (resolve) => {
      try {
        // First, search for IDs
        const encodedQuery = encodeURIComponent(query);
        const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodedQuery}&retmode=json&retmax=${options.maxResults || 5}`;
        
        https.get(searchUrl, (res) => {
          let searchData = '';
          res.on('data', chunk => searchData += chunk);
          res.on('end', async () => {
            try {
              const searchResult = JSON.parse(searchData);
              const ids = searchResult.esearchresult?.idlist || [];
              
              if (ids.length === 0) {
                resolve([]);
                return;
              }
              
              // Fetch summaries for the IDs
              const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
              
              https.get(summaryUrl, (res2) => {
                let summaryData = '';
                res2.on('data', chunk => summaryData += chunk);
                res2.on('end', () => {
                  try {
                    const summaryResult = JSON.parse(summaryData);
                    const results = [];
                    
                    ids.forEach(id => {
                      const article = summaryResult.result?.[id];
                      if (article) {
                        const authors = article.authors?.map(a => a.name).join(', ') || 'Unknown';
                        results.push({
                          source: 'PubMed',
                          title: article.title,
                          summary: `${article.source} (${article.pubdate}). Authors: ${authors}`,
                          authors: article.authors?.map(a => a.name) || [],
                          journal: article.source,
                          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
                          type: 'medical-research',
                          publishedDate: article.pubdate,
                          doi: article.doi,
                          pmid: id,
                          timestamp: new Date().toISOString()
                        });
                      }
                    });
                    
                    resolve(results);
                  } catch (error) {
                    console.error('PubMed summary parse error:', error);
                    resolve([]);
                  }
                });
              }).on('error', error => {
                console.error('PubMed summary request error:', error);
                resolve([]);
              });
            } catch (error) {
              console.error('PubMed search parse error:', error);
              resolve([]);
            }
          });
        }).on('error', error => {
          console.error('PubMed search request error:', error);
          resolve([]);
        });
      } catch (error) {
        console.error('PubMed error:', error);
        resolve([]);
      }
    });
  }

  // Semantic Scholar API - AI-powered research paper search
  async searchSemanticScholar(query, options = {}) {
    return new Promise((resolve) => {
      const encodedQuery = encodeURIComponent(query);
      const fields = 'paperId,title,abstract,authors,year,citationCount,influentialCitationCount,isOpenAccess,openAccessPdf,venue';
      const limit = options.maxResults || 5;
      
      const requestOptions = {
        hostname: 'api.semanticscholar.org',
        path: `/graph/v1/paper/search?query=${encodedQuery}&fields=${fields}&limit=${limit}`,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-Research/1.0'
        }
      };

      // Add API key if available
      if (this.config.research?.semanticScholarApiKey) {
        requestOptions.headers['x-api-key'] = this.config.research.semanticScholarApiKey;
      }

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.data) {
              response.data.forEach(paper => {
                const authorNames = paper.authors?.map(a => a.name).join(', ') || 'Unknown';
                results.push({
                  source: 'Semantic Scholar',
                  title: paper.title,
                  summary: paper.abstract ? 
                    (paper.abstract.length > 300 ? paper.abstract.substring(0, 297) + '...' : paper.abstract) :
                    `Published in ${paper.venue || 'Unknown'} (${paper.year}). Authors: ${authorNames}`,
                  fullAbstract: paper.abstract,
                  authors: paper.authors?.map(a => a.name) || [],
                  url: `https://www.semanticscholar.org/paper/${paper.paperId}`,
                  pdfUrl: paper.openAccessPdf?.url,
                  type: 'research-paper',
                  year: paper.year,
                  citationCount: paper.citationCount,
                  influentialCitationCount: paper.influentialCitationCount,
                  isOpenAccess: paper.isOpenAccess,
                  venue: paper.venue,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Semantic Scholar parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Semantic Scholar request error:', error);
        resolve([]);
      });
    });
  }

  // CORE API - Open access research papers
  async searchCORE(query, options = {}) {
    const apiKey = this.config.research?.coreApiKey;
    if (!apiKey) {
      console.log('CORE API key not configured - using limited access');
    }

    return new Promise((resolve) => {
      const params = new URLSearchParams({
        q: query,
        limit: options.maxResults || 5,
        stats: false
      });

      const requestOptions = {
        hostname: 'api.core.ac.uk',
        path: `/v3/search/outputs?${params}`,
        method: 'GET',
        headers: {
          'Authorization': apiKey ? `Bearer ${apiKey}` : ''
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.results) {
              response.results.forEach(paper => {
                results.push({
                  source: 'CORE',
                  title: paper.title,
                  summary: paper.abstract ? 
                    (paper.abstract.length > 300 ? paper.abstract.substring(0, 297) + '...' : paper.abstract) :
                    paper.description || 'Open access research paper',
                  authors: paper.authors || [],
                  url: paper.sourceFulltextUrls?.[0] || paper.downloadUrl,
                  pdfUrl: paper.downloadUrl,
                  type: 'open-access-paper',
                  year: paper.yearPublished,
                  doi: paper.doi,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('CORE parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('CORE request error:', error);
        resolve([]);
      });
    });
  }

  // Google Scholar (via SerpAPI if configured)
  async searchGoogleScholar(query, options = {}) {
    const apiKey = this.config.research?.serpApiKey;
    if (!apiKey) {
      console.log('Google Scholar search requires SerpAPI key');
      return [];
    }

    return new Promise((resolve) => {
      const params = new URLSearchParams({
        api_key: apiKey,
        engine: 'google_scholar',
        q: query,
        num: options.maxResults || 5,
        hl: 'en'
      });

      const requestOptions = {
        hostname: 'serpapi.com',
        path: `/search.json?${params}`,
        method: 'GET'
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.organic_results) {
              response.organic_results.forEach(result => {
                results.push({
                  source: 'Google Scholar',
                  title: result.title,
                  summary: result.snippet || result.publication_info?.summary || '',
                  authors: result.publication_info?.authors?.map(a => a.name) || [],
                  url: result.link,
                  pdfUrl: result.resources?.find(r => r.file_format === 'PDF')?.link,
                  type: 'scholarly-article',
                  year: result.publication_info?.year,
                  citationCount: result.inline_links?.cited_by?.total,
                  venue: result.publication_info?.venue,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Google Scholar parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Google Scholar request error:', error);
        resolve([]);
      });
    });
  }

  // Main search method combining all academic sources
  async search(query, options = {}) {
    const enabledProviders = this.config.research?.academicProviders || 
      ['arxiv', 'semanticscholar', 'pubmed'];
    
    const searchPromises = [];
    
    if (enabledProviders.includes('arxiv')) {
      searchPromises.push(this.searchArXiv(query, options));
    }
    
    if (enabledProviders.includes('pubmed')) {
      searchPromises.push(this.searchPubMed(query, options));
    }
    
    if (enabledProviders.includes('semanticscholar')) {
      searchPromises.push(this.searchSemanticScholar(query, options));
    }
    
    if (enabledProviders.includes('core')) {
      searchPromises.push(this.searchCORE(query, options));
    }
    
    if (enabledProviders.includes('googlescholar')) {
      searchPromises.push(this.searchGoogleScholar(query, options));
    }
    
    try {
      const results = await Promise.all(searchPromises);
      // Flatten and sort by relevance/citation count
      return results.flat()
        .filter(r => r !== null)
        .sort((a, b) => {
          // Prioritize papers with citation counts
          const aCitations = a.citationCount || 0;
          const bCitations = b.citationCount || 0;
          return bCitations - aCitations;
        });
    } catch (error) {
      console.error('Academic search error:', error);
      return [];
    }
  }

  // Search for papers by a specific author
  async searchByAuthor(authorName, options = {}) {
    const query = `author:"${authorName}"`;
    return this.search(query, options);
  }

  // Search for papers in a specific field
  async searchByField(field, topic, options = {}) {
    const fieldQueries = {
      'cs': `cat:cs.* ${topic}`, // Computer Science on ArXiv
      'physics': `cat:physics.* ${topic}`,
      'math': `cat:math.* ${topic}`,
      'biology': `${field} ${topic}`,
      'medicine': `${field} ${topic}`
    };
    
    const query = fieldQueries[field.toLowerCase()] || `${field} ${topic}`;
    return this.search(query, options);
  }
}

// Export singleton instance
const academicProvider = new AcademicResearchProvider();

module.exports = {
  searchAcademic: (query, options) => academicProvider.search(query, options),
  searchArXiv: (query, options) => academicProvider.searchArXiv(query, options),
  searchPubMed: (query, options) => academicProvider.searchPubMed(query, options),
  searchSemanticScholar: (query, options) => academicProvider.searchSemanticScholar(query, options),
  searchCORE: (query, options) => academicProvider.searchCORE(query, options),
  searchGoogleScholar: (query, options) => academicProvider.searchGoogleScholar(query, options),
  searchByAuthor: (author, options) => academicProvider.searchByAuthor(author, options),
  searchByField: (field, topic, options) => academicProvider.searchByField(field, topic, options)
};
```

# app/services/research/providers/aiPowered.js

```js
// AI-Powered Research Providers
// Integrates with AI search engines for intelligent research
const https = require('https');
const { loadConfig } = require('../../../config');

class AISearchProvider {
  constructor() {
    this.config = loadConfig();
  }

  // Perplexity AI Search
  async searchPerplexity(query, options = {}) {
    const apiKey = this.config.research?.perplexityApiKey;
    if (!apiKey) {
      console.log('Perplexity API key not configured');
      return [];
    }

    return new Promise((resolve) => {
      const payload = {
        model: 'sonar-medium-online', // Real-time web search model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful research assistant. Provide accurate, relevant information with sources.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        return_citations: true,
        search_recency_filter: options.recency || 'month', // month, week, day, hour
        stream: false
      };

      const postData = JSON.stringify(payload);
      const requestOptions = {
        hostname: 'api.perplexity.ai',
        path: '/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.choices && response.choices[0]) {
              const content = response.choices[0].message.content;
              const citations = response.citations || [];
              
              resolve([{
                source: 'Perplexity AI',
                title: `AI Research: ${query}`,
                summary: content,
                fullContent: content,
                citations: citations,
                url: 'https://www.perplexity.ai',
                type: 'ai-synthesis',
                confidence: 'high',
                timestamp: new Date().toISOString()
              }]);
            } else {
              resolve([]);
            }
          } catch (error) {
            console.error('Perplexity parse error:', error);
            resolve([]);
          }
        });
      });

      req.on('error', error => {
        console.error('Perplexity request error:', error);
        resolve([]);
      });

      req.write(postData);
      req.end();
    });
  }

  // You.com AI Search
  async searchYouDotCom(query, options = {}) {
    const apiKey = this.config.research?.youApiKey;
    if (!apiKey) {
      console.log('You.com API key not configured - using free tier');
      // You.com offers limited free search
    }

    return new Promise((resolve) => {
      const encodedQuery = encodeURIComponent(query);
      const requestOptions = {
        hostname: 'api.ydc-index.io',
        path: `/search?query=${encodedQuery}`,
        method: 'GET',
        headers: {
          'X-API-Key': apiKey || '',
          'Content-Type': 'application/json'
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.hits) {
              response.hits.slice(0, 3).forEach(hit => {
                results.push({
                  source: 'You.com',
                  title: hit.title || query,
                  summary: hit.description || hit.snippet,
                  url: hit.url,
                  type: 'ai-enhanced',
                  relevanceScore: hit.score,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('You.com parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('You.com request error:', error);
        resolve([]);
      });
    });
  }

  // Tavily AI Search (designed for AI agents)
  async searchTavily(query, options = {}) {
    const apiKey = this.config.research?.tavilyApiKey;
    if (!apiKey) {
      console.log('Tavily API key not configured');
      return [];
    }

    return new Promise((resolve) => {
      const payload = {
        api_key: apiKey,
        query: query,
        search_depth: options.depth || 'advanced', // basic or advanced
        include_answer: true,
        include_raw_content: options.includeRaw || false,
        max_results: options.maxResults || 5,
        include_domains: options.domains || [],
        exclude_domains: options.excludeDomains || []
      };

      const postData = JSON.stringify(payload);
      const requestOptions = {
        hostname: 'api.tavily.com',
        path: '/search',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            // Add the AI-generated answer if available
            if (response.answer) {
              results.push({
                source: 'Tavily AI',
                title: 'AI Summary',
                summary: response.answer,
                type: 'ai-answer',
                confidence: 'high',
                url: 'https://tavily.com',
                timestamp: new Date().toISOString()
              });
            }
            
            // Add individual search results
            if (response.results) {
              response.results.forEach(result => {
                results.push({
                  source: 'Tavily Search',
                  title: result.title,
                  summary: result.content,
                  url: result.url,
                  type: 'web-result',
                  relevanceScore: result.score,
                  publishedDate: result.published_date,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Tavily parse error:', error);
            resolve([]);
          }
        });
      });

      req.on('error', error => {
        console.error('Tavily request error:', error);
        resolve([]);
      });

      req.write(postData);
      req.end();
    });
  }

  // SerpAPI - Access Google, Bing, and other search engines
  async searchSerpAPI(query, options = {}) {
    const apiKey = this.config.research?.serpApiKey;
    if (!apiKey) {
      console.log('SerpAPI key not configured');
      return [];
    }

    return new Promise((resolve) => {
      const params = new URLSearchParams({
        api_key: apiKey,
        q: query,
        engine: options.engine || 'google',
        num: options.num || 5,
        hl: 'en',
        gl: 'us'
      });

      const requestOptions = {
        hostname: 'serpapi.com',
        path: `/search.json?${params}`,
        method: 'GET'
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            // Organic results
            if (response.organic_results) {
              response.organic_results.forEach(result => {
                results.push({
                  source: 'Google Search',
                  title: result.title,
                  summary: result.snippet,
                  url: result.link,
                  type: 'search-result',
                  position: result.position,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            // Knowledge graph
            if (response.knowledge_graph) {
              const kg = response.knowledge_graph;
              results.push({
                source: 'Google Knowledge Graph',
                title: kg.title,
                summary: kg.description,
                url: kg.source?.link,
                type: 'knowledge-graph',
                metadata: {
                  type: kg.type,
                  facts: kg.facts
                },
                timestamp: new Date().toISOString()
              });
            }
            
            // Answer box
            if (response.answer_box) {
              results.push({
                source: 'Google Answer',
                title: response.answer_box.title || 'Quick Answer',
                summary: response.answer_box.answer || response.answer_box.snippet,
                url: response.answer_box.link,
                type: 'answer-box',
                timestamp: new Date().toISOString()
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('SerpAPI parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('SerpAPI request error:', error);
        resolve([]);
      });
    });
  }

  // Brave Search API
  async searchBrave(query, options = {}) {
    const apiKey = this.config.research?.braveApiKey;
    if (!apiKey) {
      console.log('Brave Search API key not configured');
      return [];
    }

    return new Promise((resolve) => {
      const params = new URLSearchParams({
        q: query,
        count: options.count || 5,
        freshness: options.freshness || '', // pd, pw, pm, py (past day/week/month/year)
        text_decorations: false
      });

      const requestOptions = {
        hostname: 'api.search.brave.com',
        path: `/res/v1/web/search?${params}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': apiKey
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.web?.results) {
              response.web.results.forEach(result => {
                results.push({
                  source: 'Brave Search',
                  title: result.title,
                  summary: result.description,
                  url: result.url,
                  type: 'web-result',
                  age: result.age, // How old the content is
                  language: result.language,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            // Brave also provides discussions (Reddit, forums)
            if (response.discussions?.results) {
              response.discussions.results.forEach(discussion => {
                results.push({
                  source: 'Brave Discussions',
                  title: discussion.title,
                  summary: discussion.description,
                  url: discussion.url,
                  type: 'discussion',
                  forumName: discussion.forum_name,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Brave Search parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Brave Search request error:', error);
        resolve([]);
      });
    });
  }

  // Main search method that combines multiple AI sources
  async search(query, options = {}) {
    const enabledProviders = this.config.research?.aiProviders || ['tavily'];
    const searchPromises = [];
    
    if (enabledProviders.includes('perplexity')) {
      searchPromises.push(this.searchPerplexity(query, options));
    }
    
    if (enabledProviders.includes('you')) {
      searchPromises.push(this.searchYouDotCom(query, options));
    }
    
    if (enabledProviders.includes('tavily')) {
      searchPromises.push(this.searchTavily(query, options));
    }
    
    if (enabledProviders.includes('serpapi')) {
      searchPromises.push(this.searchSerpAPI(query, options));
    }
    
    if (enabledProviders.includes('brave')) {
      searchPromises.push(this.searchBrave(query, options));
    }
    
    try {
      const results = await Promise.all(searchPromises);
      return results.flat().filter(r => r !== null);
    } catch (error) {
      console.error('AI search error:', error);
      return [];
    }
  }
}

// Export singleton instance
const aiSearchProvider = new AISearchProvider();

module.exports = {
  searchAI: (query, options) => aiSearchProvider.search(query, options),
  searchPerplexity: (query, options) => aiSearchProvider.searchPerplexity(query, options),
  searchYouDotCom: (query, options) => aiSearchProvider.searchYouDotCom(query, options),
  searchTavily: (query, options) => aiSearchProvider.searchTavily(query, options),
  searchSerpAPI: (query, options) => aiSearchProvider.searchSerpAPI(query, options),
  searchBrave: (query, options) => aiSearchProvider.searchBrave(query, options)
};
```

# app/services/research/providers/news.js

```js
// News and Current Events Research Provider
// Searches news sources, RSS feeds, and current events
const https = require('https');
const { loadConfig } = require('../../../config');

class NewsResearchProvider {
  constructor() {
    this.config = loadConfig();
  }

  // NewsAPI - Comprehensive news coverage
  async searchNewsAPI(query, options = {}) {
    const apiKey = this.config.research?.newsApiKey;
    if (!apiKey) {
      console.log('NewsAPI key not configured');
      return [];
    }

    return new Promise((resolve) => {
      const params = new URLSearchParams({
        q: query,
        apiKey: apiKey,
        language: options.language || 'en',
        sortBy: options.sortBy || 'relevancy', // relevancy, popularity, publishedAt
        pageSize: options.maxResults || 5,
        from: options.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // Last 7 days
      });

      // Choose endpoint based on options
      const endpoint = options.topHeadlines ? '/v2/top-headlines' : '/v2/everything';
      
      const requestOptions = {
        hostname: 'newsapi.org',
        path: `${endpoint}?${params}`,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-Research/1.0'
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.articles) {
              response.articles.forEach(article => {
                results.push({
                  source: `News - ${article.source.name}`,
                  title: article.title,
                  summary: article.description || article.content?.substring(0, 300),
                  url: article.url,
                  type: 'news-article',
                  author: article.author,
                  publishedAt: article.publishedAt,
                  imageUrl: article.urlToImage,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('NewsAPI parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('NewsAPI request error:', error);
        resolve([]);
      });
    });
  }

  // The Guardian API - Quality journalism
  async searchGuardian(query, options = {}) {
    const apiKey = this.config.research?.guardianApiKey;
    if (!apiKey) {
      console.log('Guardian API key not configured - using free tier');
    }

    return new Promise((resolve) => {
      const params = new URLSearchParams({
        q: query,
        'api-key': apiKey || 'test', // 'test' gives limited access
        'page-size': options.maxResults || 5,
        'order-by': options.orderBy || 'relevance',
        'show-fields': 'headline,standfirst,body,thumbnail',
        'from-date': options.fromDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

      const requestOptions = {
        hostname: 'content.guardianapis.com',
        path: `/search?${params}`,
        method: 'GET'
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.response?.results) {
              response.response.results.forEach(article => {
                const fields = article.fields || {};
                results.push({
                  source: 'The Guardian',
                  title: fields.headline || article.webTitle,
                  summary: fields.standfirst || fields.body?.substring(0, 300) || '',
                  url: article.webUrl,
                  type: 'news-article',
                  section: article.sectionName,
                  publishedAt: article.webPublicationDate,
                  imageUrl: fields.thumbnail,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Guardian parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Guardian request error:', error);
        resolve([]);
      });
    });
  }

  // New York Times API
  async searchNYTimes(query, options = {}) {
    const apiKey = this.config.research?.nytApiKey;
    if (!apiKey) {
      console.log('NY Times API key not configured');
      return [];
    }

    return new Promise((resolve) => {
      const params = new URLSearchParams({
        q: query,
        'api-key': apiKey,
        sort: options.sort || 'relevance',
        page: 0
      });

      const requestOptions = {
        hostname: 'api.nytimes.com',
        path: `/svc/search/v2/articlesearch.json?${params}`,
        method: 'GET'
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.response?.docs) {
              response.response.docs.slice(0, options.maxResults || 5).forEach(article => {
                results.push({
                  source: 'New York Times',
                  title: article.headline?.main || article.abstract,
                  summary: article.abstract || article.lead_paragraph?.substring(0, 300),
                  url: article.web_url,
                  type: 'news-article',
                  section: article.section_name,
                  author: article.byline?.original,
                  publishedAt: article.pub_date,
                  keywords: article.keywords?.map(k => k.value),
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('NY Times parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('NY Times request error:', error);
        resolve([]);
      });
    });
  }

  // BBC News (via RSS)
  async searchBBCNews(query, options = {}) {
    // BBC doesn't have a search API, but we can use their RSS feeds
    const feeds = {
      'world': 'http://feeds.bbci.co.uk/news/world/rss.xml',
      'technology': 'http://feeds.bbci.co.uk/news/technology/rss.xml',
      'science': 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
      'business': 'http://feeds.bbci.co.uk/news/business/rss.xml',
      'health': 'http://feeds.bbci.co.uk/news/health/rss.xml'
    };

    // For now, return empty - in production, implement RSS parsing
    return [];
  }

  // Reddit - Real-time discussions and news
  async searchReddit(query, options = {}) {
    return new Promise((resolve) => {
      const params = new URLSearchParams({
        q: query,
        limit: options.maxResults || 5,
        sort: options.sort || 'relevance',
        t: options.time || 'week' // hour, day, week, month, year, all
      });

      const subreddit = options.subreddit || '';
      const path = subreddit ? `/r/${subreddit}/search.json?${params}&restrict_sr=1` : `/search.json?${params}`;

      const requestOptions = {
        hostname: 'www.reddit.com',
        path: path,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-Research/1.0'
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.data?.children) {
              response.data.children.forEach(post => {
                const postData = post.data;
                results.push({
                  source: `Reddit - r/${postData.subreddit}`,
                  title: postData.title,
                  summary: postData.selftext ? 
                    (postData.selftext.length > 300 ? postData.selftext.substring(0, 297) + '...' : postData.selftext) :
                    `${postData.num_comments} comments, ${postData.score} upvotes`,
                  url: `https://reddit.com${postData.permalink}`,
                  type: 'discussion',
                  author: postData.author,
                  score: postData.score,
                  numComments: postData.num_comments,
                  created: new Date(postData.created_utc * 1000).toISOString(),
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Reddit parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Reddit request error:', error);
        resolve([]);
      });
    });
  }

  // Hacker News - Tech news and discussions
  async searchHackerNews(query, options = {}) {
    return new Promise((resolve) => {
      const params = new URLSearchParams({
        query: query,
        tags: options.tags || 'story',
        hitsPerPage: options.maxResults || 5
      });

      const requestOptions = {
        hostname: 'hn.algolia.com',
        path: `/api/v1/search?${params}`,
        method: 'GET'
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.hits) {
              response.hits.forEach(hit => {
                results.push({
                  source: 'Hacker News',
                  title: hit.title || hit.story_title,
                  summary: hit.story_text ? 
                    (hit.story_text.length > 300 ? hit.story_text.substring(0, 297) + '...' : hit.story_text) :
                    `${hit.num_comments || 0} comments, ${hit.points || 0} points`,
                  url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
                  type: 'tech-news',
                  author: hit.author,
                  points: hit.points,
                  numComments: hit.num_comments,
                  created: hit.created_at,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Hacker News parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Hacker News request error:', error);
        resolve([]);
      });
    });
  }

  // Google News via SerpAPI
  async searchGoogleNews(query, options = {}) {
    const apiKey = this.config.research?.serpApiKey;
    if (!apiKey) {
      console.log('Google News search requires SerpAPI key');
      return [];
    }

    return new Promise((resolve) => {
      const params = new URLSearchParams({
        api_key: apiKey,
        engine: 'google_news',
        q: query,
        gl: options.country || 'us',
        hl: options.language || 'en'
      });

      const requestOptions = {
        hostname: 'serpapi.com',
        path: `/search.json?${params}`,
        method: 'GET'
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.news_results) {
              response.news_results.slice(0, options.maxResults || 5).forEach(article => {
                results.push({
                  source: article.source?.name || 'Google News',
                  title: article.title,
                  summary: article.snippet || '',
                  url: article.link,
                  type: 'news-article',
                  publishedAt: article.date,
                  thumbnail: article.thumbnail,
                  relatedCoverage: article.stories?.length || 0,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Google News parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Google News request error:', error);
        resolve([]);
      });
    });
  }

  // Main search method combining news sources
  async search(query, options = {}) {
    const enabledProviders = this.config.research?.newsProviders || 
      ['newsapi', 'reddit', 'hackernews'];
    
    const searchPromises = [];
    
    if (enabledProviders.includes('newsapi')) {
      searchPromises.push(this.searchNewsAPI(query, options));
    }
    
    if (enabledProviders.includes('guardian')) {
      searchPromises.push(this.searchGuardian(query, options));
    }
    
    if (enabledProviders.includes('nytimes')) {
      searchPromises.push(this.searchNYTimes(query, options));
    }
    
    if (enabledProviders.includes('reddit')) {
      searchPromises.push(this.searchReddit(query, options));
    }
    
    if (enabledProviders.includes('hackernews')) {
      searchPromises.push(this.searchHackerNews(query, options));
    }
    
    if (enabledProviders.includes('googlenews')) {
      searchPromises.push(this.searchGoogleNews(query, options));
    }
    
    try {
      const results = await Promise.all(searchPromises);
      // Flatten and sort by date
      return results.flat()
        .filter(r => r !== null)
        .sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.created || a.timestamp);
          const dateB = new Date(b.publishedAt || b.created || b.timestamp);
          return dateB - dateA; // Most recent first
        });
    } catch (error) {
      console.error('News search error:', error);
      return [];
    }
  }

  // Search for trending topics
  async searchTrending(options = {}) {
    // This would integrate with Twitter API, Google Trends, etc.
    // For now, return empty
    return [];
  }

  // Search news by category
  async searchByCategory(category, options = {}) {
    const categoryQueries = {
      'technology': 'technology OR tech OR software OR AI',
      'science': 'science OR research OR discovery',
      'business': 'business OR economy OR finance OR market',
      'health': 'health OR medical OR healthcare OR medicine',
      'politics': 'politics OR government OR policy OR election'
    };
    
    const query = categoryQueries[category.toLowerCase()] || category;
    return this.search(query, { ...options, topHeadlines: true });
  }
}

// Export singleton instance
const newsProvider = new NewsResearchProvider();

module.exports = {
  searchNews: (query, options) => newsProvider.search(query, options),
  searchNewsAPI: (query, options) => newsProvider.searchNewsAPI(query, options),
  searchGuardian: (query, options) => newsProvider.searchGuardian(query, options),
  searchNYTimes: (query, options) => newsProvider.searchNYTimes(query, options),
  searchReddit: (query, options) => newsProvider.searchReddit(query, options),
  searchHackerNews: (query, options) => newsProvider.searchHackerNews(query, options),
  searchGoogleNews: (query, options) => newsProvider.searchGoogleNews(query, options),
  searchTrending: (options) => newsProvider.searchTrending(options),
  searchNewsByCategory: (category, options) => newsProvider.searchByCategory(category, options)
};
```

# app/services/research/providers/technical.js

```js
// Technical Documentation Research Provider
// Searches technical docs, Stack Overflow, GitHub, and developer resources
const https = require('https');
const { loadConfig } = require('../../../config');

class TechnicalResearchProvider {
  constructor() {
    this.config = loadConfig();
  }

  // Stack Overflow API
  async searchStackOverflow(query, options = {}) {
    return new Promise((resolve) => {
      const params = new URLSearchParams({
        order: 'desc',
        sort: options.sort || 'relevance',
        q: query,
        site: 'stackoverflow',
        filter: '!9Z(-wzu0T', // Include body in response
        pagesize: options.maxResults || 5
      });

      const requestOptions = {
        hostname: 'api.stackexchange.com',
        path: `/2.3/search/advanced?${params}`,
        method: 'GET',
        headers: {
          'Accept-Encoding': 'gzip'
        }
      };

      https.get(requestOptions, (res) => {
        let chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          try {
            // Stack Exchange API returns gzipped data
            const buffer = Buffer.concat(chunks);
            const zlib = require('zlib');
            
            zlib.gunzip(buffer, (err, decoded) => {
              if (err) {
                console.error('Stack Overflow decompression error:', err);
                resolve([]);
                return;
              }

              const response = JSON.parse(decoded.toString());
              const results = [];
              
              if (response.items) {
                response.items.forEach(item => {
                  results.push({
                    source: 'Stack Overflow',
                    title: item.title,
                    summary: item.body ? 
                      (item.body.length > 300 ? item.body.substring(0, 297) + '...' : item.body) :
                      `Score: ${item.score}, ${item.answer_count} answers`,
                    url: item.link,
                    type: 'q&a',
                    score: item.score,
                    answerCount: item.answer_count,
                    isAnswered: item.is_answered,
                    tags: item.tags,
                    created: new Date(item.creation_date * 1000).toISOString(),
                    lastActivity: new Date(item.last_activity_date * 1000).toISOString(),
                    timestamp: new Date().toISOString()
                  });
                });
              }
              
              resolve(results);
            });
          } catch (error) {
            console.error('Stack Overflow parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Stack Overflow request error:', error);
        resolve([]);
      });
    });
  }

  // GitHub Search
  async searchGitHub(query, options = {}) {
    const token = this.config.research?.githubToken;
    
    return new Promise((resolve) => {
      const searchType = options.type || 'repositories'; // repositories, code, issues
      const params = new URLSearchParams({
        q: query,
        sort: options.sort || 'relevance',
        order: 'desc',
        per_page: options.maxResults || 5
      });

      const requestOptions = {
        hostname: 'api.github.com',
        path: `/search/${searchType}?${params}`,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-Research/1.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      };

      if (token) {
        requestOptions.headers['Authorization'] = `token ${token}`;
      }

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.items) {
              response.items.forEach(item => {
                if (searchType === 'repositories') {
                  results.push({
                    source: 'GitHub',
                    title: item.full_name,
                    summary: item.description || `${item.stargazers_count} stars, ${item.language || 'Unknown'} language`,
                    url: item.html_url,
                    type: 'repository',
                    stars: item.stargazers_count,
                    forks: item.forks_count,
                    language: item.language,
                    topics: item.topics,
                    lastUpdated: item.updated_at,
                    timestamp: new Date().toISOString()
                  });
                } else if (searchType === 'code') {
                  results.push({
                    source: 'GitHub Code',
                    title: `${item.repository.full_name}/${item.path}`,
                    summary: `Code in ${item.path}`,
                    url: item.html_url,
                    type: 'code',
                    repository: item.repository.full_name,
                    path: item.path,
                    timestamp: new Date().toISOString()
                  });
                } else if (searchType === 'issues') {
                  results.push({
                    source: 'GitHub Issues',
                    title: item.title,
                    summary: item.body ? 
                      (item.body.length > 300 ? item.body.substring(0, 297) + '...' : item.body) :
                      `Issue #${item.number} in ${item.repository_url.split('/').slice(-2).join('/')}`,
                    url: item.html_url,
                    type: 'issue',
                    state: item.state,
                    comments: item.comments,
                    created: item.created_at,
                    timestamp: new Date().toISOString()
                  });
                }
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('GitHub parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('GitHub request error:', error);
        resolve([]);
      });
    });
  }

  // MDN Web Docs (via DuckDuckGo)
  async searchMDN(query, options = {}) {
    return new Promise((resolve) => {
      const mdnQuery = `site:developer.mozilla.org ${query}`;
      const encodedQuery = encodeURIComponent(mdnQuery);
      
      const requestOptions = {
        hostname: 'api.duckduckgo.com',
        path: `/?q=${encodedQuery}&format=json&no_html=1`,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-Research/1.0'
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            // MDN results often come in RelatedTopics
            if (response.RelatedTopics && response.RelatedTopics.length > 0) {
              response.RelatedTopics.slice(0, options.maxResults || 3).forEach(topic => {
                if (topic.FirstURL && topic.Text) {
                  results.push({
                    source: 'MDN Web Docs',
                    title: topic.Text.split(' - ')[0],
                    summary: topic.Text,
                    url: topic.FirstURL,
                    type: 'documentation',
                    timestamp: new Date().toISOString()
                  });
                }
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('MDN search parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('MDN search request error:', error);
        resolve([]);
      });
    });
  }

  // DevDocs.io API (unofficial)
  async searchDevDocs(query, options = {}) {
    // DevDocs doesn't have an official API, but we can search documentation
    const docs = options.docs || ['javascript', 'python', 'react', 'node'];
    const results = [];
    
    // For now, we'll just return a structured response
    // In production, this would scrape or use a custom index
    docs.forEach(doc => {
      results.push({
        source: `DevDocs - ${doc}`,
        title: `${query} in ${doc} documentation`,
        summary: `Search for ${query} in ${doc} documentation`,
        url: `https://devdocs.io/${doc}/${encodeURIComponent(query)}`,
        type: 'documentation',
        timestamp: new Date().toISOString()
      });
    });
    
    return results.slice(0, options.maxResults || 3);
  }

  // Package managers (NPM, PyPI, etc.)
  async searchPackages(query, options = {}) {
    const ecosystem = options.ecosystem || 'npm';
    
    switch (ecosystem) {
      case 'npm':
        return this.searchNPM(query, options);
      case 'pypi':
        return this.searchPyPI(query, options);
      case 'cargo':
        return this.searchCargo(query, options);
      default:
        return [];
    }
  }

  // NPM Registry
  async searchNPM(query, options = {}) {
    return new Promise((resolve) => {
      const params = new URLSearchParams({
        text: query,
        size: options.maxResults || 5
      });

      const requestOptions = {
        hostname: 'registry.npmjs.org',
        path: `/-/v1/search?${params}`,
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.objects) {
              response.objects.forEach(obj => {
                const pkg = obj.package;
                results.push({
                  source: 'NPM',
                  title: pkg.name,
                  summary: pkg.description || 'No description available',
                  url: pkg.links.npm,
                  type: 'package',
                  version: pkg.version,
                  author: pkg.author?.name,
                  keywords: pkg.keywords,
                  downloads: obj.score?.detail?.popularity,
                  repository: pkg.links.repository,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('NPM search parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('NPM search request error:', error);
        resolve([]);
      });
    });
  }

  // PyPI Python Package Index
  async searchPyPI(query, options = {}) {
    return new Promise((resolve) => {
      const requestOptions = {
        hostname: 'pypi.org',
        path: `/pypi/${encodeURIComponent(query)}/json`,
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 404) {
              // Package not found, try search instead
              resolve([]);
              return;
            }
            
            const response = JSON.parse(data);
            const info = response.info;
            
            resolve([{
              source: 'PyPI',
              title: info.name,
              summary: info.summary || info.description?.substring(0, 300),
              url: info.home_page || info.project_url,
              type: 'package',
              version: info.version,
              author: info.author,
              keywords: info.keywords,
              license: info.license,
              repository: info.project_urls?.Source,
              timestamp: new Date().toISOString()
            }]);
          } catch (error) {
            console.error('PyPI search parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('PyPI search request error:', error);
        resolve([]);
      });
    });
  }

  // Rust Crates.io
  async searchCargo(query, options = {}) {
    return new Promise((resolve) => {
      const params = new URLSearchParams({
        q: query,
        per_page: options.maxResults || 5
      });

      const requestOptions = {
        hostname: 'crates.io',
        path: `/api/v1/crates?${params}`,
        method: 'GET',
        headers: {
          'User-Agent': 'Auracle-Research/1.0'
        }
      };

      https.get(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            const results = [];
            
            if (response.crates) {
              response.crates.forEach(crate => {
                results.push({
                  source: 'Crates.io',
                  title: crate.name,
                  summary: crate.description || 'No description available',
                  url: `https://crates.io/crates/${crate.name}`,
                  type: 'package',
                  version: crate.newest_version,
                  downloads: crate.downloads,
                  repository: crate.repository,
                  timestamp: new Date().toISOString()
                });
              });
            }
            
            resolve(results);
          } catch (error) {
            console.error('Cargo search parse error:', error);
            resolve([]);
          }
        });
      }).on('error', error => {
        console.error('Cargo search request error:', error);
        resolve([]);
      });
    });
  }

  // Main search method
  async search(query, options = {}) {
    const enabledProviders = this.config.research?.technicalProviders || 
      ['stackoverflow', 'github', 'npm'];
    
    const searchPromises = [];
    
    if (enabledProviders.includes('stackoverflow')) {
      searchPromises.push(this.searchStackOverflow(query, options));
    }
    
    if (enabledProviders.includes('github')) {
      searchPromises.push(this.searchGitHub(query, options));
    }
    
    if (enabledProviders.includes('mdn')) {
      searchPromises.push(this.searchMDN(query, options));
    }
    
    if (enabledProviders.includes('npm')) {
      searchPromises.push(this.searchNPM(query, options));
    }
    
    if (enabledProviders.includes('pypi')) {
      searchPromises.push(this.searchPyPI(query, options));
    }
    
    try {
      const results = await Promise.all(searchPromises);
      return results.flat().filter(r => r !== null);
    } catch (error) {
      console.error('Technical search error:', error);
      return [];
    }
  }

  // Search for code examples
  async searchCodeExamples(language, topic, options = {}) {
    const queries = [
      `${language} ${topic} example`,
      `${language} ${topic} tutorial`,
      `${language} ${topic} how to`
    ];
    
    const promises = queries.map(q => this.searchStackOverflow(q, { maxResults: 2 }));
    const results = await Promise.all(promises);
    return results.flat();
  }

  // Search for error solutions
  async searchError(error, language, options = {}) {
    const query = `${language} "${error}"`;
    return this.search(query, { ...options, sort: 'votes' });
  }
}

// Export singleton instance
const technicalProvider = new TechnicalResearchProvider();

module.exports = {
  searchTechnical: (query, options) => technicalProvider.search(query, options),
  searchStackOverflow: (query, options) => technicalProvider.searchStackOverflow(query, options),
  searchGitHub: (query, options) => technicalProvider.searchGitHub(query, options),
  searchMDN: (query, options) => technicalProvider.searchMDN(query, options),
  searchPackages: (query, options) => technicalProvider.searchPackages(query, options),
  searchNPM: (query, options) => technicalProvider.searchNPM(query, options),
  searchPyPI: (query, options) => technicalProvider.searchPyPI(query, options),
  searchCargo: (query, options) => technicalProvider.searchCargo(query, options),
  searchCodeExamples: (language, topic, options) => technicalProvider.searchCodeExamples(language, topic, options),
  searchError: (error, language, options) => technicalProvider.searchError(error, language, options)
};
```

# app/services/stt.js

```js
// Speech-to-Text Service (whisper.cpp integration)
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Clean up transcript lines
function cleanTranscriptLine(line) {
  if (!line) return null;
  
  // Filter out noise and repetitive content
  const filters = [
    /^\[BLANK_AUDIO\]$/,
    /^\[INAUDIBLE\]$/,
    /^\s*\[BLANK_AUDIO\]\s*$/,
    /^\s*\(.*\)\s*$/,  // Remove lines that are only sound effects like (sighs), (coughing)
    /^\s*-\s*$/,       // Remove lines that are just dashes
    /^thanks for watching\.?$/i,  // Remove common video outros
    /^\s*\[\\d+K\s*$/,  // Remove lines that are just terminal control codes
    /^\s*\x1b\[.*$/,   // Remove lines starting with ANSI escape sequences
    /^\s*$/, // Empty lines
  ];
  
  // Check if line matches any filter
  for (const filter of filters) {
    if (filter.test(line)) {
      return null;
    }
  }
  
  // Remove repetitive patterns (same phrase repeated multiple times)
  const words = line.split(' ');
  if (words.length > 4) {
    const firstWord = words[0].toLowerCase();
    const repetitions = words.filter(word => word.toLowerCase() === firstWord).length;
    if (repetitions > words.length / 2) {
      return null; // Likely repetitive noise
    }
  }
  
  // Clean up the line
  let cleaned = line
    .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '') // Remove ANSI escape sequences
    .replace(/\[\d+K/g, '')               // Remove specific terminal control codes like [2K
    .replace(/^\s*-\s*/, '')              // Remove leading dashes
    .replace(/\s+/g, ' ')                 // Normalize whitespace
    .trim();
    
  // Only return if it has substantial content
  return cleaned.length > 1 ? cleaned : null;
}

// Path to whisper.cpp binary and model
const WHISPER_BIN_PATHS = [
  path.join(__dirname, '../../whisper.cpp/build/bin/whisper-cli'),
  path.join(__dirname, '../../whisper.cpp/build/bin/main'),
  path.join(__dirname, '../../whisper.cpp/build/bin/whisper-server'),
  path.join(__dirname, '../../whisper.cpp/stream'),
  path.join(__dirname, '../../whisper.cpp/main')
];
const MODEL_PATH = path.join(__dirname, '../../whisper.cpp/models/ggml-base.en.bin');

function findWhisperBinary() {
  for (const binPath of WHISPER_BIN_PATHS) {
    try {
      fs.accessSync(binPath);
      return binPath;
    } catch (e) {
      // Continue to next path
    }
  }
  return null;
}

function startTranscription(onTranscript) {
  // Check if whisper.cpp binary exists
  const WHISPER_BIN = findWhisperBinary();
  if (!WHISPER_BIN) {
    console.error('STT: No whisper binary found. Checked paths:', WHISPER_BIN_PATHS);
    onTranscript({ type: 'error', text: '[Error] whisper.cpp binary not found. Please run setup-whisper.sh to install whisper.cpp' });
    return null;
  }
  
  console.log('STT: Using whisper binary:', WHISPER_BIN);
  
  // Check if model exists
  try {
    fs.accessSync(MODEL_PATH);
    const modelStats = fs.statSync(MODEL_PATH);
    console.log('STT: Using model file:', MODEL_PATH, 'Size:', Math.round(modelStats.size / 1024 / 1024), 'MB');
  } catch (e) {
    console.error('STT: Model file not found:', MODEL_PATH);
    onTranscript({ type: 'error', text: '[Error] Model file not found. Please download and place ggml-base.en.bin in whisper/models/' });
    return null;
  }

  // Test whisper binary works
  try {
    console.log('STT: Testing whisper binary...');
    execSync(`"${WHISPER_BIN}" --help`, { encoding: 'utf8', timeout: 5000 });
    console.log('STT: Whisper binary test successful');
  } catch (e) {
    console.error('STT: Whisper binary test failed:', e.message);
    onTranscript({ type: 'error', text: '[Error] Whisper binary test failed. Check console for details.' });
    return null;
  }

  // Check if ffmpeg is installed for audio capture
  try {
    execSync('which ffmpeg');
  } catch (e) {
    onTranscript({ type: 'error', text: '[Error] ffmpeg not installed. Please install ffmpeg: brew install ffmpeg' });
    return null;
  }

  // List available audio devices for debugging
  try {
    const devices = execSync('ffmpeg -f avfoundation -list_devices true -i ""', { encoding: 'utf8' });
    console.log('STT: Available audio devices:', devices);
    onTranscript({ type: 'system', text: '[Checking available audio devices...]' });
  } catch (e) {
    console.log('STT: Device listing output:', e.stderr || e.stdout);
    // This is expected to "fail" but still shows devices in stderr
  }

  onTranscript({ type: 'system', text: '[Starting audio capture with ffmpeg...]' });

  // Create temporary directory for audio files
  const tempDir = path.join(os.tmpdir(), `whisper-audio-${Date.now()}`);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  console.log('STT: Created temp directory:', tempDir);

  let isRunning = true;

  // Start ffmpeg to capture audio from microphone for transcription
  // Use the MacBook Pro Microphone (device 3)
  const ffmpegArgs = [
    '-f', 'avfoundation',     // Use macOS audio foundation
    '-i', ':3',               // MacBook Pro Microphone
    '-ar', '16000',           // Sample rate 16kHz
    '-ac', '1',               // Mono
    '-acodec', 'pcm_s16le',   // 16-bit PCM
    '-f', 'segment',          // Segment output
    '-segment_time', '1',     // 1 second segments for faster transcription
    '-segment_format', 'wav', // WAV format
    '-reset_timestamps', '1', // Reset timestamps for each segment
    path.join(tempDir, 'audio-%03d.wav')
  ];

  const ffmpegProc = spawn('ffmpeg', ffmpegArgs);
  
  console.log('STT: FFmpeg started with args:', ffmpegArgs);
  console.log('STT: FFmpeg PID:', ffmpegProc.pid);
  
  // Process audio segments as they're created
  let lastProcessedIndex = -1;
  const processInterval = setInterval(() => {
    if (!isRunning) {
      clearInterval(processInterval);
      return;
    }

    // Look for new audio files
    try {
      const files = fs.readdirSync(tempDir)
        .filter(f => f.startsWith('audio-') && f.endsWith('.wav'))
        .sort();
      
      console.log(`STT: Checking for audio files in ${tempDir}:`, files.length, 'files found');
      
      for (const file of files) {
        const match = file.match(/audio-(\d+)\.wav/);
        if (match) {
          const index = parseInt(match[1]);
          if (index > lastProcessedIndex) {
            const audioFile = path.join(tempDir, file);
            
            // Check file size and age to ensure it's complete
            const stats = fs.statSync(audioFile);
            const fileAge = Date.now() - stats.mtime.getTime();
            
            console.log(`STT: Found audio file ${file}, size: ${stats.size}, age: ${fileAge}ms`);
            
            if (stats.size < 1000 || fileAge < 1500) {
              // Skip files that are too small or too new (1.5s for 1s segments)
              console.log(`STT: Skipping ${file} (size: ${stats.size}, age: ${fileAge}ms)`);
              continue;
            }
            
            // Process with whisper
            const whisperArgs = [
              '-m', MODEL_PATH,
              '-t', '4',
              '-f', audioFile,
              '--language', 'en',
              '--no-timestamps'
            ];
            
            console.log(`STT: Processing audio file: ${audioFile}`);
            console.log(`STT: Whisper command: ${WHISPER_BIN} ${whisperArgs.join(' ')}`);
            
            console.log(`STT: Starting whisper process`);
            
            const whisperProc = spawn(WHISPER_BIN, whisperArgs);
            
            whisperProc.stdout.on('data', (data) => {
              const text = data.toString();
              console.log('STT: Whisper stdout:', text);
              const lines = text.split('\n');
              lines.forEach(line => {
                const cleaned = cleanTranscriptLine(line);
                if (cleaned && !cleaned.includes('whisper_') && !cleaned.includes('.cpp')) {
                  console.log('STT: Sending transcript:', cleaned);
                  onTranscript({ type: 'final', text: cleaned });
                }
              });
            });
            
            whisperProc.stderr.on('data', (data) => {
              const text = data.toString();
              console.log('STT: Whisper stderr:', text);
            });
            
            whisperProc.on('error', (error) => {
              console.error('STT: Whisper process error:', error);
              onTranscript({ type: 'error', text: `[Whisper process error: ${error.message}]` });
            });
            
            whisperProc.on('exit', (code) => {
              console.log(`STT: Whisper exited with code ${code}`);
              // Clean up processed file
              try {
                fs.unlinkSync(audioFile);
                console.log(`STT: Cleaned up ${audioFile}`);
              } catch (e) {
                console.error(`STT: Error cleaning up ${audioFile}:`, e);
              }
            });
            
            lastProcessedIndex = index;
          }
        }
      }
    } catch (error) {
      console.error('STT: Error processing audio files:', error);
    }
  }, 500); // Check every 500ms for faster response

  ffmpegProc.stdout.on('data', (data) => {
    const text = data.toString();
    console.log('STT: FFmpeg stdout:', text);
  });

  ffmpegProc.stderr.on('data', (data) => {
    const text = data.toString();
    console.log('STT: FFmpeg stderr:', text);
    // Only show actual errors, not progress info
    if (text.includes('error') || text.includes('Error')) {
      onTranscript({ type: 'error', text: '[ffmpeg] ' + text });
    }
    // Show initialization status
    if (text.includes('Stream mapping:') || text.includes('Input #0')) {
      onTranscript({ type: 'system', text: '[Audio input detected and ready]' });
    }
  });

  ffmpegProc.on('error', (error) => {
    console.error('STT: FFmpeg process error:', error);
    onTranscript({ type: 'error', text: '[ffmpeg error] ' + error.message });
  });

  ffmpegProc.on('exit', (code, signal) => {
    console.log(`STT: FFmpeg exited with code ${code}, signal ${signal}`);
    if (code !== 0 && code !== null) {
      onTranscript({ type: 'error', text: `[FFmpeg exited with error code ${code}]` });
    }
  });

  // Return control object
  return {
    kill: () => {
      isRunning = false;
      if (ffmpegProc && !ffmpegProc.killed) {
        ffmpegProc.kill('SIGTERM');
      }
      
      // Clean up temp files and directory
      try {
        const files = fs.readdirSync(tempDir);
        for (const file of files) {
          fs.unlinkSync(path.join(tempDir, file));
        }
        fs.rmdirSync(tempDir);
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    }
  };
}

module.exports = { startTranscription };
```

# app/services/templateManager.js

```js
// Template Manager Service - Handles template operations and variable substitution
const { createTemplate, getTemplates, getTemplateById, updateTemplate, deleteTemplate, incrementTemplateUsage } = require('./mongoStorage');
const localStorage = require('./localTemplateStorage');

class TemplateManagerService {
  constructor() {
    this.defaultTemplates = this.initializeDefaultTemplates();
    this.useLocalStorage = false;
  }

  // Determine which storage to use based on MongoDB availability
  async getStorageProvider() {
    if (this.useLocalStorage) {
      return localStorage;
    }
    
    try {
      // Test MongoDB connection by trying to get templates
      await getTemplates();
      return { createTemplate, getTemplates, getTemplateById, updateTemplate, deleteTemplate, incrementTemplateUsage };
    } catch (error) {
      console.warn('MongoDB not available, falling back to local storage:', error.message);
      this.useLocalStorage = true;
      return localStorage;
    }
  }

  initializeDefaultTemplates() {
    return [
      {
        name: "MongoDB Design Review Report",
        description: "Expert MongoDB schema and data model review with actionable recommendations and references.",
        category: "Technology",
        version: "1.0.0",
        icon: "🍃",
        prompt: `You are a world-class MongoDB Design Review Assistant. Your job is to review MongoDB data models and schemas, offering actionable feedback and recommendations that align with MongoDB's best practices.

When you begin, always check if the following context is present in the transcript or provided variables. If not, politely prompt for it in your executive summary:
- Application or business use case overview
- MongoDB schema(s) and collection structure (ERD or summary)
- List of common/important queries and update patterns (access patterns)
- Information about scale (document counts, growth, read/write/query velocities)
- Any non-obvious business or compliance requirements

Transcript:
{{transcript}}

{{#if additionalContext}}
Additional Context: {{additionalContext}}
{{/if}}

Please generate a MongoDB Design Review Report in the following format:

1. Executive Summary
   - Briefly summarize the review and, if any required context is missing, list what is needed for a more thorough review.

2. What We Heard
   - Echo back the main discussion topics and customer concerns in clear, simple language.
   - Summarize the application's goals and context as understood from the transcript.

3. Issues
   - Identify issues, antipatterns, or pain points revealed in the transcript.
   - Explicitly call out patterns that are suboptimal in MongoDB (e.g., overuse of $lookup, unnecessary normalization, large unbounded arrays, excessive collections, etc.).
   - Flag any risks to scalability, performance, or maintainability.

4. Recommendations
   - Give direct, prioritized recommendations using MongoDB schema and data modeling best practices.
   - For each issue, explain why the recommendation is optimal for MongoDB.
   - Provide improved schema examples or patterns where appropriate.
   - Prefer embedding, denormalization, and designing around the queries unless there's a strong reason not to.
   - Suggest indexing, sharding, data partitioning, or advanced features if relevant (e.g., change streams, schema validation, TTL indexes).

5. References
   - List official MongoDB documentation links that back up your recommendations.
   - Link to specific pages, not just the main docs.
   - Example links:
     - https://www.mongodb.com/docs/manual/core/data-modeling-introduction/
     - https://www.mongodb.com/docs/manual/core/schema-design-best-practices/
     - https://www.mongodb.com/docs/manual/core/aggregation-pipeline/
     - https://www.mongodb.com/docs/manual/core/indexes/
     - https://www.mongodb.com/docs/manual/core/sharding/
     - https://www.mongodb.com/docs/manual/core/changeStreams/

Format the output in clean markdown with clear headers and formatting. Communicate in a way that's clear for technical audiences but easy to digest. Do not recommend relational/SQL features or approaches. Do not speculate or make assumptions without first asking clarifying questions.`,
        variables: [
          {
            name: "additionalContext",
            type: "textarea",
            label: "Additional Context",
            placeholder: "Any additional context about the design review (optional)",
            required: false,
            default: ""
          }
        ],
        outputFormat: "markdown",
        sections: [
          {
            title: "Executive Summary",
            key: "execSummary",
            required: true,
            description: "Brief summary of the review and any missing context needed for a more thorough review."
          },
          {
            title: "What We Heard",
            key: "whatWeHeard",
            required: true,
            description: "Main discussion topics, customer concerns, and application context."
          },
          {
            title: "Issues",
            key: "issues",
            required: true,
            description: "Identified issues, antipatterns, and risks for MongoDB."
          },
          {
            title: "Recommendations",
            key: "recommendations",
            required: true,
            description: "Actionable, prioritized recommendations with explanations and schema examples."
          },
          {
            title: "References",
            key: "references",
            required: true,
            description: "Official MongoDB documentation links supporting the recommendations."
          }
        ],
        metadata: {
          author: "MongoDB Design Review Team",
          createdAt: new Date().toISOString(),
          tags: ["mongodb", "design review", "schema", "data modeling", "technology"],
          isDefault: true,
          minimumTranscriptLength: 100,
          estimatedTokens: 700,
          language: "en"
        },
        isActive: true,
        isDefault: true
      },
      {
        name: "Meeting Minutes",
        description: "Professional meeting minutes with action items and decisions",
        category: "Business",
        icon: "MeetingRoom",
        prompt: `You are a professional meeting secretary. Analyze the following transcript and create structured meeting minutes.

Transcript:
{{transcript}}

{{#if additionalContext}}
Additional Context: {{additionalContext}}
{{/if}}

Please generate meeting minutes with the following sections:
1. Meeting Summary (2-3 sentences)
2. Key Discussion Points (bullet points)
3. Decisions Made (with context and impact)
4. Action Items (with assignees and deadlines if mentioned)
5. Next Steps

Format the output in clean markdown with clear headers and formatting.`,
        variables: [
          {
            name: "additionalContext",
            type: "text",
            required: false,
            default: "",
            placeholder: "Any additional context about the meeting (optional)"
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "MongoDB Design Review Summary", key: "designReviewSummary", required: true },
          { title: "Meeting Summary", key: "summary", required: true },
          { title: "Key Discussion Points", key: "keyPoints", required: true },
          { title: "Decisions Made", key: "decisions", required: true },
          { title: "Action Items", key: "actionItems", required: true },
          { title: "Next Steps", key: "nextSteps", required: false }
        ]
      },
      {
        name: "Interview Summary",
        description: "Comprehensive interview report with candidate assessment",
        category: "HR",
        icon: "Person",
        prompt: `You are an experienced HR professional. Analyze this interview transcript and create a comprehensive summary.

Candidate Name: {{candidateName}}
Position: {{position}}
Interview Date: {{interviewDate}}

Transcript:
{{transcript}}

Please provide:
1. Candidate Overview (background, first impression)
2. Key Qualifications Discussed
3. Technical Skills Assessment
4. Behavioral Responses Analysis
5. Strengths and Weaknesses
6. Cultural Fit Assessment
7. Recommendation (with reasoning)

Be objective and base assessments only on what was discussed in the interview.`,
        variables: [
          {
            name: "candidateName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Enter candidate's name"
          },
          {
            name: "position",
            type: "text",
            required: true,
            default: "",
            placeholder: "Position being interviewed for"
          },
          {
            name: "interviewDate",
            type: "date",
            required: true,
            default: new Date().toISOString().split('T')[0]
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "Candidate Overview", key: "overview", required: true },
          { title: "Key Qualifications", key: "qualifications", required: true },
          { title: "Technical Skills", key: "technicalSkills", required: true },
          { title: "Behavioral Analysis", key: "behavioral", required: true },
          { title: "Strengths & Weaknesses", key: "strengthsWeaknesses", required: true },
          { title: "Cultural Fit", key: "culturalFit", required: true },
          { title: "Recommendation", key: "recommendation", required: true }
        ]
      },
      {
        name: "Sales Call Report",
        description: "Sales call analysis with opportunity assessment",
        category: "Sales",
        icon: "Phone",
        prompt: `You are a sales analyst. Review this sales call transcript and create a comprehensive report.

Company: {{companyName}}
Sales Rep: {{salesRep}}
Call Type: {{callType}}

Transcript:
{{transcript}}

Analyze and provide:
1. Call Summary
2. Customer Pain Points Identified
3. Product/Solution Fit Assessment
4. Objections Raised and Responses
5. Competitive Mentions
6. Budget Discussion (if any)
7. Next Steps and Follow-up Actions
8. Deal Probability Assessment (High/Medium/Low with reasoning)

Focus on actionable insights for the sales team.`,
        variables: [
          {
            name: "companyName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Customer company name"
          },
          {
            name: "salesRep",
            type: "text",
            required: true,
            default: "",
            placeholder: "Sales representative name"
          },
          {
            name: "callType",
            type: "select",
            required: true,
            default: "discovery",
            options: ["discovery", "demo", "follow-up", "negotiation", "closing"]
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "Call Summary", key: "summary", required: true },
          { title: "Pain Points", key: "painPoints", required: true },
          { title: "Solution Fit", key: "solutionFit", required: true },
          { title: "Objections", key: "objections", required: false },
          { title: "Competition", key: "competition", required: false },
          { title: "Budget", key: "budget", required: false },
          { title: "Next Steps", key: "nextSteps", required: true },
          { title: "Deal Assessment", key: "dealAssessment", required: true }
        ]
      },
      {
        name: "Medical Consultation",
        description: "Medical consultation notes with assessment and plan",
        category: "Healthcare",
        icon: "LocalHospital",
        prompt: `You are a medical scribe. Create clinical documentation from this consultation transcript.

Patient ID: {{patientId}}
Provider: {{providerName}}
Visit Type: {{visitType}}

Transcript:
{{transcript}}

Generate clinical notes including:
1. Chief Complaint
2. History of Present Illness
3. Review of Systems (if mentioned)
4. Physical Exam Findings (if mentioned)
5. Assessment
6. Plan
7. Follow-up Instructions

Use standard medical documentation format. Only include information explicitly mentioned in the transcript.`,
        variables: [
          {
            name: "patientId",
            type: "text",
            required: true,
            default: "",
            placeholder: "Patient ID (anonymized)"
          },
          {
            name: "providerName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Healthcare provider name"
          },
          {
            name: "visitType",
            type: "select",
            required: true,
            default: "routine",
            options: ["routine", "urgent", "follow-up", "consultation", "telehealth"]
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "Chief Complaint", key: "chiefComplaint", required: true },
          { title: "History of Present Illness", key: "hpi", required: true },
          { title: "Review of Systems", key: "ros", required: false },
          { title: "Physical Exam", key: "physicalExam", required: false },
          { title: "Assessment", key: "assessment", required: true },
          { title: "Plan", key: "plan", required: true },
          { title: "Follow-up", key: "followUp", required: true }
        ]
      },
      {
        name: "Legal Deposition Summary",
        description: "Legal deposition summary with key testimony highlights",
        category: "Legal",
        icon: "Gavel",
        prompt: `You are a legal assistant. Summarize this deposition transcript.

Case: {{caseNumber}}
Deponent: {{deponentName}}
Date: {{depositionDate}}
Examining Attorney: {{examiningAttorney}}

Transcript:
{{transcript}}

Provide:
1. Deponent Background (as revealed in testimony)
2. Key Facts Established
3. Critical Admissions
4. Inconsistencies or Contradictions
5. Objections and Rulings
6. Exhibits Referenced
7. Follow-up Needed

Maintain objectivity and accuracy. Use exact quotes for critical testimony.`,
        variables: [
          {
            name: "caseNumber",
            type: "text",
            required: true,
            default: "",
            placeholder: "Case number"
          },
          {
            name: "deponentName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Name of person being deposed"
          },
          {
            name: "depositionDate",
            type: "date",
            required: true,
            default: new Date().toISOString().split('T')[0]
          },
          {
            name: "examiningAttorney",
            type: "text",
            required: true,
            default: "",
            placeholder: "Examining attorney name"
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "Deponent Background", key: "background", required: true },
          { title: "Key Facts", key: "keyFacts", required: true },
          { title: "Critical Admissions", key: "admissions", required: true },
          { title: "Inconsistencies", key: "inconsistencies", required: false },
          { title: "Objections", key: "objections", required: false },
          { title: "Exhibits", key: "exhibits", required: false },
          { title: "Follow-up Needed", key: "followUp", required: true }
        ]
      },
      {
        name: "MongoDB Design Review",
        description: "Comprehensive MongoDB design review report for customer interviews",
        category: "Technology",
        icon: "Storage",
        prompt: `You are a MongoDB solutions architect analyzing a customer design review interview. Create a comprehensive design review report.

Customer: {{customerName}}
Project: {{projectName}}
Date: {{reviewDate}}
MongoDB Version: {{mongodbVersion}}

Transcript:
{{transcript}}

{{#if additionalContext}}
Additional Context: {{additionalContext}}
{{/if}}

Please generate a MongoDB Design Review Report with the following sections:

1. What We Heard
   - Customer's current architecture and pain points
   - Use cases and business requirements
   - Performance and scale requirements
   - Current challenges with their data model or queries

2. Issues with the Design
   - Schema design anti-patterns identified
   - Query performance concerns
   - Indexing strategy gaps
   - Scalability limitations
   - Security or operational concerns

3. What We Recommend
   - Schema design improvements with specific examples
   - Indexing strategy recommendations
   - Query optimization suggestions
   - Sharding strategy (if applicable)
   - Best practices for their use case
   - Migration approach if redesign is needed

4. References
   - Links to relevant MongoDB documentation
   - Best practices guides
   - Similar use case examples
   - Recommended MongoDB University courses

Format the output in clean markdown with clear headers, code examples where applicable, and actionable recommendations.`,
        variables: [
          {
            name: "customerName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Customer/Company name"
          },
          {
            name: "projectName",
            type: "text",
            required: true,
            default: "",
            placeholder: "Project or application name"
          },
          {
            name: "reviewDate",
            type: "date",
            required: true,
            default: new Date().toISOString().split('T')[0]
          },
          {
            name: "mongodbVersion",
            type: "select",
            required: true,
            default: "7.0",
            options: ["4.4", "5.0", "6.0", "7.0", "Atlas"]
          },
          {
            name: "additionalContext",
            type: "textarea",
            required: false,
            default: "",
            placeholder: "Any additional context about the customer's environment or requirements (optional)"
          }
        ],
        outputFormat: "markdown",
        sections: [
          { title: "What We Heard", key: "whatWeHeard", required: true },
          { title: "Issues with the Design", key: "designIssues", required: true },
          { title: "What We Recommend", key: "recommendations", required: true },
          { title: "References", key: "references", required: true }
        ]
      }
    ];
  }

  // Initialize default templates in database
  async initializeDatabase() {
    try {
      const storage = await this.getStorageProvider();
      const existingTemplates = await storage.getTemplates();
      
      // Always ensure MongoDB Design Review template exists
      const mongoDBTemplate = this.defaultTemplates.find(t => t.name === 'MongoDB Design Review Report');
      if (mongoDBTemplate) {
        const existingMongoTemplate = existingTemplates.find(t => t.name === 'MongoDB Design Review Report');
        if (!existingMongoTemplate) {
          console.log('Adding MongoDB Design Review template...');
          await storage.createTemplate({
            ...mongoDBTemplate,
            metadata: {
              ...mongoDBTemplate.metadata,
              author: 'MongoDB Design Review Team',
              isDefault: true
            }
          });
          console.log('MongoDB Design Review template added successfully');
        }
      }
      
      if (existingTemplates.length === 0) {
        console.log('Initializing default templates...');
        
        for (const template of this.defaultTemplates) {
          await storage.createTemplate({
            ...template,
            metadata: {
              author: 'System',
              isDefault: true
            }
          });
        }
        
        console.log('Default templates initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing default templates:', error);
      // Fallback to direct MongoDB call if storage provider fails
      try {
        const existingTemplates = await getTemplates();
        
        // Always ensure MongoDB Design Review template exists (fallback)
        const mongoDBTemplate = this.defaultTemplates.find(t => t.name === 'MongoDB Design Review Report');
        if (mongoDBTemplate) {
          const existingMongoTemplate = existingTemplates.find(t => t.name === 'MongoDB Design Review Report');
          if (!existingMongoTemplate) {
            console.log('Fallback: Adding MongoDB Design Review template...');
            await createTemplate({
              ...mongoDBTemplate,
              metadata: {
                ...mongoDBTemplate.metadata,
                author: 'MongoDB Design Review Team',
                isDefault: true
              }
            });
          }
        }
        
        if (existingTemplates.length === 0) {
          console.log('Fallback: Initializing default templates in MongoDB...');
          
          for (const template of this.defaultTemplates) {
            await createTemplate({
              ...template,
              metadata: {
                author: 'System',
                isDefault: true
              }
            });
          }
          
          console.log('Default templates initialized successfully via fallback');
        }
      } catch (fallbackError) {
        console.error('Both storage provider and fallback failed:', fallbackError);
      }
    }
  }

  // Variable substitution using Handlebars-like syntax
  substituteVariables(template, variables) {
    let prompt = template.prompt;
    
    // Simple variable substitution
    Object.keys(variables).forEach(key => {
      const value = variables[key];
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      prompt = prompt.replace(regex, value || '');
    });
    
    // Handle conditional blocks {{#if variable}}...{{/if}}
    prompt = prompt.replace(/{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g, (match, varName, content) => {
      return variables[varName] ? content : '';
    });
    
    return prompt;
  }

  // Validate variables against template requirements
  validateVariables(template, providedVariables) {
    const errors = [];
    
    template.variables.forEach(variable => {
      if (variable.required && !providedVariables[variable.name]) {
        errors.push(`Required variable '${variable.name}' is missing`);
      }
      
      if (variable.type === 'select' && providedVariables[variable.name]) {
        if (!variable.options.includes(providedVariables[variable.name])) {
          errors.push(`Invalid value for '${variable.name}'. Must be one of: ${variable.options.join(', ')}`);
        }
      }
    });
    
    return errors;
  }

  // Get template with usage tracking
  async getTemplateForUse(templateId) {
    try {
      // First try with the storage provider to handle MongoDB/local storage
      const storage = await this.getStorageProvider();
      const template = await storage.getTemplateById(templateId);
      
      if (template) {
        await storage.incrementTemplateUsage(templateId);
      }
      
      return template;
    } catch (error) {
      console.error('Error getting template for use:', error);
      // Fallback to direct MongoDB call if storage provider fails
      try {
        const template = await getTemplateById(templateId);
        if (template) {
          await incrementTemplateUsage(templateId);
        }
        return template;
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        throw new Error(`Could not retrieve template: ${error.message}`);
      }
    }
  }

  // Template CRUD operations with validation
  async createCustomTemplate(templateData) {
    // Validate template structure
    const requiredFields = ['name', 'description', 'category', 'prompt'];
    const missingFields = requiredFields.filter(field => !templateData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    // Set defaults
    const template = {
      ...templateData,
      icon: templateData.icon || 'Description',
      variables: templateData.variables || [],
      outputFormat: templateData.outputFormat || 'markdown',
      sections: templateData.sections || []
    };
    
    return await createTemplate(template);
  }

  async updateCustomTemplate(templateId, updates) {
    // Don't allow updating system templates
    const template = await getTemplateById(templateId);
    
    if (template?.metadata?.isDefault) {
      throw new Error('Cannot modify default templates');
    }
    
    // Save current version before updating
    if (template) {
      const { saveTemplateVersion } = require('./mongoStorage');
      try {
        await saveTemplateVersion(templateId, template, 'pre_update');
      } catch (error) {
        console.warn('Failed to save template version:', error);
      }
    }
    
    const result = await updateTemplate(templateId, updates);
    
    // Save new version after updating
    if (result) {
      const { saveTemplateVersion } = require('./mongoStorage');
      try {
        const updatedTemplate = await getTemplateById(templateId);
        await saveTemplateVersion(templateId, updatedTemplate, 'updated');
      } catch (error) {
        console.warn('Failed to save updated template version:', error);
      }
    }
    
    return result;
  }

  async deleteCustomTemplate(templateId) {
    // Don't allow deleting system templates
    const template = await getTemplateById(templateId);
    
    if (template?.metadata?.isDefault) {
      throw new Error('Cannot delete default templates');
    }
    
    return await deleteTemplate(templateId);
  }

  // Get templates by category
  async getTemplatesByCategory(category) {
    return await getTemplates({ category });
  }

  // Search templates
  async searchTemplates(searchTerm) {
    return await getTemplates({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } }
      ]
    });
  }

  // Template validation using JSON schema
  validateTemplateSchema(templateData) {
    const errors = [];
    
    // Required fields
    const requiredFields = ['name', 'description', 'category', 'prompt', 'version'];
    for (const field of requiredFields) {
      if (!templateData[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    // Version format validation
    if (templateData.version && !/^\d+\.\d+\.\d+$/.test(templateData.version)) {
      errors.push('Version must be in format x.y.z (e.g., 1.0.0)');
    }
    
    // Category validation
    const validCategories = ['Business', 'HR', 'Sales', 'Healthcare', 'Legal', 'Education', 'Technology', 'Finance', 'Custom'];
    if (templateData.category && !validCategories.includes(templateData.category)) {
      errors.push(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }
    
    // Variables validation
    if (templateData.variables) {
      if (!Array.isArray(templateData.variables)) {
        errors.push('Variables must be an array');
      } else {
        templateData.variables.forEach((variable, index) => {
          if (!variable.name) {
            errors.push(`Variable ${index + 1}: Missing name`);
          } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(variable.name)) {
            errors.push(`Variable ${index + 1}: Name must start with letter and contain only letters, numbers, and underscores`);
          }
          
          const validTypes = ['text', 'textarea', 'select', 'date', 'number', 'email', 'url'];
          if (!variable.type || !validTypes.includes(variable.type)) {
            errors.push(`Variable ${index + 1}: Invalid type. Must be one of: ${validTypes.join(', ')}`);
          }
          
          if (variable.type === 'select' && (!variable.options || !Array.isArray(variable.options) || variable.options.length === 0)) {
            errors.push(`Variable ${index + 1}: Select type variables must have options array`);
          }
        });
      }
    }
    
    // Output format validation
    const validFormats = ['markdown', 'html', 'json', 'plain'];
    if (templateData.outputFormat && !validFormats.includes(templateData.outputFormat)) {
      errors.push(`Invalid output format. Must be one of: ${validFormats.join(', ')}`);
    }
    
    return errors;
  }

  // Import template from JSON
  async importTemplate(templateJson) {
    try {
      let templateData;
      
      // Parse JSON if it's a string
      if (typeof templateJson === 'string') {
        templateData = JSON.parse(templateJson);
      } else {
        templateData = templateJson;
      }
      
      // Validate schema
      const validationErrors = this.validateTemplateSchema(templateData);
      if (validationErrors.length > 0) {
        throw new Error(`Template validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Get storage provider (MongoDB or local fallback)
      const storage = await this.getStorageProvider();
      
      // Check for name conflicts
      try {
        const existingTemplates = await storage.getTemplates({ name: templateData.name });
        if (existingTemplates.length > 0) {
          throw new Error(`Template with name "${templateData.name}" already exists`);
        }
      } catch (dbError) {
        console.warn('Could not check for conflicts, proceeding with import:', dbError.message);
      }
      
      // Set metadata
      const now = new Date().toISOString();
      const processedTemplate = {
        ...templateData,
        metadata: {
          ...templateData.metadata,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
          rating: 0,
          isDefault: false,
          author: templateData.metadata?.author || 'User Import'
        }
      };
      
      // Create template using appropriate storage
      const result = await storage.createTemplate(processedTemplate);
      
      console.log('Template imported successfully:', result.name);
      return result;
      
    } catch (error) {
      console.error('Error importing template:', error);
      throw new Error(`Import failed: ${error.message}`);
    }
  }

  // Export template to JSON
  async exportTemplate(templateId) {
    try {
      const storage = await this.getStorageProvider();
      const template = await storage.getTemplateById(templateId);
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      // Create exportable template (remove MongoDB _id and internal metadata)
      const exportTemplate = {
        name: template.name,
        description: template.description,
        category: template.category,
        version: template.version || '1.0.0',
        icon: template.icon || '📄',
        prompt: template.prompt,
        variables: template.variables || [],
        outputFormat: template.outputFormat || 'markdown',
        sections: template.sections || [],
        metadata: {
          author: template.metadata?.author || 'Unknown',
          createdAt: template.metadata?.createdAt,
          tags: template.metadata?.tags || [],
          minimumTranscriptLength: template.metadata?.minimumTranscriptLength || 50,
          estimatedTokens: template.metadata?.estimatedTokens,
          language: template.metadata?.language || 'en'
        }
      };
      
      return {
        success: true,
        template: exportTemplate,
        filename: `${template.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-template.json`
      };
      
    } catch (error) {
      console.error('Error exporting template:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Export all templates
  async exportAllTemplates() {
    try {
      const storage = await this.getStorageProvider();
      const templates = await storage.getTemplates();
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0.0',
        templates: templates.map(template => ({
          name: template.name,
          description: template.description,
          category: template.category,
          version: template.version || '1.0.0',
          icon: template.icon || '📄',
          prompt: template.prompt,
          variables: template.variables || [],
          outputFormat: template.outputFormat || 'markdown',
          sections: template.sections || [],
          metadata: {
            author: template.metadata?.author || 'Unknown',
            createdAt: template.metadata?.createdAt,
            tags: template.metadata?.tags || [],
            isDefault: template.metadata?.isDefault || false,
            minimumTranscriptLength: template.metadata?.minimumTranscriptLength || 50,
            estimatedTokens: template.metadata?.estimatedTokens,
            language: template.metadata?.language || 'en'
          }
        }))
      };
      
      return {
        success: true,
        data: exportData,
        filename: `mongodb-design-review-templates-${new Date().toISOString().split('T')[0]}.json`
      };
      
    } catch (error) {
      console.error('Error exporting all templates:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Import multiple templates from export file
  async importTemplateCollection(collectionJson) {
    try {
      let collectionData;
      
      // Parse JSON if it's a string
      if (typeof collectionJson === 'string') {
        collectionData = JSON.parse(collectionJson);
      } else {
        collectionData = collectionJson;
      }
      
      if (!collectionData.templates || !Array.isArray(collectionData.templates)) {
        throw new Error('Invalid template collection format. Expected "templates" array.');
      }
      
      const results = {
        imported: [],
        skipped: [],
        errors: []
      };
      
      for (const templateData of collectionData.templates) {
        try {
          const imported = await this.importTemplate(templateData);
          results.imported.push({ name: templateData.name, id: imported._id });
        } catch (error) {
          if (error.message.includes('already exists')) {
            results.skipped.push({ name: templateData.name, reason: 'Already exists' });
          } else {
            results.errors.push({ name: templateData.name, error: error.message });
          }
        }
      }
      
      return {
        success: true,
        results: results,
        summary: `Imported: ${results.imported.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`
      };
      
    } catch (error) {
      console.error('Error importing template collection:', error);
      throw new Error(`Collection import failed: ${error.message}`);
    }
  }
}

// Create singleton instance
const templateManager = new TemplateManagerService();

module.exports = {
  templateManager,
  initializeDatabase: () => templateManager.initializeDatabase(),
  substituteVariables: (template, variables) => templateManager.substituteVariables(template, variables),
  validateVariables: (template, variables) => templateManager.validateVariables(template, variables),
  getTemplateForUse: (templateId) => templateManager.getTemplateForUse(templateId),
  createCustomTemplate: (templateData) => templateManager.createCustomTemplate(templateData),
  updateCustomTemplate: (templateId, updates) => templateManager.updateCustomTemplate(templateId, updates),
  deleteCustomTemplate: (templateId) => templateManager.deleteCustomTemplate(templateId),
  getTemplatesByCategory: (category) => templateManager.getTemplatesByCategory(category),
  searchTemplates: (searchTerm) => templateManager.searchTemplates(searchTerm),
  // Import/Export functions
  validateTemplateSchema: (templateData) => templateManager.validateTemplateSchema(templateData),
  importTemplate: (templateJson) => templateManager.importTemplate(templateJson),
  exportTemplate: (templateId) => templateManager.exportTemplate(templateId),
  exportAllTemplates: () => templateManager.exportAllTemplates(),
  importTemplateCollection: (collectionJson) => templateManager.importTemplateCollection(collectionJson)
};
```

# app/services/usageTracker.js

```js
// Usage Tracking and Metrics Collection Service
const fs = require('fs');
const path = require('path');
const os = require('os');

class UsageTracker {
  constructor() {
    this.dataDir = path.join(os.homedir(), '.research-companion');
    this.usageFile = path.join(this.dataDir, 'usage-metrics.json');
    this.sessionFile = path.join(this.dataDir, 'current-session-usage.json');
    this.ensureDataDirectory();
    this.currentSession = this.loadCurrentSession();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  loadCurrentSession() {
    try {
      if (fs.existsSync(this.sessionFile)) {
        return JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading current session usage:', error);
    }
    
    return {
      sessionId: Date.now().toString(),
      startTime: new Date().toISOString(),
      provider: null,
      model: null,
      requests: [],
      totalTokens: 0,
      totalCost: 0,
      operations: {
        topicExtraction: { count: 0, tokens: 0, cost: 0 },
        meetingNotes: { count: 0, tokens: 0, cost: 0 },
        research: { count: 0, tokens: 0, cost: 0 },
        reportGeneration: { count: 0, tokens: 0, cost: 0 }
      }
    };
  }

  saveCurrentSession() {
    try {
      fs.writeFileSync(this.sessionFile, JSON.stringify(this.currentSession, null, 2));
    } catch (error) {
      console.error('Error saving current session usage:', error);
    }
  }

  loadHistoricalUsage() {
    try {
      if (fs.existsSync(this.usageFile)) {
        return JSON.parse(fs.readFileSync(this.usageFile, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading historical usage:', error);
    }
    
    return {
      totalSessions: 0,
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      providers: {},
      dailyUsage: {},
      monthlyUsage: {},
      operationBreakdown: {
        topicExtraction: { count: 0, tokens: 0, cost: 0 },
        meetingNotes: { count: 0, tokens: 0, cost: 0 },
        research: { count: 0, tokens: 0, cost: 0 },
        reportGeneration: { count: 0, tokens: 0, cost: 0 }
      }
    };
  }

  saveHistoricalUsage(data) {
    try {
      fs.writeFileSync(this.usageFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving historical usage:', error);
    }
  }

  startNewSession(provider, model) {
    // Save previous session to historical data
    this.endCurrentSession();
    
    // Start new session
    this.currentSession = {
      sessionId: Date.now().toString(),
      startTime: new Date().toISOString(),
      provider: provider,
      model: model,
      requests: [],
      totalTokens: 0,
      totalCost: 0,
      operations: {
        topicExtraction: { count: 0, tokens: 0, cost: 0 },
        meetingNotes: { count: 0, tokens: 0, cost: 0 },
        research: { count: 0, tokens: 0, cost: 0 },
        reportGeneration: { count: 0, tokens: 0, cost: 0 }
      }
    };
    
    this.saveCurrentSession();
    console.log('Started new usage tracking session:', this.currentSession.sessionId);
  }

  trackRequest(operation, inputTokens, outputTokens, provider, model) {
    const timestamp = new Date().toISOString();
    const cost = this.calculateCost(provider, model, inputTokens, outputTokens);
    const totalTokens = inputTokens + outputTokens;

    const request = {
      timestamp,
      operation,
      provider,
      model,
      inputTokens,
      outputTokens,
      totalTokens,
      cost
    };

    // Update current session
    this.currentSession.requests.push(request);
    this.currentSession.totalTokens += totalTokens;
    this.currentSession.totalCost += cost;
    this.currentSession.provider = provider;
    this.currentSession.model = model;

    // Update operation-specific metrics
    if (this.currentSession.operations[operation]) {
      this.currentSession.operations[operation].count += 1;
      this.currentSession.operations[operation].tokens += totalTokens;
      this.currentSession.operations[operation].cost += cost;
    }

    this.saveCurrentSession();
    
    console.log(`Tracked ${operation} request: ${totalTokens} tokens, $${cost.toFixed(4)}`);
    return request;
  }

  calculateCost(provider, model, inputTokens, outputTokens) {
    // Pricing per 1M tokens (as of 2024)
    const pricing = {
      openai: {
        'gpt-4': { input: 30, output: 60 },
        'gpt-4-turbo': { input: 10, output: 30 },
        'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
        'gpt-4o': { input: 5, output: 15 },
        'gpt-4o-mini': { input: 0.15, output: 0.6 }
      },
      gemini: {
        'gemini-pro': { input: 0.5, output: 1.5 },
        'gemini-1.5-pro': { input: 3.5, output: 10.5 },
        'gemini-1.5-flash': { input: 0.075, output: 0.3 }
      },
      claude: {
        'claude-3-opus-20240229': { input: 15, output: 75 },
        'claude-3-sonnet-20240229': { input: 3, output: 15 },
        'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
        'claude-3-5-sonnet-20241022': { input: 3, output: 15 }
      },
      cohere: {
        'command': { input: 1, output: 2 },
        'command-r': { input: 0.5, output: 1.5 },
        'command-r-plus': { input: 3, output: 15 }
      },
      mistral: {
        'mistral-tiny': { input: 0.25, output: 0.25 },
        'mistral-small': { input: 2, output: 6 },
        'mistral-medium': { input: 2.7, output: 8.1 },
        'mistral-large': { input: 8, output: 24 }
      },
      ollama: {
        // Local models - no cost
        default: { input: 0, output: 0 }
      }
    };

    if (provider === 'ollama') {
      return 0; // Local models are free
    }

    const modelPricing = pricing[provider]?.[model] || pricing[provider]?.default || { input: 0, output: 0 };
    
    const inputCost = (inputTokens / 1000000) * modelPricing.input;
    const outputCost = (outputTokens / 1000000) * modelPricing.output;
    
    return inputCost + outputCost;
  }

  endCurrentSession() {
    if (this.currentSession.requests.length === 0) {
      return; // No requests to save
    }

    this.currentSession.endTime = new Date().toISOString();
    
    // Load historical data
    const historical = this.loadHistoricalUsage();
    
    // Update historical totals
    historical.totalSessions += 1;
    historical.totalRequests += this.currentSession.requests.length;
    historical.totalTokens += this.currentSession.totalTokens;
    historical.totalCost += this.currentSession.totalCost;

    // Update provider stats
    const provider = this.currentSession.provider;
    if (provider) {
      if (!historical.providers[provider]) {
        historical.providers[provider] = {
          sessions: 0,
          requests: 0,
          tokens: 0,
          cost: 0,
          models: {}
        };
      }
      
      historical.providers[provider].sessions += 1;
      historical.providers[provider].requests += this.currentSession.requests.length;
      historical.providers[provider].tokens += this.currentSession.totalTokens;
      historical.providers[provider].cost += this.currentSession.totalCost;

      // Update model stats
      const model = this.currentSession.model;
      if (model) {
        if (!historical.providers[provider].models[model]) {
          historical.providers[provider].models[model] = { requests: 0, tokens: 0, cost: 0 };
        }
        historical.providers[provider].models[model].requests += this.currentSession.requests.length;
        historical.providers[provider].models[model].tokens += this.currentSession.totalTokens;
        historical.providers[provider].models[model].cost += this.currentSession.totalCost;
      }
    }

    // Update daily usage
    const today = new Date().toISOString().split('T')[0];
    if (!historical.dailyUsage[today]) {
      historical.dailyUsage[today] = { requests: 0, tokens: 0, cost: 0 };
    }
    historical.dailyUsage[today].requests += this.currentSession.requests.length;
    historical.dailyUsage[today].tokens += this.currentSession.totalTokens;
    historical.dailyUsage[today].cost += this.currentSession.totalCost;

    // Update monthly usage
    const month = today.substring(0, 7); // YYYY-MM
    if (!historical.monthlyUsage[month]) {
      historical.monthlyUsage[month] = { requests: 0, tokens: 0, cost: 0 };
    }
    historical.monthlyUsage[month].requests += this.currentSession.requests.length;
    historical.monthlyUsage[month].tokens += this.currentSession.totalTokens;
    historical.monthlyUsage[month].cost += this.currentSession.totalCost;

    // Update operation breakdown
    Object.keys(this.currentSession.operations).forEach(op => {
      if (!historical.operationBreakdown[op]) {
        historical.operationBreakdown[op] = { count: 0, tokens: 0, cost: 0 };
      }
      historical.operationBreakdown[op].count += this.currentSession.operations[op].count;
      historical.operationBreakdown[op].tokens += this.currentSession.operations[op].tokens;
      historical.operationBreakdown[op].cost += this.currentSession.operations[op].cost;
    });

    // Save updated historical data
    this.saveHistoricalUsage(historical);
    
    console.log('Session ended. Usage saved to historical data.');
  }

  getCurrentSessionMetrics() {
    return {
      ...this.currentSession,
      duration: this.currentSession.startTime ? 
        Date.now() - new Date(this.currentSession.startTime).getTime() : 0
    };
  }

  getHistoricalMetrics() {
    return this.loadHistoricalUsage();
  }

  getDashboardSummary() {
    const historical = this.loadHistoricalUsage();
    const current = this.getCurrentSessionMetrics();
    
    // Get recent usage (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
    
    const recentUsage = Object.entries(historical.dailyUsage)
      .filter(([date]) => date >= cutoffDate)
      .reduce((acc, [_, usage]) => {
        acc.requests += usage.requests;
        acc.tokens += usage.tokens;
        acc.cost += usage.cost;
        return acc;
      }, { requests: 0, tokens: 0, cost: 0 });

    return {
      current: current,
      historical: historical,
      recentUsage: recentUsage,
      topProviders: Object.entries(historical.providers)
        .sort(([,a], [,b]) => b.requests - a.requests)
        .slice(0, 5),
      costTrend: this.calculateCostTrend(historical.dailyUsage),
      efficiency: this.calculateEfficiencyMetrics(historical)
    };
  }

  calculateCostTrend(dailyUsage) {
    const last7Days = Object.entries(dailyUsage)
      .slice(-7)
      .map(([date, usage]) => ({ date, cost: usage.cost }));
    
    if (last7Days.length < 2) return 0;
    
    const recent = last7Days.slice(-3).reduce((sum, day) => sum + day.cost, 0) / 3;
    const previous = last7Days.slice(0, -3).reduce((sum, day) => sum + day.cost, 0) / Math.max(1, last7Days.length - 3);
    
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
  }

  calculateEfficiencyMetrics(historical) {
    const totalOperations = Object.values(historical.operationBreakdown)
      .reduce((sum, op) => sum + op.count, 0);
    
    if (totalOperations === 0) return {};

    return {
      avgTokensPerOperation: historical.totalTokens / totalOperations,
      avgCostPerOperation: historical.totalCost / totalOperations,
      mostEfficientOperation: Object.entries(historical.operationBreakdown)
        .reduce((min, [op, data]) => 
          data.count > 0 && (data.cost / data.count) < (min.costPerOp || Infinity) 
            ? { operation: op, costPerOp: data.cost / data.count }
            : min, {}),
      operationDistribution: Object.entries(historical.operationBreakdown)
        .map(([op, data]) => ({
          operation: op,
          percentage: (data.count / totalOperations) * 100
        }))
    };
  }

  exportUsageData() {
    const historical = this.loadHistoricalUsage();
    const current = this.getCurrentSessionMetrics();
    
    return {
      exportDate: new Date().toISOString(),
      currentSession: current,
      historicalData: historical,
      summary: this.getDashboardSummary()
    };
  }
}

// Create singleton instance
const usageTracker = new UsageTracker();

module.exports = {
  usageTracker,
  trackRequest: (operation, inputTokens, outputTokens, provider, model) => 
    usageTracker.trackRequest(operation, inputTokens, outputTokens, provider, model),
  startNewSession: (provider, model) => usageTracker.startNewSession(provider, model),
  endCurrentSession: () => usageTracker.endCurrentSession(),
  getCurrentSessionMetrics: () => usageTracker.getCurrentSessionMetrics(),
  getHistoricalMetrics: () => usageTracker.getHistoricalMetrics(),
  getDashboardSummary: () => usageTracker.getDashboardSummary(),
  exportUsageData: () => usageTracker.exportUsageData()
};
```

# app/splash/README.md

```md
# Auracle Splash Screen

A retro-styled 8-bit inspired splash screen for the Auracle application.

## Features

- 🎨 **Retro Design** - 8-bit/pixel art aesthetic matching Auracle's brand
- ⚡ **Smooth Animations** - CSS-based animations with multiple variants
- 📱 **Responsive** - Works on different screen sizes
- 🔊 **Audio Support** - Optional 8-bit loading sounds
- ♿ **Accessible** - Respects motion preferences and high contrast
- 🎯 **Interactive** - Click/keyboard shortcuts for development

## File Structure

\`\`\`
splash/
├── splash.html    # Main HTML structure
├── splash.css     # Retro styling and animations
├── splash.js      # JavaScript logic and IPC communication
└── README.md      # This file
\`\`\`

## Design Elements

### Visual Components
- **App Logo** - Animated "A" with rotating colors
- **Pixel Sprite** - Geometric CSS-based animation
- **Loading Text** - Typewriter effect with glowing text
- **Progress Bar** - Animated with shine effect
- **Floating Particles** - Background ambient animation

### Color Scheme
- Background: Deep blue gradient (`#0f172a` → `#334155`)
- Primary: Indigo (`#6366f1`)
- Secondary: Cyan (`#06b6d4`)
- Accent: Green (`#10b981`)
- Text: Light gray (`#f8fafc`)

### Animations
1. **Logo Spin** - 360° rotation with color transitions
2. **Sprite Hop** - Bouncing animation with scale
3. **Text Glow** - Pulsing text with shadow effects
4. **Dot Bounce** - Staggered loading dots
5. **Progress Fill** - Smooth bar animation with shine
6. **Particle Float** - Floating background particles

## Integration

### Main Process (main.js)
\`\`\`javascript
// Show splash screen first
createSplashWindow();

// Create main window (hidden)
createWindow();

// Initialize services and show main when ready
initializeServices().then(() => {
  mainWindow.show();
  closeSplashWindow();
});
\`\`\`

### IPC Communication
- `splash-loading-complete` - Splash notifies completion
- `loading-progress` - Update progress bar (0-100%)
- `loading-status` - Update status message text

## Customization

### Timing
- Default duration: 5 seconds maximum
- Progress animation: 3 seconds
- Text updates: Every 1.5 seconds
- Status updates: Every 2.5 seconds

### Messages
Edit arrays in `splash.js`:
\`\`\`javascript
loadingMessages: [
  'Initializing Auracle...',
  'Loading AI models...',
  // Add your messages
];
\`\`\`

### Audio
Add audio file and uncomment in HTML:
\`\`\`html
<source src="assets/loading-sound.mp3" type="audio/mpeg">
\`\`\`

### Development Features
- **Triple-click** - Skip to completion
- **Spacebar** - Skip splash (development)
- **Auto-fallback** - Works without Electron context

## Browser Compatibility

- Modern browsers with CSS Grid/Flexbox
- CSS animations and transforms
- ES6+ JavaScript features
- Electron environment with Node.js integration

## Performance

- Pure CSS animations (no JavaScript animation loops)
- Optimized for 60fps
- Minimal memory footprint
- GPU-accelerated transforms
- Reduced motion support for accessibility

## Accessibility

- `prefers-reduced-motion` support
- `prefers-contrast` high contrast mode
- Keyboard navigation support
- Screen reader friendly structure
- Optional audio with volume controls
```

# app/splash/splash.css

```css
/* bitscribe Splash Screen - Clean Professional Style */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-color: #13AA52;
  --primary-dark: #0E7C3A;
  --secondary-color: #3E4E50;
  --secondary-dark: #2A3638;
  --bg-light: #FFFFFF;
  --bg-paper: #F5F7FA;
  --text-primary: #1A1A1A;
  --text-secondary: #5A6C6F;
  --border-color: rgba(0, 0, 0, 0.08);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-light);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: 'Inter', 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
  color: var(--text-primary);
  overflow: hidden;
  position: relative;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

.app-icon {
  margin-bottom: 32px;
  position: relative;
}

.pixel-logo {
  width: 80px;
  height: 80px;
  background: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
  color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(19, 170, 82, 0.3);
  transition: all 0.3s ease;
}

.pixel-sprite {
  display: none; /* Removed for cleaner look */
}

.loading-text-container {
  margin-bottom: 24px;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: dotPulse 1.5s infinite ease-in-out;
}

.dot:nth-child(2) { animation-delay: 0.3s; }
.dot:nth-child(3) { animation-delay: 0.6s; }

@keyframes dotPulse {
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

.progress-bar {
  width: 320px;
  height: 6px;
  background: var(--bg-paper);
  border: 1px solid var(--border-color);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  animation: progress 2.5s ease-out forwards;
  position: relative;
  transition: width 0.3s ease;
}

@keyframes progress {
  from { width: 0%; }
  to { width: 100%; }
}

.loading-message {
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 400;
}

/* Loading states */
.loading-state {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeInUp 0.5s ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Clean, minimal animations */
.pixel-logo:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(19, 170, 82, 0.4);
}
```

# app/splash/splash.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>bitscribe Loading...</title>
  <link rel="stylesheet" href="splash.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
</head>
<body>
  <div class="loading-container">
    <!-- bitscribe Logo/Icon Area -->
    <div class="app-icon">
      <div class="pixel-logo">M</div>
    </div>
    
    <!-- Animated Sprite -->
    <div class="pixel-sprite"></div>
    
    <!-- Loading Text with Typing Animation -->
    <div class="loading-text-container">
      <div class="loading-text" id="loadingText">Initializing bitscribe...</div>
      <div class="loading-dots">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar" id="progressBar"></div>
    </div>
    
    <!-- Status Messages -->
    <div class="status-message" id="statusMessage">Starting AI Research Companion</div>
  </div>

  <!-- 8-bit Audio (Optional) -->
  <audio id="loadingSound" preload="auto" loop>
    <!-- You can add an 8-bit loading sound here -->
    <!-- <source src="assets/loading-sound.mp3" type="audio/mpeg"> -->
  </audio>

  <script src="splash.js"></script>
</body>
</html>
```

# app/splash/splash.js

```js
// Auracle Splash Screen JavaScript
// Handles dynamic loading states and randomized animations

class SplashScreen {
  constructor() {
    this.loadingMessages = [
      'Initializing Auracle...',
      'Loading AI models...',
      'Connecting to services...',
      'Preparing workspace...',
      'Almost ready...'
    ];
    
    this.statusMessages = [
      'Starting AI Research Companion',
      'Checking dependencies...',
      'Loading whisper.cpp engine',
      'Connecting to Ollama',
      'Initializing research tools',
      'Ready to transcribe!'
    ];
    
    this.currentMessageIndex = 0;
    this.currentStatusIndex = 0;
    this.progressValue = 0;
    
    this.init();
  }
  
  init() {
    // Start the loading sequence
    this.startLoadingSequence();
    
    // Add click-to-continue functionality (optional)
    this.addInteractivity();
    
    // Random sprite animation variant
    this.randomizeSprite();
    
    // Optional: Play loading sound
    this.playLoadingSound();
  }
  
  startLoadingSequence() {
    // Update loading text periodically
    setInterval(() => {
      this.updateLoadingText();
    }, 1500);
    
    // Update status messages
    setInterval(() => {
      this.updateStatusMessage();
    }, 2500);
    
    // Smooth progress bar animation
    this.animateProgress();
  }
  
  updateLoadingText() {
    const loadingTextElement = document.getElementById('loadingText');
    if (loadingTextElement && this.currentMessageIndex < this.loadingMessages.length) {
      // Type-writer effect
      this.typeWriterEffect(loadingTextElement, this.loadingMessages[this.currentMessageIndex]);
      this.currentMessageIndex++;
    }
  }
  
  updateStatusMessage() {
    const statusElement = document.getElementById('statusMessage');
    if (statusElement && this.currentStatusIndex < this.statusMessages.length) {
      statusElement.style.opacity = '0';
      setTimeout(() => {
        statusElement.textContent = this.statusMessages[this.currentStatusIndex];
        statusElement.style.opacity = '1';
        this.currentStatusIndex++;
      }, 200);
    }
  }
  
  typeWriterEffect(element, text) {
    element.textContent = '';
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
  }
  
  animateProgress() {
    const progressBar = document.getElementById('progressBar');
    const increment = 100 / (this.loadingMessages.length * 1.5);
    
    const progressInterval = setInterval(() => {
      if (this.progressValue < 100) {
        this.progressValue += increment;
        progressBar.style.width = Math.min(this.progressValue, 100) + '%';
      } else {
        clearInterval(progressInterval);
        // Notify main process that loading is complete
        this.notifyLoadingComplete();
      }
    }, 200);
  }
  
  randomizeSprite() {
    const sprite = document.querySelector('.pixel-sprite');
    const animations = ['spriteHop', 'spriteSpin', 'spritePulse'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    
    // Add additional animation variants
    if (randomAnimation === 'spriteSpin') {
      sprite.style.animation = 'spriteHop 1.2s ease-in-out infinite, logoSpin 2s linear infinite';
    } else if (randomAnimation === 'spritePulse') {
      sprite.style.animation = 'spriteHop 1.2s ease-in-out infinite, containerGlow 1.5s ease-in-out infinite alternate';
    }
  }
  
  playLoadingSound() {
    // Optional: Play 8-bit loading sound
    const audio = document.getElementById('loadingSound');
    if (audio && audio.canPlayType) {
      // Check if user has allowed audio autoplay
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play was prevented - that's ok
          console.log('Audio autoplay prevented:', error);
        });
      }
    }
  }
  
  addInteractivity() {
    // Allow clicking to speed up loading (for development)
    document.addEventListener('click', (e) => {
      if (e.detail === 3) { // Triple-click to skip
        this.skipToComplete();
      }
    });
    
    // Listen for main process messages
    if (window.require) {
      const { ipcRenderer } = window.require('electron');
      
      ipcRenderer.on('loading-progress', (event, progress) => {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = progress + '%';
      });
      
      ipcRenderer.on('loading-status', (event, status) => {
        const statusElement = document.getElementById('statusMessage');
        statusElement.textContent = status;
      });
    }
  }
  
  skipToComplete() {
    this.progressValue = 100;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '100%';
    setTimeout(() => {
      this.notifyLoadingComplete();
    }, 500);
  }
  
  notifyLoadingComplete() {
    // Fade out splash screen
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-out';
    
    // Notify Electron main process
    setTimeout(() => {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('splash-loading-complete');
      } else {
        // Fallback for development
        console.log('Splash loading complete');
        window.close();
      }
    }, 500);
  }
}

// Initialize splash screen when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SplashScreen();
});

// Add some extra visual flair
document.addEventListener('DOMContentLoaded', () => {
  // Create floating particles effect
  createFloatingParticles();
  
  // Add keyboard shortcuts for development
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      // Space to skip splash (development only)
      if (window.splashScreen) {
        window.splashScreen.skipToComplete();
      }
    }
  });
});

function createFloatingParticles() {
  const particleCount = 15;
  const container = document.querySelector('.loading-container');
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: rgba(99, 102, 241, 0.6);
      border-radius: 50%;
      pointer-events: none;
      animation: float ${3 + Math.random() * 4}s linear infinite;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      z-index: 1;
    `;
    
    container.appendChild(particle);
  }
  
  // Add floating animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
```

# app/splash/test.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Auracle Splash Screen Test</title>
  <link rel="stylesheet" href="splash.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  <style>
    /* Test-specific styles */
    .test-controls {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1000;
      display: flex;
      gap: 10px;
      flex-direction: column;
    }
    
    .test-btn {
      padding: 8px 12px;
      background: rgba(99, 102, 241, 0.8);
      color: white;
      border: none;
      border-radius: 4px;
      font-family: 'Press Start 2P';
      font-size: 8px;
      cursor: pointer;
    }
    
    .test-btn:hover {
      background: rgba(99, 102, 241, 1);
    }
    
    .test-info {
      position: fixed;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 10px;
      max-width: 200px;
    }
  </style>
</head>
<body>
  <!-- Test Controls -->
  <div class="test-controls">
    <button class="test-btn" onclick="restartAnimation()">Restart</button>
    <button class="test-btn" onclick="skipToEnd()">Skip</button>
    <button class="test-btn" onclick="toggleSound()">Toggle Sound</button>
    <button class="test-btn" onclick="randomizeColors()">Random Colors</button>
  </div>

  <!-- Main Splash Content -->
  <div class="loading-container">
    <!-- Auracle Logo/Icon Area -->
    <div class="app-icon">
      <div class="pixel-logo">A</div>
    </div>
    
    <!-- Animated Sprite -->
    <div class="pixel-sprite"></div>
    
    <!-- Loading Text with Typing Animation -->
    <div class="loading-text-container">
      <div class="loading-text" id="loadingText">Initializing Auracle...</div>
      <div class="loading-dots">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </div>
    </div>
    
    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar" id="progressBar"></div>
    </div>
    
    <!-- Status Messages -->
    <div class="status-message" id="statusMessage">Starting AI Research Companion</div>
  </div>

  <!-- Test Info -->
  <div class="test-info">
    <strong>Test Mode</strong><br>
    • Triple-click to skip<br>
    • Space to skip<br>
    • Auto-restart in 8s<br>
    • Click buttons to test
  </div>

  <script src="splash.js"></script>
  <script>
    // Test-specific JavaScript
    let testSplashScreen;
    
    document.addEventListener('DOMContentLoaded', () => {
      testSplashScreen = new SplashScreen();
      
      // Auto-restart for testing
      setInterval(() => {
        restartAnimation();
      }, 8000);
    });
    
    function restartAnimation() {
      location.reload();
    }
    
    function skipToEnd() {
      if (testSplashScreen) {
        testSplashScreen.skipToComplete();
      }
    }
    
    function toggleSound() {
      const audio = document.getElementById('loadingSound');
      if (audio) {
        if (audio.paused) {
          audio.play().catch(console.error);
        } else {
          audio.pause();
        }
      }
    }
    
    function randomizeColors() {
      const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#f39c12', 
        '#e74c3c', '#9b59b6', '#1abc9c', '#f1c40f'
      ];
      
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      document.documentElement.style.setProperty('--retro-primary', randomColor);
      
      const container = document.querySelector('.loading-container');
      container.style.borderColor = randomColor;
    }
    
    // Override the notifyLoadingComplete to restart instead of close
    if (window.SplashScreen) {
      const originalNotify = SplashScreen.prototype.notifyLoadingComplete;
      SplashScreen.prototype.notifyLoadingComplete = function() {
        console.log('Loading complete! Restarting in 2 seconds...');
        setTimeout(restartAnimation, 2000);
      };
    }
  </script>
</body>
</html>
```

# app/storage/index.js

```js
// Local Storage (stub)
// TODO: Replace with MongoDB in the future
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

function saveSession(session) {
  const file = path.join(dataDir, `session-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(session, null, 2));
}

function loadSessions() {
  return fs.readdirSync(dataDir)
    .filter(f => f.startsWith('session-'))
    .map(f => JSON.parse(fs.readFileSync(path.join(dataDir, f))));
}

module.exports = { saveSession, loadSessions }; 
```

# app/whisper/README.md

```md
# whisper.cpp Integration

## Install on macOS

1. **Install dependencies:**
   \`\`\`sh
   brew install cmake
   brew install portaudio
   \`\`\`

2. **Clone whisper.cpp:**
   \`\`\`sh
   git clone https://github.com/ggerganov/whisper.cpp.git
   cd whisper.cpp
   make
   \`\`\`

3. **Test transcription:**
   \`\`\`sh
   ./main -m models/ggml-base.en.bin -f samples/jfk.wav
   \`\`\`

4. **For real-time mic input:**
   \`\`\`sh
   ./main -m models/ggml-base.en.bin -t 4 --step 500 --length 5000 --real-time --output-txt
   \`\`\`

See [whisper.cpp GitHub](https://github.com/ggerganov/whisper.cpp) for more details. 
```

# babel.config.json

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
} 
```

# debug-emergency.js

```js
// Emergency Real-Time Debugging System for Auracle Blanking Issue
// This script monitors EVERYTHING to catch the exact moment of blanking

const fs = require('fs');
const path = require('path');
const os = require('os');

class EmergencyDebugger {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.logFile = path.join(os.homedir(), 'auracle-emergency-debug.log');
    this.isMonitoring = false;
    this.intervals = [];
    this.lastKnownState = {
      visible: true,
      focused: true,
      bounds: null,
      timestamp: Date.now()
    };
    
    this.setupEmergencyLogging();
    this.startEmergencyMonitoring();
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    const logLine = `[${timestamp}] ${level.toUpperCase()}: ${message} ${JSON.stringify(data)}\n`;
    
    console.log(`🚨 DEBUG: ${logLine.trim()}`);
    
    try {
      fs.appendFileSync(this.logFile, logLine);
    } catch (error) {
      console.error('Failed to write debug log:', error);
    }
  }

  setupEmergencyLogging() {
    // Clear previous log
    try {
      fs.writeFileSync(this.logFile, `=== AURACLE EMERGENCY DEBUG LOG ===\nStarted: ${new Date().toISOString()}\n\n`);
    } catch (error) {
      console.error('Failed to initialize debug log:', error);
    }

    this.log('INIT', 'Emergency debugger initialized');
  }

  startEmergencyMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    
    this.log('MONITOR', 'Starting emergency monitoring');

    // 1. Monitor window state every 100ms (very frequent)
    const windowMonitor = setInterval(() => {
      this.checkWindowState();
    }, 100);
    this.intervals.push(windowMonitor);

    // 2. Monitor renderer process every 500ms
    const rendererMonitor = setInterval(() => {
      this.checkRendererProcess();
    }, 500);
    this.intervals.push(rendererMonitor);

    // 3. Monitor memory every 1 second
    const memoryMonitor = setInterval(() => {
      this.checkMemoryUsage();
    }, 1000);
    this.intervals.push(memoryMonitor);

    // 4. Monitor system resources every 2 seconds
    const systemMonitor = setInterval(() => {
      this.checkSystemResources();
    }, 2000);
    this.intervals.push(systemMonitor);

    // 5. Ping renderer to check if it's responsive
    const responsiveMonitor = setInterval(() => {
      this.checkRendererResponsiveness();
    }, 1000);
    this.intervals.push(responsiveMonitor);
  }

  checkWindowState() {
    if (!this.mainWindow) return;

    try {
      const currentState = {
        visible: this.mainWindow.isVisible(),
        focused: this.mainWindow.isFocused(),
        minimized: this.mainWindow.isMinimized(),
        maximized: this.mainWindow.isMaximized(),
        bounds: this.mainWindow.getBounds(),
        title: this.mainWindow.getTitle(),
        destroyed: this.mainWindow.isDestroyed(),
        timestamp: Date.now()
      };

      // Check for critical state changes
      if (this.lastKnownState.visible && !currentState.visible) {
        this.log('CRITICAL', 'WINDOW BECAME INVISIBLE', currentState);
        this.emergencySnapshot('window_invisible');
      }

      if (!currentState.focused && this.lastKnownState.focused) {
        this.log('WARNING', 'Window lost focus', currentState);
      }

      if (currentState.destroyed) {
        this.log('CRITICAL', 'WINDOW DESTROYED', currentState);
      }

      this.lastKnownState = currentState;
    } catch (error) {
      this.log('ERROR', 'Window state check failed', { error: error.message });
    }
  }

  checkRendererProcess() {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return;

    try {
      // Check if webContents is available
      const webContents = this.mainWindow.webContents;
      if (!webContents) {
        this.log('CRITICAL', 'WebContents missing');
        return;
      }

      const rendererState = {
        crashed: webContents.isCrashed(),
        loading: webContents.isLoading(),
        destroyed: webContents.isDestroyed(),
        devToolsOpened: webContents.isDevToolsOpened(),
        url: webContents.getURL(),
        title: webContents.getTitle(),
        zoomFactor: webContents.getZoomFactor(),
        timestamp: Date.now()
      };

      if (rendererState.crashed) {
        this.log('CRITICAL', 'RENDERER PROCESS CRASHED', rendererState);
        this.emergencySnapshot('renderer_crashed');
        this.attemptRecovery();
      }

      if (rendererState.destroyed) {
        this.log('CRITICAL', 'RENDERER PROCESS DESTROYED', rendererState);
      }

    } catch (error) {
      this.log('ERROR', 'Renderer process check failed', { error: error.message });
    }
  }

  checkMemoryUsage() {
    try {
      const memInfo = process.memoryUsage();
      const memMB = {
        rss: Math.round(memInfo.rss / 1024 / 1024),
        heapUsed: Math.round(memInfo.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memInfo.heapTotal / 1024 / 1024),
        external: Math.round(memInfo.external / 1024 / 1024)
      };

      // Log if memory usage is concerning
      if (memMB.heapUsed > 200) {
        this.log('WARNING', 'High memory usage detected', memMB);
      }

      if (memMB.heapUsed > 500) {
        this.log('CRITICAL', 'EXTREMELY HIGH MEMORY USAGE', memMB);
        this.emergencySnapshot('high_memory');
      }

    } catch (error) {
      this.log('ERROR', 'Memory check failed', { error: error.message });
    }
  }

  checkSystemResources() {
    try {
      const cpuUsage = process.cpuUsage();
      const systemInfo = {
        platform: os.platform(),
        arch: os.arch(),
        freeMemory: Math.round(os.freemem() / 1024 / 1024),
        totalMemory: Math.round(os.totalmem() / 1024 / 1024),
        loadAverage: os.loadavg(),
        uptime: os.uptime(),
        cpuUsage: cpuUsage
      };

      // Check for concerning system state
      const memoryUsagePercent = (1 - systemInfo.freeMemory / systemInfo.totalMemory) * 100;
      if (memoryUsagePercent > 90) {
        this.log('WARNING', 'System memory critically low', systemInfo);
      }

    } catch (error) {
      this.log('ERROR', 'System resource check failed', { error: error.message });
    }
  }

  checkRendererResponsiveness() {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) return;

    try {
      // Send a ping to renderer and expect a response
      this.mainWindow.webContents.send('debug-ping', { timestamp: Date.now() });
      
      // Set a timeout to detect if renderer doesn't respond
      setTimeout(() => {
        // This will be cleared if we receive a pong
        if (!this.lastPongReceived || (Date.now() - this.lastPongReceived) > 3000) {
          this.log('WARNING', 'Renderer not responding to ping');
        }
      }, 2000);

    } catch (error) {
      this.log('ERROR', 'Responsiveness check failed', { error: error.message });
    }
  }

  emergencySnapshot(reason) {
    this.log('SNAPSHOT', `Creating emergency snapshot: ${reason}`);
    
    try {
      const snapshot = {
        timestamp: new Date().toISOString(),
        reason: reason,
        process: {
          pid: process.pid,
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage(),
          uptime: process.uptime()
        },
        system: {
          platform: os.platform(),
          arch: os.arch(),
          freeMemory: os.freemem(),
          totalMemory: os.totalmem(),
          loadAverage: os.loadavg()
        },
        window: this.lastKnownState
      };

      const snapshotFile = path.join(os.homedir(), `auracle-snapshot-${reason}-${Date.now()}.json`);
      fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2));
      
      this.log('SNAPSHOT', `Snapshot saved to ${snapshotFile}`);
    } catch (error) {
      this.log('ERROR', 'Failed to create snapshot', { error: error.message });
    }
  }

  attemptRecovery() {
    this.log('RECOVERY', 'Attempting emergency recovery');
    
    try {
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        // Try to reload the renderer
        this.mainWindow.webContents.reload();
        this.log('RECOVERY', 'Renderer reload attempted');
      }
    } catch (error) {
      this.log('ERROR', 'Recovery attempt failed', { error: error.message });
    }
  }

  // Called from IPC when renderer responds to ping
  receivePong() {
    this.lastPongReceived = Date.now();
  }

  stop() {
    this.isMonitoring = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.log('MONITOR', 'Emergency monitoring stopped');
  }
}

module.exports = EmergencyDebugger;
```

# debug-renderer.js

```js
// Emergency Renderer-Side Debugging for Screen Blanking
// This script runs in the renderer process to monitor DOM state

class RendererEmergencyDebug {
  constructor() {
    this.isMonitoring = false;
    this.intervals = [];
    this.lastDOMState = null;
    this.blankingDetected = false;
    
    this.startMonitoring();
    this.setupIPCHandlers();
    this.injectVisualIndicator();
  }

  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    console.log(`🔍 RENDERER DEBUG [${timestamp}] ${level}: ${message}`, data);
    
    // Send to main process
    try {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.send('debug-log', { level, message, data, timestamp });
      }
    } catch (error) {
      console.error('Failed to send debug log to main process:', error);
    }
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    
    this.log('INIT', 'Starting renderer emergency monitoring');

    // 1. Monitor DOM state every 500ms
    const domMonitor = setInterval(() => {
      this.checkDOMState();
    }, 500);
    this.intervals.push(domMonitor);

    // 2. Monitor React state every 1 second
    const reactMonitor = setInterval(() => {
      this.checkReactState();
    }, 1000);
    this.intervals.push(reactMonitor);

    // 3. Monitor memory usage every 2 seconds
    const memoryMonitor = setInterval(() => {
      this.checkRendererMemory();
    }, 2000);
    this.intervals.push(memoryMonitor);

    // 4. Check for CSS/styling issues every 1 second
    const styleMonitor = setInterval(() => {
      this.checkStylingIssues();
    }, 1000);
    this.intervals.push(styleMonitor);

    // 5. Monitor console errors
    this.setupErrorMonitoring();
  }

  checkDOMState() {
    try {
      const rootElement = document.getElementById('root');
      if (!rootElement) {
        this.log('CRITICAL', 'ROOT ELEMENT MISSING - This could cause blanking');
        return;
      }

      const bodyStyle = window.getComputedStyle(document.body);
      const rootStyle = window.getComputedStyle(rootElement);
      
      const domState = {
        documentReadyState: document.readyState,
        bodyVisible: bodyStyle.display !== 'none' && bodyStyle.visibility !== 'hidden',
        bodyOpacity: bodyStyle.opacity,
        rootVisible: rootStyle.display !== 'none' && rootStyle.visibility !== 'hidden',
        rootOpacity: rootStyle.opacity,
        childrenCount: rootElement.children.length,
        bodyBackground: bodyStyle.backgroundColor,
        rootBackground: rootStyle.backgroundColor,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };

      // Check for blanking conditions
      const isPotentiallyBlank = (
        domState.bodyOpacity === '0' ||
        domState.rootOpacity === '0' ||
        !domState.bodyVisible ||
        !domState.rootVisible ||
        domState.childrenCount === 0
      );

      if (isPotentiallyBlank && !this.blankingDetected) {
        this.blankingDetected = true;
        this.log('CRITICAL', '🚨 POTENTIAL BLANKING DETECTED', domState);
        this.emergencyDOMAnalysis();
        this.attemptDOMRecovery();
      } else if (!isPotentiallyBlank && this.blankingDetected) {
        this.blankingDetected = false;
        this.log('RECOVERY', 'Blanking condition resolved', domState);
      }

      this.lastDOMState = domState;
    } catch (error) {
      this.log('ERROR', 'DOM state check failed', { error: error.message, stack: error.stack });
    }
  }

  checkReactState() {
    try {
      // Check if React is mounted and working
      const root = document.getElementById('root');
      const reactFiberNode = root?._reactInternalFiber || 
                            root?._reactInternals ||
                            root?._reactRootContainer?._internalRoot?.current;
      
      const reactState = {
        reactMounted: !!reactFiberNode,
        hasReactComponents: document.querySelectorAll('[data-reactroot]').length > 0,
        muiComponents: document.querySelectorAll('[class*="Mui"]').length,
        totalComponents: document.querySelectorAll('*').length,
        rootExists: !!root,
        rootChildren: root?.children?.length || 0
      };

      if (!reactState.reactMounted && reactState.muiComponents > 0) {
        this.log('CRITICAL', '🚨 REACT CRASHED - MUI components exist but React is unmounted!', reactState);
        this.attemptReactRecovery();
      } else if (!reactState.reactMounted) {
        this.log('CRITICAL', 'React appears to be unmounted', reactState);
      }

      if (reactState.totalComponents < 10) {
        this.log('WARNING', 'Very few DOM elements detected', reactState);
      }

    } catch (error) {
      this.log('ERROR', 'React state check failed', { error: error.message });
    }
  }

  attemptReactRecovery() {
    this.log('RECOVERY', '🚨 Attempting React recovery');
    
    try {
      // Force a page reload to recover from React crash
      if (window.location && !this.recoveryAttempted) {
        this.recoveryAttempted = true;
        this.log('RECOVERY', 'Reloading page to recover React');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      this.log('ERROR', 'React recovery failed', { error: error.message });
    }
  }

  checkRendererMemory() {
    try {
      if (window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        const memoryMB = {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
        };

        const usagePercent = (memoryMB.used / memoryMB.limit) * 100;

        if (usagePercent > 80) {
          this.log('CRITICAL', 'Renderer memory critically high', { 
            ...memoryMB, 
            usagePercent: usagePercent.toFixed(1) 
          });
        }
      }
    } catch (error) {
      this.log('ERROR', 'Memory check failed', { error: error.message });
    }
  }

  checkStylingIssues() {
    try {
      const body = document.body;
      const root = document.getElementById('root');
      
      if (!body || !root) return;

      const bodyComputedStyle = window.getComputedStyle(body);
      const rootComputedStyle = window.getComputedStyle(root);

      // Check for common styling issues that could cause blanking
      const issues = [];

      if (bodyComputedStyle.display === 'none') issues.push('body display:none');
      if (bodyComputedStyle.visibility === 'hidden') issues.push('body visibility:hidden');
      if (bodyComputedStyle.opacity === '0') issues.push('body opacity:0');
      if (rootComputedStyle.display === 'none') issues.push('root display:none');
      if (rootComputedStyle.visibility === 'hidden') issues.push('root visibility:hidden');
      if (rootComputedStyle.opacity === '0') issues.push('root opacity:0');
      
      // Check for z-index issues
      const zIndex = rootComputedStyle.zIndex;
      if (zIndex && parseInt(zIndex) < 0) issues.push('root negative z-index');

      // Check for transform issues
      const transform = rootComputedStyle.transform;
      if (transform && transform !== 'none' && transform.includes('scale(0')) {
        issues.push('root scaled to 0');
      }

      if (issues.length > 0) {
        this.log('CRITICAL', 'Styling issues detected that could cause blanking', { issues });
      }

    } catch (error) {
      this.log('ERROR', 'Style check failed', { error: error.message });
    }
  }

  setupErrorMonitoring() {
    // Capture all JavaScript errors
    window.addEventListener('error', (event) => {
      this.log('CRITICAL', 'JavaScript error detected', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.log('CRITICAL', 'Unhandled promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });

    // Override console.error to catch React errors
    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.log('ERROR', 'Console error', { args: args.map(arg => String(arg)) });
      originalConsoleError.apply(console, args);
    };
  }

  emergencyDOMAnalysis() {
    this.log('ANALYSIS', 'Performing emergency DOM analysis');
    
    try {
      const analysis = {
        documentTitle: document.title,
        documentURL: document.URL,
        readyState: document.readyState,
        body: {
          exists: !!document.body,
          innerHTML: document.body?.innerHTML?.substring(0, 500) || 'MISSING',
          children: document.body?.children?.length || 0
        },
        root: {
          exists: !!document.getElementById('root'),
          innerHTML: document.getElementById('root')?.innerHTML?.substring(0, 500) || 'MISSING',
          children: document.getElementById('root')?.children?.length || 0
        },
        styles: {
          bodyDisplay: window.getComputedStyle(document.body)?.display,
          bodyVisibility: window.getComputedStyle(document.body)?.visibility,
          bodyOpacity: window.getComputedStyle(document.body)?.opacity
        }
      };

      this.log('ANALYSIS', 'DOM analysis complete', analysis);
    } catch (error) {
      this.log('ERROR', 'DOM analysis failed', { error: error.message });
    }
  }

  attemptDOMRecovery() {
    this.log('RECOVERY', 'Attempting DOM recovery');
    
    try {
      const body = document.body;
      const root = document.getElementById('root');

      // Reset critical styles that could cause blanking
      if (body) {
        body.style.display = '';
        body.style.visibility = '';
        body.style.opacity = '';
      }

      if (root) {
        root.style.display = '';
        root.style.visibility = '';
        root.style.opacity = '';
        root.style.zIndex = '';
        root.style.transform = '';
      }

      this.log('RECOVERY', 'DOM recovery styles applied');
    } catch (error) {
      this.log('ERROR', 'DOM recovery failed', { error: error.message });
    }
  }

  setupIPCHandlers() {
    try {
      if (window.require) {
        const { ipcRenderer } = window.require('electron');
        
        // Respond to ping from main process
        ipcRenderer.on('debug-ping', (event, data) => {
          ipcRenderer.send('debug-pong', { 
            ...data, 
            rendererOk: true,
            timestamp: Date.now(),
            blankingDetected: this.blankingDetected
          });
        });

        // Manual debugging commands
        ipcRenderer.on('debug-force-analysis', () => {
          this.emergencyDOMAnalysis();
        });

        ipcRenderer.on('debug-force-recovery', () => {
          this.attemptDOMRecovery();
        });
      }
    } catch (error) {
      this.log('ERROR', 'IPC setup failed', { error: error.message });
    }
  }

  injectVisualIndicator() {
    // Add a visual indicator that we're monitoring
    try {
      const indicator = document.createElement('div');
      indicator.id = 'debug-indicator';
      indicator.innerHTML = '🔍 DEBUG';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        z-index: 9999999;
        border-radius: 4px;
        font-family: monospace;
      `;
      document.body.appendChild(indicator);

      // Blink the indicator to show we're alive
      setInterval(() => {
        indicator.style.opacity = indicator.style.opacity === '0.3' ? '1' : '0.3';
      }, 1000);

    } catch (error) {
      this.log('ERROR', 'Visual indicator injection failed', { error: error.message });
    }
  }

  stop() {
    this.isMonitoring = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    this.log('MONITOR', 'Renderer monitoring stopped');
  }
}

// Auto-start when script loads
if (typeof window !== 'undefined') {
  window.emergencyDebug = new RendererEmergencyDebug();
}
```

# debug-toolkit.js

```js
// Emergency Debugging Toolkit for Auracle Blanking Issue
// This file provides comprehensive debugging tools to identify the root cause

const { app, BrowserWindow, ipcMain, systemPreferences, screen } = require('electron');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class BlankingDebugger {
  constructor() {
    this.logFile = path.join(os.homedir(), 'auracle-debug.log');
    this.monitors = [];
    this.isDebugging = false;
    this.lastScreenshot = null;
    this.performanceData = {
      memory: [],
      cpu: [],
      gpu: [],
      renderingEvents: []
    };
    
    this.setupDebugMode();
  }

  setupDebugMode() {
    // Only set up Electron debugging flags if app is available (running in Electron)
    if (app && app.commandLine) {
      // Enable Electron debugging flags
      app.commandLine.appendSwitch('enable-logging', 'stderr');
      app.commandLine.appendSwitch('log-level', '0');
      app.commandLine.appendSwitch('enable-crash-reporter');
      app.commandLine.appendSwitch('v', '1'); // Verbose logging
      
      // GPU debugging
      app.commandLine.appendSwitch('disable-gpu-sandbox');
      app.commandLine.appendSwitch('enable-gpu-rasterization');
      app.commandLine.appendSwitch('force-gpu-rasterization');
      
      // Renderer debugging
      app.commandLine.appendSwitch('enable-renderer-tls-check');
      app.commandLine.appendSwitch('disable-background-timer-throttling');
      app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
      app.commandLine.appendSwitch('disable-renderer-backgrounding');
      
      this.log('🔧 Debug mode enabled with comprehensive logging');
    } else {
      this.log('🔧 Running outside Electron - basic debug mode only');
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    console.log(logEntry);
    
    // Append to debug log file
    fs.appendFileSync(this.logFile, logEntry);
  }

  // Monitor system resources
  startSystemMonitoring() {
    this.log('🔍 Starting system monitoring...');
    
    // Memory monitoring
    setInterval(() => {
      const memUsage = process.memoryUsage();
      this.performanceData.memory.push({
        timestamp: Date.now(),
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external
      });
      
      // Log high memory usage
      if (memUsage.heapUsed > 500 * 1024 * 1024) { // 500MB
        this.log(`⚠️  High memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);
      }
    }, 1000);

    // CPU monitoring (macOS specific)
    if (process.platform === 'darwin') {
      setInterval(() => {
        exec('top -l 1 -n 0 | grep "Auracle\\|Electron"', (error, stdout, stderr) => {
          if (stdout) {
            const cpuMatch = stdout.match(/(\d+\.\d+)%/);
            if (cpuMatch) {
              const cpuUsage = parseFloat(cpuMatch[1]);
              this.performanceData.cpu.push({
                timestamp: Date.now(),
                usage: cpuUsage
              });
              
              if (cpuUsage > 80) {
                this.log(`⚠️  High CPU usage: ${cpuUsage}%`);
              }
            }
          }
        });
      }, 2000);
    }
  }

  // Monitor GPU processes
  startGPUMonitoring() {
    this.log('🎮 Starting GPU monitoring...');
    
    if (process.platform === 'darwin') {
      setInterval(() => {
        exec('ps aux | grep -i gpu', (error, stdout, stderr) => {
          if (stdout) {
            const gpuProcesses = stdout.split('\n').filter(line => 
              line.includes('gpu') && !line.includes('grep')
            );
            
            if (gpuProcesses.length > 0) {
              this.log(`🎮 GPU processes: ${gpuProcesses.length}`);
            }
          }
        });
      }, 5000);
    }
  }

  // Monitor window state changes
  monitorWindowStates(mainWindow) {
    this.log('🪟 Setting up window state monitoring...');
    
    // Monitor window visibility
    mainWindow.on('hide', () => {
      this.log('🚨 CRITICAL: Window hidden!');
      this.captureDebugSnapshot('window-hidden');
    });
    
    mainWindow.on('show', () => {
      this.log('✅ Window shown');
    });
    
    mainWindow.on('minimize', () => {
      this.log('📉 Window minimized');
    });
    
    mainWindow.on('restore', () => {
      this.log('📈 Window restored');
    });
    
    mainWindow.on('blur', () => {
      this.log('🔍 Window lost focus');
    });
    
    mainWindow.on('focus', () => {
      this.log('🎯 Window gained focus');
    });
    
    // Monitor renderer process crashes
    mainWindow.webContents.on('crashed', (event, killed) => {
      this.log(`🚨 CRITICAL: Renderer crashed! Killed: ${killed}`);
      this.captureDebugSnapshot('renderer-crashed');
    });
    
    mainWindow.webContents.on('unresponsive', () => {
      this.log('🚨 CRITICAL: Renderer unresponsive!');
      this.captureDebugSnapshot('renderer-unresponsive');
    });
    
    mainWindow.webContents.on('responsive', () => {
      this.log('✅ Renderer responsive again');
    });
    
    // Monitor DOM ready state
    mainWindow.webContents.on('dom-ready', () => {
      this.log('✅ DOM ready');
    });
    
    mainWindow.webContents.on('did-finish-load', () => {
      this.log('✅ Page finished loading');
    });
    
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      this.log(`🚨 Page failed to load: ${errorCode} - ${errorDescription}`);
    });
  }

  // Monitor system power events
  monitorPowerEvents() {
    this.log('⚡ Setting up power event monitoring...');
    
    // Monitor system sleep/wake
    if (process.platform === 'darwin') {
      if (app) {
        app.on('before-quit', () => {
          this.log('🛑 App quitting');
        });
      }
      
      // Monitor display sleep
      setInterval(() => {
        exec('pmset -g ps', (error, stdout, stderr) => {
          if (stdout) {
            if (stdout.includes('sleep')) {
              this.log('😴 System entering sleep');
            }
          }
        });
      }, 5000);
    }
  }

  // Capture comprehensive debug snapshot
  captureDebugSnapshot(trigger) {
    this.log(`📸 Capturing debug snapshot (trigger: ${trigger})`);
    
    const snapshot = {
      timestamp: Date.now(),
      trigger,
      system: {
        platform: process.platform,
        version: process.version,
        electronVersion: process.versions.electron,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      screen: screen ? {
        displays: screen ? screen.getAllDisplays() : [],
        primaryDisplay: screen ? screen.getPrimaryDisplay() : null
      } : { message: 'Screen API not available' },
      performance: {
        memory: this.performanceData.memory.slice(-10),
        cpu: this.performanceData.cpu.slice(-10),
        gpu: this.performanceData.gpu.slice(-10)
      }
    };
    
    // Save snapshot to file
    const snapshotFile = path.join(os.homedir(), `auracle-snapshot-${Date.now()}.json`);
    fs.writeFileSync(snapshotFile, JSON.stringify(snapshot, null, 2));
    
    this.log(`📸 Debug snapshot saved to: ${snapshotFile}`);
  }

  // Enable remote debugging
  enableRemoteDebugging(mainWindow) {
    this.log('🔧 Setting up remote debugging...');
    
    // Enable remote debugging on port 9222
    if (app && app.commandLine) {
      app.commandLine.appendSwitch('remote-debugging-port', '9222');
    }
    
    // Add debug console commands
    mainWindow.webContents.executeJavaScript(`
      console.log('🔧 Debug mode active');
      
      // Add global debug functions
      window.debugAuracle = {
        captureDOM: () => {
          return {
            html: document.documentElement.outerHTML,
            body: document.body.innerHTML,
            styles: Array.from(document.styleSheets).map(sheet => {
              try {
                return Array.from(sheet.cssRules).map(rule => rule.cssText);
              } catch (e) {
                return 'Unable to access stylesheet: ' + e.message;
              }
            }),
            computed: {
              bodyDisplay: getComputedStyle(document.body).display,
              bodyVisibility: getComputedStyle(document.body).visibility,
              bodyOpacity: getComputedStyle(document.body).opacity,
              bodyZIndex: getComputedStyle(document.body).zIndex
            }
          };
        },
        
        checkVisibility: () => {
          const elements = document.querySelectorAll('*');
          const hiddenElements = [];
          
          elements.forEach(el => {
            const style = getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
              hiddenElements.push({
                tag: el.tagName,
                id: el.id,
                className: el.className,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity
              });
            }
          });
          
          return hiddenElements;
        },
        
        monitorChanges: () => {
          const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
              if (mutation.type === 'attributes' && 
                  (mutation.attributeName === 'style' || 
                   mutation.attributeName === 'class')) {
                console.log('🔍 Style/class changed:', mutation.target, mutation.attributeName);
              }
            });
          });
          
          observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class']
          });
          
          return 'Monitoring DOM changes...';
        }
      };
      
      // Monitor for blanking
      let lastBodyHTML = document.body.innerHTML;
      setInterval(() => {
        const currentBodyHTML = document.body.innerHTML;
        const bodyVisible = getComputedStyle(document.body).display !== 'none' &&
                           getComputedStyle(document.body).visibility !== 'hidden' &&
                           getComputedStyle(document.body).opacity !== '0';
        
        if (!bodyVisible || currentBodyHTML.trim() === '') {
          console.error('🚨 BLANKING DETECTED!', {
            bodyVisible,
            hasContent: currentBodyHTML.trim() !== '',
            timestamp: new Date().toISOString()
          });
          
          // Send to main process
          if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('blanking-detected', {
              bodyVisible,
              hasContent: currentBodyHTML.trim() !== '',
              timestamp: new Date().toISOString(),
              debug: window.debugAuracle.captureDOM()
            });
          }
        }
        
        lastBodyHTML = currentBodyHTML;
      }, 500);
    `);
  }

  // Start comprehensive monitoring
  startMonitoring(mainWindow) {
    this.log('🚀 Starting comprehensive monitoring...');
    
    this.startSystemMonitoring();
    this.startGPUMonitoring();
    this.monitorWindowStates(mainWindow);
    this.monitorPowerEvents();
    this.enableRemoteDebugging(mainWindow);
    
    // Set up IPC handlers for debug info
    ipcMain.on('blanking-detected', (event, data) => {
      this.log(`🚨 BLANKING DETECTED BY RENDERER: ${JSON.stringify(data)}`);
      this.captureDebugSnapshot('blanking-detected');
    });
    
    // Enable crash reporting
    process.on('uncaughtException', (error) => {
      this.log(`🚨 Uncaught Exception: ${error.message}\n${error.stack}`);
      this.captureDebugSnapshot('uncaught-exception');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      this.log(`🚨 Unhandled Rejection at: ${promise} reason: ${reason}`);
      this.captureDebugSnapshot('unhandled-rejection');
    });
    
    this.log('✅ All monitoring systems active');
  }

  // Generate debug report
  generateDebugReport() {
    const report = {
      timestamp: new Date().toISOString(),
      system: {
        platform: process.platform,
        version: process.version,
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node,
        arch: process.arch,
        memory: process.memoryUsage(),
        uptime: process.uptime()
      },
      displays: screen ? screen.getAllDisplays() : [],
      performance: this.performanceData,
      logFile: this.logFile
    };
    
    const reportFile = path.join(os.homedir(), `auracle-debug-report-${Date.now()}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    this.log(`📋 Debug report generated: ${reportFile}`);
    return reportFile;
  }
}

module.exports = BlankingDebugger;
```

# DEBUGGING-SUMMARY.md

```md
# 🚨 COMPLETE DEBUGGING STRATEGY FOR AURACLE BLANKING ISSUE

## IMPLEMENTED SOLUTIONS

I've created a comprehensive debugging toolkit to identify the root cause of the Auracle app blanking issue. Here's what has been implemented:

### 1. Emergency Debugging Toolkit (`debug-toolkit.js`)
- **Real-time monitoring** of system resources, GPU processes, and window states
- **Automatic crash detection** for renderer and main processes
- **Power event monitoring** to detect system sleep/wake cycles
- **Memory leak detection** with alerting for high usage
- **Comprehensive logging** to `~/auracle-debug.log`

### 2. Emergency Diagnostic Script (`emergency-diagnostic.js`)
- **Injected into renderer** automatically when app starts
- **Real-time DOM monitoring** every 500ms to detect blanking
- **Visual state checking** for display, visibility, opacity issues
- **React state validation** to ensure components are mounted
- **Material-UI theme verification** 
- **Automatic recovery attempts** when blanking is detected
- **Available as `window.auracleDebug` for manual control**

### 3. System Monitor Script (`system-monitor.sh`)
- **System-level monitoring** independent of Electron
- **GPU process tracking** for crashes and failures
- **Display management monitoring** (sleep, brightness, power)
- **Resource usage monitoring** (memory, CPU, file descriptors)
- **Screenshot capture** for visual verification
- **Logs to `~/auracle-system-monitor.log`**

### 4. Enhanced Main Process (`app/main.js`)
- **Integrated debugging toolkit** with comprehensive monitoring
- **Enhanced error handling** with crash recovery
- **Remote debugging enabled** on port 9222
- **Additional Electron flags** for debugging
- **Emergency recovery IPC handlers**

## HOW TO USE THE DEBUGGING TOOLS

### Step 1: Start System Monitoring
\`\`\`bash
cd /Users/michael.lynn/code/auracle
./system-monitor.sh
\`\`\`
This will run continuously and log system-level events.

### Step 2: Start Auracle with Debug Mode
\`\`\`bash
cd /Users/michael.lynn/code/auracle
npm run dev
\`\`\`
The app now includes:
- Automatic debug toolkit initialization
- Emergency diagnostic script injection
- Remote debugging on port 9222
- Comprehensive logging

### Step 3: Monitor in Real-Time
- **DevTools Console**: Watch for blanking detection messages
- **System Monitor Terminal**: Watch for system-level issues
- **Home Directory Logs**: Check generated log files

### Step 4: When Blanking Occurs
The system will automatically:
1. **Detect blanking** in real-time (500ms intervals)
2. **Log comprehensive debug info** including DOM state, styles, React state
3. **Attempt automatic recovery** by restoring display properties
4. **Capture debug snapshots** with system state
5. **Alert you** with console messages and log entries

## DEBUG FILES GENERATED

All files are saved to your home directory (`~`):

- **`auracle-debug.log`** - Main debug log from toolkit
- **`auracle-system-monitor.log`** - System-level monitoring
- **`auracle-debug-report-*.json`** - Comprehensive debug reports
- **`auracle-snapshot-*.json`** - Debug snapshots when issues occur
- **`auracle_screenshot_*.png`** - Visual verification screenshots

## MANUAL DEBUGGING COMMANDS

### In DevTools Console:
\`\`\`javascript
// Check current visual state
window.auracleDebug.checkVisualState()

// Check React state
window.auracleDebug.checkReactState()

// Check Material-UI theme
window.auracleDebug.checkMUITheme()

// Attempt manual recovery
window.auracleDebug.recover()

// Force reload if needed
window.auracleDebug.forceReload()

// Stop monitoring
window.auracleDebug.stopMonitoring()
\`\`\`

### Remote Debugging:
Open Chrome/Brave/Edge and navigate to: `http://localhost:9222`

### System Commands:
\`\`\`bash
# Quick diagnostic
echo "Auracle PID: $(pgrep Auracle)" && ps -o rss= -p $(pgrep Auracle) | awk '{print "Memory: " $1/1024 "MB"}'

# Take screenshot
screencapture -x ~/desktop_check_$(date +%s).png

# Check for crashes
log show --last 30m --predicate 'eventMessage contains "crash"'
\`\`\`

## WHAT THE DEBUGGING WILL REVEAL

### If it's a CSS/Styling Issue:
- You'll see changes to `display`, `visibility`, or `opacity` in the logs
- The diagnostic script will detect hidden elements
- Theme provider status will be logged

### If it's a Memory Issue:
- Memory usage will spike before blanking
- System monitor will show high memory alerts
- Performance monitoring will track memory growth

### If it's a GPU Issue:
- GPU processes will crash and be logged
- System monitor will detect GPU process failures
- WindowServer issues will be captured

### If it's a Power Management Issue:
- Power events will be logged before blanking
- Display sleep events will be captured
- Power blocker effectiveness will be monitored

### If it's an Electron Issue:
- Renderer/main process crashes will be detected
- Window state changes will be logged
- IPC communication failures will be captured

### If it's a React Issue:
- Component mounting/unmounting will be tracked
- React state will be validated
- Error boundaries will capture React errors

## SPECIFIC SCENARIOS TO WATCH FOR

1. **Blanking after inactivity** → Power management override
2. **Blanking during processing** → Memory/GPU exhaustion
3. **Blanking after UI updates** → CSS/theme issues
4. **Blanking at random times** → System-level interference
5. **Blanking after startup** → Initialization race condition

## EMERGENCY RECOVERY

If blanking occurs, the system will automatically attempt:
1. **Style restoration** - Reset display, visibility, opacity
2. **Component remounting** - Force React re-render
3. **Window management** - Show, focus, restore window
4. **Page reload** - Last resort full reload

You can also manually trigger recovery:
- **DevTools**: `window.auracleDebug.recover()`
- **Terminal**: Kill process and restart with `pkill Auracle && npm run dev`

## EXPECTED OUTCOME

With this comprehensive monitoring in place, you should be able to:

1. **Identify the exact moment** when blanking occurs
2. **Determine the root cause** (CSS, memory, GPU, power, etc.)
3. **See the sequence of events** leading to blanking
4. **Implement targeted fixes** based on the specific cause
5. **Verify the fix** with continued monitoring

The debugging system is designed to be **minimally invasive** while providing **maximum visibility** into all potential failure points.

## NEXT STEPS

1. **Run the system** with debugging enabled
2. **Wait for blanking to occur** (or trigger it if you know how)
3. **Examine the logs** for patterns and root causes
4. **Implement specific fixes** based on findings
5. **Continue monitoring** to verify fixes

This approach should definitively identify why the Auracle app is going blank and provide the information needed to implement a permanent fix.
```

# electron-builder.yml

```yml
appId: org.mlynn.bitscribe
productName: bitscribe
copyright: Copyright © 2025 Michael Lynn. All rights reserved.

directories:
  output: dist
  buildResources: build

files:
  - app/**/*
  - node_modules/**/*
  - "!app/src/**/*"
  - "!**/node_modules/*/{CHANGELOG.md,README.md,readme.md,LICENSE,*.flow,*.mk}"
  - "!**/node_modules/.bin"
  - "!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}"
  - "!.editorconfig"
  - "!**/._*"
  - "!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}"
  - "!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}"
  - "!**/{appveyor.yml,.travis.yml,circle.yml}"
  - "!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}"

extraResources:
  - from: whisper.cpp/models/
    to: models/
    filter: ["**/*.bin"]
  - from: whisper.cpp/build/bin/
    to: bin/
    filter: ["whisper-stream*", "whisper*"]

mac:
  category: public.app-category.productivity
  icon: build/icons/mac/icon.icns
  target:
    - target: dmg
      arch: [x64, arm64]
    - target: zip
      arch: [x64, arm64]

dmg:
  title: "${productName} ${version}"
  icon: build/icons/mac/icon.icns
  contents:
    - x: 130
      y: 220
    - x: 410
      y: 220
      type: link
      path: /Applications

win:
  icon: build/icons/windows/icon.ico
  target:
    - target: nsis
      arch: [x64, ia32]
    - target: portable
      arch: [x64, ia32]

nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  perMachine: false
  createDesktopShortcut: always
  createStartMenuShortcut: true
  installerIcon: build/icons/windows/icon.ico
  uninstallerIcon: build/icons/windows/icon.ico

linux:
  icon: build/icons/linux/
  category: Office
  target:
    - target: AppImage
      arch: [x64]
    - target: snap
      arch: [x64]
    - target: deb
      arch: [x64]

snap:
  summary: AI Research Assistant
  description: |
    bitscribe captures customer interviews in real-time,
    analyzes design patterns, identifies issues, and generates comprehensive
    reports with actionable recommendations based on MongoDB best practices.
  grade: stable
  confinement: strict
  plugs:
    - audio-record
    - network
    - home

deb:
  depends:
    - gconf2
    - gconf-service
    - libnotify4
    - libappindicator1
    - libxtst6
    - libnss3
    - libasound2
    - libdrm2
    - libxss1
    - libgconf-2-4

publish:
  provider: github
  releaseType: release
```

# EMERGENCY-DEBUG-GUIDE.md

```md
# 🚨 EMERGENCY DEBUGGING GUIDE - Auracle Screen Blanking

## Quick Start

The app is still going blank despite our memory fixes. This means we need to catch it in real-time. I've implemented comprehensive debugging tools to identify the EXACT cause.

### STEP 1: Start System Monitor (Terminal 1)
\`\`\`bash
cd /Users/michael.lynn/code/auracle
./monitor-system.sh
\`\`\`
This runs **independent of Electron** and will capture system state when blanking occurs.

### STEP 2: Start the App with Full Debugging (Terminal 2)
\`\`\`bash
npm start
\`\`\`
The app now includes:
- **Emergency debugger** monitoring every 100ms
- **Renderer monitoring** with DOM state checks
- **DevTools always open** for real-time inspection
- **Visual debug indicator** (red "🔍 DEBUG" in top-right)

### STEP 3: Monitor Console Output

Watch for these critical messages:

**🔍 Normal Operation:**
\`\`\`
🔍 DEBUG: Memory usage: 45.2MB / 2048.0MB
🔍 RENDERER DEBUG: DOM state check passed
[timestamp] MONITOR: Window state normal
\`\`\`

**🚨 Blanking Detection:**
\`\`\`
🚨 CRITICAL: WINDOW BECAME INVISIBLE
🚨 CRITICAL: RENDERER PROCESS CRASHED  
🚨 CRITICAL: POTENTIAL BLANKING DETECTED
🚨 HIGH MEMORY USAGE DETECTED
\`\`\`

## What to Look For

### 1. **Immediate Blanking Indicators**
- Red debug indicator disappears
- Console stops updating
- DevTools becomes unresponsive
- Window becomes invisible but process still running

### 2. **Pre-Blanking Warning Signs**
- Memory usage climbing above 150MB
- Console errors about React/DOM
- "Renderer not responding to ping" messages
- GPU process crashes

### 3. **System-Level Issues**
- Screenshots show blank/white window
- WindowServer crashes
- Memory pressure warnings
- Display driver issues

## Debug Files Generated

All debugging info saves to your home directory:

- `~/auracle-emergency-debug.log` - Main debug log
- `~/auracle-system-monitor.log` - System monitoring
- `~/auracle-screenshots/` - Screenshots during incidents
- `~/auracle-snapshot-*.json` - Emergency snapshots

## Manual Debug Commands

If the app goes blank, try these in DevTools console:

\`\`\`javascript
// Force DOM analysis
window.emergencyDebug?.emergencyDOMAnalysis()

// Attempt recovery
window.emergencyDebug?.attemptDOMRecovery()

// Check memory
console.log(performance.memory)

// Check React state
console.log(document.getElementById('root'))
\`\`\`

## Critical Debugging Questions

When blanking occurs, we need to determine:

1. **Is the window invisible or destroyed?**
2. **Is the renderer process crashed or responsive?**
3. **Is the DOM content missing or hidden?**
4. **Is it a CSS/styling issue or memory crash?**
5. **Is it system-level (GPU) or app-level?**

## Expected Debugging Output

### Normal Operation:
\`\`\`
[2024-01-XX XX:XX:XX] INIT: Emergency debugger initialized
🔍 DEBUG: Window state normal
🔍 RENDERER DEBUG: DOM state check passed
🔍 MONITOR: Main process: 12345
🔍 MONITOR: Renderer processes: 3
\`\`\`

### When Blanking Occurs:
\`\`\`
🚨 CRITICAL: WINDOW BECAME INVISIBLE
🚨 CRITICAL: POTENTIAL BLANKING DETECTED  
[Details about exact state when it happened]
SNAPSHOT: Creating emergency snapshot: window_invisible
\`\`\`

## Recovery Actions

The system will automatically:
1. **Take screenshots** when issues detected
2. **Create snapshots** with full system state
3. **Attempt recovery** by resetting CSS and reloading
4. **Log everything** for post-mortem analysis

## Next Steps

1. **Run the monitoring** and reproduce the blanking
2. **Check the debug logs** immediately after blanking
3. **Examine screenshots** to see visual state
4. **Analyze console output** for error patterns

This comprehensive debugging will identify whether the blanking is caused by:
- **Memory exhaustion** (heap size limits)
- **Renderer crashes** (process termination)  
- **CSS/DOM issues** (invisible content)
- **System problems** (GPU/display drivers)
- **Electron bugs** (window management)

**The debug system will catch the exact moment of blanking and tell us the root cause!**
```

# EMERGENCY-DEBUGGING-GUIDE.md

```md
# 🚨 EMERGENCY DEBUGGING GUIDE for Auracle Blanking Issue

## IMMEDIATE ACTIONS

### 1. Start Emergency Monitoring

**Terminal 1 - Start System Monitor:**
\`\`\`bash
cd /Users/michael.lynn/code/auracle
./system-monitor.sh
\`\`\`

**Terminal 2 - Start Auracle with Debug Mode:**
\`\`\`bash
cd /Users/michael.lynn/code/auracle
DEBUG=* npm run dev
\`\`\`

### 2. Browser Debug Console

When the app is running, open DevTools (Cmd+Alt+I) and run:

\`\`\`javascript
// The emergency diagnostic script is auto-injected
// Check if it's running:
window.auracleDebug

// Manual recovery attempt:
window.auracleDebug.recover()

// Force reload if needed:
window.auracleDebug.forceReload()
\`\`\`

### 3. Remote Debugging

The app now runs with remote debugging enabled on port 9222:

\`\`\`bash
# Open in Chrome/Brave/Edge
open -a "Google Chrome" "http://localhost:9222"
\`\`\`

## DEBUGGING APPROACHES

### A. Real-time Monitoring

1. **Watch the system monitor output** - it logs every 5 seconds
2. **Watch the debug console** - it checks for blanking every 500ms
3. **Look for patterns** - does blanking happen at specific times?

### B. Specific Issue Detection

#### GPU Issues
\`\`\`bash
# Check GPU processes
ps aux | grep -i gpu

# Check for GPU crashes
log show --last 1h --predicate 'category == "Graphics" OR category == "GPU"'
\`\`\`

#### Memory Issues
\`\`\`bash
# Monitor memory usage
top -pid $(pgrep Auracle) -l 0

# Check for memory leaks
leaks $(pgrep Auracle)
\`\`\`

#### Display Issues
\`\`\`bash
# Check display settings
pmset -g

# Check for display sleep
system_profiler SPDisplaysDataType
\`\`\`

### C. Electron-specific Debugging

#### Main Process Debugging
\`\`\`bash
# Run with verbose logging
DEBUG=* electron .

# Check main process crashes
log show --last 1h --predicate 'process == "Auracle"'
\`\`\`

#### Renderer Process Debugging
\`\`\`javascript
// In DevTools Console
console.log('Memory usage:', performance.memory);
console.log('Render blocking:', window.debugAuracle.checkVisualState());
\`\`\`

## RECOVERY TECHNIQUES

### 1. Automatic Recovery
The app now includes automatic recovery mechanisms:
- Detects blanking in real-time
- Attempts to restore display properties
- Logs all events to debug files

### 2. Manual Recovery
If blanking occurs:

**In DevTools Console:**
\`\`\`javascript
// Step 1: Check state
window.auracleDebug.checkVisualState()

// Step 2: Attempt recovery
window.auracleDebug.recover()

// Step 3: If that fails, force reload
window.auracleDebug.forceReload()
\`\`\`

**In Terminal:**
\`\`\`bash
# Kill and restart
pkill Auracle
npm run dev
\`\`\`

### 3. Emergency Restart
\`\`\`bash
# Force quit all Electron processes
pkill -f "Electron"

# Clean restart
rm -rf node_modules/.cache
npm run dev
\`\`\`

## LOGS AND FILES

### Generated Files
- `~/auracle-debug.log` - Main debug log
- `~/auracle-system-monitor.log` - System monitoring
- `~/auracle-debug-report-*.json` - Debug reports
- `~/auracle-snapshot-*.json` - Debug snapshots
- `~/auracle_screenshot_*.png` - Visual verification

### Key Information to Collect
1. **Timing** - When does blanking occur?
2. **Memory usage** - Is it high before blanking?
3. **CPU usage** - Are there spikes?
4. **GPU processes** - Are they crashing?
5. **System events** - Any power/display events?

## SPECIFIC SCENARIOS

### Scenario 1: Blanking After Inactivity
**Likely causes:**
- Power management overriding power blocker
- Display sleep kicking in
- Background throttling

**Debug steps:**
1. Check power settings: `pmset -g`
2. Monitor power blocker status in logs
3. Check for display sleep events

### Scenario 2: Blanking During Heavy Processing
**Likely causes:**
- Memory exhaustion
- GPU process crash
- Renderer process overload

**Debug steps:**
1. Monitor memory usage during processing
2. Check for GPU process crashes
3. Monitor CPU usage patterns

### Scenario 3: Blanking After CSS/Theme Changes
**Likely causes:**
- CSS rules hiding content
- Z-index issues
- Material-UI theme problems

**Debug steps:**
1. Check computed styles in DevTools
2. Look for hidden elements
3. Verify theme provider status

### Scenario 4: Blanking After Updates
**Likely causes:**
- Electron version incompatibility
- macOS updates affecting display
- Dependency conflicts

**Debug steps:**
1. Check Electron version compatibility
2. Review recent system updates
3. Test with different Electron versions

## ELECTRON FLAGS FOR DEBUGGING

Add these to main.js for specific issues:

\`\`\`javascript
// GPU debugging
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Display debugging
app.commandLine.appendSwitch('disable-lcd-text');
app.commandLine.appendSwitch('disable-accelerated-2d-canvas');

// Memory debugging
app.commandLine.appendSwitch('max-old-space-size', '4096');
app.commandLine.appendSwitch('trace-warnings');
\`\`\`

## SYSTEM LEVEL DEBUGGING

### macOS Specific Commands
\`\`\`bash
# Check WindowServer (display server)
ps aux | grep WindowServer

# Check for display-related crashes
log show --last 1h --predicate 'subsystem == "com.apple.windowserver"'

# Check graphics drivers
system_profiler SPDisplaysDataType

# Monitor display brightness changes
log stream --predicate 'eventMessage contains "brightness"'
\`\`\`

### Process Monitoring
\`\`\`bash
# Monitor all Auracle processes
watch "ps aux | grep -i auracle"

# Check file descriptors
lsof -p $(pgrep Auracle)

# Monitor network connections
netstat -an | grep $(pgrep Auracle)
\`\`\`

## PREVENTION STRATEGIES

### 1. Resource Management
- Monitor memory usage trends
- Set memory limits if needed
- Clean up unused resources

### 2. Display Management
- Verify power blocker effectiveness
- Test with different display settings
- Monitor for display sleep events

### 3. Error Handling
- Implement comprehensive error boundaries
- Add retry mechanisms for failed operations
- Log all critical state changes

## ESCALATION STEPS

If the issue persists after debugging:

1. **Collect all debug files** from home directory
2. **Document the exact scenario** when blanking occurs
3. **Test with minimal configuration** (disable features one by one)
4. **Try different Electron versions** if compatible
5. **Test on different macOS versions** if possible

## HOTKEYS FOR DEBUGGING

While app is running:
- **Cmd+Alt+I** - Open DevTools
- **Cmd+R** - Reload renderer
- **Cmd+Shift+R** - Hard reload
- **Cmd+Alt+J** - Open DevTools Console directly

## QUICK DIAGNOSTIC COMMANDS

\`\`\`bash
# One-liner system check
echo "=== QUICK DIAGNOSTIC ===" && date && echo "Auracle PID: $(pgrep Auracle)" && echo "Memory: $(ps -o rss= -p $(pgrep Auracle) | awk '{print $1/1024 "MB"}')" && echo "Display: $(pmset -g | grep displaysleep)"

# Quick screenshot for visual verification
screencapture -x ~/desktop_check_$(date +%s).png

# Check for recent crashes
log show --last 30m --predicate 'eventMessage contains "crash"'
\`\`\`

Remember: The goal is to **capture the exact moment** when blanking occurs and **identify the root cause** through systematic monitoring and debugging.
```

# emergency-diagnostic.js

```js
// Emergency Diagnostic Script for Auracle Blanking Issue
// Run this in the Electron Developer Console for immediate debugging

(function() {
  'use strict';
  
  console.log('🚨 EMERGENCY DIAGNOSTIC MODE ACTIVATED');
  console.log('='.repeat(50));
  
  // 1. IMMEDIATE VISUAL STATE CHECK
  function checkVisualState() {
    console.log('🔍 VISUAL STATE CHECK:');
    
    const body = document.body;
    const html = document.documentElement;
    
    const bodyStyle = getComputedStyle(body);
    const htmlStyle = getComputedStyle(html);
    
    console.log('Body element:', {
      display: bodyStyle.display,
      visibility: bodyStyle.visibility,
      opacity: bodyStyle.opacity,
      zIndex: bodyStyle.zIndex,
      width: bodyStyle.width,
      height: bodyStyle.height,
      backgroundColor: bodyStyle.backgroundColor,
      color: bodyStyle.color,
      overflow: bodyStyle.overflow,
      position: bodyStyle.position
    });
    
    console.log('HTML element:', {
      display: htmlStyle.display,
      visibility: htmlStyle.visibility,
      opacity: htmlStyle.opacity,
      backgroundColor: htmlStyle.backgroundColor,
      overflow: htmlStyle.overflow
    });
    
    console.log('Body content length:', body.innerHTML.length);
    console.log('Body text content:', body.textContent.substring(0, 100) + '...');
    
    // Check if body has any visible children
    const visibleChildren = Array.from(body.children).filter(child => {
      const style = getComputedStyle(child);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0';
    });
    
    console.log('Visible children count:', visibleChildren.length);
    
    return {
      bodyVisible: bodyStyle.display !== 'none' && 
                  bodyStyle.visibility !== 'hidden' && 
                  bodyStyle.opacity !== '0',
      hasContent: body.innerHTML.trim() !== '',
      visibleChildren: visibleChildren.length
    };
  }
  
  // 2. REACT STATE CHECK
  function checkReactState() {
    console.log('⚛️ REACT STATE CHECK:');
    
    // Find React root
    const reactRoot = document.getElementById('root');
    if (!reactRoot) {
      console.error('❌ React root element not found!');
      return { hasRoot: false };
    }
    
    const rootStyle = getComputedStyle(reactRoot);
    console.log('React root style:', {
      display: rootStyle.display,
      visibility: rootStyle.visibility,
      opacity: rootStyle.opacity,
      width: rootStyle.width,
      height: rootStyle.height
    });
    
    // Check for React fiber
    const reactFiber = reactRoot._reactInternalFiber || 
                      reactRoot._reactInternalInstance ||
                      reactRoot._reactRootContainer;
    
    console.log('React fiber exists:', !!reactFiber);
    
    return {
      hasRoot: true,
      rootVisible: rootStyle.display !== 'none' && 
                  rootStyle.visibility !== 'hidden' && 
                  rootStyle.opacity !== '0',
      hasFiber: !!reactFiber
    };
  }
  
  // 3. MATERIAL-UI THEME CHECK
  function checkMUITheme() {
    console.log('🎨 MATERIAL-UI THEME CHECK:');
    
    // Check for MUI theme provider
    const muiTheme = document.querySelector('[data-mui-theme]');
    console.log('MUI theme provider found:', !!muiTheme);
    
    // Check for CSS variables
    const rootStyles = getComputedStyle(document.documentElement);
    const cssVars = {};
    
    for (let i = 0; i < rootStyles.length; i++) {
      const property = rootStyles[i];
      if (property.startsWith('--')) {
        cssVars[property] = rootStyles.getPropertyValue(property);
      }
    }
    
    console.log('CSS variables count:', Object.keys(cssVars).length);
    
    // Check for MUI components
    const muiComponents = document.querySelectorAll('[class*="Mui"], [class*="MuiBox"], [class*="MuiContainer"]');
    console.log('MUI components found:', muiComponents.length);
    
    return {
      hasThemeProvider: !!muiTheme,
      cssVarCount: Object.keys(cssVars).length,
      muiComponentCount: muiComponents.length
    };
  }
  
  // 4. ERROR MONITORING
  function setupErrorMonitoring() {
    console.log('🔍 SETTING UP ERROR MONITORING:');
    
    // Monitor all errors
    window.addEventListener('error', (event) => {
      console.error('🚨 JavaScript Error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });
    
    // Monitor unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 Unhandled Promise Rejection:', {
        reason: event.reason,
        promise: event.promise
      });
    });
    
    // Monitor React errors if available
    if (window.React) {
      console.log('React version:', window.React.version);
    }
    
    console.log('✅ Error monitoring active');
  }
  
  // 5. PERFORMANCE MONITORING
  function monitorPerformance() {
    console.log('⚡ PERFORMANCE MONITORING:');
    
    // Monitor memory usage
    if (performance.memory) {
      console.log('Memory usage:', {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
        jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
      });
    }
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('🐌 Long task detected:', entry.duration + 'ms');
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
    
    // Monitor layout thrashing
    let lastLayoutTime = performance.now();
    const layoutObserver = new ResizeObserver(() => {
      const now = performance.now();
      if (now - lastLayoutTime < 16) {
        console.warn('🔄 Potential layout thrashing detected');
      }
      lastLayoutTime = now;
    });
    
    layoutObserver.observe(document.body);
    
    console.log('✅ Performance monitoring active');
  }
  
  // 6. REAL-TIME MONITORING
  function startRealTimeMonitoring() {
    console.log('🔄 STARTING REAL-TIME MONITORING:');
    
    let checks = 0;
    const monitor = setInterval(() => {
      checks++;
      const visual = checkVisualState();
      
      if (!visual.bodyVisible || !visual.hasContent || visual.visibleChildren === 0) {
        console.error('🚨 BLANKING DETECTED!', {
          check: checks,
          timestamp: new Date().toISOString(),
          visual,
          react: checkReactState(),
          mui: checkMUITheme(),
          url: window.location.href,
          userAgent: navigator.userAgent
        });
        
        // Try to capture stack trace
        console.trace('Stack trace at blanking detection');
        
        // Try to restore if possible
        if (document.body.style.display === 'none') {
          console.log('🔧 Attempting to restore body display');
          document.body.style.display = '';
        }
        
        if (document.body.style.visibility === 'hidden') {
          console.log('🔧 Attempting to restore body visibility');
          document.body.style.visibility = '';
        }
        
        if (document.body.style.opacity === '0') {
          console.log('🔧 Attempting to restore body opacity');
          document.body.style.opacity = '';
        }
      }
      
      // Log status every 30 seconds
      if (checks % 60 === 0) {
        console.log(`✅ Monitoring active - ${checks} checks completed`);
      }
    }, 500);
    
    console.log('✅ Real-time monitoring started (500ms interval)');
    
    // Return stop function
    return () => {
      clearInterval(monitor);
      console.log('🛑 Real-time monitoring stopped');
    };
  }
  
  // 7. SYSTEM INFO
  function logSystemInfo() {
    console.log('💻 SYSTEM INFO:');
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    console.log('Language:', navigator.language);
    console.log('Online:', navigator.onLine);
    console.log('Cookies enabled:', navigator.cookieEnabled);
    console.log('Screen resolution:', screen.width + 'x' + screen.height);
    console.log('Viewport size:', window.innerWidth + 'x' + window.innerHeight);
    console.log('Device pixel ratio:', window.devicePixelRatio);
    console.log('Color depth:', screen.colorDepth);
    
    // Check for WebGL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    console.log('WebGL supported:', !!gl);
    
    if (gl) {
      console.log('WebGL renderer:', gl.getParameter(gl.RENDERER));
      console.log('WebGL vendor:', gl.getParameter(gl.VENDOR));
    }
  }
  
  // 8. MAIN EXECUTION
  console.log('🚀 RUNNING EMERGENCY DIAGNOSTIC...');
  
  // Initial checks
  logSystemInfo();
  const initialVisual = checkVisualState();
  const initialReact = checkReactState();
  const initialMUI = checkMUITheme();
  
  console.log('Initial state:', {
    visual: initialVisual,
    react: initialReact,
    mui: initialMUI
  });
  
  // Set up monitoring
  setupErrorMonitoring();
  monitorPerformance();
  
  // Start real-time monitoring
  const stopMonitoring = startRealTimeMonitoring();
  
  // Add to global scope for manual control
  window.auracleDebug = {
    checkVisualState,
    checkReactState,
    checkMUITheme,
    stopMonitoring,
    
    // Manual recovery attempts
    recover: () => {
      console.log('🔧 ATTEMPTING MANUAL RECOVERY...');
      
      // Reset body styles
      document.body.style.display = '';
      document.body.style.visibility = '';
      document.body.style.opacity = '';
      document.body.style.zIndex = '';
      
      // Reset html styles  
      document.documentElement.style.display = '';
      document.documentElement.style.visibility = '';
      document.documentElement.style.opacity = '';
      
      // Force repaint
      document.body.offsetHeight;
      
      console.log('✅ Recovery attempt complete');
    },
    
    // Force full page reload
    forceReload: () => {
      console.log('🔄 FORCING PAGE RELOAD...');
      window.location.reload();
    }
  };
  
  console.log('✅ Emergency diagnostic complete');
  console.log('💡 Use window.auracleDebug.recover() to attempt manual recovery');
  console.log('💡 Use window.auracleDebug.stopMonitoring() to stop monitoring');
  console.log('💡 Use window.auracleDebug.forceReload() to force page reload');
  
})();
```

# EMERGENCY-FIX.md

```md
# 🚨 EMERGENCY FIX - Screen Blanking Root Cause Found

## THE PROBLEM
Your system has **extreme memory pressure** (only 200MB-1GB free out of 36GB). The Auracle app renderer is consuming **935MB** of memory!

## IMMEDIATE ACTIONS

### 1. Free System Memory NOW
\`\`\`bash
# Kill Docker/Colima VM (using 1.2GB)
colima stop

# Close unnecessary apps
killall "Google Chrome"
\`\`\`

### 2. Increase Electron Memory Limits
The renderer is hitting memory limits. Add these to main.js:

\`\`\`javascript
app.commandLine.appendSwitch('max-old-space-size', '512');
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512');
\`\`\`

### 3. Emergency Memory Reduction
The transcript is likely consuming massive memory. Reduce limits to:
- MAX_TRANSCRIPT_LENGTH = 10000 (from 50000)
- Topics = 10 entries (from 30)
- Research = 5 entries (from 20)

## WHY IT'S BLANKING
When system memory is critically low, macOS:
1. Suspends background processes
2. Forces GPU memory to swap
3. **Kills renderer processes** to free memory
4. Window appears blank because renderer is dead/suspended

## THE SMOKING GUN
Your debug log shows:
- System free memory: 200MB-1GB (< 3% free)
- Auracle renderer: 935MB memory usage
- Load average: 6+ (system overloaded)
- Window lost focus at 07:07:28

This is a **system-level memory exhaustion** issue, not a code bug!
```

# monitor-system.sh

```sh
#!/bin/bash

# Emergency System Monitor for Auracle Blanking Issue
# This script monitors the system independently of Electron

LOG_FILE="$HOME/auracle-system-monitor.log"
SCREENSHOT_DIR="$HOME/auracle-screenshots"

# Create screenshot directory
mkdir -p "$SCREENSHOT_DIR"

echo "=== AURACLE SYSTEM MONITOR STARTED ===" >> "$LOG_FILE"
echo "Started at: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "🔍 MONITOR: $1"
}

# Function to take screenshot
take_screenshot() {
    local reason="$1"
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local screenshot_file="$SCREENSHOT_DIR/auracle_screenshot_${reason}_${timestamp}.png"
    
    screencapture -x "$screenshot_file" 2>/dev/null
    if [ $? -eq 0 ]; then
        log_message "Screenshot taken: $screenshot_file"
    else
        log_message "Failed to take screenshot"
    fi
}

# Function to check Auracle processes
check_auracle_processes() {
    local main_process=$(pgrep -f "electron.*auracle" | head -1)
    local renderer_processes=$(pgrep -f "auracle.*renderer" | wc -l)
    local gpu_process=$(pgrep -f "auracle.*gpu" | head -1)
    
    log_message "Main process: ${main_process:-NONE}"
    log_message "Renderer processes: $renderer_processes"
    log_message "GPU process: ${gpu_process:-NONE}"
    
    if [ -z "$main_process" ]; then
        log_message "🚨 CRITICAL: No main Auracle process found!"
        take_screenshot "no_main_process"
    fi
}

# Function to check memory usage
check_memory() {
    local memory_info=$(vm_stat | head -4)
    local memory_pressure=$(memory_pressure 2>/dev/null | head -1)
    
    log_message "Memory stats: $memory_info"
    if [ -n "$memory_pressure" ]; then
        log_message "Memory pressure: $memory_pressure"
    fi
}

# Function to check display/graphics
check_display() {
    local displays=$(system_profiler SPDisplaysDataType 2>/dev/null | grep "Resolution:" | wc -l)
    local windowserver=$(pgrep WindowServer | head -1)
    
    log_message "Active displays: $displays"
    log_message "WindowServer PID: ${windowserver:-NONE}"
    
    if [ -z "$windowserver" ]; then
        log_message "🚨 CRITICAL: WindowServer not running!"
    fi
}

# Function to monitor Electron processes specifically
monitor_electron() {
    local electron_processes=$(pgrep -f electron | wc -l)
    local helper_processes=$(pgrep -f "Electron Helper" | wc -l)
    
    log_message "Total Electron processes: $electron_processes"
    log_message "Electron Helper processes: $helper_processes"
    
    # Check for crashed processes
    local crashed_apps=$(ls /Users/*/Library/Logs/DiagnosticReports/*Electron* 2>/dev/null | tail -5)
    if [ -n "$crashed_apps" ]; then
        log_message "🚨 Recent Electron crash reports found"
        echo "$crashed_apps" >> "$LOG_FILE"
    fi
}

log_message "System monitoring started"

# Main monitoring loop
counter=0
while true; do
    counter=$((counter + 1))
    
    log_message "=== MONITOR CYCLE $counter ==="
    
    # Check every cycle
    check_auracle_processes
    check_memory
    
    # Check less frequently
    if [ $((counter % 6)) -eq 0 ]; then
        check_display
        monitor_electron
        take_screenshot "routine_check"
    fi
    
    # Sleep for 10 seconds
    sleep 10
done
```

# package.json

```json
{
  "name": "bitscribe",
  "productName": "bitscribe",
  "version": "1.0.0",
  "description": "Specialized tool for MongoDB design review interviews with real-time transcription and comprehensive report generation.",
  "main": "app/main.js",
  "homepage": "https://github.com/mongodb/design-review-scribe",
  "repository": {
    "type": "git",
    "url": "https://github.com/mongodb/design-review-scribe.git"
  },
  "author": {
    "name": "Michael Lynn",
    "email": "merlynn@gmail.com",
    "url": "https://mlynn.org"
  },
  "license": "MIT",
  "keywords": [
    "ai",
    "speech-recognition",
    "research",
    "conversation",
    "transcription",
    "productivity",
    "whisper",
    "ollama",
    "real-time"
  ],
  "category": "Productivity",
  "scripts": {
    "start": "npm run build && electron .",
    "dev": "concurrently \"webpack --watch\" \"wait-on dist/bundle.js && electron .\"",
    "build": "webpack --mode=production",
    "build:dev": "webpack --mode=development",
    "pack": "npm run build && electron-builder --dir",
    "dist": "npm run build && electron-builder",
    "dist:mac": "npm run build && electron-builder --mac",
    "dist:win": "npm run build && electron-builder --win",
    "dist:linux": "npm run build && electron-builder --linux",
    "release": "npm run build && electron-builder --publish=always",
    "release:mac": "npm run build && electron-builder --mac --publish=always",
    "release:win": "npm run build && electron-builder --win --publish=always",
    "release:linux": "npm run build && electron-builder --linux --publish=always",
    "package": "electron-builder",
    "postinstall": "electron-builder install-app-deps",
    "setup-whisper": "./setup-whisper.sh",
    "setup": "npm install && npm run setup-whisper",
    "test-whisper": "node test-whisper.js"
  },
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/material": "^7.2.0",
    "dotenv": "^17.0.1",
    "mammoth": "^1.9.1",
    "mongodb": "^6.17.0",
    "ollama": "^0.4.9",
    "pdf-parse": "^1.1.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-markdown": "^10.1.0",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@babel/cli": "^7.28.0",
    "@babel/core": "^7.28.0",
    "@babel/preset-env": "^7.28.0",
    "@babel/preset-react": "^7.27.1",
    "babel-loader": "^10.0.0",
    "concurrently": "^9.2.0",
    "copy-webpack-plugin": "^13.0.0",
    "cross-env": "^7.0.3",
    "electron": "^37.2.0",
    "electron-builder": "^26.0.12",
    "electron-notarize": "^1.2.2",
    "html-webpack-plugin": "^5.6.3",
    "wait-on": "^8.0.3",
    "webpack": "^5.99.9",
    "webpack-cli": "^6.0.1"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "os": [
    "darwin",
    "win32",
    "linux"
  ]
}

```

# PRD.md

```md
📄 Product Requirements Document (PRD)
Real-time Conversational Research Companion
📌 Overview
Product Name:
Real-time Conversational Research Companion

Description:
A cross-platform desktop application that listens to real-time conversations (via microphone), transcribes speech to text, extracts topics/questions, and automatically performs research to surface relevant insights.
It leverages a local LLM (via Ollama) to keep user data private and performant.

Target Platforms:

Initial: macOS

Next: Windows & Linux (cross-platform via Electron or Tauri)

🎯 Goals & Objectives
Goal	Description
🎤 Passive listening	Continuously capture speech and transcribe in real time
📝 Topic extraction	Use local LLM to detect main topics, questions, or unknown terms
🔍 Automatic research	Fetch info from web (Google, Wikipedia, others) on detected topics
🖥️ Insight presentation	Show research summaries, links, and highlights in an intuitive GUI
🔧 Configurable stack	Allow switching LLM models, adjusting thresholds, enabling/disabling research
🔒 Local-first privacy	All speech & LLM processing is local; only web searches leave the machine

🧭 Scope
✅ MVP
🎙 Real-time mic input + transcription (via Whisper / whisper.cpp)

🔎 Local LLM (Ollama) for topic extraction

🌐 Simple research module (search Google/Wikipedia for top topics)

🖥 Basic GUI timeline to show:

transcript text

extracted topics

summaries from research

💾 Local persistence (store sessions, config, history)

⚙ Config file for:

LLM endpoint & model

speech-to-text settings

research providers

thresholds (chunk size, min topic confidence)

🚫 Not in MVP
Multi-language support

Meeting participant separation / diarization

OAuth for personal knowledge sources (Notion, Confluence, etc.)

Mobile app

🏗 Architecture Overview
csharp
Copy
Edit
[Microphone Input]
   ↓
[Speech-to-Text]
   ↓
[Chunking (every N words/seconds)]
   ↓
[Local LLM Topic Extraction]
   ↓
[Web Research]
   ↓
[UI Timeline & Insights Panel]
   ↓
[Local storage]
🛠 Tech Stack
Layer	Tech Options
GUI	Electron + React / Tauri + React
Speech-to-text	whisper.cpp (via local CLI)
LLM	Ollama (local endpoint, configurable model)
Research	Node HTTP requests to Google Custom Search, Wikipedia
Data storage	JSON / LiteDB / SQLite (for sessions & config)
Config	JSON file in user home dir (~/.research-companion/config.json)

⚙️ Config Example
json
Copy
Edit
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
    "providers": ["google", "wikipedia"],
    "max_results": 3
  },
  "thresholds": {
    "min_words_per_chunk": 25
  }
}
🚀 User Stories
As a ...	I want to ...	So that ...
Casual user	start the app and let it run in the background	it automatically gives me research without effort
Developer	configure which LLM or speech-to-text engine to use	I can test different local setups
Privacy-minded	keep everything local (speech & LLM processing)	none of my private conversations go to the cloud
Researcher	see topics & automatic summaries in a clean timeline	I can quickly learn about what's discussed

📋 Acceptance Criteria
✅ Mic input works with acceptable real-time latency (< 3s lag)

✅ LLM detects topics & outputs 1-3 main keywords/questions per chunk

✅ Research module fetches at least 2 sources per topic

✅ UI shows a clear timeline with: transcript, topics, summary

✅ Config file can change LLM model, thresholds, research providers

✅ No audio or transcription data is uploaded anywhere except direct web lookups

📂 Directory Structure
bash
Copy
Edit
/
├── app/
│   ├── main.js          # Electron/Tauri entry
│   ├── renderer/        # React UI
│   ├── services/
│   │   ├── stt.js       # Speech-to-text integration
│   │   ├── llm.js       # Ollama interface
│   │   ├── research.js  # Web research handlers
│   ├── storage/         # JSON / DB handling
│   └── config/          # Config loader & schema
├── whisper/             # (or scripts to invoke whisper.cpp)
└── README.md
🔥 Milestones
Milestone	Description	Target Date
✅ Prototype transcription	Mic → Whisper → Console output	+2 weeks
✅ Integrate Ollama	Chunk text → send to LLM → get topics	+4 weeks
✅ Build research fetcher	Google/Wikipedia → get summaries	+6 weeks
✅ UI timeline	Transcript + topics + summaries	+8 weeks
✅ Config / local persistence	JSON file for settings & session saves	+10 weeks
✅ Build Mac app bundle	Electron/Tauri packaged .app	+12 weeks

📝 Open Questions
Should we offer auto start on system boot for power users?

Should we allow live voice command triggers (e.g. “Hey Companion, summarize this”)?

Future integrations: local vector store to remember what user already learned.

📌 Ownership
Product Owner: You (or appointed PM)

Engineering Lead: TBD

Design: TBD

Testing: TBD

✅ Done means:

App can run on macOS, start listening, summarize topics, and present research in a UI timeline, with configurable local LLM and local-only processing (except external research lookups).

```

# PRIVACY.md

```md
# Privacy Policy for Auracle

*Last updated: January 2025*

## Overview

Auracle is designed with privacy as a core principle. We believe in keeping your conversations and data private and secure.

## Data Collection and Processing

### Local Processing
- **Speech Recognition**: All audio processing happens locally on your device using whisper.cpp
- **AI Analysis**: Topic extraction and analysis is performed locally using Ollama
- **No Cloud Upload**: Your audio and conversations never leave your device

### What We Collect
- **Nothing Automatically**: Auracle does not automatically collect any personal data
- **Optional Research Queries**: Only topic searches are sent to external research APIs (Wikipedia, etc.)
- **No Audio Storage**: Audio is processed in real-time and not stored

### What We Store Locally
- **Conversation Transcripts**: Stored locally in JSON files on your device
- **Generated Reports**: Saved locally to your Downloads folder
- **App Settings**: Configuration preferences stored locally
- **Usage Metrics**: Basic app usage statistics (stored locally, not transmitted)

## Third-Party Services

### Research APIs
When you use Auracle's research features, we may send search queries to:
- **Wikipedia**: For encyclopedia entries
- **DuckDuckGo**: For general web search results
- **Other Research Sources**: As configured in settings

**Important**: Only search terms and topics are sent, never your audio or full conversations.

### Optional Cloud Services
- **AI Providers**: If you configure cloud AI providers (OpenAI, etc.), your prompts may be sent to those services
- **You Control This**: All cloud integrations are optional and configurable

## Data Security

### Local Storage
- Conversation data is stored locally on your device
- No unauthorized access from external services
- You maintain full control over your data

### Encryption
- Network communications use HTTPS/TLS encryption
- Local data storage uses your operating system's built-in security

## Your Rights

### Data Control
- **Access**: All your data is stored locally and accessible to you
- **Deletion**: You can delete conversation files and app data at any time
- **Export**: Your data is stored in standard JSON format for easy export

### Settings Control
- **Disable Research**: You can turn off all external research features
- **Choose Providers**: Select which research sources you want to use
- **Opt Out**: Disable any data collection or external communications

## Children's Privacy

Auracle is not designed for or directed at children under 13. We do not knowingly collect personal information from children under 13.

## Changes to Privacy Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy in the app and updating the "Last updated" date.

## Contact Information

If you have questions about this privacy policy, please contact us at:
- Email: privacy@auracle.app
- Website: https://auracle.app/privacy

## Technical Details

### Data Location
- **macOS**: `~/Library/Application Support/Auracle/`
- **Windows**: `%APPDATA%/Auracle/`
- **Linux**: `~/.config/Auracle/`

### Network Communications
- Research API calls (only search terms)
- Software update checks (anonymous)
- Optional cloud AI providers (if configured)

### No Tracking
- No analytics or tracking cookies
- No behavioral profiling
- No advertising networks
- No social media integrations

---

*Auracle is committed to protecting your privacy and maintaining transparency about our data practices.*
```

# README.md

```md
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

\`\`\`bash
# 1. Clone and install dependencies
git clone https://github.com/mrlynn/mongodb-design-review-scribe.git
cd mongodb-design-review-scribe
npm install

# 2. Set up dependencies (choose your preference)
./setup-whisper.sh    # For speech recognition
./setup-ollama.sh     # For local AI (optional)

# 3. Start the application
npm start
\`\`\`

## Setup Options

### Option 1: Fully Automated Setup (Recommended)
The app now handles Ollama automatically! Just run:

\`\`\`bash
# Set up Whisper for speech recognition
chmod +x setup-whisper.sh && ./setup-whisper.sh

# Ollama will be automatically managed by the app
npm start
\`\`\`

The app will:
- ✅ Automatically detect if Ollama is running
- ✅ Download and install models as needed
- ✅ Show progress during model downloads
- ✅ Fallback to cloud providers if Ollama unavailable

### Option 2: Manual Ollama Setup (Optional)
If you prefer to set up Ollama manually:

\`\`\`bash
# Install and configure Ollama manually
chmod +x setup-ollama.sh && ./setup-ollama.sh
\`\`\`

### Option 3: Cloud-Only Setup
Skip local AI completely and use cloud providers:
1. Get API keys from OpenAI, Claude, or other providers
2. Configure in app Settings → LLM Configuration
3. Only run `./setup-whisper.sh` for speech recognition

### 3. Install Node.js Dependencies

\`\`\`bash
# Install dependencies
npm install

# Build the UI
npm run build
\`\`\`

## Configuration

The app uses a configuration file at `~/.research-companion/config.json`. Default configuration:

\`\`\`json
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
\`\`\`

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
\`\`\`json
{
  "research": {
    "providers": ["wikipedia", "duckduckgo", "searxng"],
    "max_results": 4
  }
}
\`\`\`

#### 💰 **Google Search (Optional - Requires Payment)**
If you want Google results (not recommended due to cost/complexity):
1. Google requires a billing account even for "free" tier
2. Setup is complex with multiple registration steps
3. Limited to 100 searches/day before charges apply

**Recommendation**: The free sources provide excellent coverage. Google adds minimal value for the complexity and cost.

## Running the Application

1. **Ensure Ollama is running**:
   \`\`\`bash
   ollama serve
   \`\`\`

2. **Start the application**:
   \`\`\`bash
   npm start
   \`\`\`

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
\`\`\`
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
\`\`\`

### Building for Production

\`\`\`bash
npm run package
\`\`\`

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
```

# RELEASE_SPRINT.md

```md
# 🚀 Auracle Release Sprint - Production Packaging & Publishing

## 📋 Sprint Overview

**Goal**: Transform Auracle from development prototype to production-ready, publishable application for macOS App Store, Windows Store, and direct distribution.

**Timeline**: 2-3 weeks
**Priority**: Ship-ready application with professional polish

---

## 🎯 Sprint Objectives

### Primary Goals
1. ✅ **Professional App Identity** - Complete branding, icons, and metadata
2. ✅ **Production Build System** - Automated, signed, notarized builds
3. ✅ **App Store Compliance** - Meet all platform requirements
4. ✅ **User Experience Polish** - Error handling, onboarding, documentation
5. ✅ **Distribution Strategy** - Multiple distribution channels

### Success Metrics
- [ ] macOS App Store submission approved
- [ ] Microsoft Store submission approved  
- [ ] Direct download available on website
- [ ] Zero critical bugs in production build
- [ ] Complete user documentation

---

## 📦 Epic 1: App Identity & Branding (Days 1-3)

### 🎨 Visual Assets
**Priority: HIGH**

#### App Icons (Required)
- [ ] **App Icon Set** - Generate complete icon set for all platforms
  - macOS: 16x16, 32x32, 128x128, 256x256, 512x512, 1024x1024 (PNG + ICNS)
  - Windows: 16x16, 32x32, 48x48, 256x256 (ICO format)
  - Linux: 48x48, 64x64, 128x128, 256x256 (PNG)
  - Source: High-res SVG or 1024x1024 PNG

#### Brand Assets
- [ ] **Logo Design** - Professional logo for marketing
- [ ] **Splash Screen** - App launch screen (optional)
- [ ] **Window Icon** - 32x32 PNG for window title bar
- [ ] **Notification Icon** - 22x22 PNG for system notifications

#### Implementation
\`\`\`bash
# Create assets directory
mkdir -p assets/icons/{mac,windows,linux}
mkdir -p assets/brand

# Icon generation script needed
npm install -g electron-icon-maker
electron-icon-maker --input=assets/icon-source.png --output=assets/icons/
\`\`\`

### 📝 App Metadata
**Priority: HIGH**

#### Package.json Updates
- [ ] **App Name**: "Auracle - AI Research Companion"
- [ ] **Description**: Professional description for stores
- [ ] **Version**: Semantic versioning (start with 1.0.0)
- [ ] **Author**: Complete author information
- [ ] **Homepage**: Website URL
- [ ] **Repository**: GitHub repository
- [ ] **Keywords**: SEO-friendly keywords
- [ ] **Category**: "Productivity" / "Business"

#### Legal Requirements
- [ ] **License File** - Clear MIT license
- [ ] **Privacy Policy** - Required for app stores
- [ ] **Terms of Service** - User agreement
- [ ] **Copyright Notice** - Proper attribution

---

## 🔧 Epic 2: Production Build System (Days 4-7)

### ⚙️ Electron Builder Configuration
**Priority: HIGH**

#### Build Configuration File
- [ ] **Create electron-builder.yml** - Complete build configuration
\`\`\`yaml
# File: electron-builder.yml
appId: com.auracle.desktop
productName: Auracle
directories:
  output: dist
  buildResources: build
files:
  - app/**/*
  - node_modules/**/*
  - "!app/src/**/*"
  - "!**/node_modules/*/{CHANGELOG.md,README.md,readme.md}"
extraResources:
  - from: whisper.cpp/models/
    to: models/
    filter: ["**/*.bin"]
  - from: whisper.cpp/build/bin/
    to: bin/
    filter: ["whisper-stream*", "whisper*"]

mac:
  category: public.app-category.productivity
  icon: assets/icons/mac/icon.icns
  hardenedRuntime: true
  gatekeeperAssess: false
  entitlements: build/entitlements.mac.plist
  entitlementsInherit: build/entitlements.mac.plist
  
win:
  icon: assets/icons/windows/icon.ico
  target: nsis
  
linux:
  icon: assets/icons/linux/
  target: AppImage
\`\`\`

#### Code Signing Setup
- [ ] **macOS Code Signing**
  - Apple Developer Certificate
  - App-specific password
  - Notarization setup
  - Entitlements file

- [ ] **Windows Code Signing**
  - Code signing certificate
  - Windows Store certification

#### Build Scripts
- [ ] **Update package.json scripts**
\`\`\`json
{
  "scripts": {
    "build": "webpack --mode=production",
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
    "dist:mac": "electron-builder --mac",
    "dist:win": "electron-builder --win",
    "dist:linux": "electron-builder --linux",
    "release": "npm run build && electron-builder --publish=always"
  }
}
\`\`\`

### 🔒 Security & Permissions
**Priority: HIGH**

#### macOS Entitlements
- [ ] **Create build/entitlements.mac.plist**
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
  <key>com.apple.security.cs.disable-library-validation</key>
  <true/>
  <key>com.apple.security.device.microphone</key>
  <true/>
  <key>com.apple.security.network.client</key>
  <true/>
  <key>com.apple.security.files.user-selected.read-write</key>
  <true/>
</dict>
</plist>
\`\`\`

#### Permission Requests
- [ ] **Microphone Access** - Clear user prompts
- [ ] **File System Access** - For exports and configs
- [ ] **Network Access** - For research APIs

---

## 🎨 Epic 3: User Experience Polish (Days 8-12)

### 🚀 App Launch & Onboarding
**Priority: HIGH**

#### First-Run Experience
- [ ] **Welcome Screen** - Introduction to Auracle
- [ ] **Setup Wizard** - Guide through initial configuration
  - Microphone permissions
  - Whisper.cpp installation check
  - Ollama setup verification
  - Optional API key configuration
- [ ] **Sample Session** - Demo with pre-recorded audio

#### Error Handling & Recovery
- [ ] **Dependency Checks** - Verify whisper.cpp and Ollama
- [ ] **Graceful Failures** - User-friendly error messages
- [ ] **Recovery Suggestions** - Actionable troubleshooting
- [ ] **Offline Mode** - Basic functionality without research

### 📖 Help & Documentation
**Priority: MEDIUM**

#### In-App Help
- [ ] **Help Menu** - Comprehensive help system
- [ ] **Keyboard Shortcuts** - Document all shortcuts
- [ ] **Tooltips** - Contextual help throughout UI
- [ ] **Getting Started Guide** - Interactive tutorial

#### External Documentation
- [ ] **User Manual** - Complete usage guide
- [ ] **FAQ** - Common questions and solutions
- [ ] **Video Tutorials** - Screen recordings of key features
- [ ] **API Documentation** - For power users

### 🔧 Settings & Preferences
**Priority: MEDIUM**

#### Advanced Settings
- [ ] **Audio Settings** - Input device selection, gain control
- [ ] **AI Model Settings** - Model selection, performance tuning
- [ ] **Export Settings** - File formats, locations
- [ ] **Privacy Settings** - Data retention, sharing preferences
- [ ] **Appearance Settings** - Themes, font sizes

---

## 🏪 Epic 4: App Store Compliance (Days 13-16)

### 🍎 macOS App Store
**Priority: HIGH**

#### Technical Requirements
- [ ] **App Sandbox** - Enable and configure properly
- [ ] **Hardened Runtime** - Security requirements
- [ ] **Notarization** - Apple notarization process
- [ ] **XPC Services** - If using helper processes

#### Store Listing
- [ ] **App Screenshots** - High-quality screenshots (6.1", 6.5", 12.9")
- [ ] **App Preview** - 30-second demo video
- [ ] **App Description** - Compelling store description
- [ ] **Keywords** - SEO optimization
- [ ] **Age Rating** - Appropriate rating
- [ ] **Privacy Information** - Data usage disclosure

### 🪟 Microsoft Store
**Priority: MEDIUM**

#### Technical Requirements
- [ ] **Windows App Certification** - Pass all tests
- [ ] **Package Manifest** - Correct app manifest
- [ ] **Store Compliance** - Content and feature requirements

#### Store Listing
- [ ] **Store Screenshots** - Windows-specific screenshots
- [ ] **App Description** - Platform-appropriate description
- [ ] **System Requirements** - Minimum specs

### 🐧 Linux Distribution
**Priority: LOW**

#### Distribution Channels
- [ ] **Snap Store** - Snapcraft package
- [ ] **Flatpak** - Flathub distribution
- [ ] **AppImage** - Direct download
- [ ] **AUR** - Arch User Repository

---

## 🚀 Epic 5: Distribution & Release (Days 17-21)

### 🌐 Website & Landing Page
**Priority: HIGH**

#### Marketing Website
- [ ] **Landing Page** - Professional product page
- [ ] **Download Section** - All platform downloads
- [ ] **Documentation Hub** - Centralized docs
- [ ] **Blog/News** - Product updates and announcements
- [ ] **Support Page** - Contact and help resources

#### Technical Infrastructure
- [ ] **CDN Setup** - Fast global downloads
- [ ] **Analytics** - Download and usage tracking
- [ ] **Auto-updates** - Electron auto-updater integration

### 📦 Release Process
**Priority: HIGH**

#### Automated Releases
- [ ] **GitHub Actions** - CI/CD pipeline
\`\`\`yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags: ['v*']
jobs:
  release:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Build and release
        run: npm run release
        env:
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
          WIN_CSC_LINK: ${{ secrets.WIN_CSC_LINK }}
          WIN_CSC_KEY_PASSWORD: ${{ secrets.WIN_CSC_KEY_PASSWORD }}
\`\`\`

#### Version Management
- [ ] **Semantic Versioning** - Proper version strategy
- [ ] **Release Notes** - Detailed changelogs
- [ ] **Update Mechanism** - Automatic update checks
- [ ] **Rollback Strategy** - Handle failed updates

---

## 🧪 Epic 6: Quality Assurance (Ongoing)

### 🔍 Testing Strategy
**Priority: HIGH**

#### Automated Testing
- [ ] **Unit Tests** - Core service testing
- [ ] **Integration Tests** - End-to-end workflows
- [ ] **UI Tests** - Electron spectron tests
- [ ] **Performance Tests** - Memory and CPU benchmarks

#### Manual Testing
- [ ] **Platform Testing** - Test on all target platforms
- [ ] **Hardware Testing** - Different microphone setups
- [ ] **Network Testing** - Various connectivity scenarios
- [ ] **Accessibility Testing** - Screen readers, keyboard navigation

### 🐛 Bug Tracking & Resolution
**Priority: HIGH**

#### Issue Management
- [ ] **Bug Tracking System** - GitHub Issues or similar
- [ ] **Crash Reporting** - Automatic crash reports
- [ ] **User Feedback** - In-app feedback mechanism
- [ ] **Performance Monitoring** - Usage analytics

---

## 📋 Implementation Checklist

### Week 1: Foundation
- [ ] **Day 1**: App identity and branding assets
- [ ] **Day 2**: Icon generation and metadata updates
- [ ] **Day 3**: Legal documents and privacy policy
- [ ] **Day 4**: Electron builder configuration
- [ ] **Day 5**: Code signing setup

### Week 2: Polish
- [ ] **Day 8**: Welcome screen and onboarding
- [ ] **Day 9**: Error handling improvements
- [ ] **Day 10**: Settings and preferences
- [ ] **Day 11**: Help system and documentation
- [ ] **Day 12**: Testing and bug fixes

### Week 3: Release
- [ ] **Day 15**: App store submissions
- [ ] **Day 16**: Website and landing page
- [ ] **Day 17**: Release automation setup
- [ ] **Day 18**: Final testing and validation
- [ ] **Day 19**: Production release

---

## 🛠 Required Tools & Services

### Development Tools
- [ ] **Xcode** (macOS) - For iOS/macOS development
- [ ] **Visual Studio** (Windows) - For Windows development
- [ ] **Photoshop/Sketch** - Icon and asset creation
- [ ] **electron-icon-maker** - Icon generation

### Certificates & Accounts
- [ ] **Apple Developer Account** ($99/year)
- [ ] **Microsoft Partner Account** ($19 one-time)
- [ ] **Code Signing Certificate** (Windows)
- [ ] **Domain and Hosting** - For website

### Services
- [ ] **GitHub** - Repository and CI/CD
- [ ] **CloudFlare** - CDN and analytics
- [ ] **Sentry** - Error tracking (optional)
- [ ] **Google Analytics** - Usage tracking

---

## 💰 Budget Estimate

### Required Costs
- Apple Developer Account: $99/year
- Microsoft Partner Account: $19 one-time
- Domain (.com): $15/year
- Hosting/CDN: $10-50/month
- Code Signing Certificate: $75-200/year

### Optional Costs
- Professional Design: $500-2000
- Error Tracking (Sentry): $26/month
- Advanced Analytics: $10-50/month
- Professional Icons: $100-500

**Total Minimum**: ~$200 first year
**Total Recommended**: ~$1000 first year

---

## 📈 Success Metrics & KPIs

### Technical Metrics
- [ ] **Build Success Rate** - 100% successful builds
- [ ] **App Store Approval Rate** - 100% first-time approval
- [ ] **Crash Rate** - < 0.1% of sessions
- [ ] **Performance** - < 3s startup time

### Business Metrics
- [ ] **Download Numbers** - Track across all platforms
- [ ] **User Retention** - 7-day and 30-day retention
- [ ] **User Satisfaction** - App store ratings > 4.0
- [ ] **Support Requests** - < 5% of users need support

---

## 🚨 Risk Mitigation

### Technical Risks
- **Whisper.cpp Bundling** - Large binary distribution
- **Code Signing Issues** - Certificate/notarization problems
- **Platform Differences** - OS-specific bugs
- **Performance Issues** - Resource usage on different hardware

### Business Risks
- **App Store Rejection** - Policy compliance issues
- **Competition** - Similar apps in market
- **User Adoption** - Marketing and discovery challenges
- **Support Overhead** - Customer service requirements

### Mitigation Strategies
- **Early Testing** - Test on all platforms frequently
- **Documentation** - Comprehensive troubleshooting guides
- **Community Building** - Discord/Reddit presence
- **Feedback Loops** - Regular user surveys and analytics

---

## 📞 Next Steps

1. **Review & Approve** this sprint plan
2. **Resource Allocation** - Assign team members to epics
3. **Tool Setup** - Get all required accounts and certificates
4. **Kick-off Meeting** - Align team on timeline and priorities
5. **Daily Standups** - Track progress and resolve blockers

---

*Generated by Claude Code for Auracle Release Sprint Planning*
```

# setup-ollama.sh

```sh
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
```

# setup-whisper.sh

```sh
#!/bin/bash

# bitscribe - Whisper.cpp Setup Script
echo "🎤 Setting up whisper.cpp for bitscribe..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Please run this script from the bitscribe root directory${NC}"
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
echo -e "${GREEN}✅ whisper.cpp is ready for bitscribe${NC}"
echo ""
echo -e "${YELLOW}📁 Installation summary:${NC}"
echo -e "   Binary: ${WHISPER_BIN}"
echo -e "   Model:  whisper.cpp/models/ggml-base.en.bin"
echo ""
echo -e "${YELLOW}🚀 You can now start the bitscribe app with:${NC}"
echo -e "   npm run dev"
echo ""
```

# SETUP.md

```md
# bitscribe - Setup Guide

This guide will help you set up all dependencies for the bitscribe application.

## Prerequisites

- Node.js 18+ 
- Python 3.8+ (for Whisper)
- Git
- 4GB+ RAM recommended
- 2GB+ free disk space

## Quick Start

\`\`\`bash
# 1. Clone and install dependencies
git clone https://github.com/mrlynn/mongodb-design-review-scribe.git
cd mongodb-design-review-scribe
npm install

# 2. Set up Whisper (see detailed steps below)
./setup-whisper.sh

# 3. Configure your LLM provider (see Configuration section)
# 4. Start the application
npm start
\`\`\`

## Detailed Setup

### 1. Whisper Setup (Speech-to-Text)

#### Option A: Automated Setup (Recommended)
\`\`\`bash
# Run the setup script (downloads ~150MB base model)
chmod +x setup-whisper.sh
./setup-whisper.sh
\`\`\`

#### Option B: Manual Setup
\`\`\`bash
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
\`\`\`

### 2. LLM Provider Setup

Choose one or more LLM providers:

#### Option A: OpenAI (Easiest)
1. Get API key from https://platform.openai.com/api-keys
2. Add to environment or configure in app settings

#### Option B: Ollama (Local, Private)
\`\`\`bash
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
\`\`\`

#### Option C: Claude (Anthropic)
1. Get API key from https://console.anthropic.com/
2. Configure in app settings

### 3. MongoDB Setup (Optional - for RAG)

#### Option A: MongoDB Atlas (Recommended)
1. Create free cluster at https://cloud.mongodb.com/
2. Enable Vector Search
3. Get connection string

#### Option B: Local MongoDB
\`\`\`bash
# Install MongoDB Community
# macOS:
brew install mongodb-community

# Ubuntu:
sudo apt install mongodb

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod           # Ubuntu
\`\`\`

### 4. Environment Configuration

Create `.env` file in the project root:

\`\`\`env
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
\`\`\`

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
\`\`\`bash
# If Whisper build fails on macOS:
xcode-select --install

# If permission denied:
chmod +x setup-whisper.sh

# Test Whisper installation:
cd whisper.cpp
./main -m models/ggml-base.bin -f samples/jfk.wav
\`\`\`

### Memory Issues
- Reduce Whisper model size (use `base` instead of `large`)
- Increase Node.js memory: `export NODE_OPTIONS="--max-old-space-size=4096"`
- Close other applications

### Ollama Issues
\`\`\`bash
# Check if Ollama is running:
ollama list

# Restart Ollama:
pkill ollama
ollama serve

# Test connection:
curl http://localhost:11434/api/tags
\`\`\`

## Performance Optimization

### For Low-End Hardware (4-8GB RAM)
\`\`\`env
WHISPER_MODEL=base
NODE_OPTIONS=--max-old-space-size=2048
\`\`\`
- Use OpenAI API instead of local Ollama
- Enable "Low Memory Mode" in app settings

### For High-End Hardware (16GB+ RAM)
\`\`\`env
WHISPER_MODEL=medium
NODE_OPTIONS=--max-old-space-size=4096
\`\`\`
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
```

# system-monitor.sh

```sh
#!/bin/bash

# System-level monitoring script for Auracle blanking issue (macOS)
# This script monitors system resources and display activity

echo "🔍 Starting Auracle System Monitor..."
echo "Press Ctrl+C to stop monitoring"

# Create log file
LOG_FILE="$HOME/auracle-system-monitor.log"
echo "📝 Logging to: $LOG_FILE"
echo "=== Auracle System Monitor Started $(date) ===" >> "$LOG_FILE"

# Function to log with timestamp
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check if Auracle is running
check_auracle() {
    local pid=$(pgrep -f "Auracle")
    if [ ! -z "$pid" ]; then
        echo "$pid"
    else
        echo "0"
    fi
}

# Function to monitor GPU activity
monitor_gpu() {
    log_message "🎮 GPU Activity:"
    
    # Check GPU processes
    ps aux | grep -i gpu | grep -v grep | while read line; do
        log_message "  GPU Process: $line"
    done
    
    # Check WindowServer (macOS display server)
    ps aux | grep WindowServer | grep -v grep | while read line; do
        log_message "  WindowServer: $line"
    done
}

# Function to monitor display activity
monitor_display() {
    log_message "🖥️  Display Activity:"
    
    # Check display sleep settings
    local display_sleep=$(pmset -g | grep displaysleep | awk '{print $2}')
    log_message "  Display sleep setting: $display_sleep"
    
    # Check current power state
    local power_state=$(pmset -g ps | head -1)
    log_message "  Power state: $power_state"
    
    # Check display brightness
    local brightness=$(brightness -l 2>/dev/null | grep "display 0" | awk '{print $4}' 2>/dev/null || echo "unknown")
    log_message "  Display brightness: $brightness"
}

# Function to monitor system resources
monitor_resources() {
    local auracle_pid=$(check_auracle)
    
    if [ "$auracle_pid" != "0" ]; then
        log_message "📊 System Resources (PID: $auracle_pid):"
        
        # Memory usage
        local memory_usage=$(ps -p "$auracle_pid" -o rss= 2>/dev/null)
        if [ ! -z "$memory_usage" ]; then
            local memory_mb=$((memory_usage / 1024))
            log_message "  Memory usage: ${memory_mb}MB"
            
            # Alert on high memory usage
            if [ "$memory_mb" -gt 1000 ]; then
                log_message "  ⚠️  HIGH MEMORY USAGE: ${memory_mb}MB"
            fi
        fi
        
        # CPU usage
        local cpu_usage=$(ps -p "$auracle_pid" -o pcpu= 2>/dev/null)
        if [ ! -z "$cpu_usage" ]; then
            log_message "  CPU usage: ${cpu_usage}%"
            
            # Alert on high CPU usage
            if (( $(echo "$cpu_usage > 80" | bc -l) )); then
                log_message "  ⚠️  HIGH CPU USAGE: ${cpu_usage}%"
            fi
        fi
        
        # File descriptors
        local fd_count=$(lsof -p "$auracle_pid" 2>/dev/null | wc -l)
        log_message "  File descriptors: $fd_count"
        
        # Threads
        local thread_count=$(ps -p "$auracle_pid" -o thcount= 2>/dev/null)
        log_message "  Thread count: $thread_count"
        
    else
        log_message "❌ Auracle process not found"
    fi
}

# Function to monitor system events
monitor_system_events() {
    log_message "🔔 System Events:"
    
    # Check for recent system events
    log show --last 30s --predicate 'category == "Power" OR category == "Display" OR category == "Graphics"' 2>/dev/null | while read line; do
        if [[ "$line" =~ (sleep|wake|display|gpu|graphics) ]]; then
            log_message "  Event: $line"
        fi
    done
}

# Function to check Electron-specific issues
monitor_electron() {
    log_message "⚡ Electron Monitoring:"
    
    # Check for Electron processes
    ps aux | grep -i electron | grep -v grep | while read line; do
        log_message "  Electron Process: $line"
    done
    
    # Check for renderer processes
    ps aux | grep -i renderer | grep -v grep | while read line; do
        log_message "  Renderer Process: $line"
    done
    
    # Check for GPU processes related to Electron
    ps aux | grep -E "(gpu|chrome)" | grep -v grep | while read line; do
        log_message "  GPU/Chrome Process: $line"
    done
}

# Function to take screenshot for visual verification
take_screenshot() {
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local screenshot_path="$HOME/auracle_screenshot_$timestamp.png"
    
    screencapture -x "$screenshot_path" 2>/dev/null
    
    if [ -f "$screenshot_path" ]; then
        log_message "📸 Screenshot saved: $screenshot_path"
        
        # Get file size to detect blank screenshots
        local file_size=$(stat -f%z "$screenshot_path" 2>/dev/null || echo "0")
        log_message "  Screenshot size: $file_size bytes"
        
        # Small file size might indicate blank screen
        if [ "$file_size" -lt 50000 ]; then
            log_message "  ⚠️  SMALL SCREENSHOT SIZE - POSSIBLE BLANK SCREEN"
        fi
    else
        log_message "❌ Failed to capture screenshot"
    fi
}

# Function to monitor network connections
monitor_network() {
    log_message "🌐 Network Monitoring:"
    
    # Check for network connections from Auracle
    local auracle_pid=$(check_auracle)
    if [ "$auracle_pid" != "0" ]; then
        lsof -p "$auracle_pid" -i 2>/dev/null | while read line; do
            log_message "  Network: $line"
        done
    fi
}

# Function to check for audio/video issues
monitor_audio_video() {
    log_message "🎵 Audio/Video Monitoring:"
    
    # Check audio devices
    system_profiler SPAudioDataType 2>/dev/null | grep -A 5 "Audio Devices:" | while read line; do
        log_message "  Audio: $line"
    done
    
    # Check camera usage
    lsof | grep -i camera 2>/dev/null | while read line; do
        log_message "  Camera: $line"
    done
}

# Trap Ctrl+C for cleanup
trap 'log_message "🛑 Monitoring stopped by user"; exit 0' INT

# Main monitoring loop
log_message "🚀 Starting continuous monitoring..."

while true; do
    log_message "--- Monitoring Cycle ---"
    
    # Basic checks
    monitor_resources
    monitor_display
    monitor_gpu
    monitor_electron
    
    # System events (every other cycle to reduce noise)
    if [ $(($(date +%s) % 20)) -eq 0 ]; then
        monitor_system_events
        monitor_network
    fi
    
    # Take screenshot every 5 minutes for visual verification
    if [ $(($(date +%s) % 300)) -eq 0 ]; then
        take_screenshot
    fi
    
    # Audio/video check every 10 minutes
    if [ $(($(date +%s) % 600)) -eq 0 ]; then
        monitor_audio_video
    fi
    
    # Check if Auracle is still running
    if [ "$(check_auracle)" = "0" ]; then
        log_message "🚨 AURACLE PROCESS TERMINATED"
        break
    fi
    
    log_message "--- End Cycle ---"
    sleep 5
done

log_message "🏁 Monitoring ended"
```

# TEMPLATE_GUIDE.md

```md
# Auracle Template System Guide

## Overview

Auracle supports a standardized JSON template format that allows users to create, import, and export custom report templates. This system enables you to craft specialized report formats for different use cases and share them with others.

## Template Structure

Templates follow a standardized JSON schema with the following structure:

### Required Fields

- **name**: Display name of the template
- **description**: Brief description of what the template generates  
- **category**: Template category (Business, HR, Sales, Healthcare, Legal, Education, Technology, Finance, Custom)
- **version**: Version in format x.y.z (e.g., "1.0.0")
- **prompt**: The main prompt template with variable placeholders

### Optional Fields

- **icon**: Icon or emoji for display (defaults to "📄")
- **variables**: Array of input variables for the template
- **outputFormat**: Expected output format (markdown, html, json, plain)
- **sections**: Expected sections in the output
- **metadata**: Additional template metadata
- **examples**: Example inputs and outputs

## Variable Types

Templates support various input types for dynamic content:

### Text Variables
\`\`\`json
{
  "name": "companyName",
  "type": "text",
  "label": "Company Name",
  "placeholder": "Enter company name",
  "required": true
}
\`\`\`

### Textarea Variables
\`\`\`json
{
  "name": "additionalContext",
  "type": "textarea",
  "label": "Additional Context",
  "placeholder": "Any additional context (optional)",
  "required": false
}
\`\`\`

### Select Variables
\`\`\`json
{
  "name": "meetingType",
  "type": "select",
  "label": "Meeting Type",
  "required": true,
  "default": "regular",
  "options": ["regular", "standup", "planning", "strategy"]
}
\`\`\`

### Date Variables
\`\`\`json
{
  "name": "reportDate",
  "type": "date",
  "label": "Report Date",
  "required": true
}
\`\`\`

### Other Supported Types
- `number`: Numeric input
- `email`: Email validation
- `url`: URL validation

## Variable Substitution

Variables are substituted in the prompt using double curly braces:

\`\`\`
Meeting Date: {{meetingDate}}
Company: {{companyName}}
Transcript: {{transcript}}
\`\`\`

### Conditional Content

Use conditional blocks for optional content:

\`\`\`
{{#if additionalContext}}
Additional Context: {{additionalContext}}
{{/if}}
\`\`\`

## Built-in Variables

- `{{transcript}}`: The conversation transcript (automatically provided)

## Template Examples

### Basic Meeting Minutes Template

\`\`\`json
{
  "name": "Simple Meeting Minutes",
  "description": "Basic meeting minutes format",
  "category": "Business",
  "version": "1.0.0",
  "icon": "📝",
  "prompt": "Create meeting minutes for the following transcript:\n\nDate: {{meetingDate}}\nTranscript: {{transcript}}\n\nInclude:\n1. Summary\n2. Key Points\n3. Action Items",
  "variables": [
    {
      "name": "meetingDate",
      "type": "date",
      "label": "Meeting Date",
      "required": true
    }
  ],
  "outputFormat": "markdown"
}
\`\`\`

## How to Use Templates

### Creating Templates

1. Write your template following the JSON schema
2. Test it with sample data
3. Save as a `.json` file

### Importing Templates

1. Open the Template Gallery in Auracle
2. Click the "Import" button
3. Either:
   - Upload a `.json` template file
   - Paste JSON content directly

### Exporting Templates

1. In the Template Gallery, find your template
2. Click the export button (📥) on any template card
3. Or use "Export All" to export all templates

### Sharing Templates

Templates are exported as standard JSON files that can be:
- Shared via email or file sharing
- Stored in version control systems
- Published in template libraries
- Backed up for safekeeping

## Best Practices

### Template Design

1. **Clear Names**: Use descriptive, unique template names
2. **Helpful Descriptions**: Explain what the template does
3. **Logical Variables**: Only include necessary variables
4. **Good Defaults**: Provide sensible default values
5. **Clear Prompts**: Write detailed, specific prompts

### Prompt Engineering

1. **Be Specific**: Clearly define the expected output format
2. **Include Context**: Provide necessary background information
3. **Structure Requests**: Break down complex requirements
4. **Handle Edge Cases**: Account for incomplete or unusual data

### Version Management

1. **Semantic Versioning**: Use x.y.z format (e.g., 1.0.0, 1.1.0, 2.0.0)
2. **Document Changes**: Update descriptions when changing templates
3. **Backward Compatibility**: Be mindful of breaking changes

## Template Categories

- **Business**: General business reports, meeting minutes
- **HR**: Interview summaries, performance reviews
- **Sales**: Call reports, pipeline analysis
- **Healthcare**: Consultation notes, patient summaries
- **Legal**: Deposition summaries, case notes
- **Education**: Lecture summaries, research reports
- **Technology**: Technical documentation, code reviews
- **Finance**: Financial analysis, audit reports
- **Custom**: Specialized or unique use cases

## Validation

Templates are automatically validated on import for:
- Required fields presence
- Valid category selection
- Proper version format
- Variable type correctness
- Schema compliance

## Storage System

Auracle uses a hybrid storage approach:

### MongoDB Storage (Primary)
When MongoDB is available and configured:
- Templates stored in MongoDB Atlas
- Full search and filtering capabilities
- Supports team collaboration
- Real-time sync across devices

### Local Storage (Fallback)
When MongoDB is unavailable:
- Templates stored locally in `~/.research-companion/local-templates.json`
- Full import/export functionality preserved
- Templates persist between app restarts
- Works completely offline

The system automatically detects MongoDB availability and falls back gracefully to local storage.

## Environment Setup

To use MongoDB storage, ensure your `.env.local` file contains:

\`\`\`bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auracle?retryWrites=true&w=majority
OPENAI_API_KEY=sk-...your-openai-key
\`\`\`

If these environment variables are missing, the app will use local storage automatically.

## Troubleshooting

### Common Issues

1. **Import Fails**: Check JSON syntax and required fields
2. **Variables Not Working**: Verify variable names match placeholders
3. **Poor Output**: Refine prompt clarity and specificity
4. **Template Conflicts**: Use unique names to avoid duplicates
5. **MongoDB Connection Issues**: App automatically falls back to local storage

### Storage-Related Issues

1. **Templates Not Syncing**: Check MongoDB connection string
2. **Templates Disappear**: May have switched between MongoDB and local storage
3. **Export Issues**: Try exporting individual templates if bulk export fails
4. **ID Format Errors**: Template/report IDs are automatically converted to handle different formats (string, ObjectId, buffer)

### Getting Help

- Check the console for detailed error messages
- Validate JSON syntax using online tools
- Review example templates for reference
- Ensure all required fields are present
- Check environment variable configuration

## Example Templates

The system includes several example templates in the `/templates/examples/` directory:

- `meeting-minutes-example.json`: Comprehensive meeting minutes
- `custom-template-example.json`: Advanced research report template

These examples demonstrate best practices and can serve as starting points for your own templates.
```

# template-schema.json

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Auracle Report Template",
  "description": "Schema for Auracle report templates that can be imported and exported",
  "type": "object",
  "required": ["name", "description", "category", "prompt", "version"],
  "properties": {
    "name": {
      "type": "string",
      "description": "Display name of the template",
      "minLength": 1,
      "maxLength": 100
    },
    "description": {
      "type": "string",
      "description": "Brief description of what this template generates",
      "minLength": 1,
      "maxLength": 500
    },
    "category": {
      "type": "string",
      "description": "Category for organizing templates",
      "enum": ["Business", "HR", "Sales", "Healthcare", "Legal", "Education", "Technology", "Finance", "Custom"]
    },
    "version": {
      "type": "string",
      "description": "Template version for compatibility",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "icon": {
      "type": "string",
      "description": "Icon name or emoji for display",
      "default": "📄"
    },
    "prompt": {
      "type": "string",
      "description": "The main prompt template with variable placeholders",
      "minLength": 10
    },
    "variables": {
      "type": "array",
      "description": "Variables that can be substituted in the prompt",
      "items": {
        "type": "object",
        "required": ["name", "type"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Variable name (used in {{variable}} placeholders)",
            "pattern": "^[a-zA-Z][a-zA-Z0-9_]*$"
          },
          "type": {
            "type": "string",
            "description": "Input type for the variable",
            "enum": ["text", "textarea", "select", "date", "number", "email", "url"]
          },
          "label": {
            "type": "string",
            "description": "Human-readable label for the input",
            "default": ""
          },
          "placeholder": {
            "type": "string",
            "description": "Placeholder text for the input",
            "default": ""
          },
          "required": {
            "type": "boolean",
            "description": "Whether this variable is required",
            "default": false
          },
          "default": {
            "type": "string",
            "description": "Default value for the variable",
            "default": ""
          },
          "options": {
            "type": "array",
            "description": "Options for select type variables",
            "items": {
              "type": "string"
            }
          },
          "validation": {
            "type": "object",
            "description": "Validation rules for the variable",
            "properties": {
              "min": {"type": "number"},
              "max": {"type": "number"},
              "pattern": {"type": "string"},
              "message": {"type": "string"}
            }
          }
        }
      }
    },
    "outputFormat": {
      "type": "string",
      "description": "Expected output format",
      "enum": ["markdown", "html", "json", "plain"],
      "default": "markdown"
    },
    "sections": {
      "type": "array",
      "description": "Expected sections in the output (for UI hints)",
      "items": {
        "type": "object",
        "required": ["title", "key"],
        "properties": {
          "title": {
            "type": "string",
            "description": "Section title"
          },
          "key": {
            "type": "string",
            "description": "Section identifier"
          },
          "required": {
            "type": "boolean",
            "description": "Whether this section is required",
            "default": true
          },
          "description": {
            "type": "string",
            "description": "Description of what this section should contain"
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "description": "Additional metadata about the template",
      "properties": {
        "author": {
          "type": "string",
          "description": "Template author"
        },
        "createdAt": {
          "type": "string",
          "format": "date-time",
          "description": "When the template was created"
        },
        "updatedAt": {
          "type": "string",
          "format": "date-time",
          "description": "When the template was last updated"
        },
        "tags": {
          "type": "array",
          "description": "Tags for searchability",
          "items": {
            "type": "string"
          }
        },
        "isDefault": {
          "type": "boolean",
          "description": "Whether this is a system default template",
          "default": false
        },
        "minimumTranscriptLength": {
          "type": "number",
          "description": "Minimum transcript length required",
          "default": 50
        },
        "estimatedTokens": {
          "type": "number",
          "description": "Estimated tokens this template will use"
        },
        "language": {
          "type": "string",
          "description": "Primary language for this template",
          "default": "en"
        }
      }
    },
    "examples": {
      "type": "array",
      "description": "Example inputs and outputs for this template",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "description": {"type": "string"},
          "variables": {"type": "object"},
          "sampleTranscript": {"type": "string"},
          "expectedOutput": {"type": "string"}
        }
      }
    }
  },
  "additionalProperties": false
}
```

# templates/examples/custom-template-example.json

```json
{
  "name": "Custom Research Report",
  "description": "Comprehensive research report with customizable sections and analysis depth",
  "category": "Custom",
  "version": "1.2.0",
  "icon": "🔬",
  "prompt": "You are a professional research analyst. Create a comprehensive research report based on the following transcript and parameters.\n\nResearch Parameters:\n- Topic: {{researchTopic}}\n- Analysis Depth: {{analysisDepth}}\n- Target Audience: {{targetAudience}}\n- Report Date: {{reportDate}}\n- Researcher: {{researcherName}}\n\n{{#if focusAreas}}\nSpecific Focus Areas: {{focusAreas}}\n{{/if}}\n\nTranscript Content:\n{{transcript}}\n\n{{#if additionalSources}}\nAdditional Sources:\n{{additionalSources}}\n{{/if}}\n\nPlease generate a research report with the following structure:\n1. Executive Summary\n2. Research Methodology\n3. Key Findings\n4. Data Analysis\n5. Insights and Patterns\n6. Recommendations\n7. Limitations and Future Research\n8. Conclusion\n\nAdjust the depth and technical complexity based on the specified analysis depth and target audience.",
  "variables": [
    {
      "name": "researchTopic",
      "type": "text",
      "label": "Research Topic",
      "placeholder": "Main topic or subject of research",
      "required": true
    },
    {
      "name": "analysisDepth",
      "type": "select",
      "label": "Analysis Depth",
      "required": true,
      "default": "medium",
      "options": ["shallow", "medium", "deep", "comprehensive"]
    },
    {
      "name": "targetAudience",
      "type": "select",
      "label": "Target Audience",
      "required": true,
      "default": "general",
      "options": ["general", "academic", "executive", "technical", "public"]
    },
    {
      "name": "reportDate",
      "type": "date",
      "label": "Report Date",
      "required": true
    },
    {
      "name": "researcherName",
      "type": "text",
      "label": "Researcher Name",
      "placeholder": "Name of the researcher or team",
      "required": false,
      "default": "Research Team"
    },
    {
      "name": "focusAreas",
      "type": "textarea",
      "label": "Specific Focus Areas",
      "placeholder": "List specific areas to focus on (optional)",
      "required": false
    },
    {
      "name": "additionalSources",
      "type": "textarea",
      "label": "Additional Sources",
      "placeholder": "List any additional sources or references (optional)",
      "required": false
    }
  ],
  "outputFormat": "markdown",
  "sections": [
    {
      "title": "Executive Summary",
      "key": "execSummary",
      "required": true,
      "description": "High-level overview of findings"
    },
    {
      "title": "Research Methodology",
      "key": "methodology",
      "required": true,
      "description": "How the research was conducted"
    },
    {
      "title": "Key Findings",
      "key": "findings",
      "required": true,
      "description": "Main discoveries and results"
    },
    {
      "title": "Data Analysis",
      "key": "analysis",
      "required": true,
      "description": "Detailed analysis of the data"
    },
    {
      "title": "Insights and Patterns",
      "key": "insights",
      "required": true,
      "description": "Patterns and insights discovered"
    },
    {
      "title": "Recommendations",
      "key": "recommendations",
      "required": true,
      "description": "Actionable recommendations"
    },
    {
      "title": "Limitations",
      "key": "limitations",
      "required": false,
      "description": "Research limitations and future work"
    },
    {
      "title": "Conclusion",
      "key": "conclusion",
      "required": true,
      "description": "Summary and final thoughts"
    }
  ],
  "metadata": {
    "author": "Template Creator",
    "createdAt": "2024-01-15T10:30:00Z",
    "tags": ["research", "analysis", "custom", "comprehensive"],
    "isDefault": false,
    "minimumTranscriptLength": 200,
    "estimatedTokens": 800,
    "language": "en"
  },
  "examples": [
    {
      "name": "Market Research Example",
      "description": "Example for market research analysis",
      "variables": {
        "researchTopic": "Consumer Behavior in E-commerce",
        "analysisDepth": "comprehensive",
        "targetAudience": "executive",
        "reportDate": "2024-01-15",
        "researcherName": "Dr. Sarah Johnson",
        "focusAreas": "Purchase patterns, mobile usage, seasonal trends",
        "additionalSources": "Industry reports from Statista, Nielsen data"
      },
      "sampleTranscript": "During our focus group session, participants discussed their online shopping habits. Most mentioned preferring mobile apps for quick purchases but using desktop for research. Seasonal shopping peaks were noted around holidays...",
      "expectedOutput": "# Market Research Report: Consumer Behavior in E-commerce\n\n## Executive Summary\nThis comprehensive analysis reveals key insights into consumer behavior patterns in e-commerce...\n\n..."
    }
  ]
}
```

# templates/examples/meeting-minutes-example.json

```json
{
  "name": "Meeting Minutes",
  "description": "Professional meeting minutes with action items and decisions",
  "category": "Business",
  "version": "1.0.0",
  "icon": "💼",
  "prompt": "You are a professional meeting secretary. Analyze the following transcript and create structured meeting minutes.\n\nMeeting Details:\n- Date: {{meetingDate}}\n- Attendees: {{attendees}}\n- Meeting Type: {{meetingType}}\n\nTranscript:\n{{transcript}}\n\n{{#if additionalContext}}\nAdditional Context: {{additionalContext}}\n{{/if}}\n\nPlease generate meeting minutes with the following sections:\n1. Meeting Summary (2-3 sentences)\n2. Key Discussion Points (bullet points)\n3. Decisions Made (with context and impact)\n4. Action Items (with assignees and deadlines if mentioned)\n5. Next Steps\n\nFormat the output in clean markdown with clear headers and formatting.",
  "variables": [
    {
      "name": "meetingDate",
      "type": "date",
      "label": "Meeting Date",
      "required": true,
      "default": ""
    },
    {
      "name": "attendees",
      "type": "textarea",
      "label": "Attendees",
      "placeholder": "List meeting attendees (one per line or comma-separated)",
      "required": false,
      "default": ""
    },
    {
      "name": "meetingType",
      "type": "select",
      "label": "Meeting Type",
      "required": true,
      "default": "regular",
      "options": ["regular", "standup", "planning", "retrospective", "strategy", "client", "all-hands"]
    },
    {
      "name": "additionalContext",
      "type": "textarea",
      "label": "Additional Context",
      "placeholder": "Any additional context about the meeting (optional)",
      "required": false,
      "default": ""
    }
  ],
  "outputFormat": "markdown",
  "sections": [
    {
      "title": "Meeting Summary",
      "key": "summary",
      "required": true,
      "description": "Brief 2-3 sentence overview of the meeting"
    },
    {
      "title": "Key Discussion Points",
      "key": "keyPoints",
      "required": true,
      "description": "Main topics discussed in bullet point format"
    },
    {
      "title": "Decisions Made",
      "key": "decisions",
      "required": true,
      "description": "Important decisions with context and impact"
    },
    {
      "title": "Action Items",
      "key": "actionItems",
      "required": true,
      "description": "Tasks assigned with owners and deadlines"
    },
    {
      "title": "Next Steps",
      "key": "nextSteps",
      "required": false,
      "description": "Planned follow-up actions"
    }
  ],
  "metadata": {
    "author": "Auracle System",
    "createdAt": "2024-01-01T00:00:00Z",
    "tags": ["meeting", "business", "minutes", "corporate"],
    "isDefault": true,
    "minimumTranscriptLength": 100,
    "estimatedTokens": 500,
    "language": "en"
  },
  "examples": [
    {
      "name": "Weekly Team Meeting",
      "description": "Example of a weekly team standup meeting",
      "variables": {
        "meetingDate": "2024-01-15",
        "attendees": "John Smith, Jane Doe, Mike Johnson",
        "meetingType": "standup",
        "additionalContext": "Weekly team sync to discuss progress and blockers"
      },
      "sampleTranscript": "Good morning everyone. Let's start with John's updates. John mentioned completing the user authentication feature and working on the database integration next. Jane reported finishing the UI mockups and starting frontend implementation. Mike discussed resolving the deployment pipeline issues and planning the next sprint.",
      "expectedOutput": "# Meeting Minutes\n\n## Meeting Summary\nWeekly team standup focused on project progress updates and next sprint planning.\n\n## Key Discussion Points\n- User authentication feature completion\n- UI mockup finalization\n- Deployment pipeline fixes\n\n..."
    }
  ]
}
```

# templates/examples/mongodb-design-review-example.json

```json
{
  "name": "MongoDB Design Review Report",
  "description": "Expert MongoDB schema and data model review with actionable recommendations and references.",
  "category": "Technology",
  "version": "1.0.0",
  "icon": "🍃",
  "prompt": "You are a world-class MongoDB Design Review Assistant. Your job is to review MongoDB data models and schemas, offering actionable feedback and recommendations that align with MongoDB’s best practices.\n\nWhen you begin, always check if the following context is present in the transcript or provided variables. If not, politely prompt for it in your executive summary:\n- Application or business use case overview\n- MongoDB schema(s) and collection structure (ERD or summary)\n- List of common/important queries and update patterns (access patterns)\n- Information about scale (document counts, growth, read/write/query velocities)\n- Any non-obvious business or compliance requirements\n\nTranscript:\n{{transcript}}\n\n{{#if additionalContext}}\nAdditional Context: {{additionalContext}}\n{{/if}}\n\nPlease generate a MongoDB Design Review Report in the following format:\n\n1. Executive Summary\n   - Briefly summarize the review and, if any required context is missing, list what is needed for a more thorough review.\n\n2. What We Heard\n   - Echo back the main discussion topics and customer concerns in clear, simple language.\n   - Summarize the application’s goals and context as understood from the transcript.\n\n3. Issues\n   - Identify issues, antipatterns, or pain points revealed in the transcript.\n   - Explicitly call out patterns that are suboptimal in MongoDB (e.g., overuse of $lookup, unnecessary normalization, large unbounded arrays, excessive collections, etc.).\n   - Flag any risks to scalability, performance, or maintainability.\n\n4. Recommendations\n   - Give direct, prioritized recommendations using MongoDB schema and data modeling best practices.\n   - For each issue, explain why the recommendation is optimal for MongoDB.\n   - Provide improved schema examples or patterns where appropriate.\n   - Prefer embedding, denormalization, and designing around the queries unless there’s a strong reason not to.\n   - Suggest indexing, sharding, data partitioning, or advanced features if relevant (e.g., change streams, schema validation, TTL indexes).\n\n5. References\n   - List official MongoDB documentation links that back up your recommendations.\n   - Link to specific pages, not just the main docs.\n   - Example links:\n     - https://www.mongodb.com/docs/manual/core/data-modeling-introduction/\n     - https://www.mongodb.com/docs/manual/core/schema-design-best-practices/\n     - https://www.mongodb.com/docs/manual/core/aggregation-pipeline/\n     - https://www.mongodb.com/docs/manual/core/indexes/\n     - https://www.mongodb.com/docs/manual/core/sharding/\n     - https://www.mongodb.com/docs/manual/core/changeStreams/\n\nFormat the output in clean markdown with clear headers and formatting. Communicate in a way that’s clear for technical audiences but easy to digest. Do not recommend relational/SQL features or approaches. Do not speculate or make assumptions without first asking clarifying questions.",
  "variables": [
    {
      "name": "additionalContext",
      "type": "textarea",
      "label": "Additional Context",
      "placeholder": "Any additional context about the design review (optional)",
      "required": false,
      "default": ""
    }
  ],
  "outputFormat": "markdown",
  "sections": [
    {
      "title": "Executive Summary",
      "key": "execSummary",
      "required": true,
      "description": "Brief summary of the review and any missing context needed for a more thorough review."
    },
    {
      "title": "What We Heard",
      "key": "whatWeHeard",
      "required": true,
      "description": "Main discussion topics, customer concerns, and application context."
    },
    {
      "title": "Issues",
      "key": "issues",
      "required": true,
      "description": "Identified issues, antipatterns, and risks for MongoDB."
    },
    {
      "title": "Recommendations",
      "key": "recommendations",
      "required": true,
      "description": "Actionable, prioritized recommendations with explanations and schema examples."
    },
    {
      "title": "References",
      "key": "references",
      "required": true,
      "description": "Official MongoDB documentation links supporting the recommendations."
    }
  ],
  "metadata": {
    "author": "Auracle System",
    "createdAt": "2024-06-01T00:00:00Z",
    "tags": ["mongodb", "design review", "schema", "data modeling", "technology"],
    "isDefault": true,
    "minimumTranscriptLength": 100,
    "estimatedTokens": 700,
    "language": "en"
  },
  "examples": [
    {
      "name": "Sample MongoDB Design Review",
      "description": "Example review for a SaaS project management app.",
      "variables": {
        "additionalContext": "The app is a multi-tenant SaaS for project management. Each customer has their own set of projects, tasks, and users."
      },
      "sampleTranscript": "We currently have a 'users' collection, a 'projects' collection, and a 'tasks' collection. Each task references a projectId and an assigned userId. We use $lookup to join tasks with users for reporting. The largest collection is 'tasks' with about 2 million documents. We expect this to grow by 10% per month. Some customers want to keep deleted tasks for audit purposes. We sometimes see slow queries when filtering tasks by project and status.",
      "expectedOutput": "# MongoDB Design Review Report\n\n## Executive Summary\nThis review analyzes the current MongoDB schema for a multi-tenant SaaS project management app. For a more thorough review, please provide: a sample ERD, typical query patterns, and any compliance requirements.\n\n## What We Heard\n- The application manages users, projects, and tasks for multiple customers.\n- Tasks reference projects and users.\n- $lookup is used for reporting.\n- Task collection is large and growing.\n- Some customers require audit trails.\n- Occasional slow queries on tasks.\n\n## Issues\n- Frequent use of $lookup for reporting may impact performance at scale.\n- Large, unbounded 'tasks' collection could lead to index bloat and slow queries.\n- No mention of schema validation or TTL for audit data.\n\n## Recommendations\n- Consider embedding user/project info in tasks for common queries to reduce $lookup usage.\n- Use schema validation to enforce document structure.\n- Implement TTL indexes for audit data if appropriate.\n- Review and optimize indexes for frequent queries (e.g., projectId + status).\n- Monitor collection size and consider sharding if growth continues.\n\n## References\n- [Data Modeling Introduction](https://www.mongodb.com/docs/manual/core/data-modeling-introduction/)\n- [Schema Design Best Practices](https://www.mongodb.com/docs/manual/core/schema-design-best-practices/)\n- [Aggregation Pipeline](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)\n- [Indexes](https://www.mongodb.com/docs/manual/core/indexes/)\n- [Sharding](https://www.mongodb.com/docs/manual/core/sharding/)\n- [Change Streams](https://www.mongodb.com/docs/manual/core/changeStreams/)\n"
    }
  ]
} 
```

# webpack.config.js

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './app/renderer/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/renderer/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'build/icon.png', to: 'build/icon.png' }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
```

