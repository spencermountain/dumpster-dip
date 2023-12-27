/* eslint-disable no-console */
import fetch from 'node-fetch'
import fs from 'fs'

function print(txt) {
  console.log(txt)
  // process.stdout.clearLine()
  // process.stdout.cursorTo(0)
  // process.stdout.write(txt)
}

const wget = async function (url, path) {
  if (!path) {
    let parts = new URL(url).pathname.split(/\//)
    path = parts[parts.length - 1]
  }
  const res = await fetch(url)
  const fileStream = fs.createWriteStream(path)
  await new Promise((resolve, reject) => {
    let done = 0
    let total = Number(res.headers.get('content-length'))
    res.body.pipe(fileStream)
    let timer = setInterval(() => print(Math.floor((done / total) * 100) + '%'), 1000)
    res.body.on('data', (chunk) => (done += chunk.length))
    res.body.on('error', (error) => {
      clearInterval(timer)
      console.log(error)
      reject()
    })
    fileStream.on('finish', () => {
      clearInterval(timer)
      resolve()
    })
  })
}

export default wget
// wget('http://192.168.2.198/api/static/movies%2FBetween.The.Lines.1977.mp4', './foo.mp4')
// wget('http://192.168.2.198/api/static/%F0%9F%92%81%E2%80%8D%E2%99%82%EF%B8%8Ftalking%2F%F0%9F%9B%8F%EF%B8%8F%20bed%2FJoe%20Pera%2FSeason%202%2Fs02e06.mp3')
