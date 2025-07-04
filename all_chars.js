import fs from 'node:fs';

import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'

import * as ts from "typescript";

// the main glob() and globSync() resolve/return array of filenames
//
if (process.argv.length != 3) {
    console.log("Please call with a folder name")
    process.exit(1)
}
let arg = String(process.argv[2]).trimRight('/');
//console.log("your folder is:", arg)


// all js files, but don't look in node_modules
const jsfiles = await glob(`${arg}/**/*.tsx`, { ignore: 'node_modules/**' })


const chars = {};

// Run the extract function with the script's arguments
for (const f of jsfiles) {
    const d = fs.readFileSync(f);
    const text = d.toString('utf-8');
    //console.log(f);
    for (const c of text) {
        chars[c] = chars[c] || 0;
        chars[c]++;
    }
}

//console.log();
//console.log();
//console.log();

let charsArr = Array.from(Object.entries(chars));

charsArr.sort((a, b) => {
  //console.log(typeof a[0], typeof b[0]);
  // Unicode sort
  return a[0].charCodeAt(0) - b[0].charCodeAt(0);
});

for (const [k, v] of charsArr) {
    console.log(k, v);
}
