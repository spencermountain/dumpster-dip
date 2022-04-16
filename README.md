<div align="center">
	<h3>dumpster-dip</h3>
	<a href="https://npmjs.org/package/dumpster-dip">
		<img src="https://img.shields.io/npm/v/dumpster-dip.svg?style=flat-square" />
	</a>
	<div>wikipedia dump parser</div>
  <div align="center">
    <img height="50px" src="https://user-images.githubusercontent.com/399657/68221814-05ed1680-ffb8-11e9-8b6b-c7528d163871.png"/>
  </div>
  <sub>
    by
    <a href="http://spencermounta.in/">Spencer Kelly</a> and
    <a href="https://github.com/spencermountain/dumpster-dive/graphs/contributors">
      others
    </a>
  </sub>
</div>
<p></p>
<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<b>dumpster-dip</b> is a nodejs script that allows you to parse a wikipedia dump into ad-hoc data.

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


`npm install dumpster-dip`

```js
import dip from 'dumpster-dip'

const opts = {
  input: '/path/to/my-wikipedia-article-dump.xml',
  parse: (doc) => {
    return doc.sentences()[0].text()// return the first sentence of each page
  }
}
// this promise takes ~4hrs
dip(opts).then(() => {
  console.log('done!')
})
```
It uses <a href="https://github.com/spencermountain/wtf_wikipedia">wtf_wikipedia</a> as the wikiscript parser.

dumpster-dip is a fork of <a href="https://github.com/spencermountain/dumpster-dive/tree/dev">dumpster-dive</a>, which writes data to mongodb.
This library writes parsed data right to the file-system, instead.

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


This tool is intended to be a clean way to pull random bits out of wikipedia, like:

**'all the birthdays of basketball players'**
```js
await dip({
  doPage: (doc) => doc.categories().find(cat => cat === `American men's basketball players`),
  parse: (doc) => doc.infobox().get('birth_date')
})
```

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


### Outputs

By default, it outputs an individual file for every wikipedia article.
Sometimes operating systems don't like having ~6m files in one folder, though - so it nests them 2-deep, using the first 4 characters of the filename's hash:

```
/BE
  /EF
    /Dennis_Rodman.txt
    /Hilary_Clinton.txt
```

as a helper, this library exposes a function for navigating this directory scheme:

```js
import getPath from 'dumpster-dip/nested-path'
let file = getPath('Dennis Rodman')
// ./BE/EF/Dennis_Rodman.txt
```

This is the same scheme that wikipedia does internally.


---

if you want all files in one flat directory, you can do:
```js
let opts = {
  outputDir: './results', 
  outputMode: 'flat', 
}
```

if you want all results in one file, you can do:
```js
let opts = {
  outputDir: './results', 
  outputMode: 'ndjson', 
}
```

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

### Options
```js
let opts = {
  // directory for all our new files
  outputDir: './results', // (default)
  // how we should write the results
  outputMode: 'nested', // (default)

  // which wikipedia namespaces to handle (null will do all)
  namespace: 0, //(default article namespace)
  // define how many concurrent workers to run
  workers: cpuCount, // default is cpu count
  //interval to log status
  heartbeat: 5000, //every 5 seconds
  
  // parse redirects, too
  redirects: false, // (default)
  // parse disambiguation pages, too
  disambiguation: true, // (default)

  // what do return, for every page
  parse: (doc) => doc.json(), // (default)
  // should we return anything for this page?
  doPage: (doc) => true, // (default)
  // add plugins to wtf_wikipedia
  extend: (wtf) => {
    wtf.extend((models, templates, infoboxes) => {
      models.Doc.prototype.isPerson = function () {
        return this.categories().find((cat) => cat.match(/people/))
      }
    })
  },
}
```

<div >
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
</div>
<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<div><i>work in progress</i></div>

MIT