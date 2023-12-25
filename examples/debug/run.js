import dip from 'dumpster-dip'

const dump = `../enwiki-latest-pages-articles.xml`

const opts = {
  input: dump,
  libPath: './lib.js', // load our plugins
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
