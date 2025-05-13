import {ACTIONS, LikeButton } from '../LikeButton/LikeButton.js'
import { useUtonomaContractForSignedTransactions } from '../../web3_providers/signedProvider.js'

export const DislikeButton = ($container) => {
  const DislikeButton = LikeButton($container)
  const $dialogCheckWalletToApprove = document.querySelector('#dialogCheckWalletToApprove')


  DislikeButton.actions.waitingForApproveOnWallet = async() => {
    try {
      $dialogCheckWalletToApprove.showModal()
      const { utonomaContractForSignedTransactions } = await useUtonomaContractForSignedTransactions()
      let likeResult = await utonomaContractForSignedTransactions.dislike([DislikeButton.utonomaIdentifier.index, DislikeButton.utonomaIdentifier.contentType])
      DislikeButton.currentAction = { 
        value: ACTIONS.waitingForBlockchainResult, 
        payload: likeResult 
      }
    } catch(error) {
      DislikeButton.currentAction = { value: ACTIONS.genericError }
    } finally {
      $dialogCheckWalletToApprove.close()
    } 
  }

  return DislikeButton
}