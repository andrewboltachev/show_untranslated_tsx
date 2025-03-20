import fs from 'node:fs';

import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'

import * as ts from "typescript";

// the main glob() and globSync() resolve/return array of filenames

// all js files, but don't look in node_modules
const jsfiles = await glob('/home/andrey/Work/ft/constructor/static/react/base/app/chat-center/components/**/*.tsx', { ignore: 'node_modules/**' })

import { parse } from "@babel/parser";
import generate from "@babel/generator";

const code = "class Example {}";
const ast = parse(code);

const output = generate(
  ast,
  {
    /* options */
  },
  code
);


// Run the extract function with the script's arguments
for (const f of jsfiles) {
}
