// Local Storage
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// Use Electron's app data directory for production
const getDataDir = () => {
  if (app && app.getPath) {
    // Production: use user data directory
    return path.join(app.getPath('userData'), 'sessions');
  } else {
    // Fallback for when app is not available (e.g., in tests)
    return path.join(__dirname, '../../data');
  }
};

const dataDir = getDataDir();
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
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