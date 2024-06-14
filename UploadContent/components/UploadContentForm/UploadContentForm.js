import { ShortVideoMetadata } from '../../../services/models.js'
import { convertIPFSHashToBytes32 } from '../../../utils/encodingUtils/encodingUtils.js'
import { useUtonomaContractForSignedTransactions } from '../../../web3_providers/signedProvider.js';

const $formUploadContent = document.forms['formUploadContent'];
const [$inputShortVideo, $textAreaShortVideoTitle, $textAreaVideoDescription] = $formUploadContent.elements
const $videoPreview = document.querySelector('#videoPreview')
const $dialogWrongVideoFileError = document.querySelector('#dialogWrongVideoFileError')
const $dialogVideoTooLongError = document.querySelector('#dialogVideoTooLongError')
const $dialogUploadingDataToIpfsError = document.querySelector('#dialogUploadingDataToIpfsError')

$formUploadContent.addEventListener('submit', async(event) => {
  event.preventDefault()
  const shortVideoFile = $inputShortVideo.files[0]

  //validate that the video is no longer than 60 seconds
  try{
    const shortVideoDuration = await validateVideoDuration($videoPreview, shortVideoFile, 60)
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

  //validate that the user's wallet is connected
  
  //upload metadata to ipfs
  const metadata = new ShortVideoMetadata()
  metadata.shortVideoTitle = $textAreaShortVideoTitle.value,
  metadata.shortVideoDescription = $textAreaVideoDescription.value
  
  let metadataHash
  try {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzYmJlNTYxOS1hM2VmLTRjNzgtYWZjMi04N2E2ZjAzYTg4NTEiLCJlbWFpbCI6ImFkcmlhbi5zZXF1ZWlyYUBvdXRsb29rLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMmJjYjVmYTA5YzVhMjY4ODViYSIsInNjb3BlZEtleVNlY3JldCI6ImIyM2ZlYTM0NGJiMTY1Zjg2M2M1ZGQ2NjA4NDExYjFkZTk5OWEwY2Y1MmMwODg0MmRiMzJjNzMyZDljMTg2YmEiLCJpYXQiOjE3MDg2NTMxMjh9.2l4FvQow4eqchALGkxMcdhVTvSjFOxWMtU_ZIVfj2fg', 
        'Content-Type': 'application/json'
      },
      body: `{"pinataContent":${JSON.stringify(metadata)},"pinataMetadata":{"name":"metadata.json"},"pinataOptions":{"cidVersion":0}}`
    })
    const jsonResp = await res.json()
    if(jsonResp.error) throw new Error('Error in the request to upload metadata to IPFS network')
    metadataHash = jsonResp
    console.log(jsonResp)
  } catch (error) {
    $dialogUploadingDataToIpfsError.show()
    setTimeout(() => $dialogUploadingDataToIpfsError.close(), 5000)
  }

  //upload the short video to ipfs
  let shortVideoHash

  const form = new FormData();
  form.append("file", shortVideoFile);
  form.append("pinataOptions", "{\n  \"cidVersion\": 0\n}");

  try {
    const fileUploadResp =  await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzYmJlNTYxOS1hM2VmLTRjNzgtYWZjMi04N2E2ZjAzYTg4NTEiLCJlbWFpbCI6ImFkcmlhbi5zZXF1ZWlyYUBvdXRsb29rLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMmJjYjVmYTA5YzVhMjY4ODViYSIsInNjb3BlZEtleVNlY3JldCI6ImIyM2ZlYTM0NGJiMTY1Zjg2M2M1ZGQ2NjA4NDExYjFkZTk5OWEwY2Y1MmMwODg0MmRiMzJjNzMyZDljMTg2YmEiLCJpYXQiOjE3MDg2NTMxMjh9.2l4FvQow4eqchALGkxMcdhVTvSjFOxWMtU_ZIVfj2fg', 
      },
      body: form
    })
    shortVideoHash = await fileUploadResp.json()
    if(shortVideoHash.error) throw new Error('Error in the request to upload a short video to IPFS network')
    console.log("short video uploaded: ", shortVideoHash)
  } catch (err) {
    $dialogUploadingDataToIpfsError.show()
    setTimeout(() => $dialogUploadingDataToIpfsError.close(), 5000)
  }

  console.log('ipfs metadata to bytes32: ', convertIPFSHashToBytes32(metadataHash.IpfsHash))
  console.log('ipfs video to bytes32: ', convertIPFSHashToBytes32(shortVideoHash.IpfsHash))

  console.log('Sending transaction to the blockchain, please use your wallet to sign')
  let uploadResponse
  try {
    const { utonomaContractForSignedTransactions } = await useUtonomaContractForSignedTransactions()
    uploadResponse = await utonomaContractForSignedTransactions.upload(
      convertIPFSHashToBytes32(shortVideoHash.IpfsHash), 
      convertIPFSHashToBytes32(metadataHash.IpfsHash), 
      5
    )
  } catch (error) {
    console.log(error)
    return 
  }


  try {
    const transactionResp = await uploadResponse.wait()
    console.log(transactionResp)
  } catch (error) {
    console.log(error)
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
