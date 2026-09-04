import dumpster from 'dumpster-lib'
import write, { close } from './write.js'

const defaults = {
  // the sqlite file to write
  path: 'pages.db',
  // 'md' has the type, summary, categories, infobox and templates our table wants
  format: 'md',
}

// a dumpster-lib page → a row of the pages table
const toRow = (page) => ({
  id: page.pageID,
  title: page.title,
  description: page.summary,
  type: page.type,
  categories: page.categories,
  infobox: page.infobox,
  templates: page.templates,
})

const dumpsterDip = (options) => {
  options = Object.assign({}, defaults, options)
  const pool = dumpster(options)
  // sqlite writes are synchronous, so each batch is committed before the pool hands over the next
  pool.on('batch', (pages) => {
    write(pages.map(toRow), options.path)
  })
  // merge the wal back into the main file, and close
  pool.on('end', () => close())
  return pool.done
}

export default dumpsterDip
export { write, close }
