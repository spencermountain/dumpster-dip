import { Command } from 'commander'
import { addPageviews, whichFormat, whichLang } from './prompts.js'
const program = new Command()
//dumpster-dip  --lang fr --pageviews --format flat

program
  .name('dumpster-dip')
  .description('Download and parse a wikipedia dump')
  .option('-l, --lang <lang>', 'which language wikipedia to download')
  .option('--pageviews', 'include pageviews data in results')
  .option('-f, --format <fmt>', 'which format the results should be in')

program.parse()

const getParams = async function () {
  const options = program.opts()
  if (!options.lang) {
    options.lang = await whichLang().lang
  }
  if (!options.format) {
    options.format = await whichFormat().format
  }
  // if (!options.pageviews) {
  //   options.pageviews = await addPageviews().pageviews
  // }
  return options
}

let options = await getParams()
// console.log(options)
