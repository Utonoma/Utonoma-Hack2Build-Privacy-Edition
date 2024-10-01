import { getShortVideo } from '../../services/contentProvider.js'
import { getUrlFromIpfsHash } from '../../utils/encodingUtils/encodingUtils.js'
import {
  nextShortVideo,
  getPreviousShortVideo,
  informCorrectPlay,
} from './ShortVideoReel.manager.js'

let numberOfRetriesToGetShortVideo = 0 
const $shortVideoPlayer = document.querySelector('#shortVideoPlayer')
const $buttonNextShortVideo = document.querySelector('#buttonNextShortVideo')
const $buttonPreviousShortVideo = document.querySelector('#buttonPreviousShortVideo')
const $buttonLikeShortVideo = document.querySelector('#buttonLikeShortVideo')
const $likesNumber = document.querySelector('#likesNumber')
const $dialogActivateForVotingError = document.querySelector('#dialogActivateForVotingError') 
const $dialogNotEnoughBalanceError = document.querySelector('#dialogNotEnoughBalanceError')
const $dialogActivateForVotingCheckWallet = document.querySelector('#dialogActivateForVotingCheckWallet')
const $dialogActivateForVotingTransactionSent = document.querySelector('#dialogActivateForVotingTransactionSent')
const $dialogLikeContentTransactionSent = document.querySelector('#dialogLikeContentTransactionSent')
let currentUtonomaIdentifier

$buttonNextShortVideo.addEventListener('click', async() => {
  await next()
})

async function next() {
  $buttonNextShortVideo.disabled = true
  $buttonPreviousShortVideo.disabled = true
  $buttonLikeShortVideo.disabled = true

  const nextShortVideoResp = await nextShortVideo(getShortVideo)
  const { authorAddress, contentId, metadata, likes, utonomaIdentifier } = nextShortVideoResp
  try {
    $shortVideoPlayer.src = getUrlFromIpfsHash(contentId)
    $shortVideoPlayer.load()
  } catch(error) {
    console.log("Error when loading the short video", error)
  }
  var playPromise = $shortVideoPlayer.play()
  if (playPromise !== undefined) {
    playPromise.then(() => {
      numberOfRetriesToGetShortVideo = 0
      informCorrectPlay(nextShortVideoResp)
      currentUtonomaIdentifier = utonomaIdentifier
      $buttonLikeShortVideo.disabled = false
      $likesNumber.innerHTML = likes
    }).catch((error) => {
      console.log(`Error when playing the short video. The message is: ${error}. Retry number ${numberOfRetriesToGetShortVideo}`)
      numberOfRetriesToGetShortVideo++
      if(numberOfRetriesToGetShortVideo < 5) {
        next(getShortVideo)
      }
      else {
        console.log('Next short video method was not able to find valid content after all retries')
      }
    })
  }

  $buttonNextShortVideo.disabled = false
  $buttonPreviousShortVideo.disabled = false
}
next()

document.querySelector('#buttonPreviousShortVideo').addEventListener('click', async() => {
  $buttonNextShortVideo.disabled = true
  $buttonPreviousShortVideo.disabled = true
  $buttonLikeShortVideo.disabled = true
  
  try {
    const { authorAddress, contentId, metadata, likes, utonomaIdentifier } = getPreviousShortVideo()
    $shortVideoPlayer.src = getUrlFromIpfsHash(contentId)
    $shortVideoPlayer.load()
    $shortVideoPlayer.play()
    $likesNumber.innerHTML = likes
    currentUtonomaIdentifier = utonomaIdentifier
  } catch(error) {
    console.log("Error when loading the previous short video", error)
  } finally {
    $buttonNextShortVideo.disabled = false
    $buttonPreviousShortVideo.disabled = false
    $buttonLikeShortVideo.disabled = false
  }
})

$buttonLikeShortVideo.addEventListener('click', async() => {
  $buttonNextShortVideo.disabled = true
  $buttonPreviousShortVideo.disabled = true
  $buttonLikeShortVideo.disabled = true

  console.log('like button pressed for the content with id: ', currentUtonomaIdentifier)
  const { readOnlyProvider } = await import('../../web3_providers/readOnlyProvider.js')
  const { formatUnits } = await import('ethers')
  const { useUtonomaContractForSignedTransactions, useSignedProvider } = await import('../../web3_providers/signedProvider.js')

  try {
    //get the current fee
    let usersInTheLastPeriod = await readOnlyProvider.utonomaContract.currentPeriodMAU()
    console.log("current number of users is: ", usersInTheLastPeriod)
    if(usersInTheLastPeriod == 0) usersInTheLastPeriod = 1
    const currentFee = await readOnlyProvider.utonomaContract.calculateFee(usersInTheLastPeriod)
    //console.log('current Fee is: ', formatUnits(currentFee, 18))
    console.log('current Fee is: ', currentFee)

    //get the allowance of the wallet to the smartcontract
    const { utonomaContractForSignedTransactions } = await useUtonomaContractForSignedTransactions()
    const { utonomaSepoliaAddress } = await import('../../utonomaSmartContract.js') 
    const { modal } = await useSignedProvider()

    //check that the allowance is higher than the fee
    const accountAllowance = await utonomaContractForSignedTransactions.allowance(modal.getAddress() , utonomaSepoliaAddress)
    console.log('allowance from the user to the smartcontract is: ', accountAllowance)
    if(accountAllowance <= currentFee) throw new Error('Account is not activated')

    //check the balance of utonoma tokens if balance is less than currentFee, then throw
    const accountBalance = await utonomaContractForSignedTransactions.balanceOf(modal.getAddress())
    console.log('balance of the account is: ', accountBalance)
    if(accountBalance <= currentFee) throw new Error('Balance is not enought')
    
    //Inform the user what is the fee and ask if accepts

    //Send the transaction to blockchain
    $dialogActivateForVotingCheckWallet.show()
    setTimeout(() => $dialogActivateForVotingCheckWallet.close(), 5000)
    const approveResult = await utonomaContractForSignedTransactions.like([currentUtonomaIdentifier.index, currentUtonomaIdentifier.contentType])
    $dialogLikeContentTransactionSent.show()
    setTimeout(() => $dialogLikeContentTransactionSent.close(), 5000)
    /*
    const transactionResp = await approveResult.wait()
    //Alert the success
    console.log(transactionResp)
    */

  } catch(error) {
    console.log('Error in like short video: ', error)

    //probably is a good idea to do an automated test that checks the real endpoint and see if error.error.message still containing the
    //expected info
    if(error.error?.message == 'Please call connect() before request()' || error == 'Error: User disconnected') {
      console.log('User is not connected')
      //send the user to the connect wallet screen
      const { setIsLoggedIn, setAddress } = await import('../../services/userManager/userManager.js')
      setIsLoggedIn(false)
      setAddress('')
      location.hash = 'rightPanelContainer'
      setTimeout(() => location.hash = '', 100)
    }
    if(error == 'Error: Account is not activated') {
      $dialogActivateForVotingError.show()
      setTimeout(() => $dialogActivateForVotingError.close(), 5000)
      console.log('Account not activated, activate your account in the settings section')
    }

    if(error == 'Error: Balance is not enought') {
      console.log('inform the user that it should buy some Utonoma tokens')
      $dialogNotEnoughBalanceError.show()
      setTimeout(() => $dialogNotEnoughBalanceError.close(), 5000)
    }
  } finally {
    $buttonNextShortVideo.disabled = false
    $buttonPreviousShortVideo.disabled = false
    $buttonLikeShortVideo.disabled = false
  }

})