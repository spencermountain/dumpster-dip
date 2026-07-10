import assert from 'node:assert/strict'
import { rmSync } from 'node:fs'
import write, { close } from './src/index.js'
import { getDb } from './src/db.js'

const path = './scratch.db'

const cleanup = () => {
  rmSync(path, { force: true })
  rmSync(path + '-wal', { force: true })
  rmSync(path + '-shm', { force: true })
}
cleanup()

// -- write some data --
const articles = [
  {
    id: 42,
    title: 'Toronto',
    description: 'city in Ontario, Canada',
    type: 'city',
    categories: ['Cities in Ontario', 'Populated places on Lake Ontario'],
    infobox: { population: 2794356, country: 'Canada' },
    templates: ['Infobox settlement']
  },
  {
    id: '43', // numeric string, sqlite affinity should store it as an integer
    title: 'Raccoon',
    type: 'animal',
    categories: ['Mammals of North America']
    // description/infobox/templates missing on purpose
  }
]

const count = write(articles, path)
assert.equal(count, 2, 'write() returns the batch size')

// -- read it back + test --
const { db } = getDb(path)
const rows = db.prepare('SELECT * FROM pages ORDER BY id').all()

assert.equal(rows.length, 2, 'two rows landed')

const toronto = rows[0]
assert.equal(toronto.id, 42)
assert.equal(toronto.title, 'Toronto')
assert.equal(toronto.type, 'city')
assert.deepEqual(JSON.parse(toronto.categories), articles[0].categories)
assert.deepEqual(JSON.parse(toronto.infobox), { population: 2794356, country: 'Canada' })

const raccoon = rows[1]
assert.equal(raccoon.id, 43, 'string id stored as integer')
assert.equal(raccoon.description, null, 'missing fields become null')
assert.equal(raccoon.infobox, null)

// empty batch is a no-op
assert.equal(write([], path), 0)
assert.equal(db.prepare('SELECT count(*) AS n FROM pages').get().n, 2)

close()
cleanup()
console.log('✓ all good')
