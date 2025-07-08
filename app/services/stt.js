// Speech-to-Text Service (whisper.cpp integration)
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Clean up transcript lines
function cleanTranscriptLine(line) {
  console.log(`cleanTranscriptLine input: "${line}"`);
  
  if (!line) {
    console.log('cleanTranscriptLine: line is null/undefined');
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
  ];
  
  // Check if line matches any filter
  for (const filter of filters) {
    if (filter.test(line)) {
      console.log(`cleanTranscriptLine: filtered by pattern ${filter}`);
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
  
  // Clean up the line
  let cleaned = line
    .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '') // Remove ANSI escape sequences
    .replace(/\[\d+K/g, '')               // Remove specific terminal control codes like [2K
    .replace(/^\s*-\s*/, '')              // Remove leading dashes
    .replace(/\s+/g, ' ')                 // Normalize whitespace
    .trim();
    
  console.log(`cleanTranscriptLine: after cleaning: "${cleaned}" (length: ${cleaned.length})`);
  
  // Only return if it has substantial content (temporarily relaxed for debugging)
  const result = cleaned.length > 1 ? cleaned : null;
  console.log(`cleanTranscriptLine: final result: "${result}"`);
  return result;
}

// Path to whisper.cpp binary and model
const WHISPER_BIN_PATHS = [
  path.join(__dirname, '../../whisper.cpp/build/bin/whisper-cli'),
  path.join(__dirname, '../../whisper.cpp/build/bin/main'),
  path.join(__dirname, '../../whisper.cpp/build/bin/whisper-server'),
  path.join(__dirname, '../../whisper.cpp/stream'),
  path.join(__dirname, '../../whisper.cpp/main')
];
const MODEL_PATH = path.join(__dirname, '../../whisper.cpp/models/ggml-base.en.bin');

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

async function startTranscription(onTranscript, audioDeviceIndex = null) {
  // Check if whisper.cpp binary exists
  const WHISPER_BIN = findWhisperBinary();
  if (!WHISPER_BIN) {
    console.error('STT: No whisper binary found. Checked paths:', WHISPER_BIN_PATHS);
    onTranscript({ type: 'error', text: '[Error] whisper.cpp binary not found. Please run setup-whisper.sh to install whisper.cpp' });
    return null;
  }
  
  console.log('STT: Using whisper binary:', WHISPER_BIN);
  
  // Check if model exists
  try {
    fs.accessSync(MODEL_PATH);
    const modelStats = fs.statSync(MODEL_PATH);
    console.log('STT: Using model file:', MODEL_PATH, 'Size:', Math.round(modelStats.size / 1024 / 1024), 'MB');
  } catch (e) {
    console.error('STT: Model file not found:', MODEL_PATH);
    onTranscript({ type: 'error', text: '[Error] Model file not found. Please download and place ggml-base.en.bin in whisper/models/' });
    return null;
  }

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
  // Default to device 3 (MacBook Pro Microphone) instead of 1 (virtual devices)
  let deviceIndex = audioDeviceIndex !== null ? audioDeviceIndex : 3;
  console.log(`STT: Audio device selection - input: ${audioDeviceIndex}, trying: ${deviceIndex}`);
  
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
      }, 3000);
      
      ffmpegProc.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        console.log(`STT: FFmpeg stderr (device ${tryDeviceIndex}):`, text);
        
        // Check for successful startup indicators
        if (text.includes('Stream mapping:') || text.includes('Input #0')) {
          hasStarted = true;
          clearTimeout(startupTimer);
          console.log(`STT: FFmpeg successfully started with device ${tryDeviceIndex}`);
          resolve(ffmpegProc);
        }
        
        // Check for device errors that indicate we should try the next device
        if (text.includes('Input/output error') || 
            text.includes('No such device') || 
            text.includes('Device or resource busy') ||
            text.includes('Permission denied')) {
          clearTimeout(startupTimer);
          console.log(`STT: Device ${tryDeviceIndex} failed:`, text.trim());
          ffmpegProc.kill('SIGTERM');
          reject(new Error(`Device ${tryDeviceIndex} unavailable: ${text.trim()}`));
        }
      });
      
      ffmpegProc.on('error', (error) => {
        clearTimeout(startupTimer);
        console.error(`STT: FFmpeg process error (device ${tryDeviceIndex}):`, error);
        reject(error);
      });
      
      ffmpegProc.on('exit', (code) => {
        clearTimeout(startupTimer);
        if (code !== 0 && !hasStarted) {
          console.log(`STT: FFmpeg exited early with code ${code} for device ${tryDeviceIndex}`);
          reject(new Error(`FFmpeg exited with code ${code} for device ${tryDeviceIndex}`));
        }
      });
    });
  }
  
  // Try devices in order with fallback
  async function startFFmpegWithFallback() {
    const devicesToTry = [3, 2, 6, 0]; // Try MacBook mic, iPhone mic, Camo mic, then fallbacks
    
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
            
            // Process with whisper
            const whisperArgs = [
              '-m', MODEL_PATH,
              '-t', '4',
              '-f', audioFile,
              '--language', 'en',
              '--no-timestamps'
            ];
            
            console.log(`STT: Processing audio file: ${audioFile}`);
            console.log(`STT: Whisper command: ${WHISPER_BIN} ${whisperArgs.join(' ')}`);
            
            console.log(`STT: Starting whisper process`);
            
            const whisperProc = spawn(WHISPER_BIN, whisperArgs);
            
            whisperProc.stdout.on('data', (data) => {
              const text = data.toString();
              console.log('STT: Whisper stdout RAW:', text);
              const lines = text.split('\n');
              console.log(`STT: Processing ${lines.length} lines from whisper output`);
              lines.forEach((line, index) => {
                console.log(`STT: Line ${index}: "${line}"`);
                const cleaned = cleanTranscriptLine(line);
                console.log(`STT: Cleaned line ${index}: "${cleaned}"`);
                if (cleaned && !cleaned.includes('whisper_') && !cleaned.includes('.cpp')) {
                  console.log('STT: ✅ Sending transcript:', cleaned);
                  onTranscript({ type: 'final', text: cleaned });
                } else {
                  console.log(`STT: ❌ Filtered out line ${index}:`, {
                    original: line,
                    cleaned: cleaned,
                    hasWhisper: line.includes('whisper_'),
                    hasCpp: line.includes('.cpp'),
                    cleanedExists: !!cleaned
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