'use strikt';
const fs = require('fs');
const input = fs.createReadStream('./testfile');
const output = fs.createWriteStream('./output');
input.pipe(output);

