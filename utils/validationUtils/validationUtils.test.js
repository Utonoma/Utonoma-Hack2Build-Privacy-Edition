import { 
  validateVideoDuration, 
  shouldContentBeEliminated,
  canContentBeHarvested 
} from "./validationUtils.js"

test('validateVideoDuration when receiving a File object in the file parameter should throw an error', async() => {
  const errorMessage = 'invalid file object provided'

  document.body.innerHTML = '<video id="videoTag"> </video>'
  const $videoTag = document.querySelector('#videoTag') 

  await expect(
    validateVideoDuration($videoTag, 'not a File object', 60)
  ).rejects
  .toThrow(errorMessage)
})

//shouldContentBeEliminated
const shouldContentBeEliminatedPositiveCases = [
  [24, 76],
  [1, 8],
  [0, 6],
  [13, 47],
  [43310, 98100],
  [4950000000, 10050000000],
  [25, 75],
  [80,107]
]
test.each(shouldContentBeEliminatedPositiveCases)(
  "shouldContentBeEliminated method, when receiving %p likes and %p dislikes, should return true",
  (likes, dislikes) => {
    const result = shouldContentBeEliminated(likes, dislikes)
    expect(result).toBe(true)
  }
)

const shouldContentBeEliminatedNegativeCases = [
  [6, 1],
  [15, 1],
  [10, 8],
  [20, 5],
  [420, 280],
  [8, 0],
  [44, 56],
  [9759000000, 5241000000],
  [80, 106],
  ['a string', 'another string'],
  [0,0],
  [-1,0],
  [-5,-45]
]
test.each(shouldContentBeEliminatedNegativeCases)(
  "shouldContentBeEliminated method, when receiving %p likes and %p dislikes, should return false",
  (likes, dislikes) => {
    const result = shouldContentBeEliminated(likes, dislikes)
    expect(result).toBe(false)
  }
)

