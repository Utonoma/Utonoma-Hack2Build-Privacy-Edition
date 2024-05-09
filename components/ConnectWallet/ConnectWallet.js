import { 
  getIsLoggedIn, 
  getUserAddress, 
  setIsLoggedIn, 
  setAddress 
} from '../../services/userManager/userManager.js'

const $buttonConnectWallet = document.querySelector('#buttonConnectWallet')
$buttonConnectWallet.addEventListener('click', async () => {
  const { useSignedProvider } = await import('../../web3_providers/signedProvider.js')
  const { modal } = useSignedProvider()
  modal.subscribeState((newState) => {
    if(modal.getIsConnected()) {
      setIsLoggedIn(true)
      setAddress(modal.getAddress())
    } else {
      setIsLoggedIn(false)
      setAddress('')
    }
  })
  //Give two seconds before opening the modal, as there are wrong lectures on the getIsConnected method when
  //we call it immediately
  setTimeout(() => modal.open(), 2000)
})

console.log('isConnected ', getIsLoggedIn())
console.log('address ', getUserAddress())