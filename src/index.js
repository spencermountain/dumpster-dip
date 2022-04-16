import Pool from './pool/Pool.js'
import defaults from './defaults.js'

// ok guess we're gonna do this...
const dip = function (opts) {
  opts = Object.assign({}, defaults, opts)
  return new Promise((resolve, reject) => {
    let pool = new Pool(opts)
    pool.on('end', () => resolve())
    pool.on('error', (e) => reject(e))
    pool.start()
  })
}
export default dip