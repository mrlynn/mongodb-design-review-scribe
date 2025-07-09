// Speech-to-Text Service (whisper.cpp integration)
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Parse speaker-labeled output from whisper with diarization
// Global speaker tracking for tinydiarize format
let currentSpeaker = 1;

function parseSpeakerLine(line, enableSpeakerDetection = false) {
  console.log(`parseSpeakerLine input: "${line}", enableSpeakerDetection: ${enableSpeakerDetection}`);
  
  if (!line || typeof line !== 'string') {
    return null;
  }
  
  // If speaker detection is enabled, look for speaker labels
  if (enableSpeakerDetection) {
    // Check for [SPEAKER_TURN] marker which indicates speaker change
    if (line.includes('[SPEAKER_TURN]') || line.includes('[SPEAKER TURN]')) {
      // Speaker change detected - increment speaker number
      currentSpeaker += 1;
      console.log(`parseSpeakerLine: Speaker change detected, now on Speaker ${currentSpeaker}`);
      
      // Extract text without the speaker turn marker
      const text = line
        .replace(/\[SPEAKER_TURN\]/g, '')
        .replace(/\[SPEAKER TURN\]/g, '')
        .replace(/\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]/g, '') // Remove timestamps
        .trim();
      
      const cleaned = cleanTranscriptText(text);
      if (cleaned) {
        console.log(`parseSpeakerLine: Speaker change with text: Speaker ${currentSpeaker}: "${cleaned}"`);
        return {
          speaker: `Speaker ${currentSpeaker}`,
          text: cleaned,
          hasSpeaker: true
        };
      }
    }
    
    // Look for traditional speaker patterns as fallback
    const speakerMatch = line.match(/(?:\[.*?\]\s*)?\[SPEAKER_(\d+)\]\s*(.+)/) || 
                        line.match(/SPEAKER_(\d+):\s*(.+)/) ||
                        line.match(/\[(\d+)\]\s*(.+)/);
    
    if (speakerMatch) {
      const speakerNum = parseInt(speakerMatch[1]) + 1; // Convert 0-based to 1-based
      const text = speakerMatch[2].trim();
      const cleaned = cleanTranscriptText(text);
      
      if (cleaned) {
        currentSpeaker = speakerNum; // Update current speaker
        console.log(`parseSpeakerLine: Found explicit speaker ${speakerNum}: "${cleaned}"`);
        return {
          speaker: `Speaker ${speakerNum}`,
          text: cleaned,
          hasSpeaker: true
        };
      }
    }
    
    // If no speaker marker found, use current speaker
    const text = line.replace(/\[\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\]/g, '').trim();
    const cleaned = cleanTranscriptText(text);
    if (cleaned) {
      console.log(`parseSpeakerLine: Continuing with Speaker ${currentSpeaker}: "${cleaned}"`);
      return {
        speaker: `Speaker ${currentSpeaker}`,
        text: cleaned,
        hasSpeaker: true
      };
    }
  }
  
  // Fall back to regular processing without speaker labels
  const cleaned = cleanTranscriptText(line);
  if (cleaned) {
    return {
      speaker: null,
      text: cleaned,
      hasSpeaker: false
    };
  }
  
  return null;
}

// Clean up transcript text
function cleanTranscriptText(line) {
  console.log(`cleanTranscriptText input: "${line}"`);
  
  if (!line) {
    console.log('cleanTranscriptText: line is null/undefined');
    return null;
  }
  
  // Filter out noise and repetitive content
  const filters = [
    /^\[BLANK_AUDIO\]$/,
    /^\[INAUDIBLE\]$/,
    /^\s*\[BLANK_AUDIO\]\s*$/,
    /^\s*\(.*\)\s*$/,  // Remove lines that are only sound effects like (sighs), (coughing)
    /^\s*-\s*$/,       // Remove lines that are just dashes
    /^thanks for watching\.?$/i,  // Remove common video outros
    /^\s*\[\\d+K\s*$/,  // Remove lines that are just terminal control codes
    /^\s*\x1b\[.*$/,   // Remove lines starting with ANSI escape sequences
    /^\s*$/, // Empty lines
    /^(you[\s\.\,\!\?]+)+$/i,  // Filter out repeated "you" patterns
    /^(you you|you, you|you\. you)+/i,  // Filter variations of repeated "you"
    /^\s*you\s*$/i,  // Filter single "you" on a line
  ];
  
  // Check if line matches any filter
  for (const filter of filters) {
    if (filter.test(line)) {
      console.log(`cleanTranscriptText: filtered by pattern ${filter}`);
      return null;
    }
  }
  
  // Remove repetitive patterns (same phrase repeated multiple times)
  const words = line.split(' ');
  if (words.length > 4) {
    const firstWord = words[0].toLowerCase();
    const repetitions = words.filter(word => word.toLowerCase() === firstWord).length;
    if (repetitions > words.length / 2) {
      return null; // Likely repetitive noise
    }
  }
  
  // Special handling for the "you" bug
  const lowerLine = line.toLowerCase();
  const youCount = (lowerLine.match(/\byou\b/g) || []).length;
  const totalWords = words.filter(w => w.length > 0).length;
  
  // If "you" makes up more than 50% of the words, it's likely the bug
  if (youCount > 0 && totalWords > 0 && (youCount / totalWords) > 0.5) {
    console.log(`cleanTranscriptText: Filtered "you" bug - ${youCount} instances in ${totalWords} words`);
    return null;
  }
  
  // Clean up the line
  let cleaned = line
    .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '') // Remove ANSI escape sequences
    .replace(/\[\d+K/g, '')               // Remove specific terminal control codes like [2K
    .replace(/^\s*-\s*/, '')              // Remove leading dashes
    .replace(/\s+/g, ' ')                 // Normalize whitespace
    .trim();
    
  console.log(`cleanTranscriptText: after cleaning: "${cleaned}" (length: ${cleaned.length})`);
  
  // Only return if it has substantial content (temporarily relaxed for debugging)
  const result = cleaned.length > 1 ? cleaned : null;
  console.log(`cleanTranscriptText: final result: "${result}"`);
  return result;
}

// Path to whisper.cpp binary and model
const getResourcePath = () => {
  // In production, resources are in the app's resources folder
  if (process.resourcesPath) {
    return process.resourcesPath;
  }
  // In development
  return path.join(__dirname, '../..');
};

const resourcePath = getResourcePath();

const WHISPER_BIN_PATHS = [
  // Production paths (from extraResources)
  path.join(resourcePath, 'bin', 'whisper-cli'),
  path.join(resourcePath, 'bin', 'main'),
  path.join(resourcePath, 'bin', 'whisper'),
  // Development paths
  path.join(__dirname, '../../whisper.cpp/build/bin/whisper-cli'),
  path.join(__dirname, '../../whisper.cpp/build/bin/main'),
  path.join(__dirname, '../../whisper.cpp/build/bin/whisper-server'),
  path.join(__dirname, '../../whisper.cpp/stream'),
  path.join(__dirname, '../../whisper.cpp/main')
];

const MODEL_PATHS = [
  // Production paths
  path.join(resourcePath, 'models', 'ggml-base.en.bin'),
  // Development paths
  path.join(__dirname, '../../whisper.cpp/models/ggml-base.en.bin')
];

// Diarization model paths (for speaker detection)
const DIARIZATION_MODEL_PATHS = [
  // Production paths
  path.join(resourcePath, 'models', 'ggml-base.en-tdrz.bin'),
  path.join(resourcePath, 'models', 'ggml-small.en-tdrz.bin'),
  // Development paths
  path.join(__dirname, '../../whisper.cpp/models/ggml-base.en-tdrz.bin'),
  path.join(__dirname, '../../whisper.cpp/models/ggml-small.en-tdrz.bin')
];

function findModelPath(useDiarization = false) {
  const pathsToSearch = useDiarization ? DIARIZATION_MODEL_PATHS : MODEL_PATHS;
  
  for (const modelPath of pathsToSearch) {
    try {
      fs.accessSync(modelPath);
      return modelPath;
    } catch (e) {
      // Continue to next path
    }
  }
  
  // If diarization model not found, fall back to regular model
  if (useDiarization) {
    console.warn('STT: Diarization model not found, falling back to regular model');
    return findModelPath(false);
  }
  
  return null;
}

function findDiarizationModelPath() {
  for (const modelPath of DIARIZATION_MODEL_PATHS) {
    try {
      fs.accessSync(modelPath);
      return modelPath;
    } catch (e) {
      // Continue to next path
    }
  }
  return null;
}

function findWhisperBinary() {
  for (const binPath of WHISPER_BIN_PATHS) {
    try {
      fs.accessSync(binPath);
      return binPath;
    } catch (e) {
      // Continue to next path
    }
  }
  return null;
}

async function startTranscription(onTranscript, audioDeviceIndex = null, enableSpeakerDetection = false) {
  // Reset speaker counter for new session
  currentSpeaker = 1;
  
  // Check if whisper.cpp binary exists
  const WHISPER_BIN = findWhisperBinary();
  if (!WHISPER_BIN) {
    console.error('STT: No whisper binary found. Checked paths:', WHISPER_BIN_PATHS);
    onTranscript({ type: 'error', text: '[Error] whisper.cpp binary not found. Please run setup-whisper.sh to install whisper.cpp' });
    return null;
  }
  
  console.log('STT: Using whisper binary:', WHISPER_BIN);
  
  // Check if model exists (prefer diarization model if enabled)
  const MODEL_PATH = findModelPath(enableSpeakerDetection);
  if (!MODEL_PATH) {
    const modelType = enableSpeakerDetection ? 'diarization' : 'standard';
    console.error(`STT: ${modelType} model file not found. Checked paths:`, enableSpeakerDetection ? DIARIZATION_MODEL_PATHS : MODEL_PATHS);
    onTranscript({ type: 'error', text: `[Error] ${modelType} model file not found. Please ensure whisper model is installed.` });
    return null;
  }
  
  const isDiarizationModel = DIARIZATION_MODEL_PATHS.some(path => path === MODEL_PATH);
  if (enableSpeakerDetection && !isDiarizationModel) {
    console.warn('STT: Speaker detection requested but diarization model not available, using standard model');
    onTranscript({ type: 'system', text: '[Speaker detection unavailable, using standard transcription]' });
  } else if (enableSpeakerDetection && isDiarizationModel) {
    console.log('STT: Using diarization model for speaker detection');
    onTranscript({ type: 'system', text: '[Speaker detection enabled]' });
  }
  
  const modelStats = fs.statSync(MODEL_PATH);
  console.log('STT: Using model file:', MODEL_PATH, 'Size:', Math.round(modelStats.size / 1024 / 1024), 'MB');

  // Test whisper binary works
  try {
    console.log('STT: Testing whisper binary...');
    execSync(`"${WHISPER_BIN}" --help`, { encoding: 'utf8', timeout: 5000 });
    console.log('STT: Whisper binary test successful');
  } catch (e) {
    console.error('STT: Whisper binary test failed:', e.message);
    onTranscript({ type: 'error', text: '[Error] Whisper binary test failed. Check console for details.' });
    return null;
  }

  // Check if ffmpeg is installed for audio capture
  try {
    execSync('which ffmpeg');
  } catch (e) {
    onTranscript({ type: 'error', text: '[Error] ffmpeg not installed. Please install ffmpeg: brew install ffmpeg' });
    return null;
  }

  // List available audio devices for debugging
  try {
    const devices = execSync('ffmpeg -f avfoundation -list_devices true -i ""', { encoding: 'utf8' });
    console.log('STT: Available audio devices:', devices);
    onTranscript({ type: 'system', text: '[Checking available audio devices...]' });
  } catch (e) {
    console.log('STT: Device listing output:', e.stderr || e.stdout);
    // This is expected to "fail" but still shows devices in stderr
  }

  onTranscript({ type: 'system', text: '[Starting audio capture with ffmpeg...]' });

  // Create temporary directory for audio files
  const tempDir = path.join(os.tmpdir(), `whisper-audio-${Date.now()}`);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  console.log('STT: Created temp directory:', tempDir);

  let isRunning = true;

  // Start ffmpeg to capture audio from microphone for transcription
  // Use the selected audio device with fallback logic
  // Default to device 3 (MacBook Pro Microphone) as it was before
  let deviceIndex = audioDeviceIndex !== null ? audioDeviceIndex : 3;
  console.log(`STT: Audio device selection - input: ${audioDeviceIndex}, trying: ${deviceIndex}`);
  
  // Track if we're experiencing the "you" bug
  let youBugDetectionCount = 0;
  
  // Function to try different audio devices with fallback
  function tryStartFFmpeg(tryDeviceIndex) {
    console.log(`STT: Attempting to start FFmpeg with device ${tryDeviceIndex}`);
    
    const ffmpegArgs = [
      '-f', 'avfoundation',     // Use macOS audio foundation
      '-i', `:${tryDeviceIndex}`,  // Try specific device index
      '-ar', '16000',           // Sample rate 16kHz
      '-ac', '1',               // Mono
      '-acodec', 'pcm_s16le',   // 16-bit PCM
      '-f', 'segment',          // Segment output
      '-segment_time', '5',     // 5 second segments for much better transcription
      '-segment_format', 'wav', // WAV format
      '-reset_timestamps', '1', // Reset timestamps for each segment
      path.join(tempDir, 'audio-%03d.wav')
    ];

    const ffmpegProc = spawn('ffmpeg', ffmpegArgs);
    
    return new Promise((resolve, reject) => {
      let hasStarted = false;
      let errorOutput = '';
      
      // Give FFmpeg a few seconds to start successfully
      const startupTimer = setTimeout(() => {
        if (!hasStarted) {
          console.log(`STT: FFmpeg startup timeout for device ${tryDeviceIndex}`);
          ffmpegProc.kill('SIGTERM');
          reject(new Error(`Startup timeout for device ${tryDeviceIndex}`));
        }
      }, 5000);
      
      // Fallback: if process doesn't crash within 2 seconds, consider it successful
      const fallbackTimer = setTimeout(() => {
        if (!hasStarted && !ffmpegProc.killed) {
          console.log(`STT: FFmpeg fallback success for device ${tryDeviceIndex} - process still running`);
          hasStarted = true;
          clearTimeout(startupTimer);
          resolve(ffmpegProc);
        }
      }, 2000);
      
      ffmpegProc.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        console.log(`STT: FFmpeg stderr (device ${tryDeviceIndex}):`, text);
        
        // Check for successful startup indicators
        if (text.includes('Stream mapping:') || 
            text.includes('Input #0') || 
            text.includes('Output #0') ||
            text.includes('bitrate:') ||
            text.includes('segment') ||
            text.includes('avfoundation')) {
          hasStarted = true;
          clearTimeout(startupTimer);
          clearTimeout(fallbackTimer);
          console.log(`STT: FFmpeg successfully started with device ${tryDeviceIndex}`);
          resolve(ffmpegProc);
        }
        
        // Check for device errors that indicate we should try the next device
        if (text.includes('Input/output error') || 
            text.includes('No such device') || 
            text.includes('Device or resource busy') ||
            text.includes('Permission denied')) {
          clearTimeout(startupTimer);
          clearTimeout(fallbackTimer);
          console.log(`STT: Device ${tryDeviceIndex} failed:`, text.trim());
          ffmpegProc.kill('SIGTERM');
          reject(new Error(`Device ${tryDeviceIndex} unavailable: ${text.trim()}`));
        }
      });
      
      ffmpegProc.on('error', (error) => {
        clearTimeout(startupTimer);
        clearTimeout(fallbackTimer);
        console.error(`STT: FFmpeg process error (device ${tryDeviceIndex}):`, error);
        reject(error);
      });
      
      ffmpegProc.on('exit', (code) => {
        clearTimeout(startupTimer);
        clearTimeout(fallbackTimer);
        if (code !== 0 && !hasStarted) {
          console.log(`STT: FFmpeg exited early with code ${code} for device ${tryDeviceIndex}`);
          reject(new Error(`FFmpeg exited with code ${code} for device ${tryDeviceIndex}`));
        }
      });
    });
  }
  
  // Try devices in order with fallback
  async function startFFmpegWithFallback() {
    // IMPORTANT: Device 0 and 1 often cause the "you" bug (virtual devices/system audio)
    // Available devices: 2=iPhone Microphone, 3=MacBook Pro Microphone, 6=Camo Microphone
    const devicesToTry = [3, 2, 6]; // Try MacBook mic first, then iPhone mic, then Camo mic
    
    for (const tryDevice of devicesToTry) {
      try {
        console.log(`STT: Trying audio device ${tryDevice}...`);
        onTranscript({ type: 'system', text: `[Trying audio device ${tryDevice}...]` });
        const proc = await tryStartFFmpeg(tryDevice);
        console.log(`STT: Successfully started with device ${tryDevice}`);
        onTranscript({ type: 'system', text: `[Audio device ${tryDevice} connected successfully]` });
        return proc;
      } catch (error) {
        console.log(`STT: Device ${tryDevice} failed:`, error.message);
        onTranscript({ type: 'system', text: `[Device ${tryDevice} failed, trying next...]` });
      }
    }
    
    throw new Error('No working audio devices found');
  }
  
  // First try the selected device
  let ffmpegProc;
  try {
    console.log(`STT: Starting FFmpeg with primary device ${deviceIndex}...`);
    onTranscript({ type: 'system', text: `[Starting audio capture with device ${deviceIndex}...]` });
    ffmpegProc = await tryStartFFmpeg(deviceIndex);
    console.log(`STT: Primary device ${deviceIndex} working`);
  } catch (error) {
    console.log(`STT: Primary device ${deviceIndex} failed:`, error.message);
    onTranscript({ type: 'system', text: `[Primary device failed, trying alternatives...]` });
    
    try {
      ffmpegProc = await startFFmpegWithFallback();
    } catch (fallbackError) {
      console.error('STT: All audio devices failed:', fallbackError.message);
      onTranscript({ type: 'error', text: '[Error] No working audio devices found. Please check your microphone settings.' });
      return null;
    }
  }
  
  console.log('STT: FFmpeg started successfully');
  console.log('STT: FFmpeg PID:', ffmpegProc.pid);
  
  // Process audio segments as they're created
  let lastProcessedIndex = -1;
  const processInterval = setInterval(() => {
    if (!isRunning) {
      clearInterval(processInterval);
      return;
    }

    // Look for new audio files
    try {
      const files = fs.readdirSync(tempDir)
        .filter(f => f.startsWith('audio-') && f.endsWith('.wav'))
        .sort();
      
      console.log(`STT: Checking for audio files in ${tempDir}:`, files.length, 'files found');
      
      for (const file of files) {
        const match = file.match(/audio-(\d+)\.wav/);
        if (match) {
          const index = parseInt(match[1]);
          if (index > lastProcessedIndex) {
            const audioFile = path.join(tempDir, file);
            
            // Check file size and age to ensure it's complete
            const stats = fs.statSync(audioFile);
            const fileAge = Date.now() - stats.mtime.getTime();
            
            console.log(`STT: Found audio file ${file}, size: ${stats.size}, age: ${fileAge}ms`);
            
            if (stats.size < 2500 || fileAge < 5500) {
              // Skip files that are too small or too new (5.5s for 5s segments)
              console.log(`STT: Skipping ${file} (size: ${stats.size}, age: ${fileAge}ms)`);
              continue;
            }
            
            // Save a copy of the problematic audio file for debugging
            if (process.env.DEBUG_AUDIO) {
              const debugDir = path.join(os.homedir(), 'bitscribe-debug-audio');
              if (!fs.existsSync(debugDir)) {
                fs.mkdirSync(debugDir, { recursive: true });
              }
              const debugFile = path.join(debugDir, `debug-${Date.now()}-${file}`);
              fs.copyFileSync(audioFile, debugFile);
              console.log(`STT: DEBUG - Saved audio file copy to: ${debugFile}`);
            }
            
            // Process with whisper
            const whisperArgs = [
              '-m', MODEL_PATH,
              '-t', '4',
              '-f', audioFile,
              '--language', 'en'
            ];
            
            // Add diarization support if enabled and available
            if (enableSpeakerDetection && isDiarizationModel) {
              whisperArgs.push('--tinydiarize');
              // Keep timestamps for speaker detection - they're enabled by default
            } else {
              whisperArgs.push('--no-timestamps');
            }
            
            console.log(`STT: Processing audio file: ${audioFile}`);
            console.log(`STT: Whisper command: ${WHISPER_BIN} ${whisperArgs.join(' ')}`);
            
            console.log(`STT: Starting whisper process`);
            
            const whisperProc = spawn(WHISPER_BIN, whisperArgs);
            
            let youBugDetected = false;
            
            whisperProc.stdout.on('data', (data) => {
              const text = data.toString();
              console.log('STT: Whisper stdout RAW:', text);
              const lines = text.split('\n');
              console.log(`STT: Processing ${lines.length} lines from whisper output`);
              
              // Check for "you" bug pattern in raw output
              const lowerText = text.toLowerCase();
              const youMatches = (lowerText.match(/\byou\b/g) || []).length;
              const totalWords = text.split(/\s+/).filter(w => w.length > 0).length;
              
              if (youMatches > 5 && totalWords > 0 && (youMatches / totalWords) > 0.3) {
                console.log(`STT: WARNING - Detected "you" bug pattern in raw output: ${youMatches} instances in ${totalWords} words`);
                youBugDetected = true;
                youBugDetectionCount++;
                
                // Alert user about the issue
                onTranscript({ 
                  type: 'system', 
                  text: '[Audio feedback detected - please check your audio input device or use headphones]' 
                });
                
                // If we've detected the bug multiple times, suggest switching devices
                if (youBugDetectionCount > 3) {
                  onTranscript({ 
                    type: 'system', 
                    text: '[Persistent audio feedback - consider switching microphone or restarting transcription]' 
                  });
                }
                
                // Skip processing this segment
                return;
              }
              
              lines.forEach((line, index) => {
                console.log(`STT: Line ${index}: "${line}"`);
                
                // Skip whisper debug output
                if (line.includes('whisper_') || line.includes('.cpp')) {
                  console.log(`STT: ❌ Skipping debug line ${index}: "${line}"`);
                  return;
                }
                
                const result = parseSpeakerLine(line, enableSpeakerDetection && isDiarizationModel);
                console.log(`STT: Parsed line ${index}:`, result);
                
                if (result && result.text) {
                  // Additional "you" bug check on individual lines
                  const wordCount = result.text.split(/\s+/).filter(w => w.length > 0).length;
                  const youCount = (result.text.toLowerCase().match(/\byou\b/g) || []).length;
                  
                  if (youCount > 2 && wordCount > 0 && (youCount / wordCount) > 0.5) {
                    console.log(`STT: ❌ Filtered "you" bug line: ${youCount} instances in ${wordCount} words`);
                    youBugDetected = true;
                    return;
                  }
                  
                  const transcriptText = result.speaker ? `${result.speaker}: ${result.text}` : result.text;
                  console.log('STT: ✅ Sending transcript:', transcriptText);
                  onTranscript({ 
                    type: 'final', 
                    text: transcriptText,
                    speaker: result.speaker,
                    hasSpeaker: result.hasSpeaker 
                  });
                } else {
                  console.log(`STT: ❌ Filtered out line ${index}:`, {
                    original: line,
                    result: result
                  });
                }
              });
            });
            
            whisperProc.stderr.on('data', (data) => {
              const text = data.toString();
              console.log('STT: Whisper stderr:', text);
            });
            
            whisperProc.on('error', (error) => {
              console.error('STT: Whisper process error:', error);
              onTranscript({ type: 'error', text: `[Whisper process error: ${error.message}]` });
            });
            
            whisperProc.on('exit', (code) => {
              console.log(`STT: Whisper exited with code ${code}`);
              // Clean up processed file
              try {
                fs.unlinkSync(audioFile);
                console.log(`STT: Cleaned up ${audioFile}`);
              } catch (e) {
                console.error(`STT: Error cleaning up ${audioFile}:`, e);
              }
            });
            
            lastProcessedIndex = index;
          }
        }
      }
    } catch (error) {
      console.error('STT: Error processing audio files:', error);
    }
  }, 500); // Check every 500ms for faster response

  // FFmpeg event handlers are now managed within tryStartFFmpeg function

  // Return control object
  return {
    kill: () => {
      isRunning = false;
      if (ffmpegProc && !ffmpegProc.killed) {
        ffmpegProc.kill('SIGTERM');
      }
      
      // Clean up temp files and directory
      try {
        const files = fs.readdirSync(tempDir);
        for (const file of files) {
          fs.unlinkSync(path.join(tempDir, file));
        }
        fs.rmdirSync(tempDir);
      } catch (e) {
        console.error('Cleanup error:', e);
      }
    }
  };
}

module.exports = { startTranscription };