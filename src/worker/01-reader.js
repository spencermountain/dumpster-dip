import fs from 'fs'
import parseXml from './02-xml.js'
import readline from 'readline'
import sundayDriver from 'sunday-driver'
import { decode } from 'html-entities'
import { red } from '../_lib.js'

const dbNameRegex = /<dbname>(.+)wiki<\/dbname>/

async function findDbName(pathToFile) {
  const readable = fs.createReadStream(pathToFile)
  const reader = readline.createInterface({ input: readable })
  const maxLinesToLookAt = 50
  const line = await new Promise((resolve, reject) => {
    let i = 0
    reader.on('line', (line) => {
      i++
      if (i > maxLinesToLookAt) {
        reader.close()
        reject(`Didn't find dbname in first ${maxLinesToLookAt} lines`)
      }

      const match = line.match(dbNameRegex)
      if (match !== null) {
        const dbName = match[1]
        reader.close()
        resolve(dbName)
      }
    })
  })
  readable.close()
  return line
}

const readWiki = function (opts, eachPage) {
  const { index, workers, file } = opts
  const percent = 100 / workers
  const start = percent * index
  const end = start + percent
  return findDbName(file).then((language) => {
    const driver = {
      file: file,
      start: `${start}%`,
      end: `${end}%`,
      splitter: '</page>',
      each: (xml, resume) => {
        let pageTitle = 'Unknown page'
        try {
          const meta = parseXml(xml)
          pageTitle = meta.title
          meta.wiki = decode(meta.wiki)
          meta.language = language
          eachPage(meta)
        } catch (e) {
          console.log(
            red(`\nWorker ${opts.index} couldn't process '${pageTitle}':\n got error ${e}`)
          )
        }
        resume()
      }
    }
    const p = sundayDriver(driver)
    p.catch((err) => {
      console.log(red('\n\n========== Worker error!  ====='))
      console.log('🚨       worker #' + opts.index + '           🚨')
      console.log(err)
      console.log('\n\n')
    })
    return p
  })
}
export default readWiki
