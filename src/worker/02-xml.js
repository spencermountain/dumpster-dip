const getTitle = /<title>([\s\S]+?)<\/title>/
const getId = /<id>([0-9]*?)<\/id>/
const getNS = /<ns>([0-9]*?)<\/ns>/
const getText = /<text[^>]+xml:space="preserve"([\s\S]*?)<\/text>/
const getRevisionId = /<revision>[\s\S]*?<id>(\d+)<\/id>/
const getTimestamp = /<revision>[\s\S]*?<timestamp>([0-9TZ:.-]+)<\/timestamp>/

//doesn't support fancy things like &copy; to ©, etc
const escapeXML = function (str) {
  return str
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
}

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
    page.wiki = escapeXML(m[1])
  }
  //get revision id
  m = xml.match(getRevisionId)
  if (m !== null) {
    page.revisionID = m[1]
  }
  //get last update timestamp
  m = xml.match(getTimestamp)
  if (m !== null) {
    page.timestamp = m[1]
  }
  return page
}
export default parseXML
