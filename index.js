let textarea = document.getElementById('input')
let container  = document.getElementById('main')
let button = document.getElementById('button')
let accuracy = document.getElementById('acc')
accuracy.value = 75

textarea.value = 'RollerCoaster Tycoon is a series of video games that simulate amusement park management. Each game in the series challenges players with open-ended amusement park management and development, and allowing players to construct and customize their own unique roller coasters.'

let isGoing = false
let thisTyper
accuracy.addEventListener('input', (e) => {
  let error = 100 - e.target.value
  if (thisTyper.setPercentError) thisTyper.setPercentError(error)
})
button.addEventListener('click', ()=>{
  if (isGoing){
    thisTyper.stop()
    isGoing = false
    button.innerHTML = 'Go'
  } else{
    container.innerHTML = ''
    thisTyper = new typer(textarea.value, container)
    thisTyper.go()
    thisTyper.onComplete(() => {
      isGoing = false
      button.innerHTML = 'Go'
    })
    button.innerHTML = 'Stop'
    isGoing = true
  }
})