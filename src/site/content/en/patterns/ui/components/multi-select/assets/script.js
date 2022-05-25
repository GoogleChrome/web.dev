import 'https://unpkg.com/isotope-layout@3.0.6/dist/isotope.pkgd.min.js'

const IsotopeGrid = new Isotope( 'article', {
  itemSelector: 'span',
  layoutMode: 'fitRows',
  percentPosition: true
})
  
const filterGrid = query => {
  const { matches:motionOK } = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
  )
  
  IsotopeGrid.arrange({
    filter: query,
    stagger: 25,
    transitionDuration: motionOK ? '0.4s' : 0,
  })
}

// takes a <select> and returns the selection as an array
const prepareSelectOptions = element =>
  Array.from(element.selectedOptions).reduce((data, opt) => {
    data.push([opt.parentElement.label.toLowerCase(), opt.value])
    return data
  }, [])

// <select> watcher
document.querySelector('select').addEventListener('input', e => {
  let selectData = prepareSelectOptions(e.target)
  console.warn('Multiselect', selectData)

  // DEMO
  // isotope query assembly from checkbox selections
  let query = selectData.reduce((query, val) => {
    query.push('.' + val[1].split(' ').join('-'))
    return query
  }, []).join(',')

  filterGrid(query)

  // update for assistive technology
  let statusRoleElement = document.querySelector('#applied-filters')
  let filterResults = IsotopeGrid.getFilteredItemElements().length

  statusRoleElement.style.counterSet = selectData.length
  statusRoleElement.textContent = " giving " + filterResults + " results"
})

document
  .querySelector('aside form')
  .addEventListener('input', e => {
    if (e.target.nodeName === 'SELECT') return
      
    const formData = new FormData(document.querySelector('form'))
    console.warn('Checkboxes', Array.from(formData.entries()))

    // DEMO
    // isotope query assembly from checkbox selections
    let query = Array.from(formData.values()).reduce((query, val) => {
      query.push('.' + val.split(' ').join('-'))
      return query
    }, []).join(',')

    filterGrid(query)

    document.querySelector('#applied-filters').textContent = " giving " + IsotopeGrid.getFilteredItemElements().length + " results"
  })