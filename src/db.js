import { DatabaseSync } from 'node:sqlite'

// categories/infobox/templates hold stringified json
const SCHEMA = `CREATE TABLE IF NOT EXISTS pages (
  id INTEGER,
  title TEXT,
  description TEXT,
  type TEXT,
  categories TEXT,
  infobox TEXT,
  templates TEXT
)`

// tuned for bulk append-only writes, no readers
// synchronous=OFF skips fsync — safe on app crash, not power loss
const PRAGMAS = `
PRAGMA journal_mode = WAL;
PRAGMA synchronous = OFF;
PRAGMA cache_size = -64000;
PRAGMA temp_store = MEMORY;
PRAGMA wal_autocheckpoint = 10000;
PRAGMA busy_timeout = 5000;
`

const INSERT = `INSERT INTO pages
  (id, title, description, type, categories, infobox, templates)
  VALUES (?, ?, ?, ?, ?, ?, ?)`

let state = null

// open the db once, reuse it for every batch
export const getDb = (path) => {
  if (state) {
    if (state.path !== path) {
      throw new Error(`db already open at '${state.path}', got '${path}'`)
    }
    return state
  }
  const db = new DatabaseSync(path)
  db.exec('PRAGMA page_size = 8192') // bigger pages suit a large file; applies to new dbs only
  db.exec(PRAGMAS)
  db.exec(SCHEMA)
  state = { db, insert: db.prepare(INSERT), path }
  return state
}

// merge the wal back into the main file and close
export const closeDb = () => {
  if (!state) {
    return
  }
  state.db.exec('PRAGMA wal_checkpoint(TRUNCATE)')
  state.db.close()
  state = null
}