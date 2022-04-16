const getTitle = /<title>([\s\S]+?)<\/title>/
const getId = /<id>([0-9]*?)<\/id>/
const getNS = /<ns>([0-9]*?)<\/ns>/
const getText = /<text[^>]+xml:space="preserve"([\s\S]*?)<\/text>/

// parse xml with regexes (╯°□°）╯︵ ┻━┻
const parseXML = function (xml) {
  const page = {}
  //get page title
  let m = xml.match(getTitle)
  if (m !== null) {
    page.title = m[1]
  }
  //get page id
  m = xml.match(getId)
  if (m !== null) {
    page.pageID = m[1]
  }
  //get namespace
  m = xml.match(getNS)
  if (m !== null) {
    page.namespace = Number(m[1])
  }
  //get wiki text
  m = xml.match(getText)
  if (m !== null) {
    m[1] = m[1].replace(/^.*?>/, '')
    page.wiki = m[1]
  }
  return page
}
export default parseXML