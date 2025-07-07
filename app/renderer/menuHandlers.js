// Menu event handlers for the renderer process

export function setupMenuHandlers() {
  // File menu handlers
  window.electronAPI.on('new-session', () => {
    if (confirm('Start a new session? Current session will be saved.')) {
      window.dispatchEvent(new CustomEvent('new-session'));
    }
  });

  window.electronAPI.on('save-session', () => {
    window.dispatchEvent(new CustomEvent('save-session'));
  });

  window.electronAPI.on('save-session-as', () => {
    window.dispatchEvent(new CustomEvent('save-session-as'));
  });

  window.electronAPI.on('open-session', () => {
    window.dispatchEvent(new CustomEvent('open-session'));
  });

  window.electronAPI.on('export-markdown', () => {
    window.dispatchEvent(new CustomEvent('export-markdown'));
  });

  window.electronAPI.on('export-pdf', () => {
    window.dispatchEvent(new CustomEvent('export-pdf'));
  });

  window.electronAPI.on('export-docx', () => {
    window.dispatchEvent(new CustomEvent('export-docx'));
  });

  window.electronAPI.on('export-transcript', () => {
    window.dispatchEvent(new CustomEvent('export-transcript'));
  });

  // Edit menu handlers
  window.electronAPI.on('show-find', () => {
    window.dispatchEvent(new CustomEvent('show-find'));
  });

  window.electronAPI.on('edit-transcript', () => {
    window.dispatchEvent(new CustomEvent('edit-transcript'));
  });

  window.electronAPI.on('add-note', () => {
    window.dispatchEvent(new CustomEvent('add-note'));
  });

  window.electronAPI.on('add-timestamp', () => {
    window.dispatchEvent(new CustomEvent('add-timestamp'));
  });

  // View menu handlers
  window.electronAPI.on('toggle-recording-controls', () => {
    window.dispatchEvent(new CustomEvent('toggle-recording-controls'));
  });

  window.electronAPI.on('toggle-live-transcript', () => {
    window.dispatchEvent(new CustomEvent('toggle-live-transcript'));
  });

  window.electronAPI.on('toggle-insights', () => {
    window.dispatchEvent(new CustomEvent('toggle-insights'));
  });

  window.electronAPI.on('toggle-captions', () => {
    window.dispatchEvent(new CustomEvent('toggle-captions'));
  });

  window.electronAPI.on('show-debug-info', () => {
    window.dispatchEvent(new CustomEvent('show-debug-info'));
  });

  // Tools menu handlers
  window.electronAPI.on('generate-report', () => {
    window.dispatchEvent(new CustomEvent('generate-report'));
  });

  window.electronAPI.on('analyze-patterns', () => {
    window.dispatchEvent(new CustomEvent('analyze-patterns'));
  });

  window.electronAPI.on('check-best-practices', () => {
    window.dispatchEvent(new CustomEvent('check-best-practices'));
  });

  window.electronAPI.on('analyze-schema', () => {
    window.dispatchEvent(new CustomEvent('analyze-schema'));
  });

  window.electronAPI.on('test-ai-connection', () => {
    window.dispatchEvent(new CustomEvent('test-ai-connection'));
  });

  // Help menu handlers
  window.electronAPI.on('show-keyboard-shortcuts', () => {
    window.dispatchEvent(new CustomEvent('show-keyboard-shortcuts'));
  });

  window.electronAPI.on('show-about', () => {
    window.dispatchEvent(new CustomEvent('show-about'));
  });

  window.electronAPI.on('start-tutorial', () => {
    window.dispatchEvent(new CustomEvent('start-tutorial'));
  });

  // Context menu handlers
  window.electronAPI.on('analyze-as-schema', (data) => {
    window.dispatchEvent(new CustomEvent('analyze-as-schema', { detail: data }));
  });

  window.electronAPI.on('analyze-as-query', (data) => {
    window.dispatchEvent(new CustomEvent('analyze-as-query', { detail: data }));
  });

  window.electronAPI.on('research-topic', (data) => {
    window.dispatchEvent(new CustomEvent('research-topic', { detail: data }));
  });

  window.electronAPI.on('add-to-notes', (data) => {
    window.dispatchEvent(new CustomEvent('add-to-notes', { detail: data }));
  });

  window.electronAPI.on('create-action-item', (data) => {
    window.dispatchEvent(new CustomEvent('create-action-item', { detail: data }));
  });

  window.electronAPI.on('add-note-at-position', (data) => {
    window.dispatchEvent(new CustomEvent('add-note-at-position', { detail: data }));
  });

  window.electronAPI.on('insert-timestamp', () => {
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