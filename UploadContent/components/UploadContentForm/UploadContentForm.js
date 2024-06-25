import { ShortVideoMetadata } from '../../../services/models.js'
import { convertIPFSHashToBytes32 } from '../../../utils/encodingUtils/encodingUtils.js'
import { useUtonomaContractForSignedTransactions } from '../../../web3_providers/signedProvider.js';
import { validateVideoDuration } from '../../../utils/validationUtils/validationUtils.js'
import { pinJsonToIpfs, pinFileToIPFS } from '../../../services/ipfsService/ipfsService.js';

const $formUploadContent = document.forms['formUploadContent'];
const [$inputShortVideo, $textAreaShortVideoTitle, $textAreaVideoDescription] = $formUploadContent.elements
const $videoPreview = document.querySelector('#videoPreview')
const $dialogWrongVideoFileError = document.querySelector('#dialogWrongVideoFileError')
const $dialogVideoTooLongError = document.querySelector('#dialogVideoTooLongError')
const $dialogUploadingDataToIpfsError = document.querySelector('#dialogUploadingDataToIpfsError')
const $dialogCheckWalletToApprove = document.querySelector('#dialogCheckWalletToApprove')
const $dialogUploadContentTransactionSent = document.querySelector('#dialogUploadContentTransactionSent')
const $dialogUploadContentError = document.querySelector('#dialogUploadContentError')

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
  
  //upload metadata to ipfs
  const metadata = new ShortVideoMetadata()
  metadata.shortVideoTitle = $textAreaShortVideoTitle.value,
  metadata.shortVideoDescription = $textAreaVideoDescription.value
  
  let metadataHash
  let shortVideoHash
  try {
    metadataHash = await pinJsonToIpfs(metadata)
    shortVideoHash = await pinFileToIPFS(shortVideoFile)
  } catch (error) {
    $dialogUploadingDataToIpfsError.show()
    setTimeout(() => $dialogUploadingDataToIpfsError.close(), 5000)
    return
  }

  let uploadResponse
  try {
    $dialogCheckWalletToApprove.show()
    setTimeout(() => $dialogCheckWalletToApprove.close(), 5000)
    const { utonomaContractForSignedTransactions } = await useUtonomaContractForSignedTransactions()
    uploadResponse = await utonomaContractForSignedTransactions.upload(
      convertIPFSHashToBytes32(shortVideoHash.IpfsHash), 
      convertIPFSHashToBytes32(metadataHash.IpfsHash), 
      5
    )
    $dialogUploadContentTransactionSent.show()
    setTimeout(() => { 
      $dialogUploadContentTransactionSent.close() 
      window.location.replace('/')
    }, 5000)
  } catch (error) {
    console.log(error)
    $dialogUploadContentError.show()
    setTimeout(() => { 
      $dialogUploadContentError.close() 
      window.location.replace('/#rightPanelContainer')
    }, 8000)
    return 
  }

  try {
    const transactionResp = await uploadResponse.wait()
    console.log(transactionResp)
  } catch (error) {
    console.log(error)
  }

})
