import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  CssBaseline, Typography, Box, Chip, 
  Alert, AlertTitle, Link, Stack, Card,
  AppBar, Toolbar, Fab, Fade, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, 
  IconButton, Snackbar, FormControl, Select, MenuItem,
  Tabs, Tab, Paper, List, ListItem, ListItemText,
  ListItemSecondaryAction, Switch, TextField, CircularProgress,
  Divider, Grid
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Import custom components
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { setupMenuHandlers, showKeyboardShortcuts } from './menuHandlers.js';

// Use the old require method temporarily
const { ipcRenderer } = window.require('electron');

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// MongoDB Atlas-inspired theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#13AA52',
      light: '#1CC45F',
      dark: '#0E7C3A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3E4E50',
      light: '#5A6C6F',
      dark: '#2A3638',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F7FA',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#3E4E50',
    },
    success: {
      main: '#13AA52',
      light: '#1CC45F',
    },
    warning: {
      main: '#FFA500',
      light: '#FFB84D',
    },
    error: {
      main: '#D32F2F',
      light: '#E57373',
    },
    info: {
      main: '#0084FF',
      light: '#4DA3FF',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Helvetica Neue", "Inter", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.75rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 500 },
    h4: { fontSize: '1.25rem', fontWeight: 500 },
    h5: { fontSize: '1rem', fontWeight: 500 },
    h6: { fontSize: '0.875rem', fontWeight: 500 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#128A42', // slightly darker MongoDB green
          },
        },
        outlinedPrimary: {
          border: '1px solid #13AA52',
          color: '#13AA52',
          '&:hover': {
            backgroundColor: 'rgba(19, 170, 82, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16, // pill style
          fontSize: '0.75rem',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#13AA52',
          height: 3,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#13AA52',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(19, 170, 82, 0.08)',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#0084FF',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

const MongoCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: 8,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.12)',
  }
}));

const ScrollableBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  paddingRight: theme.spacing(1),
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#F5F7FA',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    '&:hover': {
      background: 'rgba(0, 0, 0, 0.3)',
    }
  },
}));

const PulsingDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 ${theme.palette.success.main}`,
    },
    '70%': {
      transform: 'scale(1)',
      boxShadow: `0 0 0 10px rgba(16, 185, 129, 0)`,
    },
    '100%': {
      transform: 'scale(0.95)',
      boxShadow: `0 0 0 0 rgba(16, 185, 129, 0)`,
    },
  },
}));

const RecordButton = styled(Fab)(({ theme, recording }) => ({
  width: 72,
  height: 72,
  backgroundColor: recording ? '#D32F2F' : '#13AA52',
  color: 'white',
  fontSize: '24px',
  fontWeight: 600,
  boxShadow: recording
    ? '0 4px 12px rgba(211, 47, 47, 0.3)'
    : '0 4px 12px rgba(19, 170, 82, 0.3)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: recording ? '#B71C1C' : '#0E7C3A',
    boxShadow: recording
      ? '0 6px 16px rgba(211, 47, 47, 0.4)'
      : '0 6px 16px rgba(19, 170, 82, 0.4)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  }
}));

const StatusIndicator = styled(Box)(({ theme, connected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.75, 2),
  borderRadius: 16,
  backgroundColor: connected ? '#E8F5E9' : '#FFF3E0',
  border: `1px solid ${connected ? '#C8E6C9' : '#FFE0B2'}`,
  fontSize: '14px',
  fontWeight: 500,
  color: connected ? '#2E7D32' : '#F57C00',
}));

// Audiogram Component
function Audiogram({ isListening }) {
  const [spectrumData, setSpectrumData] = useState(Array(16).fill(0));
  const [waveformHistory, setWaveformHistory] = useState(Array(60).fill(0));
  const [voiceActivity, setVoiceActivity] = useState(false);
  const [realAudioLevels, setRealAudioLevels] = useState(null);
  
  // Frequency band labels for professional display
  const frequencyBands = ['60Hz', '170Hz', '310Hz', '600Hz', '1kHz', '3kHz', '6kHz', '12kHz'];
  
  // Set up professional spectrum analysis with Web Audio API
  useEffect(() => {
    if (isListening && navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          
          // Professional audio analysis settings
          analyser.fftSize = 512; // Higher resolution for better frequency analysis
          analyser.smoothingTimeConstant = 0.8; // Smooth transitions
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          const timeDomainArray = new Uint8Array(bufferLength);
          
          microphone.connect(analyser);
          
          const updateSpectrum = () => {
            if (isListening) {
              // Get frequency data for spectrum analysis
              analyser.getByteFrequencyData(dataArray);
              // Get time domain data for waveform and voice activity detection
              analyser.getByteTimeDomainData(timeDomainArray);
              
              // Create logarithmic frequency bands (more realistic for human hearing)
              const bands = 16;
              const spectrum = new Array(bands).fill(0);
              
              for (let i = 0; i < bands; i++) {
                const start = Math.floor((i / bands) * bufferLength);
                const end = Math.floor(((i + 1) / bands) * bufferLength);
                let sum = 0;
                for (let j = start; j < end; j++) {
                  sum += dataArray[j];
                }
                spectrum[i] = sum / (end - start) / 255; // Normalize to 0-1
              }
              
              // Voice activity detection based on amplitude and frequency content
              const rms = Math.sqrt(timeDomainArray.reduce((sum, val) => sum + Math.pow((val - 128) / 128, 2), 0) / timeDomainArray.length);
              const highFreqEnergy = spectrum.slice(6, 12).reduce((sum, val) => sum + val, 0) / 6;
              const isVoiceActive = rms > 0.01 && highFreqEnergy > 0.1;
              
              setSpectrumData(spectrum);
              setVoiceActivity(isVoiceActive);
              
              // Update waveform history
              setWaveformHistory(prev => {
                const newHistory = [...prev.slice(1)];
                newHistory.push(rms);
                return newHistory;
              });
              
              requestAnimationFrame(updateSpectrum);
            }
          };
          
          updateSpectrum();
          setRealAudioLevels({ audioContext, stream });
        })
        .catch(err => {
          console.log('Microphone access denied, using simulated levels:', err);
          // Professional fallback simulation
          const interval = setInterval(() => {
            const simulatedSpectrum = Array(16).fill(0).map((_, i) => {
              // Simulate speech-like frequency distribution
              const speechFreq = i >= 2 && i <= 8 ? Math.random() * 0.7 + 0.1 : Math.random() * 0.3;
              return speechFreq;
            });
            setSpectrumData(simulatedSpectrum);
            setVoiceActivity(Math.random() > 0.3);
            
            setWaveformHistory(prev => {
              const newHistory = [...prev.slice(1)];
              newHistory.push(Math.random() * 0.5);
              return newHistory;
            });
          }, 100);
          
          setRealAudioLevels({ interval });
        });
    }
    
    return () => {
      if (realAudioLevels) {
        if (realAudioLevels.audioContext) {
          realAudioLevels.audioContext.close();
        }
        if (realAudioLevels.stream) {
          realAudioLevels.stream.getTracks().forEach(track => track.stop());
        }
        if (realAudioLevels.interval) {
          clearInterval(realAudioLevels.interval);
        }
      }
    };
  }, [isListening]);
  
  return (
    <Box sx={{ 
      height: 200,
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      backgroundColor: '#F8F9FA',
      borderRadius: 2
    }}>
      {/* Voice Activity Indicator */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 1,
        height: 20
      }}>
        <Box sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: voiceActivity ? '#13AA52' : '#94A3B8',
          transition: 'all 0.2s ease'
        }} />
        <Typography variant="caption" sx={{ color: '#64748B' }}>
          {voiceActivity ? 'Voice Detected' : 'Listening...'}
        </Typography>
      </Box>
      
      {/* Real-time Spectrum Analyzer */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        gap: 0.5,
        height: 90,
        mb: 2
      }}>
        {spectrumData.map((amplitude, index) => (
          <Box
            key={index}
            sx={{
              width: 14,
              height: `${Math.max(2, amplitude * 80)}px`,
              backgroundColor: isListening 
                ? (voiceActivity 
                    ? (index >= 2 && index <= 8 ? '#13AA52' : '#1CC45F') // Highlight speech frequencies
                    : '#94A3B8'
                  )
                : '#E2E8F0',
              borderRadius: 1,
              transition: 'all 0.15s ease',
              opacity: amplitude > 0.1 ? 1 : 0.5
            }}
          />
        ))}
      </Box>
      
      {/* Waveform History */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 1,
        p: 1,
        gap: 1
      }}>
        {waveformHistory.map((amplitude, index) => (
          <Box
            key={index}
            sx={{
              width: 2,
              height: `${Math.max(1, amplitude * 30)}px`,
              backgroundColor: voiceActivity && index > 50 ? '#13AA52' : '#CBD5E1',
              borderRadius: 0.5,
              opacity: index > 50 ? 1 : 0.3 + (index / 50) * 0.7
            }}
          />
        ))}
      </Box>
      
      {/* Frequency Labels */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        mt: 1,
        px: 1
      }}>
        {frequencyBands.map((freq, index) => (
          <Typography 
            key={index} 
            variant="caption" 
            sx={{ 
              color: '#94A3B8',
              fontSize: '0.7rem'
            }}
          >
            {freq}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

// Live Captions Component
function LiveCaptions({ captions }) {
  return (
    <Box sx={{ 
      height: 150,
      overflow: 'hidden',
      p: 2,
      backgroundColor: '#F8F9FA',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }}>
      {captions.slice(-3).map((caption, index) => {
        const recentCaptions = captions.slice(-3);
        const isLatest = index === recentCaptions.length - 1;
        return (
          <Typography
            key={caption.timestamp || index}
            variant="body1"
            sx={{
              fontSize: isLatest ? '18px' : '16px',
              fontWeight: isLatest ? 600 : 400,
              color: isLatest ? '#1F2937' : '#6B7280',
              opacity: 1 - (recentCaptions.length - 1 - index) * 0.3,
              mb: 1,
              lineHeight: 1.4
            }}
          >
            {caption.text}
          </Typography>
        );
      })}
      {captions.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Live captions will appear here...
        </Typography>
      )}
    </Box>
  );
}

function App() {
  // Debug logging for renderer startup
  console.log('🚀 App component mounting');
  console.log('🔍 Available APIs:', {
    require: !!window.require,
    ipcRenderer: !!ipcRenderer
  });

  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState('audiogram'); // 'transcript', 'captions', 'audiogram'
  const [recentCaptions, setRecentCaptions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [research, setResearch] = useState([]);
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [meetingNotes, setMeetingNotes] = useState(null);
  const [notesLoading, setNotesLoading] = useState(false);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(null);
  const [llmProviders, setLlmProviders] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [testingConnection, setTestingConnection] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  
  // Metrics state
  const [usageMetrics, setUsageMetrics] = useState(null);
  const [currentSessionMetrics, setCurrentSessionMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  
  // Template state
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDialog, setTemplateDialog] = useState({ open: false, mode: 'view', template: null });
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  
  // Report state
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [userReports, setUserReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  
  // Exported Reports state
  const [exportedReports, setExportedReports] = useState([]);
  const [loadingExportedReports, setLoadingExportedReports] = useState(false);
  const [reportViewMode, setReportViewMode] = useState('generated'); // 'generated' | 'exported' | 'favorites'
  
  // Report editing state
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [editedReportName, setEditedReportName] = useState('');
  const [editedReportContent, setEditedReportContent] = useState('');
  const [savingReport, setSavingReport] = useState(false);
  
  // Real-time insights state
  const [realtimeInsights, setRealtimeInsights] = useState([]);
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [currentSlides, setCurrentSlides] = useState([]);
  const [knowledgeGraph, setKnowledgeGraph] = useState(null);
  const [showInsightsPanel, setShowInsightsPanel] = useState(true);

  // RAG state
  const [ragDocuments, setRAGDocuments] = useState([]);
  const [loadingRAGDocuments, setLoadingRAGDocuments] = useState(false);
  const [ragStats, setRAGStats] = useState(null);
  
  // Ref for auto-scrolling transcript
  const transcriptRef = useRef(null);
  
  // Auto-scroll transcript when it updates
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);


  // Load settings data when dialog opens
  useEffect(() => {
    if (showSettings) {
      loadTemplates();
      loadMetrics();
      if (reportViewMode === 'generated') {
        loadUserReports();
      } else if (reportViewMode === 'exported') {
        loadExportedReports();
      } else if (reportViewMode === 'favorites') {
        loadFavoriteReports();
      }
    }
  }, [showSettings, reportViewMode]);

  useEffect(() => {
    let isMounted = true;
    console.log('Setting up IPC listeners...');
    console.log('🔍 ipcRenderer available:', !!ipcRenderer);
    
    // Set up menu handlers only if ipcRenderer is available
    try {
      setupMenuHandlers();
      console.log('✅ Menu handlers set up successfully');
    } catch (error) {
      console.error('❌ Failed to set up menu handlers:', error);
    }
    
    // Set up custom event listeners for menu actions
    const handleGenerateReport = () => {
      if (selectedTemplate) {
        handleGenerateClick();
      } else {
        setShowReportDialog(true);
      }
    };
    
    const handleShowKeyboardShortcuts = () => {
      const shortcutsHTML = showKeyboardShortcuts();
      setAlert({
        severity: 'info',
        title: 'Keyboard Shortcuts',
        message: shortcutsHTML
      });
    };
    
    const handleToggleCaptions = () => {
      setCaptionsEnabled(prev => !prev);
    };
    
    const handleShowAbout = () => {
      setAlert({
        severity: 'info',
        title: 'About bitscribe',
        message: `
          <div style="text-align: center;">
            <h3>bitscribe</h3>
            <p>Version 1.0.0</p>
            <p>AI-powered transcription and analysis tool for MongoDB design reviews</p>
            <br>
            <p><strong>Features:</strong></p>
            <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
              <li>Real-time speech transcription</li>
              <li>AI-powered conversation analysis</li>
              <li>MongoDB-specific best practices detection</li>
              <li>RAG-enhanced insights</li>
              <li>Professional report generation</li>
            </ul>
            <br>
            <p>© 2025 MongoDB. All rights reserved.</p>
          </div>
        `
      });
    };
    
    // Add event listeners
    window.addEventListener('generate-report', handleGenerateReport);
    window.addEventListener('show-keyboard-shortcuts', handleShowKeyboardShortcuts);
    window.addEventListener('toggle-captions', handleToggleCaptions);
    window.addEventListener('show-about', handleShowAbout);
    window.addEventListener('show-settings', () => setShowSettings(true));
    window.addEventListener('toggle-recording-controls', () => {
      // Toggle recording controls visibility
      setAlert({ severity: 'info', message: 'Recording controls toggled' });
    });
    window.addEventListener('edit-transcript', () => {
      setAlert({ severity: 'info', message: 'Transcript editing mode activated' });
    });
    
    // Transcript updates with AGGRESSIVE memory management
    const MAX_TRANSCRIPT_LENGTH = 8000; // 8KB limit - FURTHER REDUCED
    const MAX_TRANSCRIPT_LINES = 80; // Max lines - FURTHER REDUCED
    const MAX_CAPTIONS = 5; // Reduce captions memory footprint
    
    const transcriptHandler = (_, data) => {
      if (!isMounted) return; // Prevent updates after unmount
      
      if (typeof data === 'string') {
        // Legacy format
        setTranscript((prev) => {
          // Memory management: truncate if too large
          let managedPrev = prev;
          if (prev.length > MAX_TRANSCRIPT_LENGTH) {
            const lines = prev.split('\n');
            managedPrev = lines.slice(-Math.floor(MAX_TRANSCRIPT_LINES / 2)).join('\n');
            console.warn('Transcript truncated due to memory limits');
          }
          
          const newTranscript = managedPrev + (managedPrev ? '\n' : '') + data;
          setWordCount(newTranscript.split(/\s+/).filter(word => word.length > 0).length);
          return newTranscript;
        });
        
        // Add to captions for live view (legacy format)
        setRecentCaptions(prev => {
          const newCaptions = [...prev, { 
            text: data, 
            timestamp: Date.now() 
          }];
          // Keep only last 5 captions for memory efficiency
          return newCaptions.slice(-MAX_CAPTIONS);
        });
      } else if (data.type === 'final') {
        // Committed text - add permanently
        setTranscript((prev) => {
          // Memory management: truncate if too large
          let managedPrev = prev;
          if (prev.length > MAX_TRANSCRIPT_LENGTH) {
            const lines = prev.split('\n');
            managedPrev = lines.slice(-Math.floor(MAX_TRANSCRIPT_LINES / 2)).join('\n');
            console.warn('Transcript truncated due to memory limits');
          }
          
          const newTranscript = managedPrev + (managedPrev ? '\n' : '') + data.text;
          setWordCount(newTranscript.split(/\s+/).filter(word => word.length > 0).length);
          return newTranscript;
        });
        
        // Add to captions for live view
        setRecentCaptions(prev => {
          const newCaptions = [...prev, { 
            text: data.text, 
            timestamp: Date.now() 
          }];
          // Keep only last 5 captions for memory efficiency
          return newCaptions.slice(-MAX_CAPTIONS);
        });
      } else if (data.type === 'interim') {
        // Interim text - show temporarily but don't save
        setTranscript((prev) => {
          // Memory management for interim updates
          let managedPrev = prev;
          if (prev.length > MAX_TRANSCRIPT_LENGTH) {
            const lines = prev.split('\n');
            managedPrev = lines.slice(-Math.floor(MAX_TRANSCRIPT_LINES / 2)).join('\n');
          }
          
          // Remove any previous interim text and add new interim
          const lines = managedPrev.split('\n');
          const finalLines = lines.filter(line => !line.startsWith('〉'));
          const newTranscript = finalLines.join('\n') + (finalLines.length > 0 ? '\n' : '') + '〉 ' + data.text;
          return newTranscript;
        });
      } else if (data.type === 'error' || data.type === 'system') {
        // System messages
        setTranscript((prev) => {
          const newTranscript = prev + (prev ? '\n' : '') + data.text;
          return newTranscript;
        });
      }
    };
    
    // Topics extracted with deduplication and limits
    const topicsHandler = (_, data) => {
      if (!isMounted) return;
      setTopics((prev) => {
        // Add new data and deduplicate by timestamp
        const newTopics = [...prev, data];
        const uniqueTopics = newTopics.filter((topic, index, array) => 
          array.findIndex(t => t.timestamp === topic.timestamp) === index
        );
        
        // Keep only last 10 topic entries - REDUCED for extreme memory pressure
        const limitedTopics = uniqueTopics.slice(-10);
        
        if (limitedTopics.length < uniqueTopics.length) {
          console.warn(`Topics truncated: ${uniqueTopics.length} -> ${limitedTopics.length}`);
        }
        
        return limitedTopics;
      });
    };
    
    // Research completed with deduplication and limits
    const researchHandler = (_, data) => {
      if (!isMounted) return;
      setResearch((prev) => {
        // Add new summaries and deduplicate by topic
        const newResearch = [...prev, ...data.summaries];
        const uniqueResearch = newResearch.filter((research, index, array) => 
          array.findIndex(r => r.topic === research.topic && r.timestamp === research.timestamp) === index
        );
        
        // Keep only last 5 research items - REDUCED for extreme memory pressure
        const limitedResearch = uniqueResearch.slice(-5);
        
        if (limitedResearch.length < uniqueResearch.length) {
          console.warn(`Research truncated: ${uniqueResearch.length} -> ${limitedResearch.length}`);
        }
        
        return limitedResearch;
      });
    };
    
    // Ollama status
    const ollamaHandler = (_, connected) => {
      if (!isMounted) return;
      console.log('Received ollama-status update:', connected);
      setOllamaConnected(connected);
    };
    
    // Processing status
    const chunkHandler = () => {
      if (!isMounted) return;
      setProcessingStatus('Processing chunk...');
      setTimeout(() => {
        if (isMounted) setProcessingStatus(null);
      }, 1000);
    };
    
    // Error handler
    const errorHandler = (_, error) => {
      if (!isMounted) return;
      console.error('IPC Error:', error);
    };

    // Register all handlers with error handling
    if (!ipcRenderer) {
      console.error('❌ ipcRenderer not available, skipping IPC setup');
      return;
    }
    
    try {
      console.log('Registering IPC event handlers...');
      ipcRenderer.on('transcript-update', transcriptHandler);
      ipcRenderer.on('topics-extracted', topicsHandler);
      ipcRenderer.on('research-completed', researchHandler);
      ipcRenderer.on('ollama-status', ollamaHandler);
      ipcRenderer.on('chunk-processed', chunkHandler);
      ipcRenderer.on('processor-error', errorHandler);
      
      // Real-time event handlers
      ipcRenderer.on('realtime-insight', (_, insight) => {
        if (!isMounted) return;
        setRealtimeInsights(prev => [...prev.slice(-9), insight]); // Keep last 10
      });

      ipcRenderer.on('executive-summary-updated', (_, summary) => {
        if (!isMounted) return;
        setExecutiveSummary(summary);
      });

      ipcRenderer.on('slides-generated', (_, slides) => {
        if (!isMounted) return;
        setCurrentSlides(slides);
      });

      ipcRenderer.on('knowledge-graph-updated', (_, graphData) => {
        if (!isMounted) return;
        setKnowledgeGraph(graphData);
      });
      
      // Check Ollama status after handlers are registered
      setTimeout(() => {
        if (isMounted) {
          console.log('Sending check-ollama-status request...');
          ipcRenderer.send('check-ollama-status');
        }
      }, 100);
    } catch (error) {
      console.error('Failed to set up IPC listeners:', error);
    }
    
    return () => {
      isMounted = false;
      console.log('Cleaning up IPC listeners...');
      
      // Remove all listeners - more thorough cleanup
      try {
        ipcRenderer.removeListener('transcript-update', transcriptHandler);
        ipcRenderer.removeListener('topics-extracted', topicsHandler);
        ipcRenderer.removeListener('research-completed', researchHandler);
        ipcRenderer.removeListener('ollama-status', ollamaHandler);
        ipcRenderer.removeListener('chunk-processed', chunkHandler);
        ipcRenderer.removeListener('processor-error', errorHandler);
        ipcRenderer.removeAllListeners('realtime-insight');
        ipcRenderer.removeAllListeners('executive-summary-updated');
        ipcRenderer.removeAllListeners('slides-generated');
        ipcRenderer.removeAllListeners('knowledge-graph-updated');
        
        // Clean up custom event listeners
        window.removeEventListener('generate-report', handleGenerateReport);
        window.removeEventListener('show-keyboard-shortcuts', handleShowKeyboardShortcuts);
        window.removeEventListener('toggle-captions', handleToggleCaptions);
        window.removeEventListener('show-about', handleShowAbout);
      } catch (error) {
        console.error('Error during IPC cleanup:', error);
      }
    };
  }, []);

  // Emergency memory recovery system
  useEffect(() => {
    let memoryCheckInterval;
    
    // Monitor memory usage and perform emergency cleanup if needed
    const checkMemoryUsage = () => {
      try {
        // Check if performance.memory is available (Chromium/Electron)
        if (window.performance && window.performance.memory) {
          const memoryInfo = window.performance.memory;
          const usedMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
          const limitMB = memoryInfo.jsHeapSizeLimit / (1024 * 1024);
          
          console.log(`Memory usage: ${usedMB.toFixed(1)}MB / ${limitMB.toFixed(1)}MB`);
          
          // Emergency cleanup if memory usage is too high - MORE AGGRESSIVE
          if (usedMB > 100 || (usedMB / limitMB) > 0.7) {
            console.warn('🚨 High memory usage detected, performing emergency cleanup');
            
            // Aggressive state cleanup - batch updates to prevent React unmounting
            React.startTransition(() => {
              setTopics(prev => prev.slice(-5)); // Even more aggressive
              setResearch(prev => prev.slice(-3));
              setTranscript(prev => {
                const lines = prev.split('\n');
                return lines.slice(-50).join('\n'); // Keep only last 50 lines
              });
              
              // Clear any pending updates
              setProcessingStatus(null);
              setWordCount(0);
            });
            
            // Force garbage collection if available
            if (window.gc) {
              window.gc();
            }
          }
        }
      } catch (error) {
        console.error('Memory check error:', error);
      }
    };
    
    // Check every 30 seconds
    memoryCheckInterval = setInterval(checkMemoryUsage, 30000);
    
    return () => {
      if (memoryCheckInterval) {
        clearInterval(memoryCheckInterval);
      }
    };
  }, []);

  // Global error boundary for renderer crashes
  useEffect(() => {
    const handleError = (error) => {
      console.error('🚨 Renderer error detected:', error);
      try {
        // Send crash report to main process
        ipcRenderer.send('renderer-error', {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.error('Failed to send error report:', e);
      }
    };
    
    const handleUnhandledRejection = (event) => {
      console.error('🚨 Unhandled promise rejection:', event.reason);
      handleError(new Error(`Unhandled rejection: ${event.reason}`));
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const startTranscription = () => {
    setTranscript('');
    setTopics([]);
    setResearch([]);
    setRecentCaptions([]);
    setWordCount(0);
    setMeetingNotes(null);
    
    // Force garbage collection before starting
    if (window.gc) {
      window.gc();
    }
    
    ipcRenderer.send('start-transcription');
    setIsListening(true);
  };
  
  const stopTranscription = () => {
    ipcRenderer.send('stop-transcription');
    setIsListening(false);
    
    // Force garbage collection after stopping
    setTimeout(() => {
      if (window.gc) {
        window.gc();
      }
    }, 1000);
    
    // Show post-recording dialog if we have sufficient transcript
    if (transcript.length > 50) {
      // Load templates first
      loadTemplates();
      // Show the report generation dialog
      setShowTemplateSelection(true);
    }
  };

  const triggerResearchForTopic = async (topicData) => {
    if (!topicData || !topicData.topics || topicData.topics.length === 0) {
      console.warn('No topics available for research');
      return;
    }

    console.log('Triggering research for topics:', topicData.topics);
    
    try {
      // Send research request to main process
      const result = await ipcRenderer.invoke('trigger-research', {
        topics: topicData.topics,
        questions: topicData.questions || [],
        terms: topicData.terms || [],
        transcript: transcript,
        timestamp: topicData.timestamp
      });
      
      if (result.success) {
        console.log('Research triggered successfully');
        // Research results will be received via the research-completed event
      } else {
        console.error('Failed to trigger research:', result.error);
      }
    } catch (error) {
      console.error('Error triggering research:', error);
    }
  };

  const generateMeetingNotes = async () => {
    if (notesLoading) return;
    
    console.log('Generate meeting notes button clicked');
    console.log('Current transcript length:', transcript.length);
    console.log('Current topics:', topics);
    
    setNotesLoading(true);
    try {
      // Send current UI state to main process for generation
      const result = await ipcRenderer.invoke('generate-meeting-notes', {
        transcript,
        topics,
        research
      });
      console.log('Meeting notes result:', result);
      if (result.error) {
        console.error('Error generating meeting notes:', result.error);
      } else {
        setMeetingNotes(result);
        console.log('Meeting notes set successfully');
      }
    } catch (error) {
      console.error('Failed to generate meeting notes:', error);
    } finally {
      setNotesLoading(false);
    }
  };

  const exportMeetingNotes = async () => {
    if (!meetingNotes) return;
    
    try {
      const result = await ipcRenderer.invoke('export-meeting-notes', meetingNotes);
      if (result.success) {
        // Could show a toast notification here
        console.log('Meeting notes exported to:', result.filepath);
      } else {
        console.error('Export failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to export meeting notes:', error);
    }
  };

  const clearMeetingNotes = () => {
    setMeetingNotes(null);
  };

  // Helper functions for insight styling
  const getInsightBackgroundColor = (type) => {
    const colors = {
      contradiction: 'rgba(239, 68, 68, 0.1)',
      jargon: 'rgba(59, 130, 246, 0.1)',
      suggestion: 'rgba(16, 185, 129, 0.1)',
      insight: 'rgba(19, 170, 82, 0.1)',
      example: 'rgba(139, 92, 246, 0.1)',
      strategic: 'rgba(245, 158, 11, 0.1)',
      perspective: 'rgba(236, 72, 153, 0.1)',
      question: 'rgba(6, 182, 212, 0.1)'
    };
    return colors[type] || 'rgba(148, 163, 184, 0.1)';
  };

  const getInsightBorderColor = (type) => {
    const colors = {
      contradiction: 'rgba(239, 68, 68, 0.3)',
      jargon: 'rgba(59, 130, 246, 0.3)',
      suggestion: 'rgba(16, 185, 129, 0.3)',
      insight: 'rgba(19, 170, 82, 0.3)',
      example: 'rgba(139, 92, 246, 0.3)',
      strategic: 'rgba(245, 158, 11, 0.3)',
      perspective: 'rgba(236, 72, 153, 0.3)',
      question: 'rgba(6, 182, 212, 0.3)'
    };
    return colors[type] || 'rgba(148, 163, 184, 0.3)';
  };

  const getInsightTextColor = (type) => {
    const colors = {
      contradiction: '#ef4444',
      jargon: '#3b82f6',
      suggestion: '#10b981',
      insight: '#6366f1',
      example: '#8b5cf6',
      strategic: '#f59e0b',
      perspective: '#ec4899',
      question: '#06b6d4'
    };
    return colors[type] || '#94a3b8';
  };

  const getInsightIcon = (type) => {
    const icons = {
      contradiction: '⚠️',
      jargon: '📖',
      suggestion: '💡',
      insight: '🧠',
      example: '📋',
      strategic: '🎯',
      perspective: '👥',
      question: '❓'
    };
    return icons[type] || '💭';
  };

  // Settings functions
  const loadSettings = async () => {
    try {
      const config = await ipcRenderer.invoke('get-settings');
      const providers = await ipcRenderer.invoke('get-llm-providers');
      setSettings(config);
      setLlmProviders(providers);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const result = await ipcRenderer.invoke('update-settings', newSettings);
      if (result.success) {
        setSettings(prev => ({ ...prev, ...newSettings }));
        setSnackbar({ open: true, message: 'Settings saved successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
    }
  };

  const handleSettingsUpdate = (newSettings) => {
    // Update local state immediately for responsive UI
    setSettings(newSettings);
    // Save to backend
    saveSettings(newSettings);
  };

  const testProviderConnection = async (providerName) => {
    setTestingConnection(true);
    try {
      const result = await ipcRenderer.invoke('test-llm-provider', providerName);
      if (result.connected) {
        setSnackbar({ open: true, message: `${providerName} connected successfully!`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: `Failed to connect to ${providerName}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setSnackbar({ open: true, message: 'Connection test failed', severity: 'error' });
    } finally {
      setTestingConnection(false);
    }
  };

  // RAG functions
  const handleRAGFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    for (const file of fileArray) {
      try {
        setSnackbar({ open: true, message: `Uploading ${file.name}...`, severity: 'info' });
        
        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        const result = await ipcRenderer.invoke('upload-rag-document', {
          fileName: file.name,
          fileData: arrayBuffer,
          metadata: {
            type: 'best-practices',
            category: 'general'
          }
        });

        if (result.success) {
          setSnackbar({ open: true, message: `${file.name} uploaded successfully!`, severity: 'success' });
          loadRAGDocuments(); // Refresh the list
        } else {
          setSnackbar({ open: true, message: `Failed to upload ${file.name}: ${result.error}`, severity: 'error' });
        }
      } catch (error) {
        console.error('File upload failed:', error);
        setSnackbar({ open: true, message: `Failed to upload ${file.name}: ${error.message}`, severity: 'error' });
      }
    }
  };

  const loadRAGDocuments = async () => {
    setLoadingRAGDocuments(true);
    try {
      const [documentsResult, statsResult] = await Promise.all([
        ipcRenderer.invoke('get-rag-documents'),
        ipcRenderer.invoke('get-rag-stats')
      ]);

      if (documentsResult.success) {
        setRAGDocuments(documentsResult.documents);
      }

      if (statsResult.success) {
        setRAGStats(statsResult.stats);
      }
    } catch (error) {
      console.error('Failed to load RAG documents:', error);
      setSnackbar({ open: true, message: 'Failed to load documents', severity: 'error' });
    } finally {
      setLoadingRAGDocuments(false);
    }
  };

  const deleteRAGDocument = async (documentId) => {
    try {
      const result = await ipcRenderer.invoke('delete-rag-document', documentId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Document deleted successfully!', severity: 'success' });
        loadRAGDocuments(); // Refresh the list
      } else {
        setSnackbar({ open: true, message: 'Failed to delete document', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      setSnackbar({ open: true, message: 'Failed to delete document', severity: 'error' });
    }
  };

  const openSettings = () => {
    loadSettings();
    loadMetrics();
    loadUserReports();
    loadExportedReports();
    loadRAGDocuments();
    setShowSettings(true);
  };

  const loadMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const [usage, current] = await Promise.all([
        ipcRenderer.invoke('get-usage-metrics'),
        ipcRenderer.invoke('get-current-session-metrics')
      ]);
      setUsageMetrics(usage);
      setCurrentSessionMetrics(current);
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const exportUsageData = async () => {
    try {
      const result = await ipcRenderer.invoke('export-usage-data');
      if (result.success) {
        setSnackbar({ open: true, message: 'Usage data exported successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to export usage data', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to export usage data:', error);
      setSnackbar({ open: true, message: 'Failed to export usage data', severity: 'error' });
    }
  };

  // Template functions
  const loadTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const result = await ipcRenderer.invoke('get-templates');
      if (result.success) {
        setTemplates(result.templates);
        
        // Auto-select MongoDB Design Review template if no template is selected
        if (!selectedTemplate && result.templates.length > 0) {
          const mongoDBTemplate = result.templates.find(t => 
            t.name === 'MongoDB Design Review Report' || 
            t.isDefault === true
          );
          if (mongoDBTemplate) {
            setSelectedTemplate(mongoDBTemplate);
          } else {
            // Fallback to first template
            setSelectedTemplate(result.templates[0]);
          }
        }
      } else {
        setSnackbar({ open: true, message: 'Failed to load templates', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      setSnackbar({ open: true, message: 'Failed to load templates', severity: 'error' });
    } finally {
      setLoadingTemplates(false);
    }
  };

  const generateReport = async (templateId) => {
    try {
      setSnackbar({ open: true, message: 'Generating report...', severity: 'info' });
      const result = await ipcRenderer.invoke('generate-report', templateId, transcript, {}, Date.now().toString());
      if (result.success) {
        setSnackbar({ open: true, message: 'Report generated successfully!', severity: 'success' });
        // Store the generated report and show it
        setGeneratedReport({
          id: result.reportId,
          content: result.content,
          metadata: result.metadata,
          templateId: templateId,
          template: templates.find(t => t._id === templateId),
          generatedAt: new Date()
        });
        setShowReportDialog(true);
        // Refresh user reports list
        loadUserReports();
      } else {
        setSnackbar({ open: true, message: `Failed to generate report: ${result.error}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      setSnackbar({ open: true, message: 'Failed to generate report', severity: 'error' });
    }
  };

  const triggerResearchForCurrentTranscript = async () => {
    if (!transcript || transcript.length < 50) return;
    
    try {
      setSnackbar({ open: true, message: 'Researching current transcript...', severity: 'info' });
      
      // Extract topics from current transcript
      const result = await ipcRenderer.invoke('trigger-immediate-research', transcript);
      if (result.success) {
        setSnackbar({ open: true, message: 'Research completed!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Research failed', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to trigger research:', error);
      setSnackbar({ open: true, message: 'Research failed', severity: 'error' });
    }
  };

  const generateQuickReport = async () => {
    if (!transcript || transcript.length < 50) return;
    
    try {
      setSnackbar({ open: true, message: 'Generating quick report...', severity: 'info' });
      
      // Generate meeting notes without template selection
      const result = await ipcRenderer.invoke('generate-meeting-notes', transcript);
      if (result.success) {
        setMeetingNotes(result.notes);
        setSnackbar({ open: true, message: 'Quick report generated!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Report generation failed', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate quick report:', error);
      setSnackbar({ open: true, message: 'Report generation failed', severity: 'error' });
    }
  };

  const generateReportFromSelection = async (templateId) => {
    setGeneratingReport(true);
    setShowTemplateSelection(false);
    
    try {
      setSnackbar({ open: true, message: 'Generating report from template...', severity: 'info' });
      const result = await ipcRenderer.invoke('generate-report', templateId, transcript, {}, Date.now().toString());
      if (result.success) {
        setSnackbar({ open: true, message: 'Report generated successfully!', severity: 'success' });
        // Store the generated report and show it
        setGeneratedReport({
          id: result.reportId,
          content: result.content,
          metadata: result.metadata,
          templateId: templateId,
          template: templates.find(t => t._id === templateId),
          generatedAt: new Date()
        });
        setShowReportDialog(true);
        // Refresh user reports list
        loadUserReports();
      } else {
        setSnackbar({ open: true, message: `Failed to generate report: ${result.error}`, severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      setSnackbar({ open: true, message: 'Failed to generate report', severity: 'error' });
    } finally {
      setGeneratingReport(false);
    }
  };

  const exportTemplate = async (templateId) => {
    try {
      const result = await ipcRenderer.invoke('export-template-json', templateId);
      if (result.success) {
        setSnackbar({ open: true, message: 'Template exported successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to export template', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to export template:', error);
      setSnackbar({ open: true, message: 'Failed to export template', severity: 'error' });
    }
  };

  const exportAllTemplates = async () => {
    try {
      const result = await ipcRenderer.invoke('export-all-templates');
      if (result.success) {
        setSnackbar({ open: true, message: 'All templates exported successfully!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to export templates', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to export all templates:', error);
      setSnackbar({ open: true, message: 'Failed to export templates', severity: 'error' });
    }
  };

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // Load settings and LLM providers on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Report management functions
  const loadUserReports = async () => {
    setLoadingReports(true);
    try {
      const result = await ipcRenderer.invoke('get-user-reports');
      if (result.success) {
        setUserReports(result.reports);
      } else {
        console.error('Failed to load user reports:', result.error);
      }
    } catch (error) {
      console.error('Failed to load user reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const exportGeneratedReport = async (reportId) => {
    try {
      const result = await ipcRenderer.invoke('export-report', reportId, 'markdown');
      if (result.success) {
        setSnackbar({ open: true, message: `Report exported to ${result.filename}`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to export report', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to export report:', error);
      setSnackbar({ open: true, message: 'Failed to export report', severity: 'error' });
    }
  };

  const viewReport = async (reportId) => {
    try {
      const result = await ipcRenderer.invoke('get-report', reportId);
      if (result.success) {
        setGeneratedReport({
          id: result.report._id,
          content: result.report.content,
          metadata: result.report.metadata,
          templateId: result.report.templateId,
          template: { name: result.report.templateName },
          generatedAt: new Date(result.report.generatedAt)
        });
        setShowReportDialog(true);
      } else {
        setSnackbar({ open: true, message: 'Failed to load report', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to load report:', error);
      setSnackbar({ open: true, message: 'Failed to load report', severity: 'error' });
    }
  };

  // Exported Reports functions
  const loadExportedReports = async () => {
    setLoadingExportedReports(true);
    try {
      const result = await ipcRenderer.invoke('get-exported-reports-by-user', 'default-user');
      if (result.success) {
        setExportedReports(result.reports);
      } else {
        console.error('Failed to load exported reports:', result.error);
        setSnackbar({ open: true, message: 'Failed to load exported reports', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to load exported reports:', error);
      setSnackbar({ open: true, message: 'Failed to load exported reports', severity: 'error' });
    } finally {
      setLoadingExportedReports(false);
    }
  };

  const loadFavoriteReports = async () => {
    setLoadingReports(true);
    try {
      const result = await ipcRenderer.invoke('get-favorite-reports', 'default-user');
      if (result.success) {
        setUserReports(result.reports);
      } else {
        console.error('Failed to load favorite reports:', result.error);
        setSnackbar({ open: true, message: 'Failed to load favorite reports', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to load favorite reports:', error);
      setSnackbar({ open: true, message: 'Failed to load favorite reports', severity: 'error' });
    } finally {
      setLoadingReports(false);
    }
  };

  const deleteExportedReport = async (exportId) => {
    try {
      const result = await ipcRenderer.invoke('delete-exported-report', exportId);
      if (result.success && result.deleted) {
        setSnackbar({ open: true, message: 'Exported report deleted successfully', severity: 'success' });
        loadExportedReports(); // Refresh list
      } else {
        setSnackbar({ open: true, message: 'Failed to delete exported report', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to delete exported report:', error);
      setSnackbar({ open: true, message: 'Failed to delete exported report', severity: 'error' });
    }
  };

  // Report editing functions
  const startEditingReport = () => {
    if (generatedReport) {
      setIsEditingReport(true);
      setEditedReportName(generatedReport.template?.name || '');
      setEditedReportContent(generatedReport.content);
    }
  };

  const cancelEditingReport = () => {
    setIsEditingReport(false);
    setEditedReportName('');
    setEditedReportContent('');
  };

  const saveReportEdits = async () => {
    if (!generatedReport) return;
    
    setSavingReport(true);
    try {
      const updates = {
        templateName: editedReportName,
        content: editedReportContent
      };
      
      const result = await ipcRenderer.invoke('update-report', generatedReport.id, updates);
      if (result.success) {
        setSnackbar({ open: true, message: 'Report updated successfully', severity: 'success' });
        
        // Update the local state
        setGeneratedReport(prev => ({
          ...prev,
          template: { ...prev.template, name: editedReportName },
          content: editedReportContent
        }));
        
        // Refresh reports list
        loadUserReports();
        setIsEditingReport(false);
      } else {
        setSnackbar({ open: true, message: 'Failed to update report', severity: 'error' });
      }
    } catch (error) {
      console.error('Failed to save report edits:', error);
      setSnackbar({ open: true, message: 'Failed to update report', severity: 'error' });
    } finally {
      setSavingReport(false);
    }
  };

  const renderMeetingNotes = () => {
    if (!meetingNotes) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            📝 No meeting notes generated yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate AI-powered meeting summary with action items
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Chip 
              label={notesLoading ? "Generating..." : "Generate Notes"}
              onClick={generateMeetingNotes}
              disabled={notesLoading || transcript.length < 10}
              sx={{ 
                backgroundColor: notesLoading ? 'rgba(19, 170, 82, 0.3)' : '#13AA52',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: notesLoading ? 'rgba(19, 170, 82, 0.3)' : '#128A42',
                }
              }}
            />
            <Chip 
              label="Test Generate"
              onClick={() => {
                console.log('Test button clicked');
                // Add some test data for testing
                setTranscript('We discussed the quarterly budget and decided to increase marketing spend by 20%. John will prepare the budget proposal by Friday. Sarah mentioned that we need to hire two new developers. The team agreed to implement the new API by end of March.');
                setTopics([{
                  topics: ['budget', 'marketing', 'hiring', 'API development'],
                  questions: ['When should we start hiring?'],
                  terms: ['quarterly budget', 'API'],
                  timestamp: new Date().toISOString()
                }]);
                setTimeout(() => generateMeetingNotes(), 500);
              }}
              sx={{ 
                backgroundColor: '#FFFFFF',
                border: '2px solid #13AA52',
                color: '#13AA52',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: 2,
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(19, 170, 82, 0.08)',
                }
              }}
            />
          </Box>
        </Box>
      );
    }

    return (
      <Box>
        {/* Header with Export Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.light' }}>
            📋 Meeting Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip 
              label="Export"
              size="small"
              onClick={exportMeetingNotes}
              sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '11px'
              }}
            />
            <Chip 
              label="Clear"
              size="small"
              onClick={clearMeetingNotes}
              sx={{ 
                background: 'rgba(239, 68, 68, 0.8)',
                color: 'white',
                fontWeight: 500,
                cursor: 'pointer',
                fontSize: '11px'
              }}
            />
          </Box>
        </Box>

        <Stack spacing={2}>
          {/* Summary */}
          {meetingNotes.summary && (
            <Box sx={{ 
              p: 3, 
              bgcolor: '#FFFFFF', 
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#13AA52' }}>
                📄 Summary
              </Typography>
              <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                {meetingNotes.summary}
              </Typography>
            </Box>
          )}

          {/* Action Items */}
          {meetingNotes.actionItems && meetingNotes.actionItems.length > 0 && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(245, 158, 11, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(245, 158, 11, 0.1)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'warning.light' }}>
                ✅ Action Items ({meetingNotes.actionItems.length})
              </Typography>
              {meetingNotes.actionItems.map((item, index) => (
                <Box key={index} sx={{ mb: 1, ml: 1 }}>
                  <Typography variant="caption" sx={{ 
                    color: 'text.primary', 
                    fontWeight: 500,
                    display: 'block'
                  }}>
                    {index + 1}. {item.item}
                  </Typography>
                  {(item.assignee || item.deadline || item.priority) && (
                    <Box sx={{ ml: 1, mt: 0.5 }}>
                      {item.assignee && (
                        <Chip label={`@${item.assignee}`} size="small" sx={{ 
                          mr: 0.5, fontSize: '10px', height: '18px'
                        }} />
                      )}
                      {item.priority && (
                        <Chip 
                          label={item.priority} 
                          size="small" 
                          sx={{ 
                            mr: 0.5, 
                            fontSize: '10px', 
                            height: '18px',
                            background: item.priority === 'high' ? 'rgba(239, 68, 68, 0.8)' :
                                       item.priority === 'medium' ? 'rgba(245, 158, 11, 0.8)' :
                                       'rgba(107, 114, 128, 0.8)',
                            color: 'white'
                          }} 
                        />
                      )}
                      {item.deadline && (
                        <Typography variant="caption" color="text.secondary">
                          Due: {item.deadline}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Decisions */}
          {meetingNotes.decisions && meetingNotes.decisions.length > 0 && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(6, 182, 212, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(6, 182, 212, 0.1)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'secondary.light' }}>
                🎯 Decisions ({meetingNotes.decisions.length})
              </Typography>
              {meetingNotes.decisions.map((decision, index) => (
                <Box key={index} sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ 
                    color: 'text.primary', 
                    fontWeight: 500,
                    display: 'block'
                  }}>
                    {decision.decision}
                  </Typography>
                  {decision.context && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', ml: 1 }}>
                      Context: {decision.context}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Key Points */}
          {meetingNotes.keyPoints && meetingNotes.keyPoints.length > 0 && (
            <Box sx={{ 
              p: 2, 
              bgcolor: 'rgba(16, 185, 129, 0.05)', 
              borderRadius: 2,
              border: '1px solid rgba(16, 185, 129, 0.1)'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'success.light' }}>
                💡 Key Points
              </Typography>
              {meetingNotes.keyPoints.map((point, index) => (
                <Typography key={index} variant="caption" sx={{ 
                  color: 'text.secondary', 
                  display: 'block',
                  mb: 0.5,
                  ml: 1
                }}>
                  • {point}
                </Typography>
              ))}
            </Box>
          )}
        </Stack>
      </Box>
    );
  };

  const renderTopics = () => {
    if (topics.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            🔍 No topics detected yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start speaking to see AI-extracted topics appear
          </Typography>
        </Box>
      );
    }
    
    return (
      <Stack spacing={2}>
        {topics.map((topicData, index) => (
          <Fade in={true} key={index} style={{ transitionDelay: `${index * 100}ms` }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: '#FFFFFF', 
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                border: '1px solid rgba(19, 170, 82, 0.2)',
              }
            }}>
              <Typography variant="caption" color="text.secondary" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                mb: 1.5,
                fontWeight: 500
              }}>
                ⏰ {new Date(topicData.timestamp).toLocaleTimeString()}
              </Typography>
              
              {topicData.topics.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.light' }}>
                    💡 Topics
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {topicData.topics.map((topic, i) => (
                      <Chip 
                        key={i} 
                        label={topic} 
                        size="small" 
                        sx={{
                          backgroundColor: '#13AA52',
                          color: 'white',
                          fontWeight: 500,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: '#128A42',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {topicData.questions.length > 0 && (
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'secondary.light' }}>
                    ❓ Questions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {topicData.questions.map((question, i) => (
                      <Chip 
                        key={i} 
                        label={question} 
                        size="small" 
                        sx={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                          color: 'white',
                          fontWeight: 500,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {topicData.terms.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                    🔤 Terms
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {topicData.terms.map((term, i) => (
                      <Chip 
                        key={i} 
                        label={term} 
                        size="small" 
                        variant="outlined"
                        sx={{
                          borderColor: 'text.secondary',
                          color: 'text.secondary',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: 'text.primary',
                            color: 'text.primary',
                            bgcolor: 'rgba(148, 163, 184, 0.1)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Fade>
        ))}
      </Stack>
    );
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        height: '100vh',
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Clean background - no decoration needed for MongoDB Atlas style */}

        {/* Header */}
        <AppBar position="static" elevation={0} sx={{ 
          backgroundColor: '#FFFFFF',
          color: '#1A1A1A',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
        }}>
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
              <Avatar sx={{ 
                backgroundColor: '#13AA52',
                width: 40,
                height: 40,
                fontSize: '18px',
                fontWeight: 'bold'
              }}>
                M
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  bitscribe
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1 }}>
                  AI Research Assistant
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StatusIndicator 
                connected={ollamaConnected}
                onClick={() => ipcRenderer.send('check-ollama-status')}
                sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              >
                {ollamaConnected ? <PulsingDot /> : <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />}
                <Typography variant="body2">
                  {ollamaConnected ? 'AI Connected' : 'AI Disconnected'}
                </Typography>
              </StatusIndicator>

              {/* LLM Provider Selector */}
              {settings && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={settings?.llm?.provider || 'ollama'}
                    onChange={(e) => {
                      const newProvider = e.target.value;
                      const newSettings = {
                        ...settings,
                        llm: { ...(settings?.llm || {}), provider: newProvider }
                      };
                      setSettings(newSettings);
                      handleSettingsUpdate(newSettings);
                    }}
                  displayEmpty
                  variant="outlined"
                  sx={{
                    height: 32,
                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: 1,
                    color: 'primary.light',
                    fontSize: '13px',
                    '& .MuiSelect-select': {
                      py: 0.5,
                      px: 1.5
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    },
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.15)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  {llmProviders.map(provider => (
                    <MenuItem key={provider.id} value={provider.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '13px' }}>
                          {provider.name}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              )}
              
              {wordCount > 0 && (
                <Chip 
                  label={`${wordCount} words`} 
                  size="small" 
                  variant="outlined"
                  sx={{ borderColor: 'primary.main', color: 'primary.light' }}
                />
              )}
              
              <IconButton 
                onClick={openSettings}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.light' }
                }}
                title="Settings"
              >
                ⚙️
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content Area with New Layout */}
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          {!ollamaConnected && (
            <Fade in={!ollamaConnected}>
              <Alert 
                severity="warning" 
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  right: 16,
                  zIndex: 10,
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: 'warning.light',
                  '& .MuiAlert-icon': { color: 'warning.main' }
                }}
              >
                Ollama AI is not connected. Please ensure Ollama is running locally on port 11434.
              </Alert>
            </Fade>
          )}

          {/* Left Panel: Conversation Topics */}
          <Box sx={{ 
            width: '360px', 
            display: 'flex', 
            flexDirection: 'column', 
            backgroundColor: '#F5F7FA',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            p: 4,
            gap: 3,
            overflow: 'hidden'
          }}>
            {/* Action Buttons Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                size="small"
                onClick={triggerResearchForCurrentTranscript}
                disabled={!transcript || transcript.length < 50}
                sx={{ 
                  flex: 1,
                  fontSize: '12px',
                  py: 0.75,
                  borderColor: 'secondary.main',
                  color: 'secondary.light',
                  '&:hover': { 
                    bgcolor: 'rgba(6, 182, 212, 0.1)',
                    borderColor: 'secondary.light'
                  },
                  '&:disabled': {
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    color: 'text.disabled'
                  }
                }}
              >
                🔍 Research Now
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                onClick={generateQuickReport}
                disabled={!transcript || transcript.length < 50}
                sx={{ 
                  flex: 1,
                  fontSize: '12px',
                  py: 0.75,
                  borderColor: 'success.main',
                  color: 'success.light',
                  '&:hover': { 
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'success.light'
                  },
                  '&:disabled': {
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    color: 'text.disabled'
                  }
                }}
              >
                📝 Quick Report
              </Button>
            </Box>

            {/* Recording Status - Compact */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
              <RecordButton
                recording={isListening}
                onClick={isListening ? stopTranscription : startTranscription}
                sx={{ width: 48, height: 48 }}
              >
                {isListening ? '⏹' : '🎤'}
              </RecordButton>
              
              <Box sx={{ flex: 1 }}>
                {isListening && (
                  <Chip 
                    label="🔴 LIVE" 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#D32F2F',
                      color: 'white',
                      fontWeight: 600,
                      animation: 'pulse 2s infinite',
                      fontSize: '11px',
                      borderRadius: 2
                    }}
                  />
                )}
                
                {topics.length > 0 && (
                  <Chip 
                    label={`${topics.length} topics`} 
                    size="small" 
                    sx={{ 
                      ml: 1,
                      backgroundColor: '#13AA52',
                      color: 'white',
                      fontSize: '11px',
                      borderRadius: 2
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Primary Action: Generate Report Button */}
            {transcript.length > 50 && !isListening && (
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => {
                    loadTemplates();
                    setShowTemplateSelection(true);
                  }}
                  sx={{ 
                    py: 2,
                    background: 'linear-gradient(135deg, #13AA52 0%, #1CC45F 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '16px',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(19, 170, 82, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0E7C3A 0%, #13AA52 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(19, 170, 82, 0.4)'
                    }
                  }}
                  startIcon={<Typography sx={{ fontSize: '24px' }}>📋</Typography>}
                >
                  Generate Report from Transcript
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  Transform your {transcript.split(' ').length} words into a comprehensive report
                </Typography>
              </Box>
            )}

            {/* Conversation Topics Section */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>
                🎯 Conversation Topics
              </Typography>
              
              {topics.length === 0 ? (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  border: '2px dashed rgba(148, 163, 184, 0.2)',
                  borderRadius: 2,
                  bgcolor: 'rgba(148, 163, 184, 0.05)'
                }}>
                  <Typography color="text.secondary" sx={{ mb: 1, fontSize: '14px' }}>
                    🎤 Start recording to extract topics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                    Topics will appear here in real-time
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {topics.map((topicData, index) => (
                    <Card key={index} sx={{ 
                      p: 2,
                      background: 'rgba(99, 102, 241, 0.03)',
                      border: '1px solid rgba(99, 102, 241, 0.1)',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)'
                      }
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
                          ⏰ {new Date(topicData.timestamp).toLocaleTimeString()}
                        </Typography>
                        <Chip 
                          label={`${topicData.topics?.length || 0}`} 
                          size="small" 
                          sx={{ 
                            height: '20px',
                            fontSize: '10px',
                            bgcolor: 'primary.main',
                            color: 'white'
                          }}
                        />
                      </Box>
                      
                      {topicData.topics && topicData.topics.length > 0 && (
                        <Box sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {topicData.topics.slice(0, 3).map((topic, i) => (
                              <Chip 
                                key={i} 
                                label={topic} 
                                size="small" 
                                variant="outlined"
                                sx={{ 
                                  height: '24px',
                                  fontSize: '11px',
                                  borderColor: 'primary.main',
                                  color: 'primary.light',
                                  bgcolor: 'rgba(99, 102, 241, 0.05)'
                                }}
                              />
                            ))}
                            {topicData.topics.length > 3 && (
                              <Chip 
                                label={`+${topicData.topics.length - 3}`} 
                                size="small" 
                                sx={{ 
                                  height: '24px',
                                  fontSize: '10px',
                                  bgcolor: 'rgba(148, 163, 184, 0.1)',
                                  color: 'text.secondary'
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => triggerResearchForTopic(topicData)}
                          sx={{ 
                            fontSize: '10px', 
                            py: 0.5,
                            px: 1.5,
                            flex: 1,
                            borderColor: 'rgba(6, 182, 212, 0.3)',
                            color: 'secondary.light',
                            '&:hover': { 
                              bgcolor: 'rgba(6, 182, 212, 0.1)',
                              borderColor: 'secondary.main'
                            }
                          }}
                        >
                          🔍 Research
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => {
                            loadTemplates();
                            setShowTemplateSelection(true);
                          }}
                          sx={{ 
                            fontSize: '10px', 
                            py: 0.5,
                            px: 1.5,
                            flex: 1,
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                            color: 'success.main',
                            '&:hover': { 
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              borderColor: 'success.main'
                            }
                          }}
                        >
                          📝 Report
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: 3,
            gap: 2,
            overflow: 'hidden'
          }}>
            {/* Main conversation content - with view mode toggle */}
            <Card sx={{ 
              flex: 1,
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0 // Important for flexbox children
            }}>
              {/* Header with view mode toggle */}
              <Box sx={{ 
                p: 3, 
                pb: 0,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexShrink: 0
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {viewMode === 'transcript' && '📝 Live Transcript'}
                  {viewMode === 'captions' && '💬 Live Captions'}
                  {viewMode === 'audiogram' && '🎵 Audio Visualization'}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label="Audiogram"
                    size="small"
                    color={viewMode === 'audiogram' ? 'primary' : 'default'}
                    onClick={() => setViewMode('audiogram')}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="Captions"
                    size="small"
                    color={viewMode === 'captions' ? 'primary' : 'default'}
                    onClick={() => setViewMode('captions')}
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="Full Text"
                    size="small"
                    color={viewMode === 'transcript' ? 'primary' : 'default'}
                    onClick={() => setViewMode('transcript')}
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>
              </Box>

              {/* Content area */}
              <Box sx={{ flex: 1, minHeight: 0, p: 3, pt: 2 }}>
                {viewMode === 'audiogram' && (
                  <Audiogram isListening={isListening} />
                )}
                
                {viewMode === 'captions' && (
                  <LiveCaptions captions={recentCaptions} />
                )}
                
                {viewMode === 'transcript' && (
                  <Box 
                    ref={transcriptRef}
                    sx={{ 
                      height: '100%',
                      overflow: 'auto',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      color: 'text.primary',
                      backgroundColor: '#F8F9FA',
                      p: 2,
                      borderRadius: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(148, 163, 184, 0.1)',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(148, 163, 184, 0.3)',
                        borderRadius: '4px',
                        '&:hover': {
                          background: 'rgba(148, 163, 184, 0.5)',
                        }
                      }
                    }}
                  >
                    {transcript || 'Full transcript will appear here when you start recording...'}
                  </Box>
                )}
              </Box>
            </Card>
          </Box>

          {/* Right Sidebar: Research & Notes */}
          <Box sx={{ 
            width: '380px', 
            display: 'flex', 
            flexDirection: 'column', 
            borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
            bgcolor: '#F5F7FA',
            overflow: 'hidden',
            p: 4,
            gap: 3,
            height: '100vh' // Ensure full height
          }}>
            {/* Real-time Insights Section */}
            <Box sx={{ 
              flexGrow: 1, 
              minHeight: '300px', // Minimum height to prevent crushing
              maxHeight: 'calc(100vh - 400px)', // Leave space for Notes section
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  🧠 Live Insights
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => setShowInsightsPanel(!showInsightsPanel)}
                  sx={{ color: 'text.secondary' }}
                >
                  {showInsightsPanel ? '👁️' : '👁️‍🗨️'}
                </IconButton>
              </Box>
              
              {showInsightsPanel && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {realtimeInsights.length === 0 && research.length === 0 ? (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 3,
                      border: '2px dashed rgba(148, 163, 184, 0.2)',
                      borderRadius: 2,
                      bgcolor: 'rgba(148, 163, 184, 0.05)'
                    }}>
                      <Typography color="text.secondary" sx={{ mb: 1, fontSize: '14px' }}>
                        🔍 Real-time insights will appear here
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                        AI is analyzing your conversation...
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={1.5}>
                      {/* Real-time insights */}
                      {realtimeInsights.slice(-5).map((insight, index) => (
                        <Card 
                          key={`insight-${insight.timestamp}-${index}`}
                          sx={{ 
                            p: 1.5, 
                            bgcolor: getInsightBackgroundColor(insight.type),
                            border: `1px solid ${getInsightBorderColor(insight.type)}`,
                            borderRadius: 2,
                            opacity: 0.95,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': { opacity: 1, transform: 'translateY(-1px)' }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" sx={{ 
                              fontSize: '10px',
                              fontWeight: 600,
                              color: getInsightTextColor(insight.type),
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}>
                              {getInsightIcon(insight.type)} {insight.type}
                            </Typography>
                            <Box sx={{ flex: 1 }} />
                            <Chip 
                              label={`${Math.round(insight.confidence * 100)}%`}
                              size="small"
                              sx={{ 
                                height: '16px',
                                fontSize: '9px',
                                bgcolor: 'rgba(255,255,255,0.2)',
                                color: 'text.primary'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ 
                            fontSize: '12px',
                            lineHeight: 1.4,
                            color: 'text.primary'
                          }}>
                            {insight.content}
                          </Typography>
                          {insight.action && (
                            <Typography variant="caption" sx={{ 
                              fontSize: '11px',
                              color: 'text.secondary',
                              fontStyle: 'italic',
                              mt: 0.5,
                              display: 'block'
                            }}>
                              💡 {insight.action}
                            </Typography>
                          )}
                        </Card>
                      ))}
                      
                      {/* Traditional research insights */}
                      {research.slice(-2).map((item, index) => (
                        <Card 
                          key={`research-${index}`}
                          sx={{ 
                            p: 1.5, 
                            bgcolor: 'rgba(6, 182, 212, 0.05)', 
                            borderRadius: 2,
                            border: '1px solid rgba(6, 182, 212, 0.1)',
                          }}
                        >
                          <Typography variant="body2" sx={{ 
                            fontWeight: 600, 
                            mb: 0.5, 
                            color: 'secondary.light',
                            fontSize: '12px'
                          }}>
                            🔍 {item.topic || 'Research'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '11px' }}>
                            {item.summary || (item.sources && item.sources[0]?.summary) || 'Research insight available'}
                          </Typography>
                        </Card>
                      ))}
                    </Stack>
                  )}
                </Box>
              )}
            </Box>

            {/* Quick Notes & Summary Section */}
            <Box sx={{ 
              flexShrink: 0, // Prevent shrinking
              height: '320px', // Fixed height to prevent overlap
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              p: 2
            }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label="📋 Notes" 
                  size="small" 
                  onClick={() => setActiveTab(0)}
                  variant={activeTab === 0 ? "filled" : "outlined"}
                  sx={{ fontSize: '12px' }}
                />
                <Chip 
                  label="📄 Summary" 
                  size="small" 
                  onClick={() => setActiveTab(1)}
                  variant={activeTab === 1 ? "filled" : "outlined"}
                  sx={{ fontSize: '12px' }}
                />
                <Chip 
                  label="📊 Slides" 
                  size="small" 
                  onClick={() => setActiveTab(2)}
                  variant={activeTab === 2 ? "filled" : "outlined"}
                  sx={{ fontSize: '12px' }}
                />
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {activeTab === 0 && renderMeetingNotes()}
                
                {activeTab === 1 && (
                  <Box sx={{ 
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#F8F9FA',
                    height: '100%'
                  }}>
                    {executiveSummary ? (
                      <Typography variant="body2" sx={{ 
                        fontSize: '12px',
                        lineHeight: 1.4,
                        color: 'text.primary'
                      }}>
                        {executiveSummary}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary" sx={{ fontSize: '12px', fontStyle: 'italic' }}>
                        Executive summary will appear as conversation progresses...
                      </Typography>
                    )}
                  </Box>
                )}
                
                {activeTab === 2 && (
                  <Box sx={{ 
                    height: '100%',
                    overflow: 'auto'
                  }}>
                    {currentSlides.length > 0 ? (
                      <Stack spacing={1}>
                        {currentSlides.map((slide, index) => (
                          <Card key={index} sx={{ p: 1.5, bgcolor: 'rgba(99, 102, 241, 0.05)' }}>
                            <Typography variant="subtitle2" sx={{ 
                              fontSize: '13px', 
                              fontWeight: 600, 
                              mb: 1,
                              color: 'primary.main'
                            }}>
                              {slide.title}
                            </Typography>
                            {slide.bullets.map((bullet, bulletIndex) => (
                              <Typography key={bulletIndex} variant="body2" sx={{ 
                                fontSize: '11px',
                                lineHeight: 1.3,
                                color: 'text.secondary',
                                ml: 1,
                                mb: 0.5
                              }}>
                                • {bullet}
                              </Typography>
                            ))}
                          </Card>
                        ))}
                      </Stack>
                    ) : (
                      <Typography color="text.secondary" sx={{ fontSize: '12px', fontStyle: 'italic' }}>
                        Slide points will be generated every 5 minutes...
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Recent Section */}
            <Box sx={{ height: '200px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '16px' }}>
                📝 Recent
              </Typography>
              
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderRadius: 2,
                p: 2,
                bgcolor: '#F5F7FA'
              }}>
                {transcript ? (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      lineHeight: 1.4,
                      whiteSpace: 'pre-wrap',
                      color: 'text.secondary'
                    }}
                  >
                    {transcript.split('\n').slice(-10).join('\n')}
                  </Typography>
                ) : (
                  <Typography color="text.secondary" sx={{ fontSize: '12px', fontStyle: 'italic' }}>
                    Recent transcript will appear here...
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Settings and Other Dialogs */}
        {showSettings && (
          <Dialog
            open={true}
            onClose={() => setShowSettings(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                bgcolor: 'background.paper',
                backgroundImage: 'none',
                minHeight: '80vh'
              }
            }}
          >
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                ⚙️ Settings
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="General" />
                  <Tab label="AI Providers" />
                  <Tab label="RAG Documents" />
                  <Tab label="Templates" />
                  <Tab label="Reports" />
                  <Tab label="Metrics" />
                  <Tab label="Advanced" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                {/* General Settings */}
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>General Settings</Typography>
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Auto-save transcripts"
                          secondary="Automatically save conversation transcripts"
                        />
                        <ListItemSecondaryAction>
                          <Switch
                            checked={settings?.autoSave || false}
                            onChange={(e) => handleSettingsUpdate({
                              ...settings,
                              autoSave: e.target.checked
                            })}
                          />
                        </ListItemSecondaryAction>
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Dark mode"
                          secondary="Use dark theme (currently always on)"
                        />
                        <ListItemSecondaryAction>
                          <Switch checked={true} disabled />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                {/* AI Providers */}
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>AI Provider Configuration</Typography>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>Active Provider</Typography>
                      <Select
                        value={settings?.llm?.provider || 'ollama'}
                        onChange={(e) => handleSettingsUpdate({
                          ...settings,
                          llm: { ...(settings?.llm || {}), provider: e.target.value }
                        })}
                      >
                        {llmProviders.map(provider => (
                          <MenuItem key={provider.id} value={provider.id}>
                            {provider.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" gutterBottom>Provider Status</Typography>
                      {llmProviders.map(provider => (
                        <Box key={provider.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2">{provider.name}</Typography>
                            <Button
                              size="small"
                              onClick={() => testProviderConnection(provider.id)}
                              disabled={testingConnection}
                            >
                              Test Connection
                            </Button>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {provider.id === 'ollama' && 'Local Ollama instance'}
                            {provider.id === 'openai' && 'OpenAI API'}
                            {provider.id === 'anthropic' && 'Anthropic Claude API'}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                {/* RAG Documents */}
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" gutterBottom>📚 RAG Document Management</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Upload best practice documents to enhance AI analysis with your organization's knowledge
                    </Typography>

                    {/* Document Upload Section */}
                    <Paper sx={{ p: 3, mb: 3, border: '2px dashed', borderColor: 'primary.main', borderRadius: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>📤 Upload Documents</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Supported formats: PDF, DOCX, TXT, MD
                        </Typography>
                        <input
                          type="file"
                          id="rag-file-upload"
                          multiple
                          accept=".pdf,.docx,.txt,.md"
                          style={{ display: 'none' }}
                          onChange={(e) => handleRAGFileUpload(e.target.files)}
                        />
                        <Button
                          variant="contained"
                          onClick={() => document.getElementById('rag-file-upload').click()}
                          startIcon="📁"
                        >
                          Choose Files
                        </Button>
                      </Box>
                    </Paper>

                    {/* RAG Settings */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>⚙️ RAG Settings</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Typography variant="body2" gutterBottom>Enable RAG Enhancement</Typography>
                          <Switch
                            checked={settings?.rag?.enabled || false}
                            onChange={(e) => handleSettingsUpdate({
                              ...settings,
                              rag: { ...settings?.rag, enabled: e.target.checked }
                            })}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" gutterBottom>
                            Relevance Threshold: {settings?.rag?.threshold || 0.7}
                          </Typography>
                          <TextField
                            type="number"
                            size="small"
                            inputProps={{ min: 0.1, max: 1.0, step: 0.1 }}
                            value={settings?.rag?.threshold || 0.7}
                            onChange={(e) => handleSettingsUpdate({
                              ...settings,
                              rag: { ...settings?.rag, threshold: parseFloat(e.target.value) }
                            })}
                          />
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Document List */}
                    <Paper sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">📋 Uploaded Documents</Typography>
                        <Button size="small" onClick={() => loadRAGDocuments()}>
                          Refresh
                        </Button>
                      </Box>
                      
                      {loadingRAGDocuments ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                          <CircularProgress />
                        </Box>
                      ) : ragDocuments.length === 0 ? (
                        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                          No documents uploaded yet
                        </Typography>
                      ) : (
                        <List>
                          {ragDocuments.map((doc) => (
                            <ListItem key={doc.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                              <ListItemText
                                primary={doc.fileName}
                                secondary={`${doc.wordCount} words • ${doc.fileType} • ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                              />
                              <ListItemSecondaryAction>
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => deleteRAGDocument(doc.id)}
                                >
                                  Delete
                                </Button>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </Paper>

                    {/* RAG Stats */}
                    {ragStats && (
                      <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>📊 RAG Statistics</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">Total Documents</Typography>
                            <Typography variant="h4">{ragStats.totalDocuments}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">Total Chunks</Typography>
                            <Typography variant="h4">{ragStats.totalChunks}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">Avg Chunks/Doc</Typography>
                            <Typography variant="h4">{ragStats.avgChunksPerDoc}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                {/* Templates */}
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Report Templates</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" onClick={() => loadTemplates()}>
                        Refresh
                      </Button>
                      <Button size="small" onClick={() => exportAllTemplates()}>
                        Export All
                      </Button>
                      <Button 
                        size="small" 
                        onClick={async () => {
                          const result = await ipcRenderer.invoke('force-add-mongodb-template');
                          if (result.success) {
                            setSnackbar({ open: true, message: 'MongoDB template added!', severity: 'success' });
                            loadTemplates();
                          } else {
                            setSnackbar({ open: true, message: 'Failed to add MongoDB template', severity: 'error' });
                          }
                        }}
                        sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                      >
                        Add MongoDB Template
                      </Button>
                    </Box>
                  </Box>

                  {loadingTemplates ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {templates.map((template) => (
                        <ListItem key={template._id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                          <ListItemText
                            primary={template.name}
                            secondary={template.description}
                          />
                          <ListItemSecondaryAction>
                            <IconButton size="small" onClick={() => exportTemplate(template._id)}>
                              📤
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={4}>
                {/* Reports */}
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Generated Reports</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant={reportViewMode === 'generated' ? 'contained' : 'outlined'}
                        onClick={() => setReportViewMode('generated')}
                      >
                        Generated
                      </Button>
                      <Button 
                        size="small"
                        variant={reportViewMode === 'exported' ? 'contained' : 'outlined'}
                        onClick={() => setReportViewMode('exported')}
                      >
                        Exported
                      </Button>
                      <Button 
                        size="small"
                        variant={reportViewMode === 'favorites' ? 'contained' : 'outlined'}
                        onClick={() => setReportViewMode('favorites')}
                      >
                        Favorites
                      </Button>
                    </Box>
                  </Box>

                  {loadingReports || loadingExportedReports ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <List>
                      {(reportViewMode === 'generated' ? userReports : exportedReports).map((report) => (
                        <ListItem key={report._id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                          <ListItemText
                            primary={report.metadata?.title || report.templateName || 'Untitled Report'}
                            secondary={report.createdAt || report.generatedAt || report.timestamp ? 
                              new Date(report.createdAt || report.generatedAt || report.timestamp).toLocaleString() : 
                              'Date not available'}
                          />
                          <ListItemSecondaryAction>
                            <IconButton size="small" onClick={() => viewReport(report._id)}>
                              👁️
                            </IconButton>
                            {reportViewMode === 'generated' && (
                              <IconButton size="small" onClick={() => exportGeneratedReport(report._id)}>
                                📤
                              </IconButton>
                            )}
                            {reportViewMode === 'exported' && (
                              <IconButton size="small" onClick={() => deleteExportedReport(report._id)}>
                                🗑️
                              </IconButton>
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={5}>
                {/* Metrics */}
                <Stack spacing={3}>
                  <Typography variant="h6">Usage Metrics</Typography>
                  
                  {loadingMetrics ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : usageMetrics ? (
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">Total Sessions</Typography>
                          <Typography variant="h4">{usageMetrics.totalSessions || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">Total Requests</Typography>
                          <Typography variant="h4">{usageMetrics.totalRequests || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">Avg Requests/Session</Typography>
                          <Typography variant="h4">{usageMetrics.averageRequestsPerSession?.toFixed(1) || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="body2" color="text.secondary">Current Provider</Typography>
                          <Typography variant="h6">{usageMetrics.currentProvider || 'None'}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography color="text.secondary">No metrics available</Typography>
                  )}

                  <Box sx={{ mt: 3 }}>
                    <Button variant="outlined" onClick={() => exportUsageData()}>
                      Export Usage Data
                    </Button>
                  </Box>
                </Stack>
              </TabPanel>

              <TabPanel value={activeTab} index={6}>
                {/* Advanced Settings */}
                <Stack spacing={3}>
                  <Typography variant="h6">Advanced Settings</Typography>
                  
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>MongoDB Connection String</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={settings?.mongodb?.uri || ''}
                      onChange={(e) => handleSettingsUpdate({
                        ...settings,
                        mongodb: { ...(settings?.mongodb || {}), uri: e.target.value }
                      })}
                      placeholder="mongodb://localhost:27017/auracle"
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>Processing Buffer Size (ms)</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={settings?.processing?.bufferSize || 5000}
                      onChange={(e) => handleSettingsUpdate({
                        ...settings,
                        processing: { ...(settings?.processing || {}), bufferSize: parseInt(e.target.value) }
                      })}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>Max Transcript Length</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      value={settings?.limits?.transcriptLength || 10000}
                      onChange={(e) => handleSettingsUpdate({
                        ...settings,
                        limits: { ...(settings?.limits || {}), transcriptLength: parseInt(e.target.value) }
                      })}
                    />
                  </Box>
                </Stack>
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSettings(false)}>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}


        {/* Post-Recording Report Generation Dialog */}
        {showTemplateSelection && (
          <Dialog
            open={showTemplateSelection}
            onClose={() => setShowTemplateSelection(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
              }
            }}
          >
            <DialogTitle sx={{ 
              background: 'linear-gradient(135deg, #13AA52 0%, #1CC45F 100%)',
              color: 'white',
              py: 3
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  📋 Generate Your Report
                </Typography>
                <Chip 
                  label={`${transcript.split(' ').length} words captured`} 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 500
                  }} 
                />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Transform your conversation into a comprehensive report using AI-powered templates
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                {/* RAG Enhancement Status */}
                {settings?.rag?.enabled && (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <AlertTitle>🧠 RAG Enhancement Active</AlertTitle>
                    Your report will be enhanced with insights from {ragDocuments.length} knowledge documents
                  </Alert>
                )}

                {/* Quick Stats */}
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                      <Typography variant="h4">{topics.length}</Typography>
                      <Typography variant="body2">Topics Identified</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                      <Typography variant="h4">{Math.ceil(transcript.split(' ').length / 250)}</Typography>
                      <Typography variant="body2">Minutes Recorded</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
                      <Typography variant="h4">{templates.length}</Typography>
                      <Typography variant="body2">Templates Available</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Template Selection */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Choose a Report Template
                  </Typography>
                  {loadingTemplates ? (
                    <CircularProgress />
                  ) : templates.length === 0 ? (
                    <Alert severity="warning">No templates available. Please create a template first.</Alert>
                  ) : (
                    <Grid container spacing={2}>
                      {templates.map((template) => (
                        <Grid item xs={12} sm={6} key={template._id}>
                          <Card 
                            sx={{ 
                              p: 2, 
                              cursor: 'pointer',
                              border: selectedTemplate?._id === template._id ? '2px solid' : '1px solid',
                              borderColor: selectedTemplate?._id === template._id ? 'primary.main' : 'divider',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 2
                              }
                            }}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Box sx={{ 
                                width: 48, 
                                height: 48, 
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: selectedTemplate?._id === template._id ? 'primary.main' : 'primary.light',
                                color: 'white',
                                fontSize: '24px'
                              }}>
                                {template.icon || (
                                  template.category === 'Technology' ? '💻' :
                                  template.category === 'interview' ? '🎤' : 
                                  template.category === 'meeting' ? '📅' : 
                                  template.category === 'research' ? '🔬' : 
                                  template.category === 'Business' ? '💼' : '📄'
                                )}
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {template.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {template.description}
                                </Typography>
                                <Chip 
                                  label={template.category} 
                                  size="small" 
                                  sx={{ mt: 0.5 }}
                                  color={selectedTemplate?._id === template._id ? 'primary' : 'default'}
                                />
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setShowTemplateSelection(false)}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      if (selectedTemplate) {
                        generateReport(selectedTemplate._id);
                        setShowTemplateSelection(false);
                      }
                    }}
                    disabled={!selectedTemplate || generatingReport}
                    size="large"
                    sx={{ px: 4 }}
                    startIcon={generatingReport ? <CircularProgress size={20} /> : '✨'}
                  >
                    {generatingReport ? 'Generating...' : 'Generate Report'}
                  </Button>
                </Box>
              </Stack>
            </DialogContent>
          </Dialog>
        )}

        {/* Report Viewer Dialog */}
        {showReportDialog && generatedReport && (
          <Dialog
            open={showReportDialog}
            onClose={() => setShowReportDialog(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                height: '90vh',
                maxHeight: '90vh'
              }
            }}
          >
            <DialogTitle sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">
                  📄 {generatedReport.metadata?.title || 'Generated Report'}
                </Typography>
                <Chip 
                  label={generatedReport.template?.name || 'Report'} 
                  size="small" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
              <IconButton
                size="small"
                onClick={() => setShowReportDialog(false)}
                sx={{ color: 'white' }}
              >
                ✕
              </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0, height: 'calc(100% - 120px)', overflow: 'auto' }}>
              <Box sx={{ p: 4, bgcolor: 'background.default' }}>
                <Paper sx={{ p: 4, maxWidth: '900px', mx: 'auto' }}>
                  <Box sx={{ mb: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">
                      Generated on {generatedReport.generatedAt ? new Date(generatedReport.generatedAt).toLocaleString() : 'Just now'}
                    </Typography>
                  </Box>
                  
                  {/* Render Markdown content */}
                  <Box sx={{ 
                    '& h1': { fontSize: '2rem', fontWeight: 600, mt: 3, mb: 2 },
                    '& h2': { fontSize: '1.5rem', fontWeight: 600, mt: 3, mb: 2 },
                    '& h3': { fontSize: '1.25rem', fontWeight: 500, mt: 2, mb: 1 },
                    '& p': { mb: 1.5, lineHeight: 1.6 },
                    '& ul, & ol': { mb: 2, pl: 3 },
                    '& li': { mb: 0.5 },
                    '& blockquote': { 
                      borderLeft: '4px solid',
                      borderColor: 'primary.main',
                      pl: 2,
                      ml: 0,
                      fontStyle: 'italic',
                      color: 'text.secondary'
                    },
                    '& code': { 
                      bgcolor: 'grey.100',
                      p: 0.5,
                      borderRadius: 0.5,
                      fontFamily: 'monospace',
                      fontSize: '0.9em'
                    },
                    '& pre': {
                      bgcolor: 'grey.100',
                      p: 2,
                      borderRadius: 1,
                      overflow: 'auto',
                      mb: 2,
                      '& code': {
                        bgcolor: 'transparent',
                        p: 0
                      }
                    },
                    '& table': {
                      width: '100%',
                      borderCollapse: 'collapse',
                      mb: 2,
                      '& th, & td': {
                        border: '1px solid',
                        borderColor: 'divider',
                        p: 1
                      },
                      '& th': {
                        bgcolor: 'grey.100',
                        fontWeight: 600
                      }
                    },
                    '& a': {
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }
                  }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {generatedReport.content}
                    </ReactMarkdown>
                  </Box>
                </Paper>
              </Box>
            </DialogContent>
            
            <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Button onClick={() => setShowReportDialog(false)}>
                Close
              </Button>
              <Button 
                variant="contained" 
                startIcon="📤"
                onClick={async () => {
                  if (generatedReport.id) {
                    await exportGeneratedReport(generatedReport.id);
                  }
                }}
              >
                Export Report
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Box>
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
); 