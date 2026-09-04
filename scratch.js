import dumpsterDip from './src/index.js'

const stats = await dumpsterDip({
  path: '/Users/spencer/Desktop/pages.db',
  project: 'wikipedia',
  lang: 'sw',
  batchPageCount: 100,
  file: '/Volumes/4TB/wikipedia/swwiki-latest-pages-articles.xml',
})
console.log('dumpster-dip end', stats)
