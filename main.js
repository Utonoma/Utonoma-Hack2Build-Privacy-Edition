const $splashScreen = document.querySelector('#splashScreen')
const $buttonTouchToStart = document.querySelector('#buttonTouchToStart')
$buttonTouchToStart.addEventListener('click', () => {
  $splashScreen.style.display = 'none'
  document.querySelector('#shortVideoReel').style.display = ''
})
