import dip from 'dumpster-dip'

// talk pages are not found in the 'latest-pages-articles.xml' dump.
// instead, you must download the larger 'latest-pages-meta-current.xml' dump
const afwiki = `./afwiki-latest-pages-meta-current.xml`

const opts = {
  input: afwiki,
  ns: 1, // do talk pages only
  outputMode: 'encyclopedia-one',
  parse: function (doc) {
    return doc.text()
  }
}

await dip(opts).then(() => {
  console.log('done')
})
