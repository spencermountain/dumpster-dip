// to run this example, first run
// npm install wtf-plugin-debug
// and dl/unzip a wikipedia dump
import dip from 'dumpster-dip'

const dump = `./afwiki-latest-pages-articles.xml`

const opts = {
  input: dump,
  libPath: './examples/debug/_lib.js', // load our plugins
  outputMode: 'ndjson', //append one file as output
  doPage: function (doc) {
    return doc.isBad() //skip the good ones
  },
  parse: function (doc) {
    return [doc.title(), doc.isBad(), doc.sentences()[0].text()].join('\t')
  }
}

await dip(opts).then(() => {
  console.log('done')
})
