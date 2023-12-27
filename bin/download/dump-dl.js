/* eslint-disable no-console */
import sh from 'shelljs'
import path from 'path'
import wget from './_wget.js'

const download = async function (lang, dir) {
  let file = path.join(dir, `./${lang}wiki-latest-pages-articles.xml.bz2`)
  console.log('\n\ndownloading:')
  let url = `https://dumps.wikimedia.org/${lang}wiki/latest/${lang}wiki-latest-pages-articles.xml.bz2`
  sh.cd(dir) //.exec(cmd)
  await wget(url, dir)
  console.log('\n\nunzipping:')
  sh.cd(dir).exec(`bzip2 -d ${file}`)
  console.log('\n\nprocessing:')
}
// const download = function (lang, dir) {
//   let file = path.join(dir, `./${lang}wiki-latest-pages-articles.xml.bz2`)
//   console.log('\n\ndownloading:')
//   let cmd = `wget --no-clobber https://dumps.wikimedia.org/${lang}wiki/latest/${lang}wiki-latest-pages-articles.xml.bz2 -P ${dir}`
//   sh.cd(dir).exec(cmd)

//   console.log('\n\nunzipping:')
//   sh.cd(dir).exec(`bzip2 -d ${file}`)
//   console.log('\n\nprocessing:')
// }
export default download
