// get ready for filename
const encodeTitle = function (title) {
  title = title || ''
  title = title.trim()
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.replace(/ /g, '_')
  // escape slashes, or possible absolute paths
  title = encodeURIComponent(title)
  // clobber any potential dot files, or relative paths
  title = title.replace(/^\./g, '\\./')
  // some operating systems complain with long filenames
  if (title.length >= 255) {
    title = title.substr(0, 254) //truncate it
  }
  return title
}
export default encodeTitle
