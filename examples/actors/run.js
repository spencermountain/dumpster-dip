import dip from 'dumpster-dip'

const dump = `../enwiki-latest-pages-articles.xml`
const opts = {
  input: dump,
  libPath: './_lib.js', //load our plugins
  outputMode: 'ndjson', //results in one file
  doPage: function (doc) {
    return doc.classify().type === 'Person/Creator/Actor' //only emit actors
  },
  parse: function (doc) {
    return [
      doc.title(),
      doc.birthDate(), //from person plugin
      doc.summary() // first sentence clause
    ]
  }
}

await dip(opts).then(() => {
  console.log('done')
})
