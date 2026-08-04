// Copies non-TS assets (icons) into dist after tsc build.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'nodes', 'Asyntai', 'asyntai.svg');
const dest = path.join(__dirname, '..', 'dist', 'nodes', 'Asyntai', 'asyntai.svg');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log('copied asyntai.svg -> dist');
