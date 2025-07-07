#!/usr/bin/env node

// Simple script to generate a temporary MongoDB-themed icon
// This creates a basic green icon with "M" for MongoDB
// For production, replace with a professionally designed icon

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgIcon = `
<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mongoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#13AA52;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0E7C3A;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Background Circle -->
  <circle cx="512" cy="512" r="480" fill="url(#mongoGradient)" />
  
  <!-- MongoDB Leaf Shape (simplified) -->
  <path d="M 512 200 Q 400 400 512 800 Q 624 400 512 200 Z" 
        fill="white" 
        opacity="0.9" />
  
  <!-- Inner Leaf Detail -->
  <path d="M 512 300 Q 480 450 512 700 Q 544 450 512 300 Z" 
        fill="#13AA52" 
        opacity="0.7" />
  
  <!-- Optional: Add "DR" for Design Review -->
  <text x="512" y="750" 
        font-family="Arial, sans-serif" 
        font-size="120" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white">DR</text>
</svg>
`;

// Save SVG
const svgPath = path.join(__dirname, 'icon.svg');
fs.writeFileSync(svgPath, svgIcon);

console.log('✅ Generated temporary MongoDB Design Review icon!');
console.log(`📁 SVG saved to: ${svgPath}`);
console.log('\n🔄 Next steps:');
console.log('1. Convert the SVG to required formats using an online converter');
console.log('2. Or use imagemagick: convert icon.svg -resize 1024x1024 icon.png');
console.log('3. Then use electron-icon-builder or platform-specific tools');
console.log('\n💡 For a professional icon, consider hiring a designer or using MongoDB\'s official assets');

// Create placeholder files to prevent errors
const iconDirs = [
  'icons/mac',
  'icons/windows',
  'icons/linux'
];

iconDirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Create a basic text file explaining what should go here
const placeholderContent = `Place your icon file here:
- macOS: icon.icns
- Windows: icon.ico
- Linux: Multiple PNG files (16x16.png, 32x32.png, etc.)

See CREATE_ICONS.md for detailed instructions.`;

fs.writeFileSync(path.join(__dirname, 'icons/mac/README.txt'), placeholderContent);
fs.writeFileSync(path.join(__dirname, 'icons/windows/README.txt'), placeholderContent);
fs.writeFileSync(path.join(__dirname, 'icons/linux/README.txt'), placeholderContent);

console.log('\n📂 Created icon directories with placeholder files');