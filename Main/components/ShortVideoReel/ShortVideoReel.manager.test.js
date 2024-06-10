import {
  getShortVideoHistory,
  getCurrentVideo,
  getDetachedHead,
  nextShortVideo,
  getPreviousShortVideo,
  informCorrectPlay,
} from './ShortVideoReel.manager'

const shortVideos = [
  {'cid' : '16546'},
  {'cid' : '23456'}
]

function* shortVideosMaker() {
  /*
  let index = 0
  while (index < shortVideos.length) yield shortVideos[index]
  */
  yield shortVideos[0]
  yield shortVideos[1]
}

const gen = shortVideosMaker()

function getShortVideoMockApi() {
  return gen.next().value
}

test('At the creation of the short video reel module, the state should be the initial', ()=> {
  expect(getShortVideoHistory()).toEqual([])
  expect(getCurrentVideo()).toEqual(-1)
  expect(getDetachedHead()).toEqual(false)
})

test('Given the initial state, if we try to get the previous short video we should get an exception', () => {
  const noPrevVideoErrorMessage = 'this is the first video, you can not go backwards'

  const errorMessage = () => {
    getPreviousShortVideo()
  }
  expect(errorMessage).toThrow(noPrevVideoErrorMessage)
})

test('Given the initial state, if we get the next short video we should receive the first video that the api returns', async() => {
  const resp = await nextShortVideo(getShortVideoMockApi)
  
  expect(resp).toEqual(shortVideos[0])
})

test('Once the first short video was played correctly, we should inform it. And we should transition to the following state:', () => {
  informCorrectPlay(shortVideos[0])

  expect(getShortVideoHistory().length).toEqual(1)
  expect(getCurrentVideo()).toEqual(0)
  expect(getDetachedHead()).toEqual(false)
})

test('Given the first state, if we try to get the previous short video we should get an exception', () => {
  const noPrevVideoErrorMessage = 'this is the first video, you can not go backwards'

  const errorMessage = () => {
    getPreviousShortVideo()
  }
  expect(errorMessage).toThrow(noPrevVideoErrorMessage)
})

test('Given the first state, if we get the next short video we should receive the second video that the api returns', async() => {
  const resp = await nextShortVideo(getShortVideoMockApi)
  expect(resp).toEqual(shortVideos[1])
})

test('Once the second short video was played correctly, we should inform it. And we should transition to the following state:', () => {
  informCorrectPlay(shortVideos[1])

  expect(getShortVideoHistory().length).toEqual(2)
  expect(getCurrentVideo()).toEqual(1)
  expect(getDetachedHead()).toEqual(false)
})

test('Given the second state, if we try to get the previous short video we should get first video and we should be in the first state but with a detached head', () => {
  const resp = getPreviousShortVideo()
  expect(resp).toEqual(shortVideos[0])
  expect(getCurrentVideo()).toEqual(0)
  expect(getDetachedHead()).toEqual(true)
})

test('Given the first state, if we get the next short video we should receive the second video that the api returns', async() => {
  const resp = await nextShortVideo(getShortVideoMockApi)
  expect(resp).toEqual(shortVideos[1])
})

test('Once the second short video was played correctly, we should inform it. And we should transition to the second state without adding the played video to the history:', () => {
  informCorrectPlay(shortVideos[1])

  expect(getShortVideoHistory().length).toEqual(2)
  expect(getCurrentVideo()).toEqual(1)
  expect(getDetachedHead()).toEqual(false)
})
