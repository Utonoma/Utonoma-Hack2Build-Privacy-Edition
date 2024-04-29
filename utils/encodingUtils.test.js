import { getIpfsHashFromBytes32, getUrlFromIpfsHash } from "./encodingUtils.js"

/*
A sample list of valid CIDs:
QmWhR7sn34AK7Y8MDJhdSGnjzGzzEG1BhxjTpAZb591gRa
QmWRxk71v5t4FfAjSJfRcSszH2q8WUz9PRTdp6GZhaQs6q
QmXHcxubtESDpFqoR1nkmPecUATsDfboyN3R2PREChUpYd
QmXGk2EonyBiktmXZJNuzWFqe9zvMFyaE6n15JSy9XxEGG
QmSDWozUsTkRZdA3ksiLrMXRwJupC8vBdk83Ez4UXRp681
*/

test('getUrlFromIpfsHash should compose a url that points to the provided CID', () => {
  const providedCID = 'QmWhR7sn34AK7Y8MDJhdSGnjzGzzEG1BhxjTpAZb591gRa'
  const actualResult = getUrlFromIpfsHash(providedCID)

  const expectedResult = 'https://copper-urban-gorilla-864.mypinata.cloud/ipfs/QmWhR7sn34AK7Y8MDJhdSGnjzGzzEG1BhxjTpAZb591gRa?pinataGatewayToken=WmR3tEcyNtxE6vjc4lPPIrY0Hzp3Dc9AYf2X4Bl-8o6JYBzTx9aY_u3OlpL1wGra'
  expect(expectedResult).toStrictEqual(actualResult)
})