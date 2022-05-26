import $ from 'blingblingjs'
import {rovingIndex} from 'roving-ux'

const splitButtons = $('.gui-split-button')
const popupButtons = $('.gui-popup-button')

// popup activating roving index for it's buttons
popupButtons.forEach(element => 
  rovingIndex({
    element,
    target: 'button',
  }))

// support escape key
popupButtons.on('keyup', e => {
  if (e.code === 'Escape')
    e.target.blur()
})

popupButtons.on('focusin', e => {
  e.currentTarget.setAttribute('aria-expanded', true)
})

popupButtons.on('focusout', e => {
  e.currentTarget.setAttribute('aria-expanded', false)
})

// respond to any button interaction
splitButtons.on('click', event => {
  if (event.target.nodeName !== 'BUTTON') return
  console.info(event.target.innerText)
})