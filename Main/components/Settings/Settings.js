import { 
  setIsLoggedIn,
  setAddress
} from '../../../services/userManager/userManager.js'
import { useUtonomaContractForSignedTransactions, useSignedProvider } from '../../../web3_providers/signedProvider.js'
import { utonomaSepoliaAddress } from '../../../utonomaSmartContract.js'
import { parseUnits } from 'ethers'

const $settings = document.querySelector('#settings')
const $modalConfirmActivateForVoting = document.querySelector('#modalConfirmActivateForVoting')
const $dialogActivateForVotingCheckWallet = document.querySelector('#dialogActivateForVotingCheckWallet')
const $dialogActivateForVotingTransactionSent = document.querySelector('#dialogActivateForVotingTransactionSent')
const $dialogActivateForVotingError = document.querySelector('#dialogActivateForVotingError')
const $dialogSendOrReceiveTokens = document.querySelector('#dialogSendOrReceiveTokens')
const $connectWallet = document.querySelector('#connectWallet')
const $buttonActivateForVoting = document.querySelector('#buttonActivateForVoting')
const $buttonManageAccount = document.querySelector('#buttonManageAccount')
const $buttonSendTokens = document.querySelector('#buttonSendTokens')
const $buttonDialogCloseSendTokens = document.querySelector('#buttonDialogCloseSendTokens')

$buttonManageAccount.addEventListener('click', async () => {
  $buttonManageAccount.disabled = true
  const { useSignedProvider } = await import('../../../web3_providers/signedProvider.js')
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
  $buttonActivateForVoting.disabled = true
  $modalConfirmActivateForVoting.showModal()
  document.querySelector('#buttonConfirmActivateForVotingYes').addEventListener('click', () => {
    activateForVoting()
    $modalConfirmActivateForVoting.close()
    $dialogActivateForVotingCheckWallet.show()
    setTimeout(() => $dialogActivateForVotingCheckWallet.close(), 5000)
    $buttonActivateForVoting.disabled = false
  })
  document.querySelector('#buttonConfirmActivateForVotingNo').addEventListener('click', () => {
    $modalConfirmActivateForVoting.close()
    $buttonActivateForVoting.disabled = false
  })
})

async function activateForVoting() {
  try {
    const { utonomaContractForSignedTransactions } = await useUtonomaContractForSignedTransactions()
    const approveResult = await utonomaContractForSignedTransactions.approve(utonomaSepoliaAddress, parseUnits("100000.0", 18))
    $dialogActivateForVotingTransactionSent.show()
    setTimeout(() => $dialogActivateForVotingTransactionSent.close(), 5000)
    const transactionResp = await approveResult.wait()
    //Alert the success
    console.log(transactionResp)
  }
  catch(error) {
    if(error.error?.message == 'Please call connect() before request()' || error == 'Error: User disconnected') {
      const { setIsLoggedIn, setAddress } = await import('../../../services/userManager/userManager.js')
      setIsLoggedIn(false)
      setAddress('')
    }
    else {
      $dialogActivateForVotingError.show()
      setTimeout(() => $dialogActivateForVotingError.close(), 5000)
    }
  }
}

$buttonSendTokens.addEventListener('click', () => {
  $dialogSendOrReceiveTokens.showModal()
})

$buttonDialogCloseSendTokens.addEventListener('click', () => {
  $dialogSendOrReceiveTokens.close()
})