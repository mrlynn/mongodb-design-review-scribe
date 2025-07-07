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