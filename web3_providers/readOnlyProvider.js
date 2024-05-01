import { sepoliaEndpoint } from './rpcEndpoints.js'
import { JsonRpcProvider, Contract } from 'ethers'
import { utonomaSepoliaAddress, utonomaABI} from '../utonomaSmartContract.js'

let provider
let utonomaContract

export function useReadOnlyProvider() {
  if(!provider || !utonomaContract) {
    provider = new JsonRpcProvider(sepoliaEndpoint)
    utonomaContract = new Contract(
      utonomaSepoliaAddress, 
      utonomaABI,
      provider
    )
  }
  return {
    provider,
    utonomaContract
  }
}