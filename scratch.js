import dip from 'dumpster-dip'

const afwiki = `/Users/spencer/data/wikipedias/afwiki-latest-pages-articles.xml`

const opts = {
  input: afwiki,
  // directory for all our new files
  outputDir: '/Users/spencer/Desktop/results', // (default)
  // 
  // libPath: '/Users/spencer/mountain/wtf_wikipedia/scratch.js',

  libPath: './myLib.js', // our version
  // how we should write the results
  // outputMode: 'nested', // (default)
  outputMode: 'encyclopedia-two', // (default)
  // which wikipedia namespaces to handle (null will do all)
  // namespace: 0, //(default article namespace)
  // define how many concurrent workers to run
  // workers: 3, // default is cpu count
  //interval to log status
  // heartbeat: 5000, //every 5 seconds
  // should we return anything for this page?
  doPage: function () { return true }, // (default)

  // what do return, for every page
  parse: function (doc) {
    return doc.text()
  },

}

await dip(opts).then(() => {
  console.log('done')
})


// import getPath from 'dumpster-dip/nested-path'
// let file = getPath('Dennis Rodman')
// console.log(file)
// ./BE/EF/Dennis_Rodman.txt