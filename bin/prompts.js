import inquirer from 'inquirer'

console.log('\n\nWelcome to the dumpster-dip CLI\n')

const whichLang = async function () {
  console.log('\n\n')
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'lang',
      message: 'Which language wikipedia do you want to process?',
      validate(value) {
        const valid = typeof value === 'string' && value.length == 2
        return valid || "Please enter a two-letter lang code, like 'fr'"
      }
    }
  ])
}

const addPageviews = async function () {
  console.log('\n\n')
  return await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addPageviews',
      message: 'Do you want to include pageviews data?',
      default: false,
      transformer: (answer) => (answer ? true : false)
    }
  ])
}

const whichFormat = async function () {
  console.log('\n\n')
  return await inquirer.prompt([
    {
      type: 'list',
      name: 'size',
      message: 'What format would you like the results?',
      choices: ['Hash', 'Flat', 'Encyclopedia', 'Encyclopedia-two', 'ndjson'],
      filter(val) {
        return val.toLowerCase()
      }
    }
  ])
}
export { addPageviews, whichFormat, whichLang }
