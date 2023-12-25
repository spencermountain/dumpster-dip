// npm i wtf-plugin-classify wtf-plugin-summary wtf-plugin-person
import wtf from 'wtf_wikipedia'
import classify from 'wtf-plugin-classify'
import summary from 'wtf-plugin-summary'
import person from 'wtf-plugin-person'

wtf.plugin(classify)
wtf.plugin(summary)
wtf.plugin(person)

export default wtf
