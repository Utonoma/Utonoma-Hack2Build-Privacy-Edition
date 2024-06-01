import { 
  setIsLoggedIn,
  setAddress
} from '../../services/userManager/userManager.js'
import { useUtonomaContractForSignedTransactions, useSignedProvider } from '../../web3_providers/signedProvider.js'
import { utonomaSepoliaAddress } from '../../utonomaSmartContract.js'
import { parseUnits } from 'ethers'

const $settings = document.querySelector('#settings')
const $connectWallet = document.querySelector('#connectWallet')
const $buttonActivateForVoting = document.querySelector('#buttonActivateForVoting')
const $buttonManageAccount = document.querySelector('#buttonManageAccount')

$buttonManageAccount.addEventListener('click', async () => {
  $buttonManageAccount.disabled = true
  const { useSignedProvider } = await import('../../web3_providers/signedProvider.js')
  const { modal } = await useSignedProvider()
  modal.open()
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

$buttonActivateForVoting.addEventListener('click', async() => {
  try {
    const { utonomaContractForSignedTransactions } = await useUtonomaContractForSignedTransactions()
    const approveResult = await utonomaContractForSignedTransactions.approve(utonomaSepoliaAddress, parseUnits("100000.0", 18))
    const transactionResp = await approveResult.wait()
    console.log(transactionResp)
  }
  catch(error) {
    console.log('Error message: ', error)
  }
})