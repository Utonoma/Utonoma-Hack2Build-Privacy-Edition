import './utonoma_styles_library/index.css'
import './components/ConnectWallet/ConnectWallet.js'

const $splashScreen = document.querySelector('#splashScreen')
const $buttonTouchToStart = document.querySelector('#buttonTouchToStart')
$buttonTouchToStart.addEventListener('click', async () => {
  $splashScreen.style.display = 'none'
  document.querySelector('#shortVideoReel').style.display = ''
  await import('./components/ShortVideoReel/ShortVideoReel.js')
})
