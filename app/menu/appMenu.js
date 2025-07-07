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