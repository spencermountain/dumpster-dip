const green = str => '\x1b[32m' + str + '\x1b[0m'
const red = str => '\x1b[31m' + str + '\x1b[0m'
const blue = str => '\x1b[34m' + str + '\x1b[0m'
const magenta = str => '\x1b[35m' + str + '\x1b[0m'
const cyan = str => '\x1b[36m' + str + '\x1b[0m'
const grey = str => '\x1b[37m' + str + '\x1b[0m'
const yellow = str => '\x1b[33m' + str + '\x1b[0m'
const black = str => '\x1b[30m' + str + '\x1b[0m'
const dim = str => '\x1b[2m' + str + '\x1b[0m'

export {
  green,
  red,
  blue,
  magenta,
  cyan,
  grey,
  yellow,
  black,
  dim,
}