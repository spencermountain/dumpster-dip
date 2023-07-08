import sh from 'shelljs'
const project = 'wikipedia'
const tsvOut = './tmp.tsv'

const prepPageviews = function (file, lang) {
  //filter-it down to our project only
  sh.exec(`grep '^${lang}.${project} .* desktop ' ${file} > ${tsvOut}`)

  let counts = {}
  let arr = fs.readFileSync(tsvOut).toString().split(/\n/)
  console.log(arr.length, ' tsv list')
  for (let i = 0; i < arr.length; i += 1) {
    let a = arr[i].split(' ')
    let title = a[1]
    if (title !== undefined && a[4] !== '1') {
      title = toName(title)
      let num = Number(a[4])
      // another filter
      if (ignorePage(title) === true) {
        continue
      }
      if (num <= 2) {
        continue
      }
      // mean += num
      counts[title] = num
    }
  }
  // console.log('writing pageviews json')
  // counts = JSON.stringify(counts, null, 2)
  // fs.writeFileSync(output, counts)
  // console.log('wrote pageviews json')
  // console.log('max', max)
  // console.log('mean', mean / Object.keys(counts).length)
  return counts
}

export default prepPageviews