import { useReadOnlyProvider } from "../web3_providers/readOnlyProvider"
import { formatUnits } from 'ethers'

export async function getShortVideo() {
  const { provider, utonomaContract } = useReadOnlyProvider()
  const shortVideosLibraryLength = formatUnits(await utonomaContract.getContentLibraryLength(5), 0)
  const identifier = Math.floor(Math.random() * (shortVideosLibraryLength - 1))
  const { 0: authorAddress, 1: contentId, 2: metadata, 3: likes }  = await utonomaContract.getContentById([identifier,5])

  return {
    authorAddress,
    contentId,
    metadata,
    likes
  }
}
