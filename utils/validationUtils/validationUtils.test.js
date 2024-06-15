import { validateVideoDuration } from "./validationUtils.js"

test('validateVideoDuration when receiving a File object in the file parameter should throw an error', async() => {
  const errorMessage = 'invalid file object provided'

  document.body.innerHTML = '<video id="videoTag"> </video>'
  const $videoTag = document.querySelector('#videoTag') 

  await expect(
    validateVideoDuration($videoTag, 'not a File object', 60)
  ).rejects
  .toThrow(errorMessage)
})