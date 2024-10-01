let shortVideoHistory = []
let currentVideo = -1;
let detachedHead = false

export function getShortVideoHistory() { return shortVideoHistory }
export function getCurrentVideo() { return currentVideo }
export function getDetachedHead() { return detachedHead }

export async function nextShortVideo(apiCall) {
  if(detachedHead) {
    updateCurrentShortVideo(currentVideo + 1)
    return shortVideoHistory[currentVideo]
  }
  else {
    //Add a case for when there are no videos in the network
    return await apiCall()
    /*Later you can catch exceptions from getShortVideo with this code 
    if (Object.keys(myEmptyObj).length === 0) {
      getShortVideoResp
    }*/
    }
}

export function getPreviousShortVideo() {
  if(currentVideo <= 0 ) throw 'this is the first video, you can not go backwards'
  updateCurrentShortVideo(currentVideo - 1)
  updateDetachedHead(true)
  return shortVideoHistory[currentVideo]
}

export function informCorrectPlay(shortVideo) {
  if(currentVideo >= shortVideoHistory.length - 1) {
    //If we are comming out of a detached head state, we are not going to add the video to the history
    //because we already have its
    if(detachedHead === false) addShortVideoToHistory(shortVideo)
    updateDetachedHead(false)
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