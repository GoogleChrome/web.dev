import {rovingIndex} from "https://cdn.skypack.dev/roving-ux"

document.querySelectorAll('.horizontal-media-scroller')
  .forEach(scroller => rovingIndex({
    element: scroller,
    target: 'a',
  }))
