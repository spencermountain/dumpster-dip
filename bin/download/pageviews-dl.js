/* eslint-disable no-console */
import sh from 'shelljs'
import spacetime from 'spacetime'

const download = function (dir) {
  // get yesterday's version
  let d = spacetime.yesterday()
  let date = d.format('{year}{month-pad}{date-pad}')
  const url = `https://dumps.wikimedia.org/other/pageview_complete/${d.year()}/${d.format(
    '{year}-{month-pad}'
  )}/pageviews-${date}-user.bz2`
  sh.cd(dir).exec(`wget --no-clobber ${url} -P ${dir}`)
}
export default download

// download('en', './')
