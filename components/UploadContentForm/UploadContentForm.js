import { ShortVideoMetadata } from '../../services/models.js'
import { convertIPFSHashToBytes32 } from '../../utils/encodingUtils/encodingUtils.js'
import { useUtonomaContractForSignedTransactions } from '../../web3_providers/signedProvider.js';
import { validateVideoDuration } from '../../utils/validationUtils/validationUtils.js'
import { pinJsonToIpfs, pinFileToIPFS } from '../../services/ipfsService/ipfsService.js';

export const UploadContentForm = ($container) => {
  const $formUploadContent = $container.forms['formUploadContent'];
  const [$inputShortVideo, $textAreaShortVideoTitle, $textAreaVideoDescription] = $formUploadContent.elements
  const $videoPreview = $container.querySelector('#videoPreview')
  const $dialogWrongVideoFileError = $container.querySelector('#dialogWrongVideoFileError')
  const $dialogVideoTooLongError = $container.querySelector('#dialogVideoTooLongError')
  const $dialogUploadingDataToIpfsError = $container.querySelector('#dialogUploadingDataToIpfsError')
  const $dialogCheckWalletToApprove = $container.querySelector('#dialogCheckWalletToApprove')
  const $dialogUploadContentTransactionSent = $container.querySelector('#dialogUploadContentTransactionSent')
  const $dialogUploadContentError = $container.querySelector('#dialogUploadContentError')
  const $buttonUploadContent = $container.querySelector('#buttonUploadContent')

  $formUploadContent.addEventListener('submit', async(event) => {
    event.preventDefault()
    $buttonUploadContent.disabled = true

    const shortVideoFile = $inputShortVideo.files[0]
  
    //validate that the video is no longer than 60 seconds
    try{
      const shortVideoDuration = await validateVideoDuration($videoPreview, shortVideoFile, 60)
      if(!shortVideoDuration) {
        $dialogVideoTooLongError.show()
        setTimeout(() => $dialogVideoTooLongError.close(), 5000)
        $buttonUploadContent.disabled = false
        return
      }
    } catch(error) {
      console.log(error)
      $dialogWrongVideoFileError.show()
      setTimeout(() => $dialogWrongVideoFileError.close(), 5000)
      $buttonUploadContent.disabled = false
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
      $buttonUploadContent.disabled = false
      return
    }
  
    let uploadResponse
    try {
      $dialogCheckWalletToApprove.show()
      setTimeout(() => $dialogCheckWalletToApprove.close(), 5000)
      //Enable the button again before asking the user to sign the transaction
      $buttonUploadContent.disabled = false
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
      $buttonUploadContent.disabled = false
      return 
    }
  
    try {
      const transactionResp = await uploadResponse.wait()
      console.log(transactionResp)
    } catch (error) {
      console.log(error)
    }
  
    $buttonUploadContent.disabled = false
  })

}