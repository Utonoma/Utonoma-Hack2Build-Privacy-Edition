import '../utonoma_styles_library/index.css'
import { useReadOnlyProvider } from "../web3_providers/readOnlyProvider.js"
import { getUserAddress } from "../services/userManager/userManager.js"
import { getIpfsHashFromBytes32 } from "../utils/encodingUtils/encodingUtils.js"

const { utonomaContract } = useReadOnlyProvider()

const $contentInfoCardTemplate = document.querySelector('#contentInfoCardTemplate')
const $cardsContainer = document.querySelector('#cardsContainer')
const $tempFragment = document.createDocumentFragment()
const $dialogFetchingMyContentError = document.querySelector('#dialogFetchingMyContentError')

async function getContent() {
  let events
  try{
    events = await utonomaContract.queryFilter(utonomaContract.filters.uploaded(getUserAddress()))
  }
  catch(error) {
    $dialogFetchingMyContentError.showModal()
    setTimeout(() => { 
      $dialogFetchingMyContentError.close() 
      window.location.replace('/#rightPanelContainer')
    }, 8000)
    console.log('error when querying the events list of the account, check if user is logged in')
    return
  }
  if(!events?.length || events.length <= 0) {
    $cardsContainer.appendChild(
      document.querySelector('#noUploadedContentTemplate').content.cloneNode(true)
    )
    console.log('There are no uploaded events triggered by this user')
    return
  }

  try{
    const contents = await Promise.all(
      events.map(async (element, index) => {
        const { 
          0: uploaderAddress, 
          1: identifierIndex, 
          2: identifierContentType 
        } = element.args

        const { 
          0: authorAddress, 
          1: contentIdInBytes32, 
          2: metadataHashInBytes32, 
          3: likes,
          4: dislikes
        } = await utonomaContract.getContentById([identifierIndex, identifierContentType])
  
        const metadata = await fetch(
          `https://copper-urban-gorilla-864.mypinata.cloud/ipfs/${getIpfsHashFromBytes32(metadataHashInBytes32)}?pinataGatewayToken=WmR3tEcyNtxE6vjc4lPPIrY0Hzp3Dc9AYf2X4Bl-8o6JYBzTx9aY_u3OlpL1wGra`
        )
        const readableMetadata = await metadata.json()

        return {
          shortVideoTitle : readableMetadata.shortVideoTitle,
          likes,
          dislikes
        }
      })
    )

    contents.forEach(e => {
      const $card = $contentInfoCardTemplate.content.cloneNode(true)
      $card.querySelector('#contentInfoCardTitle').innerText = e.shortVideoTitle
      $card.querySelector('#contentInfoCardLikes').innerText = e.likes
      $card.querySelector('#contentInfoCardDislikes').innerText = e.dislikes
      $tempFragment.appendChild($card)
    })

    $cardsContainer.appendChild($tempFragment)
  }
  catch(error) {
    $dialogFetchingMyContentError.showModal()
    setTimeout(() => { 
      $dialogFetchingMyContentError.close() 
      window.location.replace('/#rightPanelContainer')
    }, 8000)
    console.log('error when creating the content onformation cards')
    console.log(error)
  }
}

getContent()