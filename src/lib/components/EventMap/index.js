/**
 * @fileoverview Element that renders a map and a list of local events.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import './_styles.scss';

const encodeMarkers = function (markers) {
  const color = 'red';
  return markers
    .map((marker) => {
      return `markers=color:${color}%7Clabel:${marker.place[0]}%7C${marker.marker}`;
    })
    .join('&');
};

const formatDate = function (date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Renders a map and a list of local events. It takes input from a <code>
 * element embedded as a child of this element.
 *
 * @extends {BaseElement}
 * @final
 */
class EventMap extends BaseElement {
  static get properties() {
    return {
      title: {type: String},
      center: {type: String},
      zoom: {type: Number},
      size: {type: String},
      events: {type: String},
      key: {type: String},
      localEvents: {type: Object},
    };
  }

  constructor() {
    super();
    this.title = '';
    this.center = '';
    this.zoom = 4;
    this.size = '600x300';
    this.events = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.events = JSON.parse(this.querySelector('code').innerText.trim());
    this.eventRegions = Object.keys(this.events);
    this.localEvents = this.events[this.eventRegions[0]];
  }

  onChange(e) {
    this.localEvents = this.events[e.target.value];
  }

  render() {
    const params = [
      `center=${this.center}`,
      `zoom=${this.zoom}`,
      `size=${this.size}`,
      `maptype=roadmap`,
      encodeMarkers(this.localEvents),
      `key=${this.key}`,
    ].join('&');
    const url = `https://maps.googleapis.com/maps/api/staticmap?${params}`;

    // prettier-ignore
    return html`
      <select class="w-live-select" @change="${this.onChange}">
        ${this.eventRegions.map((region) => {
    return html`<option value=${region}>${region}</option>`;
  })}
  </select>
      <img
        width="600"
        height="300"
        src="${url}"
        alt="${this.title}"
      />
      <ul class="w-event-list__community-events">
        ${this.localEvents.map((entry) => {
    const date = new Date(entry.date);
    return html`
            <li>
              <span>${entry.place}</span>
              <time datetime=${date.toISOString()}>
                ${formatDate(date)}
              </time>
            </li>
          `;
  })}
      </ul>
    `;
  }
}

customElements.define('web-event-map', EventMap);
