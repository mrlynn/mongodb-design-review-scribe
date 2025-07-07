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