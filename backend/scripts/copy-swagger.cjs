const fs = require('node:fs');
const path = require('node:path');

const source = path.resolve(__dirname, '../src/swagger');
const destination = path.resolve(__dirname, '../dist/swagger');
fs.mkdirSync(destination, { recursive: true });
for (const file of fs.readdirSync(source).filter((name) => name.endsWith('.yaml'))) {
  fs.copyFileSync(path.join(source, file), path.join(destination, file));
}
