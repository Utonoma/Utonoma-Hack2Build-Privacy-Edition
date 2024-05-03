import { getShortVideo } from "../../services/contentProvider.js"
import { getUrlFromIpfsHash } from "../../utils/encodingUtils.js"

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

document.querySelector('#buttonPreviousShortVideo').addEventListener('click', () => {
  console.log('Previous short video, please!!')
})

async function nextShortVideo() {
  //Add a case for when there are no videos in the network
  const getShortVideoResp = await getShortVideo()
  /*Later you can catch exceptions from getShortVideo with this code 
  if (Object.keys(myEmptyObj).length === 0) {
    getShortVideoResp
  }*/
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
    }).catch((error) => {
      console.log(`Error when playing the short video. The message is: ${error}. Retry number ${numberOfRetriesToGetShortVideo}`)
      if(numberOfRetriesToGetShortVideo < 5) {
        nextShortVideo()
      }
      else {
        console.log('Next short video method was not able to find valid content after all retries')
      }
      numberOfRetriesToGetShortVideo++
    })
  }
}

//Gets a short video as soon as loading
nextShortVideo()