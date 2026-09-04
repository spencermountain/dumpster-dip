# dumpster-dip
parse a wikipedia dump into sqlite

```js
import dumpsterDip from 'dumpster-dip'

const stats = await dumpsterDip({
  file: './swwiki-latest-pages-articles.xml',
  path: './pages.db', // the sqlite file to write
})
```

each page becomes a row: `id, title, description, type, categories, infobox, templates`, from the `md` format. the json columns hold stringified json.

the parsing is done by [dumpster-lib](https://github.com/spencermountain/dumpster-lib), and any of its options (`workers`, `batchPageCount`, `namespace`, `redirects`...) can be passed in too. each batch is committed in one transaction before the parsers hand over the next, so memory stays flat.

uses `node:sqlite`, so it needs node 22.5 or later.

the writer is also exported on its own:

```js
import { write, close } from 'dumpster-dip'
write(rows, './pages.db') // synchronous. one transaction per call
close()
```

MIT
