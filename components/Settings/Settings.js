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

$buttonActivateForVoting.addEventListener('click', async() => {
  try {
    const utonomaContractForSignedTransactions = await useUtonomaContractForSignedTransactions()
    const approveResult = await utonomaContractForSignedTransactions.approve(utonomaSepoliaAddress, parseUnits("100000.0", 18))
    const transactionResp = await approveResult.wait()
    console.log(transactionResp)
  }
  catch(error) {
    console.log('Error message: ', error)
  }
})