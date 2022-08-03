const progress = document.querySelector('progress')
const zone     = document.querySelector('#loading-zone')

const state = {
  val: .1
}

const roundDecimals = (val, places) =>
  +(Math.round(val + "e+" + places)  + "e-" + places)

const setProgress = () => {
  // set loading zone status
  zone.setAttribute('aria-busy', state.val < 1)

  // clear attributes if no value to show
  // <progress> will show indeterminate state
  if (state.val === null) {
    progress.removeAttribute('aria-valuenow')
    progress.removeAttribute('value')
    progress.focus()
    return
  }

  // round bad JS decimal math
  const val = roundDecimals(state.val, 2)
  const valPercent = val * 100 + "%"
  
  // set value for screenreaders and element values
  progress.value = val
  progress.setAttribute('aria-valuenow', valPercent)
  progress.innerText = valPercent

  // focus so screenreaders hear the announced value update
  progress.focus()
}