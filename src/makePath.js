import encodeTitle from './output/encodeTitle.js'
import toNested from './output/nested-path.js'

// a helper function for export as 'dumpster-dip/make-path'
const makePath = function (str) {
  let title = encodeTitle(str)
  title = toNested(title)
  return title + '.txt'
}
export default makePath