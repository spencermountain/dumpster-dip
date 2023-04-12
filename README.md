<div align="center">
	<h3>dumpster-dip</h3>
	<a href="https://npmjs.org/package/dumpster-dip">
		<img src="https://img.shields.io/npm/v/dumpster-dip.svg?style=flat-square" />
	</a>
  <!-- <a href="https://www.codacy.com/app/spencerkelly86/dumpster-dip">
    <img src="https://api.codacy.com/project/badge/grade/6fad3c588d3d4c97ab8a9abf9f2a5a01" />
  </a> -->
	<div>wikipedia dump parser</div>
  <sub>
    by
    <a href="http://spencermounta.in/">Spencer Kelly</a>, <a href="https://github.com/devrim">Devrim Yasar</a>,
		 and
    <a href="https://github.com/spencermountain/wtf_wikipedia/graphs/contributors">
      others
    </a>
  </sub>
</div>
<p></p>

<div align="center">
  gets a wikipedia <a href="https://dumps.wikimedia.org">xml dump</a> into tiny json files,
  <div>so you can get a bunch of easy data.</div>

  <h2 align="center">👍 〰〰〰〰〰〰〰〰 👍</h2>
</div>
<p></p>
<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<b>dumpster-dip</b> is a script that allows you to parse a wikipedia dump into ad-hoc data.

<b><a href="https://github.com/spencermountain/dumpster-dive">dumpster-dive</a></b> is a script that puts it into mongodb, instead.

<i >use whatever you prefer!</i>

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<b>1. Download</b> a dump <br/>
cruise the <a href="https://dumps.wikimedia.org/enwiki/latest/">wikipedia dump page</a> and look for `${LANG}wiki-latest-pages-articles.xml.bz2`

<p></p>
<b>2. Unzip</b> the dump <br/>

`bzip2 -d ./path/to/enwiki-latest-pages-articles.xml.bz2`

<p></p>
<b>3. Start</b> the javascript <br/>

`npm install dumpster-dip`

```js
import dip from 'dumpster-dip'

const opts = {
  input: '/path/to/my-wikipedia-article-dump.xml',
  parse: function(doc) {
    return doc.sentences()[0].text()// return the first sentence of each page
  }
}
// this promise takes ~4hrs
dip(opts).then(() => {
  console.log('done!')
})
```

en-wikipedia takes about 4hrs on a macbook.

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

---

This tool is intended to be a clean way to pull random bits out of wikipedia, like:

**'all the birthdays of basketball players'**
```js
await dip({
  doPage: function(doc){ return doc.categories().find(cat => cat === `American men's basketball players`)},
  parse: function(doc){ return doc.infobox().get('birth_date')}
})
```

It uses <a href="https://github.com/spencermountain/wtf_wikipedia">wtf_wikipedia</a> as the wikiscript parser.

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>


### Outputs:

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


##### Flat results:

if you want all files in one flat directory, you can do:
```js
let opts = {
  outputDir: './results', 
  outputMode: 'flat', 
}
```

##### Results in one file:
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
  parse: function(doc){return doc.json()}, // (default)  - avoid using an arrow-function
  // should we return anything for this page?
  doPage: function(doc){ return true}, // (default)
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


<div align="center">
  <img src="https://user-images.githubusercontent.com/399657/68221731-e8b84800-ffb7-11e9-8453-6395e0e903fa.png"/>
</div>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<div><i>work in progress</i></div>

MIT
