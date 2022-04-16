import makePath from './makePath.js'
import fs from 'fs'

import path from 'path'

const root = path.resolve()

// get ready for filename
const encodeTitle = function (title) {
  title = title.trim()
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.replace(/ /g, '_')
  return title
}

// recursively create any nested directories
const writeFile = function (file, contents) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents);
}

// modes:  nested | flat | ndjson
const output = function (res, opts) {
  const { outputDir, outputMode } = opts
  let dir = path.join(root, outputDir)
  const title = encodeTitle(res.title)
  if (outputMode === 'flat') {
    dir = path.join(dir, title + '.txt')
  } else if (outputMode === 'ndjson') {
    dir = path.join(dir, 'dip.ndjson')
  } else { // (nested)
    dir = path.join(dir, makePath(title) + '.txt')
  }
  writeFile(dir, JSON.stringify(res))
}
export default output