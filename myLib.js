import wtf from 'wtf_wikipedia'


// add custom analysis as a plugin
wtf.extend((models, templates) => {
  // add a new method
  models.Doc.prototype.firstSentence = function () {
    let s = this.sentences()[0]
    if (s) {
      return s.text()
    }
    return ''
  }
  // support a missing plugin   
  templates.pingponggame = function (tmpl, list) {
    let arr = tmpl.split('|')
    return arr[1] + ' to ' + arr[2]
  }
})
export default wtf