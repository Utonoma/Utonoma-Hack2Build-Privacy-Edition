import { useReadOnlyProvider } from "../web3_providers/readOnlyProvider"
const { provider, utonomaContract } = useReadOnlyProvider()

test('useReadOnlyProvider should return two not null objects: provider and utonomaContract', () => {
  expect(provider).toBeTruthy()
  expect(utonomaContract).toBeTruthy()
})

/*
List of some of the external methods from the Utonoma smart contract:
approve
createUser
deletion
dislike
harvestLikes
like
reply
updateUserMetadataHash
upload
voluntarilyDelete
getContentById
*/
test('In useReadOnlyProvider, the returned utonomaContract object should contain the most important methods from the smart contract', () => {
  expect(utonomaContract.approve).toBeTruthy()
  expect(utonomaContract.createUser).toBeTruthy()
  expect(utonomaContract.deletion).toBeTruthy()
  expect(utonomaContract.dislike).toBeTruthy()
  expect(utonomaContract.harvestLikes).toBeTruthy()
  expect(utonomaContract.like).toBeTruthy()
  expect(utonomaContract.reply).toBeTruthy()
  expect(utonomaContract.updateUserMetadataHash).toBeTruthy()
  expect(utonomaContract.upload).toBeTruthy()
  expect(utonomaContract.voluntarilyDelete).toBeTruthy()
  expect(utonomaContract.getContentById).toBeTruthy()

})