import toNestedPath from './nested-path.js'
import fs from 'fs'
import encodeTitle from './encodeTitle.js'

import path from 'path'

const root = path.resolve()



// recursively create any nested directories
const writeFile = function (file, body) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  let out = ''
  if (typeof body === 'string') {
    out = body
  } else {
    out = JSON.stringify(body, null, 2)
  }
  fs.writeFileSync(file, out)
}

const append = function (file, txt) {
  fs.writeFileSync(file, txt, { flag: 'a' })
}

// modes:  nested | flat | ndjson
const output = function (res, opts) {
  const { outputDir, outputMode } = opts
  let dir = outputDir
  if (!path.isAbsolute(dir)) {
    dir = path.join(root, outputDir)
  }
  if (outputMode === 'flat') {
    let title = encodeTitle(res.title)
    dir = path.join(dir, title + '.txt')
    writeFile(dir, res.body)
  } else if (outputMode === 'ndjson') {
    dir = path.join(dir, './index.ndjson')
    append(dir, JSON.stringify(res.body) + '\n')
  } else { // (nested)
    let title = encodeTitle(res.title)
    dir = path.join(dir, toNestedPath(title) + '.txt')
    writeFile(dir, res.body)
  }
}
export default output