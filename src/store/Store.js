import { get, set } from 'lodash'

const store = {}

window.store = store

function reset() {
  console.log('reset')

  Object.assign(store, {
    entries: [],
    mouseHistory: [],
    mousePath: []
  })
}

function getValue(fieldPath) {
  console.log('get', fieldPath)

  return get(store, fieldPath)
}

function setValue(fieldPath, value) {
  console.log('set', fieldPath, value)

  return set(store, fieldPath, value)
}

function getStore() {
  console.log('getStore')

  return store
}

export default {
  reset,
  getValue,
  setValue,
  getStore
}
