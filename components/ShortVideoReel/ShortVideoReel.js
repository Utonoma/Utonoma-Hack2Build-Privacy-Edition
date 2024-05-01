import { getShortVideo } from "../../services/contentProvider.js"
import { getIpfsHashFromBytes32, getUrlFromIpfsHash } from "../../utils/encodingUtils.js"

let numberOfRetriesToGetShortVideo = 0 
const $shortVideoPlayer = document.querySelector('#shortVideoPlayer')
const $buttonNextShortVideo = document.querySelector('#buttonNextShortVideo')


$buttonNextShortVideo.addEventListener('click', async() => {
  $buttonNextShortVideo.disabled = true
  await nextShortVideo()
  $buttonNextShortVideo.disabled = false
})

document.querySelector('#buttonPreviousShortVideo').addEventListener('click', () => {
  console.log('Previous short video, please!!')
})

async function nextShortVideo() {
  try {
    //Add a case for when there are no videos in the network
    const { authorAddress, contentId, metadata, likes } = await getShortVideo()
    $shortVideoPlayer.src = getUrlFromIpfsHash(getIpfsHashFromBytes32(contentId))
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