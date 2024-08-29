import { 
  getIsLoggedIn, 
  getUserAddress, 
  setIsLoggedIn, 
  setAddress 
} from '../../../services/userManager/userManager.js'
import { createStateForConnectWallet } from "./ConnectWallet.state.js"

const $settings = document.querySelector('#settings')
const $connectWallet = document.querySelector('#connectWallet')

export const ConnectWallet = ($container) => {
  const state = createStateForConnectWallet()
  const $buttonConnectWallet = $container.querySelector('#buttonConnectWallet')

  async function effectIsButtonConnectWalletEnabled() {
    $buttonConnectWallet.disabled = true
    const { useSignedProvider } = await import('../../../web3_providers/signedProvider.js')
    const { modal } = await useSignedProvider()
    modal.subscribeState(async(newState) => {
      if(newState?.open === false) {
        state.setIsButtonConnectWalletEnabled(true, () => {})
        $buttonConnectWallet.disabled = false
      }
    })
    modal.subscribeProvider(({ address, isConnected }) => {
      console.log('something happened with the provider')
      if(isConnected) {
        setIsLoggedIn(true)
        setAddress(address)
        $connectWallet.style.display = 'none'
        $settings.style.display = 'flex'
      } else {
        setIsLoggedIn(false)
        setAddress('')
      }
    })
    modal.open()
  }

  $buttonConnectWallet.addEventListener('click', () => {
    state.setIsButtonConnectWalletEnabled(false, effectIsButtonConnectWalletEnabled)
  })

  return state
}