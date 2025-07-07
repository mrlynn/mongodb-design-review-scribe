# Creating App Icons for MongoDB Design Review Scribe

## Icon Requirements

The app needs icons in the following formats:

### macOS
- **File**: `build/icons/mac/icon.icns`
- **Format**: ICNS (Apple Icon Image)
- **Sizes needed**: 16x16, 32x32, 64x64, 128x128, 256x256, 512x512, 1024x1024

### Windows
- **File**: `build/icons/windows/icon.ico`
- **Format**: ICO (Windows Icon)
- **Sizes needed**: 16x16, 32x32, 48x48, 64x64, 128x128, 256x256

### Linux
- **Directory**: `build/icons/linux/`
- **Format**: PNG
- **Files needed**:
  - `16x16.png`
  - `32x32.png`
  - `48x48.png`
  - `64x64.png`
  - `128x128.png`
  - `256x256.png`
  - `512x512.png`
  - `1024x1024.png`

## Creating Icons

### Option 1: Using a Professional Tool
1. Create a 1024x1024 PNG with your MongoDB-themed design
2. Use a tool like:
   - **macOS**: [Image2icon](https://img2icnsapp.com/) or `iconutil`
   - **Online**: [CloudConvert](https://cloudconvert.com/png-to-icns)
   - **Cross-platform**: [electron-icon-builder](https://github.com/safu9/electron-icon-builder)

### Option 2: Using Command Line (macOS)

1. Create a base 1024x1024 PNG file named `icon.png`
2. Create the iconset:

```bash
mkdir icon.iconset
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
cp icon.png icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
mv icon.icns build/icons/mac/
```

### Option 3: Using electron-icon-builder

Install the tool:
```bash
npm install -g electron-icon-builder
```

Create icons from a single PNG:
```bash
electron-icon-builder --input=icon.png --output=build/icons
```

## Design Suggestions

For a MongoDB Design Review Scribe icon, consider:
- MongoDB leaf logo (🍃) as the base
- Add elements suggesting analysis/review (magnifying glass, document, chart)
- Use MongoDB brand colors:
  - Primary Green: #13AA52
  - Dark Green: #0E7C3A
  - Light Green: #1CC45F

## Quick Solution: Using an Emoji as Icon

For testing purposes, you can create a simple icon using an emoji:

1. Create a text file with just the 🍃 emoji
2. Take a screenshot
3. Crop and save as PNG
4. Use the conversion tools above

## Setting the Icon in Development

For development (without building), you can set the icon directly in the main window:

```javascript
// In app/main.js
mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  icon: path.join(__dirname, '../build/icons/mac/icon.icns'), // macOS
  // icon: path.join(__dirname, '../build/icons/windows/icon.ico'), // Windows
  // icon: path.join(__dirname, '../build/icons/linux/512x512.png'), // Linux
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
});
```