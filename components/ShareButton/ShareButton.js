export const ShareButton = () => {
  const $buttonShare = document.querySelector('#buttonShare')
  const $dialogShareButtonTextCopied = document.querySelector('#dialogShareButtonTextCopied')

  const state = {
    currentVideo: null,
    _loading: false,
    get loading() {
      return this._loading
    },
    set loading(value) {
      this._loading = value
      if (effects.loading) effects.loading()
    },
  }

  const effects = {
    loading: () => {
      if (state.loading) {
        $buttonShare.disabled = true
        $buttonShare.style.visibility = 'hidden'
      } else {
        $buttonShare.disabled = false
        $buttonShare.style.visibility = 'visible'
      }
    }
  }

  state.effects = effects

  $buttonShare.addEventListener('click', async() => {
    const shareUrl = `${window.location.origin}?watch=${state.currentVideo}`
    await navigator.clipboard.writeText(shareUrl)
    $dialogShareButtonTextCopied.show()
    setTimeout(() => $dialogShareButtonTextCopied.close(), 2500)
  })
  
  return state
}