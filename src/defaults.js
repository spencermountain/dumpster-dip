import os from 'os'
const cpuCount = os.cpus().length

export default {
  // directory for all our new files
  outputDir: './dip', // (default)
  // which wikipedia namespaces to handle (null will do all)
  namespace: 0, //(default article namespace)
  // whether to include pages that are redirects
  redirects: false,
  // whether to include disambiguiation pages
  disambiguation: true,
  // define how many concurrent workers to run
  workers: cpuCount, // default is cpu count
  //interval to log status
  heartbeat: 5000, //every 5 seconds
  // allow custom wtf library
  libPath: 'wtf_wikipedia',
  // should we return anything for this page?
  doPage: function () {
    return true
  },
  // what do return, for every page
  parse: function (doc) {
    return doc.json()
  }
}
