import { getShortVideo } from '../../services/contentProvider.js'
import { getUrlFromIpfsHash } from '../../utils/encodingUtils/encodingUtils.js'
import {
  createStateForShortVideoReel
} from './ShortVideoReel.state.js'

export const ShortVideoReel = ($container) => {
  const state = createStateForShortVideoReel()

  const $shortVideoPlayer = $container.querySelector('#shortVideoPlayer')
  const $buttonNextShortVideo = $container.querySelector('#buttonNextShortVideo')
  const $buttonPreviousShortVideo = $container.querySelector('#buttonPreviousShortVideo')
  const $buttonLikeShortVideo = $container.querySelector('#buttonLikeShortVideo')
  const $likesNumber = $container.querySelector('#likesNumber')
  const $dialogActivateForVotingError = $container.querySelector('#dialogActivateForVotingError') 
  const $dialogNotEnoughBalanceError = $container.querySelector('#dialogNotEnoughBalanceError')
  const $dialogActivateForVotingCheckWallet = $container.querySelector('#dialogActivateForVotingCheckWallet')
  const $dialogActivateForVotingTransactionSent = $container.querySelector('#dialogActivateForVotingTransactionSent')
  const $dialogLikeContentTransactionSent = $container.querySelector('#dialogLikeContentTransactionSent')

  let currentUtonomaIdentifier
  let numberOfRetriesToGetShortVideo = 0 

  async function effects() {
    switch (state.currentStep()) {
      case state.availiableSteps.nextShortVideo:
        loading(true)
        //if user is watching a previuos video then get the next one from the history, otherwise get a new one from the internet
        try {
          if(state.detachedHead()) var nextShortVideo = state.shortVideoHistory()[state.currentVideo()]
          else nextShortVideo = await getShortVideo()
          const { authorAddress, contentId, metadata, likes, utonomaIdentifier } = nextShortVideo
          $shortVideoPlayer.src = getUrlFromIpfsHash(contentId)
          $shortVideoPlayer.load()
          const playPromise = $shortVideoPlayer.play()
          if (!playPromise) throw new Error('playPromise returned undefined')
          playPromise.then(() => {
            numberOfRetriesToGetShortVideo = 0
            state.setStep(state.availiableSteps.informCorrectPlay, undefined, nextShortVideo)
            currentUtonomaIdentifier = utonomaIdentifier
            $likesNumber.innerHTML = likes
            loading(false)
          }).catch((error) => {
            console.log(`Error when playing the short video. The message is: ${error}. Retry number ${numberOfRetriesToGetShortVideo}`)
            numberOfRetriesToGetShortVideo++
            if(numberOfRetriesToGetShortVideo < 10) {
              console.log('Error when playing the short video, retrying')
              state.setStep(state.availiableSteps.nextShortVideo, effects) //On error, transition to this same step to retry 
              return
            }
            else {
              loading(false)
              console.log('Next short video method was not able to find valid content after all retries')
            }
          })
        } catch(error) {
          console.log("Error when loading the short video", error)
          state.setStep(state.availiableSteps.nextShortVideo, effects) //On error, transition to this same step to retry 
          return
        }
        break
      case state.availiableSteps.previousShortVideo:
        loading(true)
        try {
          const { authorAddress, contentId, metadata, likes, utonomaIdentifier } = state.shortVideoHistory()[state.currentVideo()]
          $shortVideoPlayer.src = getUrlFromIpfsHash(contentId)
          $shortVideoPlayer.load()
          $shortVideoPlayer.play()
          $likesNumber.innerHTML = likes
          currentUtonomaIdentifier = utonomaIdentifier
        } catch(error) {
          console.log("Error when loading the previous short video", error)
          state.setStep(state.availiableSteps.nextShortVideo, effects) //On error, transition to the next video step
        }
        loading(false)
        break 
    }
  }

  function loading(boolean) {
    $buttonNextShortVideo.disabled = boolean
    $buttonPreviousShortVideo.disabled = boolean
    $buttonLikeShortVideo.disabled = boolean
  }

  $buttonNextShortVideo.addEventListener('click', async() => {
    state.setStep(state.availiableSteps.nextShortVideo, effects)
  })

  $buttonPreviousShortVideo.addEventListener('click', async() => {
    state.setStep(state.availiableSteps.previousShortVideo, effects)
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

  state.setStep(state.availiableSteps.nextShortVideo, effects) //kickstart the component
}

