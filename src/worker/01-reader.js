import sundayDriver from 'sunday-driver'
import parseXml from './02-xml.js'
import {decode} from 'html-entities'
import chalk from 'chalk';

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
      try {
        let meta = parseXml(xml);
        // console.log("worker", opts.index, "processing", meta.title);
        meta.wiki = decode(meta.wiki);
        eachPage(meta)
      } catch(e) {
        console.log(chalk.red(`Worker ${opts.index} encountered ${e} while processing ${meta.title}`));
      }
      resume();
    }
  };
  const p = sundayDriver(driver);
  p.catch(err => {
    console.log(chalk.red('\n\n========== Worker error!  ====='));
    console.log('🚨       worker #' + opts.index + '           🚨');
    console.log(err);
    console.log('\n\n');
  });
  return p

}
export default readWiki
