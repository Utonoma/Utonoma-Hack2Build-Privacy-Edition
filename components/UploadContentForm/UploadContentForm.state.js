export const createStateForUploadContentForm = () => {
  const availiableStates = Object.freeze({
    fillingForm: Symbol('fillingForm'),
    validatingForm: Symbol('validatingForm'), 
    uploadingToIpfs: Symbol('uploadingToIpfs'),
    uploadingToUtonoma: Symbol('uploadingToUtonoma'),
    confirmingTransaction: Symbol('success'),
    end: Symbol('end'),
    videoTooLongError: Symbol('videoTooLongError'),
    wrongVideoFileError: Symbol('wrongVideoFileError'),
    uploadingToIpfsError: Symbol('uploadingToIpfsError'),
    uploadingToUtonomaError: Symbol('uploadingToUtonomaError')
  })

  let currentState = availiableStates.fillingForm

  function setState(newState, effect) {
    if (!Object.values(availiableStates).includes(newState)) return
    if(newState === currentState) return
    currentState = newState
    effect()
  }

  return {
    availiableStates,
    currentState: () => currentState,
    setState
  }
}