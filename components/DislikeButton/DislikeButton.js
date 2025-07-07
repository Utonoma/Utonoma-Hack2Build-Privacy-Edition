import {ACTIONS, LikeButton } from '../LikeButton/LikeButton.js'
import { useUtonomaContractForSignedTransactions } from '../../web3_providers/signedProvider.js'
import { GenericModal as GenericModalFactory } from '../modals/GenericModal/GenericModal.js'

export const DislikeButton = ($container) => {
  
  const $dialogCheckWalletToApprove = document.querySelector('#dialogCheckWalletToApprove')
  
  const DislikeButton = LikeButton($container)
  const DialogConfirmDelete = GenericModalFactory(document.querySelector('#dialogConfirmDelete'))
  

  ACTIONS.alertDelete = 'alertDelete',
  ACTIONS.waitingForDeletionApproveOnWallet = 'waitingForDeletionApproveOnWallet'

  DislikeButton.actions.alertDelete = async() => {
    try {
      await DialogConfirmDelete.actions.showDialog()
      ? DislikeButton.currentAction = { value: ACTIONS.waitingForDeletionApproveOnWallet }
      : DislikeButton.currentAction = { value: ACTIONS.waiting }
    } catch (error) {
      state.currentAction = { value: ACTIONS.genericError }
    }
  }
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
      console.log('Error while disliking content:', error)
    } finally {
      $dialogCheckWalletToApprove.close()
    }
  } 
  DislikeButton.actions.waitingForDeletionApproveOnWallet = async() => {
    try {
      const { utonomaContractForSignedTransactions } = await useUtonomaContractForSignedTransactions()
      const transaction = await utonomaContractForSignedTransactions.deletion(DislikeButton.utonomaIdentifier)
      const likeResult = await transaction.wait()
      if(likeResult.status === 1) {
        DislikeButton.currentAction = { value: ACTIONS.deletionSuccess }
      } else {
        DislikeButton.currentAction = { value: ACTIONS.deletionError }
      }
    } catch (error) {
      console.error('Error while deleting content:', error)
      DislikeButton.currentAction = { value: ACTIONS.genericError }
    }
  }

  return DislikeButton
}