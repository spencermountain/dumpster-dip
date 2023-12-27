import dip from 'dumpster-dip'

const dump = `./enwiki-latest-pages-articles.xml`
const opts = {
  input: dump,
  outputMode: 'encyclopedia', // all 'E' movies under the ./e/ directory...
  doPage: function (doc) {
    // look for anything with a 'Film' 'infobox
    return doc.infobox() && doc.infobox().type() === 'film'
  },
  parse: function (doc) {
    let inf = doc.infobox()
    // pluck some values from its infobox
    return {
      title: doc.title(),
      runtime: inf.get('runtime'),
      budget: inf.get('budget'),
      gross: inf.get('gross')
    }
  }
}

await dip(opts).then(() => {
  console.log('done')
})
