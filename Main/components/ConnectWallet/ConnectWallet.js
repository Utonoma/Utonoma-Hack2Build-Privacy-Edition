import { 
  getIsLoggedIn, 
  getUserAddress, 
  setIsLoggedIn, 
  setAddress 
} from '../../../services/userManager/userManager.js'
import { createStateForConnectWallet } from "./ConnectWallet.state.js"
import { useSignedProvider } from '../../../web3_providers/signedProvider.js'

const $settings = document.querySelector('#settings')
const $connectWallet = document.querySelector('#connectWallet')

export const ConnectWallet = ($container) => {
  const state = createStateForConnectWallet()
  const $buttonConnectWallet = $container.querySelector('#buttonConnectWallet')
  const $buttonImANewUser = document.querySelector('#buttonImANewUser')

  $buttonImANewUser.addEventListener('click', async() => {
    $buttonImANewUser.disabled = true
    const { modal } = await useSignedProvider()
    await modal.open({ view: 'WhatIsAWallet' })
    $buttonImANewUser.disabled = false
  })

  async function effectIsButtonConnectWalletEnabled() {
    $buttonConnectWallet.disabled = true
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