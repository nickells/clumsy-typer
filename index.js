// let input = document.getElementById('input')
function typer(
  message = 'RollerCoaster Tycoon is a series of video games that simulate amusement park management. Each game in the series challenges players with open-ended amusement park management and development, and allowing players to construct and customize their own unique roller coasters.',
  container = document.getElementById('main')
){
  let alphabet = ['qwertyuiop', 'asdfghjkl;', 'zxcvbnm,./',]
  let output = ''

  function percentChance(num){
    return Math.random() <= (num / 100)
  }

  function getRandomKey(object){
    let keys = Object.keys(object)
    return keys[Math.floor(Math.random() * keys.length)]
  }

  function removeKey(keyToOmit, object){
    const keys = Object.keys(object)
    let indexToRemove = 0
    keys.forEach((objectKey, i) => {
      if (objectKey === keyToOmit) {
        indexToRemove = i
      }
    })
    keys.splice(indexToRemove, 1)

    object = keys.reduce((obj, key) => {
      obj[key] = object[key]
      return obj
    }, {})

    return object
  }

  function getTypo(letter){
    const letterWasUppercase = letter === letter.toUpperCase()
    letter = letter.toLowerCase()
    let options = {
      'up': [-1, 0],
      'left': [0, -1],
      'right': [0, 1],
      'down': [1, 0]
    }
    let location = [0, 0]
    alphabet.forEach((row, r) => {
      for (let i = 0; i < row.length; i++){
        if (row[i] === letter){
          location = [r, i]
          break
        }
      }
    })
    let row = location[0]
    let column = location[1]
    let key = alphabet[row][column]
    // avoid edge of keyboard
    if (row === 0) options = removeKey('up', options)
    if (row === 2) options = removeKey('down', options)
    if (column === alphabet[row].length -1) options = removeKey('right', options)
    if (column === 0) options = removeKey('left', options)
    let thisTypo = options[getRandomKey(options)]
    row += thisTypo[0]
    column += thisTypo[1]
    // catch for special chars
    if (alphabet[row][column] === undefined) return letter
    else return letterWasUppercase ? alphabet[row][column].toUpperCase() : alphabet[row][column]
  }

  function repeatLastLetter(index){
    return output[index-1]
  }

  const PERCENT_ERROR = 15
  const PERCENT_ERROR_ON_CORRECTION = 10
  const BASE_SPEED = 100
  const SPEED_VARIATION = 50
  const RATE_SLOWDOWN_WHEN_CORRECTING = 100

  let index = 0
  let deleteThisCharacter = false
  let isCorrection = false

  function type(){
    if (
      percentChance(PERCENT_ERROR)
      && message[index] !== ' '
      && !deleteThisCharacter
      && index !== 0
      && !(isCorrection && percentChance(100 - PERCENT_ERROR_ON_CORRECTION))
      ) {
      // pick between adjacent or repeated letter
      if (percentChance(50) && index !== 0) {
        const typo = getTypo(message[index])
        output += typo
      } else {
        output += repeatLastLetter(index)
      }
      // turn on deletion mode for next cycle
      deleteThisCharacter = true
      index++
    } else {
      if (deleteThisCharacter){
        // delete one character
        output = output.slice(0, -1)
        index -= 1
        deleteThisCharacter = false
        isCorrection = true
      } else {
      // type correct letter
        isCorrection = false
        output += message[index]
        index++
      }
      
    }
    // render
    requestAnimationFrame(()=>container.innerHTML = output)
    // stop when complete
    if (output === message) {
      return
    }
    else {
      let variation = SPEED_VARIATION - (Math.random() * SPEED_VARIATION * 2)
      if (isCorrection || deleteThisCharacter) {
        variation += RATE_SLOWDOWN_WHEN_CORRECTING
      }
      setTimeout(type, BASE_SPEED + variation)
    }
  }

  return {
    go() {
      type()
    }
  }
}

