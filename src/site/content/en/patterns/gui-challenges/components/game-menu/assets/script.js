import {rovingIndex} from 'https://cdn.skypack.dev/roving-ux'
   
const menu = document.querySelector('.threeD-button-set')
const menuRect = menu.getBoundingClientRect()

const { matches:motionOK } = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
)

rovingIndex({
  element: document.querySelector('.threeD-button-set'),
  target: 'button',
})

if (motionOK) {
  window.addEventListener('mousemove', ({target, clientX, clientY}) => {
    const {dx,dy} = getAngles(clientX, clientY)

    menu.style.setProperty('--x', `${dy / 20}deg`)
    menu.style.setProperty('--y', `${dx / 20}deg`)
  })
}

const getAngles = (clientX, clientY) => {
  const { x, y, width, height } = menuRect 
  
  const dx = clientX - (x + 0.5 * width)
  const dy = clientY - (y + 0.5 * height)
  
  return {dx,dy}
}