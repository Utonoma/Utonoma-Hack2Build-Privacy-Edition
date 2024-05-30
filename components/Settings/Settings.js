import { 
  setIsLoggedIn,
  setAddress
} from '../../services/userManager/userManager.js'

const $settings = document.querySelector('#settings')
const $connectWallet = document.querySelector('#connectWallet')
const $buttonManageAccount = document.querySelector('#buttonManageAccount')
$buttonManageAccount.addEventListener('click', async () => {
  $buttonManageAccount.disabled = true
  const { useSignedProvider } = await import('../../web3_providers/signedProvider.js')
  const { modal } = useSignedProvider()
  //Give two seconds before opening the modal, as there are wrong lectures on the getIsConnected method when
  //we call it immediately
  setTimeout(() => modal.open(), 2000)
  modal.subscribeState(async(newState) => {
    if(modal.getIsConnected()) {
      setIsLoggedIn(true)
      setAddress(modal.getAddress())
    } else {
      setIsLoggedIn(false)
      setAddress('')
      $settings.style.display = 'none'
      $connectWallet.style.display = 'flex'
      await import('../ConnectWallet/ConnectWallet.js')
    }
  })
  $buttonManageAccount.disabled = false
})