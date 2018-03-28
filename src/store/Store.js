import { get, set } from 'lodash'

const store = { values: {} }

window.store = store

function reset() {
  store.values = {
    userInfo: {},
    flatInfo: {},
    surveyQuestions: {},
    entries: [],
    surveyAnalysis: [],
    mouseHistory: [],
    mousePath: []
  }
}

function getValue(fieldPath) {
  return get(store.values, fieldPath)
}

function setValue(fieldPath, value) {
  return set(store.values, fieldPath, value)
}

function getStore() {
  return store.values
}

export default {
  reset,
  getValue,
  setValue,
  getStore
}
