// First run setup utilities
const fs = require('fs');
const path = require('path');
const { app, dialog } = require('electron');

function getAppDataPath() {
  return app ? app.getPath('userData') : path.join(require('os').homedir(), '.bitscribe');
}

function isFirstRun() {
  const setupFile = path.join(getAppDataPath(), '.setup-complete');
  return !fs.existsSync(setupFile);
}

function markSetupComplete() {
  const appDataPath = getAppDataPath();
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
  }
  
  const setupFile = path.join(appDataPath, '.setup-complete');
  fs.writeFileSync(setupFile, JSON.stringify({
    setupDate: new Date().toISOString(),
    version: require('../../package.json').version
  }));
}

async function showFirstRunDialog(mainWindow) {
  if (!mainWindow) return;
  
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Welcome to Bitscribe',
    message: 'Welcome to Bitscribe!',
    detail: 'This appears to be your first time running Bitscribe. The app will now set up your data directories and check for required components.',
    buttons: ['Continue', 'Learn More'],
    defaultId: 0
  });
  
  if (result.response === 1) {
    // Show help or documentation
    require('electron').shell.openExternal('https://github.com/mongodb/bitscribe');
  }
  
  markSetupComplete();
}

module.exports = {
  isFirstRun,
  markSetupComplete,
  showFirstRunDialog
};