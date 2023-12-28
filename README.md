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
    <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>
<p></p>

<div align="center">
  gets a wikipedia <a href="https://dumps.wikimedia.org">xml dump</a> into tiny json files,
  <div>so you can get a bunch of easy data.</div>
</div>
<p></p>
<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<b>dumpster-dip</b> puts data into _files_.

<b><a href="https://github.com/spencermountain/dumpster-dive">dumpster-dive</a></b> puts data into mongodb, instead.

<i >use whatever you prefer!</i>

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<div align="right">
_dumpster-dip can be used from the command-line, or as a javascript library:_
</div>

## Command-Line

the easiest way to get started is to simply run

```bash
npx dumpster-dip
```

and follow-along with the prompts. There are no dependencies _(besides [nodejs](https://nodejs.org/en/download/))_.

This will **download**, **unzip**, and **parse** any-language wikipedia, into a selected format.

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

The optional params are:

```bash
--lang fr             # do the french wikipedia
--output encyclopedia # add all 'E' pages to ./E/
--text                # return plaintext instead of json
```

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

## JS API

Dumpster-dip also can be used in javascript, which allows far-more configuration:

```bash
npm install dumpster-dip
```

```js
import dumpster from 'dumpster-dip'
// or const dumpster = require('dumpster-dip')

await dumpster({ file: './enwiki-latest-pages-articles.xml' })
```

This will require you to download and unzip a dump yourself. Instructions below.
Depending on the language, it may take a couple hours.

### Instructions

<b>1. Download</b> a dump <br/>
cruise the <a href="https://dumps.wikimedia.org/enwiki/latest/">wikipedia dump page</a> and look for `${LANG}wiki-latest-pages-articles.xml.bz2`

<p></p>
<b>2. Unzip</b> the dump <br/>

`bzip2 -d ./path/to/enwiki-latest-pages-articles.xml.bz2`

<p></p>
<b>3. Start</b> the javascript <br/>

```js
import dip from 'dumpster-dip'

const opts = {
  input: '/path/to/my-wikipedia-article-dump.xml',
  parse: function (doc) {
    return doc.sentences()[0].text() // return the first sentence of each page
  }
}
// this promise takes ~4hrs
dip(opts).then(() => {
  console.log('done!')
})
```

en-wikipedia takes about 4hrs on a macbook.

### Options

```js
let opts = {
  file: './enwiki-latest-pages-articles.xml', // path to unzipped dump file relative to cwd
  outputDir: './dip', // directory for all our new file(s)
  outputMode: 'nested', // how we should write the results

  // define how many concurrent workers to run
  workers: cpuCount, // default is cpu count
  //interval to log status
  heartbeat: 5000, //every 5 seconds

  // which wikipedia namespaces to handle (null will do all)
  namespace: 0, //(default article namespace)
  // parse redirects, too
  redirects: false,
  // parse disambiguation pages, too
  disambiguation: true,

  // allow a custom wtf_wikipedia parsing library
  libPath: 'wtf_wikipedia',

  // should we skip this page or return something?
  doPage: function (doc) {
    return true
  },

  // what do return, for every page
  //- avoid using an arrow-function
  parse: function (doc) {
    return doc.json()
  }
}
```

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

to put files in folders indexed by their first letter, do:

```js
let opts = {
  outputDir: './results',
  outputMode: 'encyclopedia'
}
```

this is less ideal, because some directories become way larger than others. Also remember that titles are UTF-8.

For two-letter folders, use `outputMode: 'encyclopedia-two'`

##### Flat results:

if you want all files in one flat directory, you can do:

```js
let opts = {
  outputDir: './results',
  outputMode: 'flat'
}
```

##### Results in one file:

if you want all results in one file, you can do:

```js
let opts = {
  outputDir: './results',
  outputMode: 'ndjson'
}
```

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

---

### Examples:

This tool is intended to be a clean way to pull random bits out of wikipedia, which is often a complicated place. Getting specific data sometimes requires some investigation, and experimentation.

_See more examples in [./examples dir](https://github.com/spencermountain/dumpster-dip/tree/main/src)_

#### Birthdays of basketball players

Process only the pages with the category [American men's basketball players](https://en.m.wikipedia.org/wiki/Category:American_men%27s_basketball_players)

```js
await dip({
  input: `./enwiki-latest-pages-articles.xml`,
  doPage: function (doc) {
    return doc.categories().find((cat) => cat === `American men's basketball players`)
  },
  parse: function (doc) {
    return doc.infobox().get('birth_date')
  }
})
```

### Film Budgets

Look for pages with the [Film infobox](https://en.m.wikipedia.org/wiki/Template:Infobox_film) and grab some properties:

```js
await dip({
  input: `./enwiki-latest-pages-articles.xml`,
  outputMode: 'encyclopedia', // all 'E' movies under the ./e/ directory...
  doPage: function (doc) {
    // look for anything with a 'Film' 'infobox
    return doc.infobox() && doc.infobox().type() === 'film'
  },
  parse: function (doc) {
    let inf = doc.infobox()
    // pluck some values from its infobox
    return {
      title: doc.title(),
      budget: inf.get('budget'),
      gross: inf.get('gross')
    }
  }
})
```

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

<div align="center">
  <img src="https://user-images.githubusercontent.com/399657/68221731-e8b84800-ffb7-11e9-8453-6395e0e903fa.png"/>
</div>

<!-- spacer -->
<img height="50px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

---

### Customization

Given the `parse` callback, you're free to return anything you'd like. Sometimes though, you may want to parse a page with a custom version of `wtf_wikipedia` parser - if you need any extra plugins or functionality.

Here we apply a [custom plugin](https://observablehq.com/@spencermountain/wtf-wikipedia-plugins) to our wtf lib, and pass it in to be available each worker:

in `./myLib.js`

```js
import wtf from 'wtf_wikipedia'

// add custom analysis as a plugin
wtf.extend((models, templates) => {
  // add a new method
  models.Doc.prototype.firstSentence = function () {
    return this.sentences()[0].text()
  }
  // support a missing plugin
  templates.pingponggame = function (tmpl, list) {
    let arr = tmpl.split('|')
    return arr[1] + ' to ' + arr[2]
  }
})
export default wtf
```

then we can pass this version into dumpster-dip:

```js
import dip from 'dumpster-dip'

dip({
  input: '/path/to/dump.xml',
  libPath: './myLib.js', // our version
  parse: function (doc) {
    return doc.firstSentence() // use custom method
  }
})
```

---

We are commited to making this library into a great tool for parsing mediawiki projects.
[Prs](https://github.com/spencermountain/compromise/wiki/Contributing) welcomed!

MIT
