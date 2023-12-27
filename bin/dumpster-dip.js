#!/usr/bin/env node
import prompt from 'prompt'
import optimist from 'optimist'
import dlWiki from './download/dump-dl.js'
import dlPageviews from './download/pageviews-dl.js'
import dumpster from '../src/index.js'
import fs from 'fs'
import path from 'path'

const dir = process.cwd()

var schema = {
  properties: {
    lang: {
      type: 'string',
      description: 'Which language wikipedia to download? (please use 2-letter code)',
      mesage: "Use 'fr' to download the french wikipedia, etc.",
      required: true,
      default: 'en'
    },
    output: {
      description: 'What format do you want the results to be?',
      message: 'hash, flat, encyclopedia, enclyclopedia-two, or ndjson',
      default: 'hash'
    }
    // pageviews: {
    //   description: 'Do you also want to download pageviews data? y/n',
    //   message: 'To include pageview data, type y',
    //   validator: /y[es]*|n[o]?/,
    //   default: 'n'
    // },
  }
}

console.log('\n\n\n')
prompt.start()
prompt.override = optimist.argv

const status = await prompt.get(schema)

// co-erce to boolean
status.pageviews = status.pageviews === 'y' ? true : false

//download pageviews data?
if (status.pageviews) {
  console.log(`Downloading wikipedia pageviews dataset`)
  await dlPageviews(dir)
}

// download a dump, or re-use existing one
let file = path.join(dir, `./${status.lang}wiki-latest-pages-articles.xml`)
if (fs.existsSync(file) === false) {
  console.log(`Downloading ${status.lang} wikipedia dump`)
  await dlWiki(status.lang, dir)
}

console.log('\n\nBeginning to process wikipedia dump:\n')
await dumpster({
  input: file,
  outputMode: status.output,
  pageviews: status.pageviews,
  parse: function (doc) {
    return doc.json()
  }
})
