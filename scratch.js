import dip from 'dumpster-dip'

// const afwiki = `/Volumes/4TB/wikipedia/afwiki-latest-pages-articles.xml`
const afwiki = `/Users/spencer/mountain/dumpster-dip/afwiki-latest-pages-meta-current.xml`

const opts = {
  input: afwiki,
  namespace: 1,
  outputDir: '/Users/spencer/Desktop/dip',
  outputMode: 'encyclopedia',
  parse: function (doc) {
    return doc.title()
  }
}

await dip(opts).then(() => {
  console.log('done')
})

// import getPath from 'dumpster-dip/nested-path'
// let file = getPath('Dennis Rodman')
// console.log(file)
// ./BE/EF/Dennis_Rodman.txt
