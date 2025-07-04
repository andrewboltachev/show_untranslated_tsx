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
console.log("your folder is:", arg)


// all js files, but don't look in node_modules
const jsfiles = await glob(`${arg}/**/*.tsx`, { ignore: 'node_modules/**' })

//const found = [];

let found = [];
let repl = [];

let printer = null, sourceFile = null;

const missing = {};

/**
 * Trims whitespace from both ends of a string and returns the trimmed string
 * along with the lengths of whitespace removed from the left and right.
 *
 * @param {string} sourceString The string to be trimmed.
 * @returns {{trimmedString: string, trimmedLeftLength: number, trimmedRightLength: number}} An object containing the trimmed string and the lengths of whitespace removed.
 */
function trimStringWithWhitespaceCounts(sourceString) {
    if (typeof sourceString !== 'string') {
        // Optionally handle non-string inputs, e.g., convert to string or throw an error
        sourceString = String(sourceString);
    }

    let startIndex = 0;
    // Find the index of the first non-whitespace character from the left
    while (startIndex < sourceString.length && /\s/.test(sourceString[startIndex])) {
        startIndex++;
    }

    let endIndex = sourceString.length - 1;
    // Find the index of the last non-whitespace character from the right
    // The loop condition `endIndex >= startIndex` is crucial for handling strings
    // that are entirely whitespace or empty.
    while (endIndex >= startIndex && /\s/.test(sourceString[endIndex])) {
        endIndex--;
    }

    // Extract the substring containing only the non-whitespace characters
    // If the string was all whitespace or empty, startIndex will be >= sourceString.length,
    // and endIndex will be < startIndex, resulting in an empty string from substring.
    const trimmedString = sourceString.substring(startIndex, endIndex + 1);

    // Calculate the lengths of trimmed whitespace
    const trimmedLeftLength = startIndex;
    const trimmedRightLength = sourceString.length - (endIndex + 1);

    return {
        trimmedString: trimmedString,
        trimmedLeftLength: trimmedLeftLength,
        trimmedRightLength: trimmedRightLength
    };
}

const extractNode = (node) => {
  let name = "";

  // This is an incomplete set of AST nodes which could have a top level identifier
  // it's left to you to expand this list, which you can do by using
  // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
  // as below

  let k = null;
  const { pos, end } = node;
  if (
    ts.isJsxText(node)
  ) {
    if (/[ёа-яЁА-Я]/gi.exec(node.text)) {
      found.push(node.text);
      k = printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
      console.assert(node.text.length === node.end - node.pos);
      const {
        trimmedString,
        trimmedLeftLength,
        trimmedRightLength
      } = trimStringWithWhitespaceCounts(node.text);
      repl.push(
        {pos: pos + trimmedLeftLength, end: end - (trimmedLeftLength + trimmedRightLength), code: '{boo}'}
      );
    }
  }

  // TODO: ts.isStringLiteral(node)
  // TODO: || ts.isTemplateMiddle(node) || ts.isTemplateHead(node) || ts.isTemplateTail(node)
  node.forEachChild(extractNode)

  //const container = true ? foundNodes : unfoundNodes;
  //container.push([name, node]);
};

/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 */
function extract(file) {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  let program = ts.createProgram([file], { allowJs: true });
  sourceFile = program.getSourceFile(file);

  // To print the AST, we'll use TypeScript's printer
  printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  // To give constructive error messages, keep track of found and un-found identifiers
  const unfoundNodes = [], foundNodes = [];

  // Loop through the root AST nodes of the file
  ts.forEachChild(sourceFile, extractNode);

  /*// Either print the found nodes, or offer a list of what identifiers were found
  if (!foundNodes.length) {
    console.log(`Could not find any of ${identifiers.join(", ")} in ${file}, found: ${unfoundNodes.filter(f => f[0]).map(f => f[0]).join(", ")}.`);
    process.exitCode = 1;
  } else {
    foundNodes.map(f => {
      const [name, node] = f;
      console.log("### " + f + "\n");
    });
  }*/
}

let offset = 0;

const insertStringIntoFile = (s, {pos, end, code}) => {
  const posWithOffset = pos + offset;
  const len = end - pos; // длина исходной строки
  const r = s.slice(0, posWithOffset) + code + s.slice(posWithOffset + len);

  offset += code.length - len;
  return r;
}

// Run the extract function with the script's arguments
let ii = 0;
for (const f of jsfiles) {
  if (ii === 10) break;
  found = [];
  repl = [];
  extract(f, []);
  if (found.length > 0) {
    console.log(f);
    for (const s of found) {
      console.log(`\t${s}`);
    }
    let ff = fs.readFileSync(f, 'utf-8');
    offset = 0;
    for (const item of repl) {
      ff = insertStringIntoFile(ff, item);
    }
    fs.writeFileSync(f, ff);
  }
  ii++;
}
