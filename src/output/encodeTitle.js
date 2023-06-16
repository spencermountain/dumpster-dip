// get ready for filename
const encodeTitle = function (title) {
  title = title || ''
  title = title.trim()
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.replace(/ /g, '_')
  // escape slashes, or possible absolute paths
  title = title.replace(/\//g, '\\/')
  // clobber any potential dot files, or relative paths
  title = title.replace(/^\./g, '\\./')
  return title
}
export default encodeTitle

// console.log(encodeTitle('.foo/bar'))