import { getShortVideo } from "../../services/contentProvider"
import { getIpfsHashFromBytes32, getUrlFromIpfsHash } from "../../utils/encodingUtils"

const $shortVideoPlayer = document.querySelector('#shortVideoPlayer')

document.querySelector('#buttonNextShortVideo').addEventListener('click', async () => {
  const { authorAddress, contentId, metadata, likes } = await getShortVideo()
  $shortVideoPlayer.src = getUrlFromIpfsHash(getIpfsHashFromBytes32(contentId))
  try {
    $shortVideoPlayer.load()
    $shortVideoPlayer.play()
  } catch(error) {
    console.log(error)
  }
})

document.querySelector('#buttonPreviousShortVideo').addEventListener('click', () => {
  console.log('Previous short video, please!!')
})