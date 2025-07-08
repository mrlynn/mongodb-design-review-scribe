#!/usr/bin/env node

// Simple test script to verify speaker detection logic
const path = require('path');
const fs = require('fs');

// Simulate the paths from our STT service
const DIARIZATION_MODEL_PATHS = [
  path.join(__dirname, 'whisper.cpp/models/ggml-base.en-tdrz.bin'),
  path.join(__dirname, 'whisper.cpp/models/ggml-small.en-tdrz.bin')
];

const MODEL_PATHS = [
  path.join(__dirname, 'whisper.cpp/models/ggml-base.en.bin')
];

function findModelPath(useDiarization = false) {
  const pathsToSearch = useDiarization ? DIARIZATION_MODEL_PATHS : MODEL_PATHS;
  console.log(`\n🔍 Searching for ${useDiarization ? 'diarization' : 'standard'} model...`);
  
  for (const modelPath of pathsToSearch) {
    console.log(`  Checking: ${modelPath}`);
    try {
      fs.accessSync(modelPath);
      console.log(`  ✅ Found: ${modelPath}`);
      return modelPath;
    } catch (e) {
      console.log(`  ❌ Not found: ${modelPath}`);
    }
  }
  
  // If diarization model not found, fall back to regular model
  if (useDiarization) {
    console.log('\n⚠️  Diarization model not found, falling back to regular model');
    return findModelPath(false);
  }
  
  console.log('\n❌ No models found!');
  return null;
}

// Test the model detection logic
console.log('🧪 Testing Speaker Detection Model Logic\n');

console.log('Test 1: Standard model detection');
const standardModel = findModelPath(false);
console.log(`Result: ${standardModel ? 'SUCCESS' : 'FAILED'}`);

console.log('\nTest 2: Diarization model detection (should fallback)');
const diarizationModel = findModelPath(true);
console.log(`Result: ${diarizationModel ? 'SUCCESS (with fallback)' : 'FAILED'}`);

// Test speaker parsing logic
console.log('\n🧪 Testing Speaker Line Parsing\n');

function parseSpeakerLine(line, enableSpeakerDetection = false) {
  if (!line || typeof line !== 'string') {
    return null;
  }
  
  // Simplified version of our parsing logic
  if (enableSpeakerDetection) {
    const speakerMatch = line.match(/(?:\[.*?\]\s*)?\[SPEAKER_(\d+)\]\s*(.+)/) || 
                        line.match(/SPEAKER_(\d+):\s*(.+)/) ||
                        line.match(/\[(\d+)\]\s*(.+)/);
    
    if (speakerMatch) {
      const speakerNum = parseInt(speakerMatch[1]) + 1;
      const text = speakerMatch[2].trim();
      
      return {
        speaker: `Speaker ${speakerNum}`,
        text: text,
        hasSpeaker: true
      };
    }
    
    // Default to Speaker 1 if no label found
    return {
      speaker: 'Speaker 1',
      text: line.trim(),
      hasSpeaker: true
    };
  }
  
  // Regular processing without speaker labels
  return {
    speaker: null,
    text: line.trim(),
    hasSpeaker: false
  };
}

// Test cases
const testLines = [
  '[SPEAKER_00] Hello there, how are you?',
  'SPEAKER_01: I am doing great, thanks!',
  '[0] This is another format',
  'Regular text without speaker label',
  '[00:00:01.000 --> 00:00:03.000] [SPEAKER_01] Hello with timestamp'
];

testLines.forEach((line, index) => {
  console.log(`Test line ${index + 1}: "${line}"`);
  
  const withoutDetection = parseSpeakerLine(line, false);
  const withDetection = parseSpeakerLine(line, true);
  
  console.log(`  Without detection: ${JSON.stringify(withoutDetection)}`);
  console.log(`  With detection:    ${JSON.stringify(withDetection)}`);
  console.log('');
});

console.log('✅ Speaker detection tests completed!');