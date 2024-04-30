import { getShortVideo } from "../../services/contentProvider.js"
import { getIpfsHashFromBytes32, getUrlFromIpfsHash } from "../../utils/encodingUtils.js"

const $shortVideoPlayer = document.querySelector('#shortVideoPlayer')
const $buttonNextShortVideo = document.querySelector('#buttonNextShortVideo')


$buttonNextShortVideo.addEventListener('click', async() => {
  $buttonNextShortVideo.disabled = true
  await nextShorVideo()
  $buttonNextShortVideo.disabled = false
})

document.querySelector('#buttonPreviousShortVideo').addEventListener('click', () => {
  console.log('Previous short video, please!!')
})

async function nextShorVideo() {
  const { authorAddress, contentId, metadata, likes } = await getShortVideo()
  $shortVideoPlayer.src = getUrlFromIpfsHash(getIpfsHashFromBytes32(contentId))
  try {
    $shortVideoPlayer.load()
    $shortVideoPlayer.play()
  } catch(error) {
    console.log(error)
  }
}

//Gets a short video as soon as loading
nextShorVideo()