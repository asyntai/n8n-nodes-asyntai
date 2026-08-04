// Copies non-TS assets (icons) into dist after tsc build.
// Copies every SVG in nodes/Asyntai so light and dark icon variants both ship.
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'nodes', 'Asyntai');
const destDir = path.join(__dirname, '..', 'dist', 'nodes', 'Asyntai');
fs.mkdirSync(destDir, { recursive: true });

const icons = fs.readdirSync(srcDir).filter((f) => f.endsWith('.svg'));
for (const icon of icons) {
	fs.copyFileSync(path.join(srcDir, icon), path.join(destDir, icon));
	console.log(`copied ${icon} -> dist`);
}
