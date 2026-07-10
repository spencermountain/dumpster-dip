import { getDb, closeDb } from './db.js'

const DEFAULT_PATH = 'pages.db'

const str = (val) => {
  if (val === undefined || val === null) {
    return null
  }
  return String(val)
}

const json = (val) => {
  if (val === undefined || val === null) {
    return null
  }
  return JSON.stringify(val)
}

const id = (val) => {
  if (typeof val === 'number') {
    return val
  }
  return str(val) // sqlite's integer affinity converts numeric strings
}

// write one batch of parsed articles as rows, in a single transaction
const write = (articles, path = DEFAULT_PATH) => {
  if (!articles || articles.length === 0) {
    return 0
  }
  const { db, insert } = getDb(path)
  db.exec('BEGIN')
  try {
    for (const a of articles) {
      insert.run(
        id(a.id),
        str(a.title),
        str(a.description),
        str(a.type),
        json(a.categories),
        json(a.infobox),
        json(a.templates)
      )
    }
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
  return articles.length
}

export default write
export const close = closeDb