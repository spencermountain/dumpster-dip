import dip from 'dumpster-dip'

const afwiki = `/Users/spencer/data/wikipedias/afwiki-latest-pages-articles.xml`

const opts = {
  input: afwiki,
  // directory for all our new files
  outputDir: './results', // (default)
  // how we should write the results
  outputMode: 'nested', // (default)
  // which wikipedia namespaces to handle (null will do all)
  namespace: 0, //(default article namespace)
  // define how many concurrent workers to run
  workers: 3, // default is cpu count
  //interval to log status
  heartbeat: 5000, //every 5 seconds

  // what do return, for every page
  parse: function (doc) {
    return {
      title: doc.title(),
      // cats: doc.categories()
    }
  }, // (default)
  // should we return anything for this page?
  doPage: function () { return true }, // (default)
  // add plugins to wtf_wikipedia
  // extend: (wtf) => {
  //   wtf.extend((models) => {
  //     models.Doc.prototype.isPerson = function () {
  //       return this.categories().find((cat) => cat.match(/people/))
  //     }
  //   })
  // },
}

dip(opts).then(() => {
  console.log('done')
})


// import getPath from 'dumpster-dip/nested-path'
// let file = getPath('Dennis Rodman')
// console.log(file)
// ./BE/EF/Dennis_Rodman.txt