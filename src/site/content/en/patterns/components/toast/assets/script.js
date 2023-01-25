const init = () => {
  const node = document.createElement('section')
  node.classList.add('gui-toast-group')

  document.firstElementChild.insertBefore(node, document.body)
  return node
}

const createToast = text => {
  const node = document.createElement('output')
  
  node.innerText = text
  node.classList.add('gui-toast')
  node.setAttribute('role', 'status')
  node.setAttribute('aria-live', 'polite')

  return node
}

const addToast = toast => {
  const { matches:motionOK } = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
  )

  Toaster.children.length && motionOK
    ? flipToast(toast)
    : Toaster.appendChild(toast)
}

const Toast = text => {
  let toast = createToast(text)
  addToast(toast)

  return new Promise(async (resolve, reject) => {
    await Promise.allSettled(
      toast.getAnimations().map(animation => 
        animation.finished
      )
    )
    Toaster.removeChild(toast)
    resolve() 
  })
}

// https://aerotwist.com/blog/flip-your-animations/
const flipToast = toast => {
  // FIRST
  const first = Toaster.offsetHeight

  // add new child to change container size
  Toaster.appendChild(toast)

  // LAST
  const last = Toaster.offsetHeight

  // INVERT
  const invert = last - first

  // PLAY
  const animation = Toaster.animate([
    { transform: `translateY(${invert}px)` },
    { transform: 'translateY(0)' }
  ], {
    duration: 150,
    easing: 'ease-out',
  })

  animation.startTime = document.timeline.currentTime
}

const Toaster = init()
export default Toast