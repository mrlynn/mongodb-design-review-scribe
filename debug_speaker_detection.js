// Debug script to check speaker detection configuration
const { loadConfig, saveConfig } = require('./app/config');

console.log('🔍 Debugging Speaker Detection Configuration\n');

// Check current config
try {
  const config = loadConfig();
  console.log('📋 Current Configuration:');
  console.log(JSON.stringify(config, null, 2));
  
  // Check specifically for speakerDetection setting
  console.log('\n🎯 Speaker Detection Status:');
  console.log(`speakerDetection: ${config?.speakerDetection || 'undefined'}`);
  console.log(`audioDevice: ${config?.audioDevice || 'undefined'}`);
  
  // Test setting speaker detection to true
  console.log('\n✍️ Testing configuration update...');
  const updatedConfig = {
    ...config,
    speakerDetection: true
  };
  
  saveConfig(updatedConfig);
  console.log('✅ Successfully set speakerDetection to true');
  
  // Verify it was saved
  const verifyConfig = loadConfig();
  console.log('\n🔍 Verification:');
  console.log(`speakerDetection after save: ${verifyConfig?.speakerDetection}`);
  
} catch (error) {
  console.error('❌ Error loading/saving config:', error);
}

console.log('\n🎭 Manual Test Instructions:');
console.log('1. Start Bitscribe app');
console.log('2. Open Settings → General');
console.log('3. Look for "Speaker Detection" toggle');
console.log('4. Toggle it ON');
console.log('5. Start recording');
console.log('6. Look for purple "👥 Speakers" chip');
console.log('7. Check transcript view for colored speaker chips');

console.log('\n🔧 If speaker detection toggle is missing:');
console.log('- Check that the ListItem is visible in Settings');
console.log('- Verify no React errors in console');
console.log('- Check that the toggle responds to clicks');