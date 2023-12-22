import prompt from 'prompt'
import optimist from 'optimist'
import dlWiki from './dump-dl.js'
import dlPageviews from './pageviews-dl.js'
const dir = './'

var schema = {
  properties: {
    lang: {
      type: 'string',
      description: 'Which language wikipedia to download? (please use 2-letter code)',
      mesage: "Use 'fr' to download the french wikipedia, etc.",
      required: true,
      default: 'en'
    },
    pageviews: {
      description: 'Do you also want to download pageviews data? y/n',
      message: 'To include pageview data, type y',
      validator: /y[es]*|n[o]?/,
      default: 'n'
    },
    output: {
      description: 'What format do you want the results to be?',
      message: 'hash, flat, encyclopedia, enclyclopedia-two, or ndjson',
      default: 'hash'
    }
  }
}

prompt.start()
prompt.override = optimist.argv

const status = await prompt.get(schema)

// co-erce to boolean
status.pageviews = status.pageviews === 'y' ? true : false
console.log(status)

if (status.pageviews) {
  await dlPageviews(dir)
}
await dlWiki(status.lang, dir)
