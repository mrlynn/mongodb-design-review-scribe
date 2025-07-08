// AfterPack script to ensure binaries are executable
const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  console.log('Running afterPack script...');
  
  const { appOutDir, electronPlatformName } = context;
  
  if (electronPlatformName === 'darwin' || electronPlatformName === 'linux') {
    const resourcesPath = path.join(appOutDir, 'bitscribe.app', 'Contents', 'Resources');
    const binPath = path.join(resourcesPath, 'bin');
    
    if (fs.existsSync(binPath)) {
      console.log('Making binaries executable:', binPath);
      
      const binaries = ['whisper-cli', 'main', 'whisper'];
      
      for (const binary of binaries) {
        const binaryPath = path.join(binPath, binary);
        if (fs.existsSync(binaryPath)) {
          console.log('Setting executable permissions for:', binaryPath);
          fs.chmodSync(binaryPath, 0o755);
        }
      }
    }
  }
  
  console.log('afterPack script completed');
};