const switcher = document.querySelector('#theme-switcher')
const doc = document.firstElementChild

switcher.addEventListener('input', e =>
  setTheme(e.target.value))

const setTheme = theme =>
  doc.setAttribute('color-scheme', theme)