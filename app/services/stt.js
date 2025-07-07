// Speech-to-Text Service (whisper.cpp integration)
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Clean up transcript lines
function cleanTranscriptLine(line) {
  if (!line) return null;
  
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
    
  // Only return if it has substantial content
  return cleaned.length > 3 ? cleaned : null;
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

function startTranscription(onTranscript) {
  // Check if whisper.cpp binary exists
  const WHISPER_BIN = findWhisperBinary();
  if (!WHISPER_BIN) {
    onTranscript({ type: 'error', text: '[Error] whisper.cpp binary not found. Please run setup-whisper.sh to install whisper.cpp' });
    return null;
  }
  
  // Check if model exists
  try {
    fs.accessSync(MODEL_PATH);
  } catch (e) {
    onTranscript({ type: 'error', text: '[Error] Model file not found. Please download and place ggml-base.en.bin in whisper/models/' });
    return null;
  }

  // Check if ffmpeg is installed for audio capture
  const { execSync } = require('child_process');
  try {
    execSync('which ffmpeg');
  } catch (e) {
    onTranscript({ type: 'error', text: '[Error] ffmpeg not installed. Please install ffmpeg: brew install ffmpeg' });
    return null;
  }

  onTranscript({ type: 'system', text: '[Starting audio capture with ffmpeg...]' });

  // Create temporary directory for audio files
  const tempDir = path.join(os.tmpdir(), `whisper-audio-${Date.now()}`);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  let isRunning = true;

  // Start ffmpeg to capture audio from microphone for transcription
  // Use the MacBook Pro Microphone (device 3)
  const ffmpegArgs = [
    '-f', 'avfoundation',     // Use macOS audio foundation
    '-i', ':3',               // MacBook Pro Microphone
    '-ar', '16000',           // Sample rate 16kHz
    '-ac', '1',               // Mono
    '-acodec', 'pcm_s16le',   // 16-bit PCM
    '-f', 'segment',          // Segment output
    '-segment_time', '1',     // 1 second segments for fastest response
    '-segment_format', 'wav', // WAV format
    '-reset_timestamps', '1', // Reset timestamps for each segment
    path.join(tempDir, 'audio-%03d.wav')
  ];

  const ffmpegProc = spawn('ffmpeg', ffmpegArgs);
  
  console.log('FFmpeg started with args:', ffmpegArgs);
  
  // Process audio segments as they're created
  let lastProcessedIndex = -1;
  const processInterval = setInterval(() => {
    if (!isRunning) {
      clearInterval(processInterval);
      return;
    }

    // Look for new audio files
    const files = fs.readdirSync(tempDir)
      .filter(f => f.startsWith('audio-') && f.endsWith('.wav'))
      .sort();
    
    // console.log(`Checking for audio files in ${tempDir}:`, files.length, 'files found');
    
    for (const file of files) {
      const match = file.match(/audio-(\d+)\.wav/);
      if (match) {
        const index = parseInt(match[1]);
        if (index > lastProcessedIndex) {
          const audioFile = path.join(tempDir, file);
          
          // Check file size and age to ensure it's complete
          const stats = fs.statSync(audioFile);
          const fileAge = Date.now() - stats.mtime.getTime();
          
          if (stats.size < 1000 || fileAge < 1000) {
            // Skip files that are too small or too new
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
          
          // console.log(`Processing audio file: ${audioFile}`);
          
          const whisperProc = spawn(WHISPER_BIN, whisperArgs);
          let output = '';
          
          whisperProc.stdout.on('data', (data) => {
            const text = data.toString();
            const lines = text.split('\n');
            lines.forEach(line => {
              const cleaned = cleanTranscriptLine(line);
              if (cleaned && !cleaned.includes('whisper_') && !cleaned.includes('.cpp')) {
                // console.log('Sending transcript:', cleaned);
                onTranscript({ type: 'final', text: cleaned });
              }
            });
          });
          
          whisperProc.stderr.on('data', (data) => {
            // console.log('Whisper stderr:', data.toString());
          });
          
          whisperProc.on('exit', (code) => {
            // console.log(`Whisper exited with code ${code}`);
            // Clean up processed file
            try {
              fs.unlinkSync(audioFile);
            } catch (e) {}
          });
          
          lastProcessedIndex = index;
        }
      }
    }
  }, 500); // Check every 500ms for faster response

  ffmpegProc.stderr.on('data', (data) => {
    const text = data.toString();
    console.log('FFmpeg stderr:', text);
    // Only show actual errors, not progress info
    if (text.includes('error') || text.includes('Error')) {
      onTranscript({ type: 'error', text: '[ffmpeg] ' + text });
    }
  });

  ffmpegProc.on('error', (error) => {
    onTranscript({ type: 'error', text: '[ffmpeg error] ' + error.message });
  });

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