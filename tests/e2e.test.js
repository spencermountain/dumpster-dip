import { test, after } from 'node:test'
import assert from 'node:assert'
import { rmSync } from 'node:fs'
import path from 'node:path'
import makeFixture from 'dumpster-lib/fixture'
import dumpsterDip from '../src/index.js'
import { getDb, closeDb } from '../src/db.js'

const fixture = makeFixture(400)
after(() => rmSync(fixture.dir, { recursive: true, force: true }))

test('a dump lands as one row per article', async () => {
  const dbPath = path.join(fixture.dir, 'pages.db')
  const stats = await dumpsterDip({ file: fixture.file, path: dbPath, heartbeat: 0, lang: 'en', workers: 3, batchPageCount: 25 })
  assert.equal(stats.written, fixture.expect.articles.length)

  const { db } = getDb(dbPath)
  const count = db.prepare('SELECT count(*) AS n, count(DISTINCT id) AS ids FROM pages').get()
  assert.deepEqual(count, { n: fixture.expect.articles.length, ids: fixture.expect.articles.length })
  const row = db.prepare('SELECT id, title, description, categories, templates FROM pages WHERE id = 1').get()
  assert.equal(row.title, 'Page 1')
  assert.deepEqual(JSON.parse(row.categories), ['Towns'])
  assert.equal(JSON.parse(row.templates).find((t) => t.template === 'tinytown data').founded, '1801')
  closeDb()
})
