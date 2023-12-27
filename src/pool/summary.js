import { green, red, blue, magenta, cyan, grey, yellow, black, dim } from '../_lib.js'

// calculate sums from each worker
const calc = function (arr) {
  let sums = {
    processed: 0,
    skipped: 0,
    written: 0,

    skipped_namespace: 0,
    skipped_redirect: 0,
    skipped_disambig: 0,
    skipped_empty: 0
  }
  arr.forEach((o) => {
    sums.processed += o.processed
    sums.written += o.written
    sums.skipped_namespace += o.skipped_namespace
    sums.skipped_redirect += o.skipped_redirect
    sums.skipped_disambig += o.skipped_disambig
    sums.skipped_empty += o.skipped_empty
  })
  sums.skipped = sums.skipped_namespace + sums.skipped_redirect
  sums.skipped = sums.skipped_disambig + sums.skipped_empty
  return sums
}

const percent = (sum, total) => {
  let p = parseInt((sum / total) * 100, 10)
  return p + '%'
}
const num = (n) => {
  return n.toLocaleString().padStart(8)
}

const getSummary = function (arr) {
  let res = calc(arr)
  let msg = `\n\n\n${grey('-----')}\n`
  msg += 'Processed:'.padEnd(20) + magenta(num(res.processed) + ' pages')
  msg +=
    'Wrote:'.padEnd(20) +
    green(num(res.written) + ' pages ') +
    grey(percent(res.written, res.processed))
  msg +=
    'Skipped:'.padEnd(20) +
    cyan(num(res.skipped) + ' pages') +
    grey(percent(res.skipped, res.processed))
  msg += '      by namespace:'.padEnd(20) + cyan(num(res.skipped_namespace))
  msg += '      redirects:'.padEnd(20) + cyan(num(res.skipped_redirect))
  msg += '      disambigs:'.padEnd(20) + cyan(num(res.skipped_disambig))
  msg += '      empty:'.padEnd(20) + cyan(num(res.skipped_empty))
}
export default getSummary
