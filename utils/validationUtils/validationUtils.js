/**
 * Validate if a video duration is longer than a certain amount of time
 * @param {object} $videoDomElement - A video tag in the dom where the video can be loaded (this 
 * element will be hidden from user)
 * @param {object} file - A File javascript object containing the video
 * @param {Number} maxDuration - The maximum time of seconds for the video to be considered valid
 * @returns {Promise} True if the video lasts less than the max duration time, false if it's longer
 * @throws {Error} If the html element provided in $videoDomElement is not a video tag or have no source. Also,
 * in case that the File is not a video
 */
export async function validateVideoDuration($videoDomElement, file, maxDuration) {
  return new Promise((resolve) => {
    var reader = new FileReader();

    reader.onload = function(e) {
      if(!$videoDomElement.src) throw new Error('Invalid video tag')
      $videoDomElement.src = e.target.result
      $videoDomElement.load()
      $videoDomElement.onloadedmetadata = function() {
        if(this.duration <= maxDuration) resolve(true) 
        else resolve(false)
      }
    }
    try{
      reader.readAsDataURL(file);
    }
    catch(error) {
      throw new Error('invalid file object provided')
    }
  }) 
}