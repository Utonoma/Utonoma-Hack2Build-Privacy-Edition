import { getShortVideo } from '../../services/contentProvider.js'
import { getUrlFromIpfsHash } from '../../utils/encodingUtils/encodingUtils.js'
import { shortVideoReelState as state } from './ShortVideoReel.state.js'
import { LikeButton as LikeButtonFactory } from '../LikeButton/LikeButton.js'
import { ShareButton } from '../ShareButton/ShareButton.js'

const $shortVideoPlayer = document.querySelector('#shortVideoPlayer')
const $buttonNextShortVideo = document.querySelector('#buttonNextShortVideo')
const $buttonPreviousShortVideo = document.querySelector('#buttonPreviousShortVideo')
const $likesNumber = document.querySelector('#likesNumber')

const LikeButton = LikeButtonFactory(document.querySelector('#likeButtonContainer'))
ShareButton()

let currentUtonomaIdentifier
let numberOfRetriesToGetShortVideo = 0 

async function effects() {
  switch (state.currentStep()) {
    case state.availiableSteps.nextShortVideo:
      loading(true)
      //if user is watching a previuos video then get the next one from the history, otherwise get a new one from the internet
      try {
        if(state.detachedHead()) var nextShortVideo = state.shortVideoHistory()[state.currentVideo()]
        else nextShortVideo = await getShortVideo(state.shortVideoHistory())
        const { authorAddress, contentId, metadata, likes, utonomaIdentifier } = nextShortVideo
        $shortVideoPlayer.src = getUrlFromIpfsHash(contentId)
        $shortVideoPlayer.load()
        const playPromise = $shortVideoPlayer.play()
        if (!playPromise) throw new Error('playPromise returned undefined')
        playPromise.then(() => {
          numberOfRetriesToGetShortVideo = 0
          currentUtonomaIdentifier = utonomaIdentifier
          LikeButton.updateUtonomaIdentifier(utonomaIdentifier)
          $likesNumber.innerHTML = likes
          loading(false)
          state.setStep(state.availiableSteps.informCorrectPlay, effects, nextShortVideo)
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
        LikeButton.updateUtonomaIdentifier(utonomaIdentifier)
        //Update the url to reflect the current video  
        const { index } = currentUtonomaIdentifier
        const newUrl = `${ window.location.pathname }?watch=${ index }`
        window.history.pushState({}, '', newUrl)
      } catch(error) {
        console.log("Error when loading the previous short video", error)
        state.setStep(state.availiableSteps.nextShortVideo, effects) //On error, transition to the next video step
      }
      loading(false)
      break
    case state.availiableSteps.informCorrectPlay:
      //Update the url to reflect the current video  
      const { index } = currentUtonomaIdentifier
      const newUrl = `${window.location.pathname}?watch=${index}`
      window.history.pushState({}, '', newUrl)
      break
  }
}

function loading(boolean) {
  $buttonNextShortVideo.disabled = boolean
  $buttonPreviousShortVideo.disabled = boolean
  LikeButton.loading(boolean)
}

$buttonNextShortVideo.addEventListener('click', async() => {
  state.setStep(state.availiableSteps.nextShortVideo, effects)
})

$buttonPreviousShortVideo.addEventListener('click', async() => {
  state.setStep(state.availiableSteps.previousShortVideo, effects)
})

state.setStep(state.availiableSteps.nextShortVideo, effects) //kickstart the component