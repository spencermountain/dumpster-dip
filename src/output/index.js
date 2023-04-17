import toNestedPath from './nested-path.js'
import fs from 'fs'
import encodeTitle from './encodeTitle.js'

import path from 'path'


// recursively create any nested directories
const writeFile = function (file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  let res = data
  if (typeof res !== 'string') {
    res = JSON.stringify(res)
  }
  fs.writeFileSync(file, res)
}

const append = function (file, txt) {
  fs.writeFileSync(file, txt, { flag: 'a' })
}

// modes:  nested | flat | ndjson
const output = function (res, title, opts) {
  const { outputDir, outputMode } = opts
  let dir = path.resolve(outputDir)

  if (outputMode === 'flat') {
    title = encodeTitle(title)
    dir = path.join(dir, title + '.txt')
    writeFile(dir, res)
  } else if (outputMode === 'ndjson') {
    dir = path.join(dir, './index.ndjson')
    append(dir, JSON.stringify(res) + '\n')
  } else { // (nested)
    title = encodeTitle(title)
    dir = path.join(dir, toNestedPath(title) + '.txt')
    writeFile(dir, res)
  }
}
export default output