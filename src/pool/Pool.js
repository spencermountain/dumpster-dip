import path from 'path'
import fs from 'fs'
import EventEmitter from 'events'
import { Worker } from 'worker_threads'
import { fileURLToPath } from 'url'
import { JSONfn } from 'jsonfn'
import { checkFile } from './prep.js'
import { blue, yellow, magenta, grey } from '../_lib.js'
const dir = path.dirname(fileURLToPath(import.meta.url))

class Pool extends EventEmitter {
  constructor(opts) {
    super(opts)
    checkFile(opts.input)
    this.opts = opts
    this.workers = []
    this.methods = JSONfn.stringify(opts)
    // start the logger
    this.heartbeat = setInterval(() => this.beat(), this.opts.heartbeat)
    this.status = [{}]
  }
  // kick off each worker, on a part of the file
  start() {
    let bytes = fs.statSync(this.opts.input)['size']
    const mb = Math.round(bytes / 1048576) + 'mb';
    console.log(`\n\nstarting ${blue(this.opts.workers)} workers on the ${yellow(mb)} file`)

    for (let i = 0; i < this.opts.workers; i += 1) {
      // Create each worker.
      let info = {
        workerData: {
          index: i,
          input: this.opts.input,
          output: this.opts.output,
          namespace: this.opts.namespace,
          workers: this.opts.workers,
          methods: this.methods,
        }
      }
      const file = path.join(dir, '../worker/index.js')
      const worker = new Worker(file, info)
      // receive status of each worker, when requested
      worker.on('message', (msg) => {
        this.status[msg.status.index] = msg.status
      })
      worker.on('error', (err) => console.error(err))
      worker.on('exit', (code) => {
        console.log('worker done', code)
      })
      this.workers.push(worker)
    }
    let header = this.workers.map((_, i) => ` #${i + 1}`.padStart('8')).join('   ')
    console.log('\n' + magenta(header))
  }
  stop() {
    console.log('cleaning up...')
    clearInterval(this.heartbeat)
    // this.workers.forEach(w => w.emit('exit'))
    // this.emit('exit');
    this.emit('end');
    this.removeAllListeners();
    setTimeout(() => {
      // todo: figure out how to exit naturally
      process.exit()
    }, 500)
  }
  // heartbeat status logger
  beat() {
    this.workers.forEach(w => w.postMessage('thump'))
    setTimeout(() => {
      let row = this.status.map(o => o.written.toLocaleString().padStart('8')).join('   ')
      console.log(grey(row))
      let allDone = this.status.every(obj => obj.finished === true)
      if (allDone === true) {
        this.stop()
      }
    }, 500);
  }
}

export default Pool