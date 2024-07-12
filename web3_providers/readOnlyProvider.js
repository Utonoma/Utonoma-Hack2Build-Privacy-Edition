import { sepoliaEndpoint } from './rpcEndpoints.js'
import { JsonRpcProvider, Contract } from 'ethers'
import { utonomaSepoliaAddress, utonomaABI} from '../utonomaSmartContract.js'

let provider
let utonomaContract

/**
 * @typedef {Object} useReadOnlyProviderReturn
 * @property {Object} provider - Handler to the JsonRpcProvider used to create the 
 * smart contract instance
 * @property {Object} utonomaContract - The instance of the utonoma contract
 */

/**
 * Gets a provider and a smart contract instance for methods that only reads information 
 * from the blockchain
 * @returns {useReadOnlyProviderReturn} - {@link useReadOnlyProviderReturn}
 */

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