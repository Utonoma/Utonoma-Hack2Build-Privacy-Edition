import { useReadOnlyProvider } from "../web3_providers/readOnlyProvider.js"
import { formatUnits } from 'ethers'

export async function getShortVideo() {
  const { provider, utonomaContract } = useReadOnlyProvider()
  //throw exception if the content id is 0
  try {
    const shortVideosLibraryLength = formatUnits(await utonomaContract.getContentLibraryLength(5), 0)
    const identifier = Math.floor(Math.random() * shortVideosLibraryLength)
    const { 0: authorAddress, 1: contentId, 2: metadata, 3: likes } = await utonomaContract.getContentById([identifier,5])
    //if(contentId == '0x0') throw 'Content deleted'
    return {
      authorAddress,
      contentId,
      metadata,
      likes
    }
  } catch(error) {
    console.log("Error in getContentLibrary getContentById: ", error)
    return {}
  }
}
