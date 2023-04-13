import sundayDriver from 'sunday-driver'
import parseXml from './02-xml.js'
import {decode} from 'html-entities'
import {red} from "../_lib.js"

const readWiki = function (opts, eachPage) {
  const { index, workers, file } = opts
  const percent = 100 / workers;
  const start = percent * index;
  const end = start + percent;

  // console.log(`#${index}  - from ${start} to ${end}`)
  const driver = {
    file: file,
    start: `${start}%`,
    end: `${end}%`,
    splitter: '</page>',
    each: (xml, resume) => {
      let pageTitle = "Unknown page"
      try {
        const meta = parseXml(xml);
        pageTitle = meta.title
        // console.log("worker", opts.index, "processing", meta.title);
        meta.wiki = decode(meta.wiki);
        eachPage(meta)
      } catch(e) {
        console.log(red(`Worker ${opts.index} couldn't process ${pageTitle}: got error ${e}`));
      }
      resume();
    }
  };
  const p = sundayDriver(driver);
  p.catch(err => {
    console.log(red('\n\n========== Worker error!  ====='));
    console.log('🚨       worker #' + opts.index + '           🚨');
    console.log(err);
    console.log('\n\n');
  });
  return p

}
export default readWiki
