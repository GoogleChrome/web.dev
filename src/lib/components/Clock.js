import {render} from 'preact';
import {html} from 'htm/preact';

/* eslint-disable require-jsdoc */
function Clock(props) {
  const time = new Date().toLocaleTimeString();
  return html`<span class="some-clock">${time}</span>`;
}

// render an instance of Clock into <body>:
render(html`<${Clock} />`, document.body);
