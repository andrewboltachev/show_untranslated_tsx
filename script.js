import fs from 'node:fs';

import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'

import * as ts from "typescript";

// the main glob() and globSync() resolve/return array of filenames

// all js files, but don't look in node_modules
const jsfiles = await glob('/home/andrey/Work/ft/constructor/static/react/base/app/chat-center/components/**/*.tsx', { ignore: 'node_modules/**' })

/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 */
function extract(file) {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  let program = ts.createProgram([file], { allowJs: true });
  const sourceFile = program.getSourceFile(file);

  // To print the AST, we'll use TypeScript's printer
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  // To give constructive error messages, keep track of found and un-found identifiers
  const unfoundNodes = [], foundNodes = [];

  // Loop through the root AST nodes of the file
  ts.forEachChild(sourceFile, node => {
    let name = "";

    // This is an incomplete set of AST nodes which could have a top level identifier
    // it's left to you to expand this list, which you can do by using
    // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
    // as below
    if (ts.isStringLiteral(node)) {
      print.print(node)
    }

    const container = true ? foundNodes : unfoundNodes;
    container.push([name, node]);
  });

  /*// Either print the found nodes, or offer a list of what identifiers were found
  if (!foundNodes.length) {
    console.log(`Could not find any of ${identifiers.join(", ")} in ${file}, found: ${unfoundNodes.filter(f => f[0]).map(f => f[0]).join(", ")}.`);
    process.exitCode = 1;
  } else {
    foundNodes.map(f => {
      const [name, node] = f;
      console.log("### " + f + "\n");
      //console.log(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile)) + "\n";
    });
  }*/
}

// Run the extract function with the script's arguments
for (const f of jsfiles) {
  fs.readFile(f, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    extract(f, []);
  });
  break;
}
console.log(jsfiles[0]);


