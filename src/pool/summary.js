// calculate sums from each worker
const getSummary = function (arr) {
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
export default getSummary
