import { tierNames, tierColors, editorList, storageName } from './constants.js'
import { createStorageStructure, getStorageValues } from './helpers.js'

const content = document.querySelector('.content')

const rowLookup = new Map()

let currentEditorIdx = -1
let primaryImage = null
let primaryText = null
let placedEditor = null
let placedRow = null

function resetStats() {
  // TODO: add a confirmation modal
  localStorage.removeItem(storageName)
  location.reload()
}

function initValues() {
  let storageValues = getStorageValues()
  if (storageValues === null) {
    const intialStorageData = createStorageStructure()
    localStorage.setItem(storageName, JSON.stringify(intialStorageData))
    storageValues = getStorageValues()
  }
  currentEditorIdx = storageValues.currentEditor
}

function defaults() {
  placedEditor = null
  placedRow = null
}

function createRow() {
  const row = document.createElement('div')
  row.className = 'row'
  return row
}

function createRowTitle(tierName, color) {
  const tier = document.createElement('div')
  tier.className = 'row-title'
  tier.style.backgroundColor = '#' + color
  tier.innerHTML = tierName
  return tier
}

function createTierSection() {
  for(let i=0; i < tierNames.length; i++ ) {
    const color = tierColors[i]
    const name = tierNames[i]
    const title = createRowTitle(name, color)
    const row = createRow()
    content.appendChild(title)
    content.appendChild(row)
    rowLookup.set(name, row)
  }
}

function createImg(editorName, makeBig=false) {
  const img = document.createElement('img')
  img.src = `editors/${editorName}`
  if(makeBig) {
    img.className = 'center'
  } else {
    img.className = ''
  }
  return img
}

function displayEditor() {
  const editor = editorList[currentEditorIdx]
  const img = createImg(editor, true)
  const text = document.createElement('div')
  text.innerHTML = editor
  text.className = 'text-editor'
  content.appendChild(img)
  content.appendChild(text)
  primaryImage = img
  primaryText = text
}

function chooseNextEditor() {
  defaults()
  currentEditorIdx += 1
  // localStorage.setItem(curEditorStrgName, currentEditor)
  if (currentEditorIdx >= editorList.length) {
    return
  }
  displayEditor()
}

function removePrimaries() {
  if (primaryImage) {
    content.removeChild(primaryImage)
    primaryImage = null
  }
  if (primaryText) {
    content.removeChild(primaryText)
    primaryText = null
  }
}

function placeEditor(position, storageWritable=true) {
  removePrimaries()
  if (currentEditorIdx >= editorList.length) {
    return
  }
  const tierName = tierNames[position]
  if (!tierName) {
    return
  }
  const row = rowLookup.get(tierName)
  const editor = editorList[currentEditorIdx]
  if (placedEditor) {
    const row = rowLookup.get(placedRow)
    row.removeChild(placedEditor)
  } else {
    const img = createImg(editor)
    placedEditor = img
  }
  row.appendChild(placedEditor)
  placedRow = tierName
  // update storage with the new values TODO: maybe a function for this
  if (storageWritable) {
    const currentStorage = getStorageValues()
    currentStorage.currentEditor = currentEditorIdx
    currentStorage.editors[editor] = tierName
    localStorage.setItem(storageName, JSON.stringify(currentStorage))
  }
}

function attachEvent() {
  document.addEventListener('keydown', (event) => {
    const keyName = event.key
    if (keyName === ' ') {
      chooseNextEditor()
      return
    }

    const keyNumber = parseInt(keyName)
    if (typeof keyNumber === 'number' && keyNumber >= -1 && keyNumber <= 6) {
      placeEditor(keyNumber - 1)
    } else if (typeof keyNumber === 'number' && (keyNumber < -1 ||  keyNumber > 6)) {
      JSAlert.alert(`Should press a button between 1 and ${tierNames.length}`);
    }
  })
}

function resumeSession() {
  const storageValues = getStorageValues()
  if (storageValues.currentEditor === -1) {
  } else {
    const currentStorage = getStorageValues()
    for (let i = 0; i <= currentStorage.currentEditor; i++) {
      currentEditorIdx = i // i will hate myself for this one
      const currentEditor = editorList[i]
      const currentPosition = currentStorage.editors[currentEditor]
      const currentPositionIdx = tierNames.indexOf(currentPosition)
      placeEditor(currentPositionIdx, false)
      defaults()
    }
  }
}

function main() {
  createTierSection()
  initValues()
  resumeSession()
  attachEvent()
  const resetBtn = document.getElementById('reset')
  resetBtn.onclick = resetStats

}

main()