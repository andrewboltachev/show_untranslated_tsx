import fs from 'node:fs';

import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'

import * as ts from "typescript";

import { parse } from "@babel/parser";
import generate from "@babel/generator";

// the main glob() and globSync() resolve/return array of filenames

// all js files, but don't look in node_modules
const jsfiles = await glob('/home/andrey/Work/ft/constructor/static/react/base/app/chat-center/components/**/*.tsx', { ignore: 'node_modules/**' })


// Run the extract function with the script's arguments
for (const f of jsfiles) {
  const code = fs.readFileSync(f, 'utf8');
  const ast = parse(code, { sourceType: "module", plugins: ["typescript", "decorators", "jsx"] });

  const output = generate.default(
    ast,
    {
      /* options */
    },
    code
  );
  console.log('foo');
  console.log(output.code);
  fs.writeFileSync(f, output.code);

  break;
}
