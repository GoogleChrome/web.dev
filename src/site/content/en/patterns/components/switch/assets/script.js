const elements = document.querySelectorAll('.gui-switch')
const switches = new WeakMap()

const state = {
  activethumb: null,
  recentlyDragged: false,
}

const getStyle = (element, prop) =>
  parseInt(
    window.getComputedStyle(element)
      .getPropertyValue(prop))

const getPseudoStyle = (element, prop) =>
  parseInt(
    window.getComputedStyle(element, ':before')
      .getPropertyValue(prop))

const dragInit = event => {
  if (event.target.disabled) return

  state.activethumb = event.target
  state.activethumb.addEventListener('pointermove', dragging)
  state.activethumb.style.setProperty('--thumb-transition-duration', '0s')
}

const dragging = event => {
  if (!state.activethumb) return

  let {thumbsize, bounds, padding} = switches.get(state.activethumb.parentElement)
  let directionality = getStyle(state.activethumb, '--isLTR')

  let track = (directionality === -1)
    ? (state.activethumb.clientWidth * -1) + thumbsize + padding
    : 0

  let pos = Math.round(event.offsetX - thumbsize / 2)

  if (pos < bounds.lower) pos = 0
  if (pos > bounds.upper) pos = bounds.upper

  state.activethumb.style.setProperty('--thumb-position', `${track + pos}px`)
}

const dragEnd = event => {
  if (!state.activethumb) return

  state.activethumb.checked = determineChecked()

  if (state.activethumb.indeterminate)
    state.activethumb.indeterminate = false

  state.activethumb.style.removeProperty('--thumb-transition-duration')
  state.activethumb.style.removeProperty('--thumb-position')
  state.activethumb.removeEventListener('pointermove', dragging)
  state.activethumb = null

  padRelease()
}

const padRelease = () => {
  state.recentlyDragged = true

  setTimeout(_ => {
    state.recentlyDragged = false
  }, 300)
}

const preventBubbles = event => {
  if (state.recentlyDragged)
    event.preventDefault() && event.stopPropagation()
}

const labelClick = event => {
  if (
    state.recentlyDragged || 
    !event.target.classList.contains('gui-switch') || 
    event.target.querySelector('input').disabled
  ) return

  let checkbox = event.target.querySelector('input')
  checkbox.checked = !checkbox.checked
  event.preventDefault()
}

const determineChecked = () => {
  let {bounds} = switches.get(state.activethumb.parentElement)
  let curpos = 
    Math.abs(
      parseInt(
        state.activethumb.style.getPropertyValue('--thumb-position')))

  if (!curpos) {
    curpos = state.activethumb.checked
      ? bounds.lower
      : bounds.upper
  }

  return curpos >= bounds.middle
}

elements.forEach(guiswitch => {
  let checkbox = guiswitch.querySelector('input')
  let thumbsize = getPseudoStyle(checkbox, 'width')
  let padding = getStyle(checkbox, 'padding-left') + getStyle(checkbox, 'padding-right')

  checkbox.addEventListener('pointerdown', dragInit)
  checkbox.addEventListener('pointerup', dragEnd)
  checkbox.addEventListener('click', preventBubbles)
  guiswitch.addEventListener('click', labelClick)

  switches.set(guiswitch, {
    thumbsize,
    padding,
    bounds: {
      lower: 0,
      middle: (checkbox.clientWidth - padding) / 4,
      upper: checkbox.clientWidth - thumbsize - padding,
    },
  })
})

window.addEventListener('pointerup', event => {
  if (!state.activethumb) return

  dragEnd(event)
})