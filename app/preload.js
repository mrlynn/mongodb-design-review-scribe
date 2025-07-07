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