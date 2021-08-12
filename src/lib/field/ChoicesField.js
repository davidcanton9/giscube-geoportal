import { escapeRegex, strContains } from 'src/lib/utils'

import Field from './Field'
import ChoicesWidget from './widgets/form/Choices'

export default class ChoicesField extends Field {
  constructor (info) {
    super(info)

    this.valuesList = []
    this.valuesDict = {}
    this.allowAddNew = info.widget_options.allow_add_new

    const valuesList = info.widget_options.values_list
    if (Array.isArray(valuesList)) {
      for (let value of valuesList) {
        if (Array.isArray(value)) {
          this.valuesDict[value[0]] = value[1]
          this.valuesList.push({ value: value[0], label: value[1] })
        } else {
          this.valuesDict[value] = value
          this.valuesList.push({ value, label: value })
        }
      }
    }
  }

  str (data) {
    const key = this.getValue(data)
    const value = this.valuesDict[key]
    const result = Field.toString(value === void 0 ? key : value)
    console.log('RESULT', result)
    return result
  }

  formWidget () {
    return ChoicesWidget
  }

  search (value) {
    console.log('**** SEARCH', value)
    const choices = this.valuesList
      .filter(
        row => strContains(row.label, value)
      )
      .map(row => `^${escapeRegex(row.value)}$`)

    choices.unshift(escapeRegex(value))

    return [ this.name + '__iregex', `(${choices.join('|')})` ]
  }
}
