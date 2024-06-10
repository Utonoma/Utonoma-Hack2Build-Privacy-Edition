import { getShortVideo } from '../../../services/contentProvider.js'
import { getUrlFromIpfsHash } from '../../../utils/encodingUtils.js'
import {
  nextShortVideo,
  getPreviousShortVideo,
  informCorrectPlay,
} from './ShortVideoReel.manager.js'

let numberOfRetriesToGetShortVideo = 0 
const $shortVideoPlayer = document.querySelector('#shortVideoPlayer')
const $buttonNextShortVideo = document.querySelector('#buttonNextShortVideo')
const $buttonPreviousShortVideo = document.querySelector('#buttonPreviousShortVideo')


$buttonNextShortVideo.addEventListener('click', async() => {
  await next()
})

async function next() {
  $buttonNextShortVideo.disabled = true
  $buttonPreviousShortVideo.disabled = true

  const nextShortVideoResp = await nextShortVideo(getShortVideo)
  const { authorAddress, contentId, metadata, likes } = nextShortVideoResp
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
  
  try {
    const { authorAddress, contentId, metadata, likes } = getPreviousShortVideo()
    $shortVideoPlayer.src = getUrlFromIpfsHash(contentId)
    $shortVideoPlayer.load()
    $shortVideoPlayer.play()
  } catch(error) {
    console.log("Error when loading the previous short video", error)
  }

  $buttonNextShortVideo.disabled = false
  $buttonPreviousShortVideo.disabled = false
})