const { app, BrowserWindow, ipcMain, powerSaveBlocker, dialog } = require('electron');

// 🚨 EMERGENCY: Increase memory limit for stability but add monitoring
app.commandLine.appendSwitch('max-old-space-size', '2048'); // Increase to 2GB for stability
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=2048 --expose-gc --optimize-for-size');

// Import emergency debugging system
const EmergencyDebugger = require('../debug-emergency');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
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
ipcMain.on('start-transcription', async (event) => {
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
  
  // Get audio device from settings
  const config = loadConfig();
  const audioDevice = config?.audioDevice;
  
  whisperProc = await stt.startTranscription((data) => {
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
  }, audioDevice);
  
});

// IPC: Process uploaded transcript
ipcMain.on('process-transcript', (event, transcriptContent) => {
  console.log('📄 Processing uploaded transcript:', transcriptContent.length, 'characters');
  
  // Add to processor for topic extraction and insights
  processor.addTranscript(transcriptContent);
  
  // Create a mock session for the uploaded transcript
  if (!currentSession) {
    currentSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      transcript: [transcriptContent],
      topics: [],
      research: []
    };
  } else {
    currentSession.transcript.push(transcriptContent);
  }
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

// Audio Device IPC Handler
ipcMain.handle('get-audio-devices', async () => {
  try {
    // Execute ffmpeg to get device list
    const output = execSync('ffmpeg -f avfoundation -list_devices true -i ""', { encoding: 'utf8' });
    return { success: true, devices: [] }; // ffmpeg lists devices in stderr
  } catch (error) {
    // FFmpeg lists devices in stderr when it "fails"
    const stderr = error.stderr || '';
    const devices = [];
    
    // Parse audio devices from stderr
    const lines = stderr.split('\n');
    let inAudioSection = false;
    
    for (const line of lines) {
      if (line.includes('AVFoundation audio devices:')) {
        inAudioSection = true;
        continue;
      }
      if (inAudioSection && line.includes('[') && line.includes(']')) {
        const match = line.match(/\[(\d+)\]\s+(.+)/);
        if (match) {
          devices.push({
            index: parseInt(match[1]),
            name: match[2].trim()
          });
        }
      }
    }
    
    return { success: true, devices };
  }
});

// File Upload IPC Handlers
ipcMain.handle('upload-audio-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select Audio File',
      filters: [
        { name: 'Audio Files', extensions: ['mp3', 'wav', 'mp4', 'm4a', 'ogg', 'flac'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    const filePath = result.filePaths[0];
    console.log('Selected audio file:', filePath);
    
    // TODO: Process the audio file with whisper
    return { success: true, filePath };
  } catch (error) {
    console.error('Error selecting audio file:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('upload-transcript-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Select Transcript File',
      filters: [
        { name: 'Text Files', extensions: ['txt', 'md', 'rtf'] },
        { name: 'Document Files', extensions: ['docx', 'pdf'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (result.canceled) {
      return { success: false, canceled: true };
    }

    const filePath = result.filePaths[0];
    console.log('Selected transcript file:', filePath);
    
    // Read and return file content
    const content = fs.readFileSync(filePath, 'utf8');
    return { success: true, filePath, content };
  } catch (error) {
    console.error('Error reading transcript file:', error);
    return { success: false, error: error.message };
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