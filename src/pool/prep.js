/* eslint-disable no-console */
import fs from 'fs'
import { red, blue, grey } from '../_lib.js'
import path from 'path'

const checkFile = function (file) {
  if (!file || !fs.existsSync(file)) {
    console.log(red('\n  --can\'t find file:  "' + blue(file) + '" ---'));
    console.log(grey('     please supply a filename for the wikipedia article dump in xml format'));
    process.exit(1);
  }
  if (/\.bz2$/.test(file)) {
    console.log(red('\n    --- hello, please unzip this file first  ---'));
    console.log(grey('     ($ bzip2 -d ' + file + ' )'));
    process.exit(1);
  }
}

const makeDir = function (name) {
  let dir = path.resolve(name)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
export { checkFile, makeDir }