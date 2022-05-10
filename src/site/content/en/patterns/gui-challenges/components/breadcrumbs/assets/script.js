const crumbs         = document.querySelectorAll('.breadcrumbs select')
const allowedKeys    = new Set(['Tab', 'Enter', ' '])
const preventedKeys  = new Set(['ArrowUp', 'ArrowDown'])

// watch crumbs for *full* changes,
// ensures it's not a user exploring options via keyboard
crumbs.forEach(nav => {
  let ignoreChange = false

  nav.addEventListener('change', e => {
    if (ignoreChange) return

    const option = e.target
    const choice = option.value
    const crumb = option.closest('.crumb')

    // flag crumb so adjacent siblings can be hidden
    crumb.classList.add('tree-changed')

    // update crumb text to reflect the user's choice
    crumb.querySelector(':scope > a').textContent = choice

    routePage(choice)
  })

  nav.addEventListener('keydown', ({ key }) => {
    if (preventedKeys.has(key))
      ignoreChange = true
    else if (allowedKeys.has(key))
      ignoreChange = false
  })
})

const routePage = route => {
  console.info('change path to: ', route)
  // change entire URL (window.location)
  // or 
  // use your favorite clientside framework's router
}