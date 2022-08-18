import {scrollend} from 'https://cdn.jsdelivr.net/gh/argyleink/scrollyfills@latest/dist/scrollyfills.modern.js'

export default class Carousel {
  constructor(element) {
    this.elements = {
      root:       element,
      scroller:   element.querySelector('.gui-carousel--scroller'),
      snaps:      element.querySelectorAll('.gui-carousel--snap'),
      previous:   null, // generated in #createControl
      next:       null, // generated in #createControl
      pagination: null, // generated in #createPagination
    }

    this.current = undefined        // set in #initializeState
    this.hasIntersected = new Set() // holds intersection results used on scrollend

    this.elements.root.setAttribute('tabindex', -1)
    this.elements.root.setAttribute('aria-roledescription', 'carousel')

    this.elements.scroller.setAttribute('role', 'group')
    this.elements.scroller.setAttribute('aria-label', 'Items Scroller')
    this.elements.scroller.setAttribute('aria-live', 'Polite')

    this.#createObservers()
    this.#createPagination()
    this.#createControls()
    this.#initializeState()
    this.#listen()
    this.#synchronize()
  }

  #synchronize() {
    for (let observation of this.hasIntersected) {
      // toggle inert when it's not intersecting
      observation.target
        .toggleAttribute('inert', !observation.isIntersecting)

      // toggle aria-selected on pagination dots
      const dot = this.elements.pagination
        .children[this.#getElementIndex(observation.target)]

      dot.setAttribute('aria-selected', observation.isIntersecting)
      dot.setAttribute('tabindex', !observation.isIntersecting ? '-1' : '0')

      // stash the intersecting snap element
      if (observation.isIntersecting) {
        this.current = observation.target
        this.goToElement({
          scrollport: this.elements.pagination,
          element: dot,
        })
      }
    }

    this.#updateControls()
    this.hasIntersected.clear()
  }

  goNext() {
    const next = this.current.nextElementSibling

    if (this.current === next)
      return

    if (next) {
      this.goToElement({
        scrollport: this.elements.scroller,
        element: next,
      })
      this.current = next
    }
    else {
      console.log('at the end')
    }
  }

  goPrevious() {
    const previous = this.current.previousElementSibling

    if (this.current === previous)
      return

    if (previous) {
      this.goToElement({
        scrollport: this.elements.scroller,
        element: previous,
      })
      this.current = previous
    }
    else {
      console.log('at the beginning')
    }
  }

  goToElement({scrollport, element}) {
    const dir = this.#documentDirection()

    const delta = Math.abs(scrollport.offsetLeft - element.offsetLeft)
    const scrollerPadding = parseInt(getComputedStyle(scrollport)['padding-left'])

    const pos = scrollport.clientWidth / 2 > delta
      ? delta - scrollerPadding
      : delta + scrollerPadding

    scrollport.scrollTo(dir === 'ltr' ? pos : pos*-1, 0)
  }

  #updateControls() {
    const {lastElementChild:last, firstElementChild:first} = this.elements.scroller

    const isAtEnd   = this.current === last
    const isAtStart = this.current === first

    // before we possibly disable a button
    // shift the focus to the complimentary button
    if (document.activeElement === this.elements.next && isAtEnd)
      this.elements.previous.focus()
    else if (document.activeElement === this.elements.previous && isAtStart)
      this.elements.next.focus()

    this.elements.next.toggleAttribute('disabled', isAtEnd)
    this.elements.previous.toggleAttribute('disabled', isAtStart)
  }

  #listen() {
    // observe children intersection
    for (let item of this.elements.snaps)
      this.carousel_observer.observe(item)

    // watch document for removal of this carousel node
    this.mutation_observer.observe(document, {
      childList: true,
      subtree: true,
    })

    // scrollend listener for sync
    this.elements.scroller.addEventListener('scrollend', this.#synchronize.bind(this))
    this.elements.next.addEventListener('click', this.goNext.bind(this))
    this.elements.previous.addEventListener('click', this.goPrevious.bind(this))
    this.elements.pagination.addEventListener('click', this.#handlePaginate.bind(this))
    this.elements.root.addEventListener('keydown', this.#handleKeydown.bind(this))
  }

  #unlisten() {
    for (let item of this.elements.snaps)
      this.carousel_observer.unobserve(item)

    this.mutation_observer.disconnect()

    this.elements.scroller.removeEventListener('scrollend', this.#synchronize)
    this.elements.next.removeEventListener('click', this.goNext)
    this.elements.previous.removeEventListener('click', this.goPrevious)
    this.elements.pagination.removeEventListener('click', this.#handlePaginate)
    this.elements.root.removeEventListener('keydown', this.#handleKeydown)
  }

  #createObservers() {
    this.carousel_observer = new IntersectionObserver(observations => {
      for (let observation of observations) {
        this.hasIntersected.add(observation)

        // toggle --in-view class if intersecting or not
        observation.target.classList
          .toggle('--in-view', observation.isIntersecting)
      }
    }, {
      root: this.elements.scroller,
      threshold: .6,
    })

    this.mutation_observer = new MutationObserver((mutationList, observer) => {
      mutationList
        .filter(x => x.removedNodes.length > 0)
        .forEach(mutation => {
          [...mutation.removedNodes]
            .filter(x => x.querySelector('.gui-carousel') === this.elements.root)
            .forEach(removedEl => {
              this.#unlisten()
            })
        })
    })
  }

  #initializeState() {
    const startIndex = this.elements.root.hasAttribute('carousel-start')
      ? this.elements.root.getAttribute('carousel-start') - 1
      : 0

    this.current = this.elements.snaps[startIndex]
    this.#handleScrollStart()

    // each snap target needs a marker for pagination
    // each snap needs some a11y love
    this.elements.snaps.forEach((snapChild, index) => {
      this.hasIntersected.add({
        isIntersecting: index === 0,
        target: snapChild,
      })

      this.elements.pagination
        .appendChild(this.#createMarker(snapChild, index))

      snapChild.setAttribute('aria-label', `${index+1} of ${this.elements.snaps.length}`)
      snapChild.setAttribute('aria-roledescription', 'item')
    })
  }

  #handleScrollStart() {
    if (this.elements.root.hasAttribute('carousel-start')) {
      const itemIndex = this.elements.root.getAttribute('carousel-start')
      const startElement = this.elements.snaps[itemIndex - 1]

      this.elements.snaps.forEach(snap =>
        snap.style.scrollSnapAlign = 'unset')

      startElement.style.scrollSnapAlign = null
      startElement.style.animation = 'carousel-scrollstart 1ms'

      startElement.addEventListener('animationend', e => {
        startElement.animation = null
        this.elements.snaps.forEach(snap =>
          snap.style.scrollSnapAlign = null)
      }, {once: true})
    }
  }

  #handlePaginate(e) {
    if (e.target.classList.contains('gui-carousel--pagination'))
      return

    e.target.setAttribute('aria-selected', true)
    const item = this.elements.snaps[this.#getElementIndex(e.target)]

    this.goToElement({
      scrollport: this.elements.scroller,
      element: item,
    })
  }

  #handleKeydown(e) {
    const dir = this.#documentDirection()
    const idx = this.#getElementIndex(e.target)

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()

        const next_offset = dir === 'ltr' ? 1 : -1
        const next_control = dir === 'ltr' ? this.elements.next : this.elements.previous

        if (e.target.closest('.gui-carousel--pagination'))
          this.elements
            .pagination.children[idx + next_offset]
            ?.focus()
        else {
          if (document.activeElement === next_control)
            this.#keypressAnimation(next_control)
          next_control.focus()
        }

        dir === 'ltr' ? this.goNext() : this.goPrevious()
        break
      case 'ArrowLeft':
        e.preventDefault()

        const previous_offset = dir === 'ltr' ? -1 : 1
        const previous_control = dir === 'ltr' ? this.elements.previous : this.elements.next

        if (e.target.closest('.gui-carousel--pagination'))
          this.elements
            .pagination.children[idx + previous_offset]
            ?.focus()
        else {
          if (document.activeElement === previous_control)
            this.#keypressAnimation(previous_control)
          previous_control.focus()
        }

        dir === 'ltr' ? this.goPrevious() : this.goNext()
        break
    }
  }

  #getElementIndex(element) {
    let index = 0
    while (element = element.previousElementSibling)
      index++
    return index
  }

  #createPagination() {
    let nav = document.createElement('nav')
    nav.className = 'gui-carousel--pagination'
    this.elements.root.appendChild(nav)

    this.elements.pagination = nav
  }

  #createMarker(item, index) {
    const markerType = this.elements.root.getAttribute('carousel-pagination')
    index++ // user facing index shouldnt start at 0

    if (markerType == 'gallery')
      return this.#createMarkerGallery({index, type: markerType, item})
    else
      return this.#createMarkerDot({index, type: markerType, item})
  }

  #createMarkerDot({index, type, item}) {
    const marker = document.createElement('button')
    const img = item.querySelector('img')
    const caption = item.querySelector('figcaption')
    marker.className = 'gui-carousel--control'
    marker.type = 'button'
    marker.role = 'tab'
    marker.title = `Item ${index}: ${img?.alt || caption?.innerText}`
    marker.setAttribute('aria-label', img?.alt || caption?.innerText)
    marker.setAttribute('aria-setsize', this.elements.snaps.length)
    marker.setAttribute('aria-posinset', index)
    marker.setAttribute('aria-controls', `carousel-item-${index}`)
    return marker
  }

  #createMarkerGallery({index, type, item}) {
    const marker = document.createElement('button')
    const img = item.querySelector('img')
    marker.style.backgroundImage = `url(${img.src})`
    marker.className = 'gui-carousel--control --gallery'
    marker.type = 'button'
    marker.role = 'tab'
    marker.title = `Item ${index}: ${img.alt}`
    marker.setAttribute('aria-label', img.alt)
    marker.setAttribute('aria-setsize', this.elements.snaps.length)
    marker.setAttribute('aria-posinset', index)
    marker.setAttribute('aria-controls', `carousel-item-${index}`)
    return marker
  }

  #createControls() {
    let controls = document.createElement('div')
    controls.className = 'gui-carousel--controls'

    let prevBtn = this.#createControl('previous')
    let nextBtn = this.#createControl('next')

    controls.appendChild(prevBtn)
    controls.appendChild(nextBtn)

    this.elements.previous = prevBtn
    this.elements.next = nextBtn
    this.elements.root.prepend(controls)
  }

  #createControl(btnType) {
    let control = document.createElement('button')
    let userFacingText = `${btnType.charAt(0).toUpperCase() + btnType.slice(1)} Item`

    control.type = 'button'
    control.title = userFacingText
    control.className = `gui-carousel--control --${btnType}`
    control.setAttribute('aria-controls', 'gui-carousel--controls')
    control.setAttribute('aria-label', userFacingText)

    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('aria-hidden', 'true')
    svg.setAttribute('viewBox', '0 0 20 20')
    svg.setAttribute('fill', 'currentColor')

    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('fill-rule', 'evenodd')
    path.setAttribute('clip-rule', 'evenodd')

    let previousPath = 'M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
    let nextPath = 'M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'

    path.setAttribute('d', btnType === 'next' ? nextPath : previousPath)

    svg.appendChild(path)
    control.appendChild(svg)

    return control
  }

  #keypressAnimation(element) {
    element.style.animation = 'gui-carousel--control-keypress 145ms var(--ease-2)'
    element.addEventListener('animationend', e => {
      element.style.animation = null
    }, {once: true})
  }

  #documentDirection() {
    return document.firstElementChild.getAttribute('dir') || 'ltr'
  }
}

document.querySelectorAll('.gui-carousel').forEach(element => {
  new Carousel(element)
})
