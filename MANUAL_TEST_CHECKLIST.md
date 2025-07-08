# 🔍 Manual Speaker Detection Testing Checklist

## Step-by-Step Debugging

### Step 1: Check if Settings Panel is Working
1. Open Bitscribe app (should be running now)
2. Click the **Settings** button (⚙️ icon or menu)
3. **Look for the "General" tab** in the settings dialog
4. **Verify the General tab loads without errors**

### Step 2: Look for Speaker Detection Toggle
In the General Settings tab, you should see:
- ✅ Auto-save transcripts (toggle)
- ✅ Dark mode (toggle - disabled)  
- ✅ Audio Input Device (dropdown)
- **🔍 Speaker Detection (toggle) ← THIS IS WHAT WE'RE LOOKING FOR**

The Speaker Detection toggle should appear as:
```
Speaker Detection                           [  ○  ]
Identify different speakers in conversations (Speaker 1, Speaker 2, etc.)
```

### Step 3: Test the Toggle
1. **Toggle Speaker Detection ON**
2. **Verify it shows as enabled**
3. **Close settings and reopen** - verify setting persists

### Step 4: Test Recording with Speaker Detection
1. **Start recording** (🎤 button)
2. **Look for visual indicators**:
   - 🔴 LIVE chip (should appear)
   - **👥 Speakers chip (should appear if speaker detection is ON)**

### Step 5: Test Transcript Display
1. **Switch to "Transcript" view** (use the chips: Audiogram | Captions | **Transcript** | Research)
2. **Speak some test words**
3. **Look for speaker formatting**:
   - Without speaker detection: `Hello there`
   - **With speaker detection: `[Speaker 1] Hello there` (with colored chip)**

## 🚨 Troubleshooting

### If Speaker Detection Toggle is Missing:
1. **Check React Console**: Open Developer Tools (Cmd+Opt+I) and look for errors
2. **Scroll Down**: The toggle might be below other settings
3. **Check Settings Tab**: Make sure you're in "General" tab (first tab)

### If Toggle Exists but Indicator Missing:
1. **Check settings are saved**: Close/reopen settings to verify toggle state
2. **Check recording status**: The 👥 Speakers chip only appears WHILE recording
3. **Check console logs**: Look for "Speaker detection" messages

### If Transcript Shows No Speaker Labels:
1. **Remember**: We don't have actual diarization models installed
2. **Expected behavior**: Should fallback to "Speaker 1:" for all text when enabled
3. **Check transcript content**: Look for "Speaker 1:" prefixes

## 🎯 Expected Results

### ✅ Working Speaker Detection:
- Toggle visible in General settings
- Toggle can be turned on/off and persists
- 👥 Speakers indicator appears during recording
- Transcript shows "Speaker 1:" prefixes (even without real speaker detection)
- Colored speaker chips in transcript view

### ❌ Broken Speaker Detection:
- Toggle not visible in settings
- React errors in console
- No 👥 Speakers indicator when recording
- No speaker formatting in transcript

## 🔧 Debug Commands

If things aren't working, try these in the app's console (Developer Tools):

```javascript
// Check if settings include speaker detection
localStorage.getItem('bitscribe-config')

// Check current settings state
console.log(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)
```

## 📞 What to Report Back

Please let me know:
1. **Is the Speaker Detection toggle visible in General Settings?** (Yes/No)
2. **If yes, does it respond to clicks?** (Yes/No)
3. **Does the 👥 Speakers indicator appear when recording?** (Yes/No)
4. **Are there any console errors?** (Copy any red errors)
5. **What does the transcript look like?** (Copy a sample)

This will help me identify exactly what's not working!