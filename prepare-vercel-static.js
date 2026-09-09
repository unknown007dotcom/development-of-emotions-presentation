const fs = require('fs');
const path = require('path');

const root = __dirname;
const output = path.join(root, '.vercel', 'output');
const staticDir = path.join(output, 'static');
const files = ['index.html', 'topic-ii.html', 'styles.css', 'app.js', 'topic-ii.js'];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(staticDir, { recursive: true });
for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(staticDir, file));
}
fs.writeFileSync(path.join(output, 'config.json'), JSON.stringify({ version: 3 }, null, 2));
console.log(`Prepared ${files.length} static presentation files for Vercel.`);
