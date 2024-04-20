import { filecoinTestnetEndpoint } from './rpcEndpoints.js'
import { JsonRpcProvider, Contract } from 'ethers'
import { utonomaFilecoinCalibrationTestNetAddress, utonomaABI} from '../utonomaSmartContract.js'

let provider
let utonomaContract

export function useReadOnlyProvider() {
  if(!provider || !utonomaContract) {
    provider = new JsonRpcProvider(filecoinTestnetEndpoint)
    utonomaContract = new Contract(
      utonomaFilecoinCalibrationTestNetAddress, 
      utonomaABI,
      provider
    )
  }
  return {
    provider,
    utonomaContract
  }
}