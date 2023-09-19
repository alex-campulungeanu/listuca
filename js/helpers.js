import { editorList, storageName } from './constants.js'

function createStorageStructure() {
  let jsonData = {}
  jsonData.currentEditor = -1
  jsonData.editors = {}
  editorList.forEach((item, idx) => {
    jsonData.editors[item] = ''
  })
  return jsonData
}

function getStorageValues() {
  const val = localStorage.getItem(storageName)
  const valParsed = JSON.parse(val)
  return valParsed
}

export {
  createStorageStructure,
  getStorageValues,
}