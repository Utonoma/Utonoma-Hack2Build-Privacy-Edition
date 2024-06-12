import { shortVideoMetadata } from "../../../services/objectTemplates.js";

const $formUploadContent = document.forms['formUploadContent'];
const [$inputShortVideo, $textAreaShortVideoTitle, $textAreaVideoDescription] = $formUploadContent.elements
const $videoPreview = document.querySelector('#videoPreview')
const $dialogWrongVideoFileError = document.querySelector('#dialogWrongVideoFileError')
const $dialogVideoTooLongError = document.querySelector('#dialogVideoTooLongError')

$formUploadContent.addEventListener('submit', async(event) => {
  event.preventDefault()
  //validate that the video is no longer than 60 seconds
  try{
    const shortVideoDuration = await validateVideoDuration($videoPreview, $inputShortVideo.files[0], 60)
    if(!shortVideoDuration) {
      $dialogVideoTooLongError.show()
      setTimeout(() => $dialogVideoTooLongError.close(), 5000)
      return
    }
  } catch(error) {
    console.log(error)
    $dialogWrongVideoFileError.show()
    setTimeout(() => $dialogWrongVideoFileError.close(), 5000)
    return
  }
  

});

async function validateVideoDuration($videoDomElement, file, maxDuration) {
  return new Promise((resolve) => {
    var reader = new FileReader();

    reader.onload = function(e) {
      if(!$videoDomElement.src) throw new Error('Invalid video tag')
      $videoDomElement.src = e.target.result
      $videoDomElement.load()
      $videoDomElement.onloadedmetadata = function() {
        console.log(this.duration)
        if(this.duration <= maxDuration) resolve(true) 
        else resolve(false)
      };
    }.bind(this)
    try{
      reader.readAsDataURL(file);
    }
    catch(error) {
      throw new Error('invalid file object provided')
    }
  }) 
}
