import { get, set } from 'lodash'

const store = {}

window.store = store

function reset() {
  Object.assign(store, {
    entries: [],
    mouseHistory: [],
    mousePath: []
  })
}

function getValue(fieldPath) {
  return get(store, fieldPath)
}

function setValue(fieldPath, value) {
  return set(store, fieldPath, value)
}

function getStore() {
  return store
}

export default {
  reset,
  getValue,
  setValue,
  getStore
}
