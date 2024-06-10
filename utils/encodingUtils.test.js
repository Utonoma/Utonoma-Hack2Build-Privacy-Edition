import { getIpfsHashFromBytes32, getUrlFromIpfsHash } from './encodingUtils.js'

/*
A sample list of valid CIDs:
QmWhR7sn34AK7Y8MDJhdSGnjzGzzEG1BhxjTpAZb591gRa
QmWRxk71v5t4FfAjSJfRcSszH2q8WUz9PRTdp6GZhaQs6q
QmXHcxubtESDpFqoR1nkmPecUATsDfboyN3R2PREChUpYd
QmXGk2EonyBiktmXZJNuzWFqe9zvMFyaE6n15JSy9XxEGG
QmSDWozUsTkRZdA3ksiLrMXRwJupC8vBdk83Ez4UXRp681
*/

const bytes32CidExamples = [
  '0x7c2f5370a060b0f9a498ef2ebb062c2caeaa3db01d55ebc2b58b66f2ee70e08d',
  '0xeeba13fef204f6ad2785259d06b0f5ea630e76715f932640e257c55009804cc3'
]

const convertedBytes32CidExamples = [
  'QmWhR7sn34AK7Y8MDJhdSGnjzGzzEG1BhxjTpAZb591gRa',
  'QmeQYJwBo9fh7DafsGCYksRUsQGxEa3gXE7BzqKXd126uY'
]

test('getIpfsHashFromBytes32 should convert a bytes32 encoded CID into a normal CID V1.0', ()=> {
  const convertionResult = bytes32CidExamples.map((i) => {
    return getIpfsHashFromBytes32(i)
  })

  expect(convertedBytes32CidExamples).toEqual(convertionResult)
})

test('getIpfsHashFromBytes32 when receiving an empty or null value should throw an exception', () => {
  const errorMessage = 'no input received'

  const errorReceivingNull = () => {
    getIpfsHashFromBytes32(null)
  }
  const errorReceivingUndefined = () => {
    getIpfsHashFromBytes32(undefined)
  }

  expect(errorReceivingNull).toThrow(errorMessage)
  expect(errorReceivingUndefined).toThrow(errorMessage)
})

test('getUrlFromIpfsHash should compose a url that points to the provided CID', () => {
  const providedCID = 'QmWhR7sn34AK7Y8MDJhdSGnjzGzzEG1BhxjTpAZb591gRa'
  const actualResult = getUrlFromIpfsHash(providedCID)

  const expectedResult = 'https://copper-urban-gorilla-864.mypinata.cloud/ipfs/QmWhR7sn34AK7Y8MDJhdSGnjzGzzEG1BhxjTpAZb591gRa?pinataGatewayToken=WmR3tEcyNtxE6vjc4lPPIrY0Hzp3Dc9AYf2X4Bl-8o6JYBzTx9aY_u3OlpL1wGra'
  expect(expectedResult).toStrictEqual(actualResult)
})