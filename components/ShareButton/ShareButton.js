export const ShareButton = () => {
  const $buttonShare = document.querySelector('#buttonShare')
  const $dialogShareButtonTextCopied = document.querySelector('#dialogShareButtonTextCopied')

  const state = {
    currentVideo: null,
    _loading: false,
    get loading() {
      return this._loading
    },
    set loading({value, effects, payload}) {
      //disable the button
      this._loading = value
      if (effects) effects(payload)
    }
  }

  $buttonShare.addEventListener('click', async() => {
    const shareUrl = `${window.location.origin}?watch=${state.currentVideo}`
    await navigator.clipboard.writeText(shareUrl)
    $dialogShareButtonTextCopied.show()
    setTimeout(() => $dialogShareButtonTextCopied.close(), 2500)
  })
  
  return state
}