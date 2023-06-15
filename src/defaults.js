import os from 'os'
const cpuCount = os.cpus().length

export default {
  // directory for all our new files
  outputDir: './dip', // (default)
  // which wikipedia namespaces to handle (null will do all)
  namespace: 0, //(default article namespace)
  // define how many concurrent workers to run
  workers: cpuCount, // default is cpu count
  //interval to log status
  heartbeat: 5000, //every 5 seconds
  // allow custom wtf library
  libPath: 'wtf_wikipedia',
  // what do return, for every page
  parse: function (doc) {
    console.log('cool', doc)
  }, // (default)
  // should we return anything for this page?
  doPage: function () { return true }, // (default)
  // add plugins to wtf_wikipedia
  extend: function (wtf) {
    wtf.extend((models) => {
      models.Doc.prototype.isPerson = function () {
        return this.categories().find((cat) => cat.match(/people/))
      }
    })
  }

}