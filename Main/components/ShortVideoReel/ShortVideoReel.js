import { getShortVideo } from '../../../services/contentProvider.js'
import { getUrlFromIpfsHash } from '../../../utils/encodingUtils/encodingUtils.js'
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
    $buttonLikeShortVideo.disabled = true
  } catch(error) {
    console.log("Error when loading the previous short video", error)
  }

  $buttonNextShortVideo.disabled = false
  $buttonPreviousShortVideo.disabled = false
})

$buttonLikeShortVideo.addEventListener('click', () => {
  console.log('like button pressed for the content with id: ', currentUtonomaIdentifier)
})