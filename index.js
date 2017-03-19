let alphabet = ['qwertyuiop', 'asdfghjkl;', 'zxcvbnm,./',]
let container = document.getElementById('main')

let message = 'RollerCoaster Tycoon is a series of video games that simulate amusement park management. Each game in the series challenges players with open-ended amusement park management and development, and allowing players to construct and customize their own unique roller coasters.'
let output = ''
function percentChance(num){
  return Math.random() <= (num / 100)
}

function getRandomKey(object){
  let keys = Object.keys(object)
  return keys[Math.floor(Math.random() * keys.length)]
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
  if (row === 0) delete options.up
  if (row === 2) delete options.down
  if (column === alphabet[row].length -1) delete options.right
  if (column === 0) delete options.left
  let thisTypo = options[getRandomKey(options)]
  row += thisTypo[0]
  column += thisTypo[1]
  if (letterWasUppercase) return alphabet[row][column].toUpperCase()
  else return alphabet[row][column]
}

function repeatLastLetter(index){
  return output[index-1]
}



const PERCENT_ERROR = 20
const PERCENT_ERROR_ON_CORRECTION = 25

let index = 0
let deleteThisCharacter = false
let isCorrection = false
let interval = setInterval(function(){
  // 10 percent chance of making an error
  if (
    percentChance(PERCENT_ERROR)
    && message[index] !== ' '
    && !deleteThisCharacter
    && index !== 0
    // 60 percent chance of hitting the right letter on a correction
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
  container.innerHTML = output
  // stop when complete
  if (output === message || index === message.length) clearInterval(interval)
}, 100)

