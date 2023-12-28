// talk pages are not found in the normal 'latest-pages-articles.xml' dump.
// instead, you must download the larger 'latest-pages-meta-current.xml' dump
// to process only Talk pages, set 'namespace' to 1
import dip from 'dumpster-dip'

const afwiki = `./afwiki-latest-pages-meta-current.xml`

const opts = {
  input: afwiki,
  namespace: 1, // do talk pages only
  outputMode: 'encyclopedia',
  parse: function (doc) {
    return doc.text()
  }
}

await dip(opts).then(() => {
  console.log('done')
})
