const span = (text, index) => {
  const node = document.createElement('span')

  node.textContent = text
  node.style.setProperty('--index', index)
  
  return node
}

export const byWord = text =>
  text.split(' ').map(span)

const {matches:motionOK} = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
)

if (motionOK) {
  const splitTargets = document.querySelectorAll('[split-by]')

  splitTargets.forEach(node => {
    let nodes = byWord(node.innerText)

    if (nodes)
      node.firstChild.replaceWith(...nodes)
  })
}