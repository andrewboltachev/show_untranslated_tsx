import fs from 'node:fs';

import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'

import * as ts from "typescript";

// the main glob() and globSync() resolve/return array of filenames
//
if (process.argv.length != 3) {
    //console.log("Please call with a folder name")
    //process.exit(1)
}
let arg = "/home/andrei/Work/ft/constructor"; //String(process.argv[2]).trimRight('/');
console.log("your folder is:", arg)


// all js files, but don't look in node_modules
const jsfiles = await glob(`${arg}/**/*.tsx`, { ignore: 'node_modules/**' })

//const found = [];

let found = [];
let repl = {};

let fff = "";
//let fText = "";

let printer = null, sourceFile = null;

let nodes = {};

const extractNode = (node) => {
  let name = "";

  // This is an incomplete set of AST nodes which could have a top level identifier
  // it's left to you to expand this list, which you can do by using
  // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
  // as below


  const len = node.end - node.pos;
  let matched = null;
  for (const [kk, vv] of Object.entries(node)) {
    if (/.*[ёа-яЁА-Я№ĸ].*/gi.exec(vv)) {
      matched = kk;
      break;
    }
  }
  const sk = ts.SyntaxKind[node.kind];
  if (matched && !['StringLiteral', 'JsxText'].includes(sk)) {
    console.log(`vi +${node.pos}go ${fff} # ${sk} ${matched}`);
    console.log(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile));
  }

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
  fff = file;
  //const d = fs.readFileSync(file);
  //fText = d.toString('utf-8');
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  // console.log(fff);
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

// Run the extract function with the script's arguments
let ii = 0;
for (const f of jsfiles) {
  if (f !== '/home/andrei/Work/ft/constructor/static/app/settings/employees/views/table.employees.tsx') continue;
  //console.log(ii, jsfiles.length);
  found = [];
  repl = {};
  extract(f, []);
  if (found.length > 0) {
    console.log(f);
    for (const s of found) {
      console.log(`\t${s}`);
    }
    let ff = fs.readFileSync(f, 'utf-8');
    continue;
    for (const [k, v] of Object.entries(repl)) {
      ff = ff.replaceAll(k, v);
    }
    fs.writeFileSync(f, ff);
  }
  ii += 1;
}
