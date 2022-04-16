import md5 from './md5.js'

//the wikimedia image url is a little silly:
//https://commons.wikimedia.org/wiki/Commons:FAQ#What_are_the_strangely_named_components_in_file_paths.3F
const makePath = function (title) {
  let hash = md5(title)
  let path = hash.substring(0, 2) + '/' + hash.substring(2, 4) + '/'
  title = encodeURIComponent(title)
  return path += title
}
export default makePath