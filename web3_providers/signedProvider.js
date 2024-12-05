import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { scrollSepolia } from '@reown/appkit/networks'
import { BrowserProvider, Contract } from 'ethers'
import { utonomaSepoliaAddress, utonomaABI } from '../utonomaSmartContract.js'
import { sepoliaEndpoint } from './rpcEndpoints.js'

let modal

const projectId = '2897ca765c95a7e36410d31f88a6efee' //Id for the demo project

const metadata = {
  name: 'Demo Utonoma',
  description: 'The demo version of social network of the web3 world',
  url: 'https://demo.utonoma.com/', // url must match your domain & subdomain
  icons: ['https://demo.utonoma.com/'] //set an icon
}

export function useSignedProvider() {
    if(!modal) {
      modal = createAppKit({
        adapters: [new EthersAdapter()],
        networks: [scrollSepolia],
        metadata,
        projectId,
        features: {
          analytics: true // Optional - defaults to your Cloud configuration
        },
        featuredWalletIds: [ //Wallets shown by default when opening the modal
          '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0' //Trust Wallet
        ]
      })
    }
    return { modal }
}

export async function useUtonomaContractForSignedTransactions() {
  /*
  let { modal } = await useSignedProvider()
  if(!modal.getIsConnected()) throw(new Error('User disconnected'))
  const walletProvider = modal.getWalletProvider()
  const ethersProvider = new BrowserProvider(walletProvider)
  const signer = await ethersProvider.getSigner()
  const utonomaContractForSignedTransactions = new Contract(utonomaSepoliaAddress, utonomaABI, signer)*/
  const utonomaContractForSignedTransactions = new Object()
  return { utonomaContractForSignedTransactions }
}
