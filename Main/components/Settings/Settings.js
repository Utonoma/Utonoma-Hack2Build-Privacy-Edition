import { 
  setIsLoggedIn,
  setAddress
} from '../../../services/userManager/userManager.js'

const $settings = document.querySelector('#settings')
const $dialogSendOrReceiveTokens = document.querySelector('#dialogSendOrReceiveTokens')
const $connectWallet = document.querySelector('#connectWallet')
const $buttonManageAccount = document.querySelector('#buttonManageAccount')
const $buttonSendTokens = document.querySelector('#buttonSendTokens')
const $buttonDialogCloseSendTokens = document.querySelector('#buttonDialogCloseSendTokens')
const $buttonBuySellTokens = document.querySelector('#buttonBuySellTokens')

$buttonManageAccount.addEventListener('click', async () => {
  $buttonManageAccount.disabled = true
  const { useSignedProvider } = await import('../../../web3_providers/signedProvider.js')
  const { modal } = await useSignedProvider()
  modal.subscribeState(async(newState) => {
    const isLoggedIn = modal.getIsConnectedState()
    if(isLoggedIn) {
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
  modal.open()
  $buttonManageAccount.disabled = false
})


$buttonSendTokens.addEventListener('click', () => {
  $dialogSendOrReceiveTokens.showModal()
})

$buttonDialogCloseSendTokens.addEventListener('click', () => {
  $dialogSendOrReceiveTokens.close()
})

$buttonBuySellTokens.addEventListener('click', async () => {
  const { dexLink } = await import('../../../utonomaSmartContract.js')
  window.location.href = dexLink
})