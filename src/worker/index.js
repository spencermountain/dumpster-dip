import { workerData, parentPort } from 'worker_threads'
import { JSONfn } from 'jsonfn'
import wtf from 'wtf_wikipedia'
import reader from './01-reader.js'
import { magenta } from '../_lib.js'
import output from './output/index.js'

let { input, outputDir, outputMode, index, workers, namespace, redirects, disambiguation } = workerData
let methods = JSONfn.parse(workerData.methods)
methods.extend(wtf)

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
  if (res) {
    status.written += 1
    // console.log(res)
    output(res, { outputDir, outputMode })
  }
}

// start off the worker!
reader({ index, workers, file: input }, eachPage).then((doc) => {
  console.log(magenta(`worker #${index} finished`))
  status.finished = true
})

// log the status of this worker, when asked
parentPort.on('message', () => parentPort.postMessage({ status }))
