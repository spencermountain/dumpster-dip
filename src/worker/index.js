import { workerData, parentPort } from 'worker_threads'
import { JSONfn } from 'jsonfn'
import wtfLib from 'wtf_wikipedia'
import reader from './01-reader.js'
import { magenta } from '../_lib.js'
import output from '../output/index.js'

// use default wtf library
let wtf = wtfLib

let { input, outputDir, outputMode, index, workers, namespace, redirects, disambiguation } = workerData
let methods = JSONfn.parse(workerData.methods)
// methods.extend(wtf)

// shim-in a new wtf lib
if (workerData.wtfPath) {
  import(workerData.wtfPath).then(obj => wtf = obj.default).catch(err => console.log(err))
}

let status = {
  index,
  finished: false,
  pages: 0,

  wrong_namespace: 0,
  redirects: 0,
  disambiguation: 0,

  skipped: 0,
  written: 0,
}

const eachPage = function (meta) {
  status.pages += 1
  // only process pages in a given namespace
  if (meta.namespace !== namespace && namespace !== null) {
    status.wrong_namespace += 1
    status.skipped += 1
    return null
  }
  // parse the wikitext
  let doc = wtf(meta.wiki, meta)
  // skip redirect pages
  if (redirects === false && doc.isRedirect()) {
    status.redirects += 1
    status.skipped += 1
    return null
  }
  // skip disambiguation pages
  if (disambiguation === false && doc.isDisambig()) {
    status.disambiguation += 1
    status.skipped += 1
    return null
  }
  if (!methods.doPage(doc)) {
    status.skipped += 1
    return null
  }
  // actually process the page
  let res = methods.parse(doc)
  let title = doc.title()
  if (res) {
    status.written += 1
    // console.log(res)
    output(res, title, { outputDir, outputMode })
  }
}

setTimeout(() => {

  // start off the worker!
  reader({ index, workers, file: input }, eachPage).then((doc) => {
    console.log(magenta(`worker #${index} finished`))
    status.finished = true
  })
}, 2000);

// log the status of this worker, when asked
parentPort.on('message', () => parentPort.postMessage({ status }))
