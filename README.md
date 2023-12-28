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
  <div>
    <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
  </div>
</div>
<p></p>

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

The data exports from wikimedia, arguably the world's most-important datasets, exist as <a href="https://dumps.wikimedia.org">huge xml files</a>, in a notorious markup format.

<b>dumpster-dip</b> can flip this dataset into individual <b>json</b> or <b>text</b> files.

<div align="right">
  <i>Sister-project <b><a href="https://github.com/spencermountain/dumpster-dive">dumpster-dive</a></b> puts this data into mongodb, instead <br/>
  use whatever you prefer!</i>
  <p></p>
  Both projects use <a href="https://github.com/spencermountain/wtf_wikipedia">wtf_wikipedia</a> as a parser.
</div>

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

## Command-Line

the easiest way to get started is to simply run:

```bash
npx dumpster-dip
```

which is a wild, no-install, no-dependency way to get going.

Follow the prompts, and this will **download**, **unzip**, and **parse** any-language wikipedia, into a selected format.

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

Also available to be used as a powerful javascript library:

```bash
npm install dumpster-dip
```

```js
import dumpster from 'dumpster-dip' // or require('dumpster-dip')

await dumpster({ file: './enwiki-latest-pages-articles.xml' }) // 😅
```

This will require you to download and unzip a dump yourself. Instructions below.
Depending on the language, it may take a couple hours.

### Instructions

<b>1. Download</b> a dump <br/>
cruise the <a href="https://dumps.wikimedia.org/enwiki/latest/">wikipedia dump page</a> and look for `${LANG}wiki-latest-pages-articles.xml.bz2`

<p></p>
<b>2. Unzip</b> the dump <br/>

`bzip2 -d ./enwiki-latest-pages-articles.xml.bz2`

<p></p>
<b>3. Start</b> the javascript <br/>

```js
import dip from 'dumpster-dip'

const opts = {
  input: './enwiki-latest-pages-articles.xml',
  parse: function (doc) {
    return doc.sentences()[0].text() // return the first sentence of each page
  }
}

dip(opts).then(() => {
  console.log('done!')
})
```

en-wikipedia takes about 4hrs on a macbook. See expected article counts [here](https://meta.wikimedia.org/wiki/List_of_Wikipedias)

### Options

```js
{
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

### Output formats:

dumpster-dip comes with 4 output formats:

- **'flat'** - all files in 1 directory
- **'encyclopedia'** - all `'E..'` pages in `./e`
- **'encyclopedia-two'** - all `'Ed..'` pages in `./ed`
- **'hash'** (default) - 2 evenly-distributed directories
- **'ndjson'** - all data in one file

Sometimes operating systems don't like having ~6m files in one folder - so these options allow different nesting structures:

##### Encyclopedia

to put files in folders indexed by their first letter, do:

```js
let opts = {
  outputDir: './results',
  outputMode: 'encyclopedia'
}
```

Remember, some directories become way larger than others. Also remember that titles are UTF-8.

For two-letter folders, use `outputMode: 'encyclopedia-two'`

#### Hash (default)

This format nests each file 2-deep, using the first 4 characters of the filename's hash:

```
/BE
  /EF
    /Dennis_Rodman.txt
    /Hilary_Clinton.txt
```

Although these directory names are meaningless, the advantage of this format is that files will be distributed evenly, instead of piling-up in the 'E' directory.

This is the same scheme that wikipedia does internally.

as a helper, this library exposes a function for navigating this directory scheme:

```js
import getPath from 'dumpster-dip/nested-path'
let file = getPath('Dennis Rodman')
// ./BE/EF/Dennis_Rodman.txt
```

##### Flat:

if you want all files in one flat directory, you can cross your fingers and do:

```js
let opts = {
  outputDir: './results',
  outputMode: 'flat'
}
```

##### Ndjson

You may want all results in one newline-delimited file.
Using this format, you can produce TSV or CSV files:

```js
let opts = {
  outputDir: './results',
  outputMode: 'ndjson',
  parse: function (doc) {
    return [doc.title(), doc.text().length].join('\t')
  }
}
```

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>
<div align="center">
  <img height="50px" src="https://user-images.githubusercontent.com/399657/68221824-09809d80-ffb8-11e9-9ef0-6ed3574b0ce8.png"/>
</div>

### Examples:

Wikipedia is often a complicated place. Getting specific data may require some investigation, and experimentation:

_See runnable examples in [./examples](https://github.com/spencermountain/dumpster-dip/tree/main/src)_

#### Birthdays of basketball players

Process only the 13,000 pages with the category [American men's basketball players](https://en.m.wikipedia.org/wiki/Category:American_men%27s_basketball_players)

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
  outputMode: 'encyclopedia',
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

#### Talk Pages

Talk pages are not found in the normal 'latest-pages-articles.xml' dump. Instead, you must download the larger 'latest-pages-meta-current.xml' dump.
To process only Talk pages, set 'namespace' to 1.

```js
const opts = {
  input: `./enwiki-latest-pages-meta-current.xml`,
  namespace: 1, // do talk pages only
  parse: function (doc) {
    return doc.text() //return their text
  }
}
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

Given the `parse` callback, you're free to return anything you'd like.

One of the charms of [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia) is its [plugin system](https://observablehq.com/@spencermountain/wtf-wikipedia-plugins?collection=@spencermountain/wtf_wikipedia), which allows users to add any new features.

Here we apply a [custom plugin](https://observablehq.com/@spencermountain/wtf-wikipedia-plugins) to our wtf lib, and pass it in to be available each worker:

in `./myLib.js`

```js
import wtf from 'wtf_wikipedia'

// add custom analysis as a plugin
wtf.plugin((models, templates) => {
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
  libPath: './myLib.js', // our version (relative to cwd)
  parse: function (doc) {
    return doc.firstSentence() // use custom method
  }
})
```

See the [plugins available](https://github.com/spencermountain/wtf_wikipedia/tree/master/plugins), such as the [NHL season parser](https://github.com/spencermountain/wtf_wikipedia/tree/master/plugins/sports), the [nsfw tagger](https://github.com/spencermountain/wtf-plugin-nsfw), or a parser for [disambiguation pages](https://github.com/spencermountain/wtf_wikipedia/tree/master/plugins/disambig).

---

<!-- spacer -->
<img height="25px" src="https://user-images.githubusercontent.com/399657/68221862-17ceb980-ffb8-11e9-87d4-7b30b6488f16.png"/>

#### 👋

We are commited to making this library into a great tool for parsing mediawiki projects.

**[Prs](https://github.com/spencermountain/compromise/wiki/Contributing) welcomed and respected.**

MIT
