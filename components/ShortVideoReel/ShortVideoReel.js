import { getShortVideo } from "../../services/contentProvider.js"
import { getUrlFromIpfsHash } from "../../utils/encodingUtils.js"

let shortVideoHistory = []
let currentVideo = -1;
let detachedHead = false

let numberOfRetriesToGetShortVideo = 0 
const $shortVideoPlayer = document.querySelector('#shortVideoPlayer')
const $buttonNextShortVideo = document.querySelector('#buttonNextShortVideo')
const $buttonPreviousShortVideo = document.querySelector('#buttonPreviousShortVideo')


$buttonNextShortVideo.addEventListener('click', async() => {
  $buttonNextShortVideo.disabled = true
  $buttonPreviousShortVideo.disabled = true
  await nextShortVideo()
  $buttonNextShortVideo.disabled = false
  $buttonPreviousShortVideo.disabled = false
})

document.querySelector('#buttonPreviousShortVideo').addEventListener('click', async() => {
  $buttonNextShortVideo.disabled = true
  $buttonPreviousShortVideo.disabled = true
  await prevShortVideo()
  $buttonNextShortVideo.disabled = false
  $buttonPreviousShortVideo.disabled = false
})

async function nextShortVideo() {
  let getShortVideoResp
  if(detachedHead) {
    updateCurrentShortVideo(currentVideo + 1)
    getShortVideoResp = shortVideoHistory[currentVideo]
  }
  else {
    //Add a case for when there are no videos in the network
    getShortVideoResp = await getShortVideo()
    /*Later you can catch exceptions from getShortVideo with this code 
    if (Object.keys(myEmptyObj).length === 0) {
      getShortVideoResp
    }*/
  }
  const { authorAddress, contentId, metadata, likes } = getShortVideoResp
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
      if(currentVideo >= shortVideoHistory.length - 1) {
        //If we are comming out of a detached head state, we are not going to add the video to the history
        //because we already have it
        if(detachedHead === false) addShortVideoToHistory(getShortVideoResp)
        updateDetachedHead(false)
      }
    }).catch((error) => {
      console.log(`Error when playing the short video. The message is: ${error}. Retry number ${numberOfRetriesToGetShortVideo}`)
      numberOfRetriesToGetShortVideo++
      if(numberOfRetriesToGetShortVideo < 5) {
        nextShortVideo()
      }
      else {
        console.log('Next short video method was not able to find valid content after all retries')
      }
    })
  }
}

//Gets a short video as soon as loading
nextShortVideo()

async function prevShortVideo() {
  try {
    const { authorAddress, contentId, metadata, likes } = getPreviousShortVideo()
    $shortVideoPlayer.src = getUrlFromIpfsHash(contentId)
    $shortVideoPlayer.load()
    $shortVideoPlayer.play()
  } catch(error) {
    console.log("Error when loading the previous short video", error)
  }
}

function addShortVideoToHistory(shortVideoInfo) {
  shortVideoHistory.push(shortVideoInfo)
  updateCurrentShortVideo(shortVideoHistory.length - 1)
}

function updateCurrentShortVideo(index) {
  currentVideo = index
}

function updateDetachedHead(boolean) {
  if (typeof variable == "boolean") throw 'updateDetachedHead only accepts booleans'
  detachedHead = boolean
}

function getPreviousShortVideo() {
  if(currentVideo <= 0 ) throw 'this is the first video, you can not go backwards'
  updateCurrentShortVideo(currentVideo - 1)
  updateDetachedHead(true)
  return shortVideoHistory[currentVideo]
}