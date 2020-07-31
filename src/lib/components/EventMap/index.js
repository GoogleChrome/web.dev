/**
 * @fileoverview Element that renders a map and a list of local events.
 */

import {html} from 'lit-element';
import {BaseStateElement} from '../BaseStateElement';
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
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Renders a map and a list of local events. It takes input from a <code>
 * element embedded as a child of this element.
 *
 * @extends {BaseStateElement}
 * @final
 */
class EventMap extends BaseStateElement {
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
    this.size = '600x300';
    this.events = null;
    this.zoom = 0;
    this.key = '';
  }

  onStateChanged({communityEvents}) {
    if (communityEvents && this.events !== communityEvents) {
      this.events = communityEvents;
      this.eventRegions = Object.keys(this.events);
      this.localEvents = this.events[this.eventRegions[0]];
    }
  }

  onChange(e) {
    this.localEvents = this.events[e.target.value];
  }

  render() {
    if (!this.events) {
      return html``;
    }

    // Set the minimal zoom to 4, if only 1 marker present.
    const zoom = this.zoom || this.localEvents.length < 2 ? 4 : '';
    const params = [
      `center=${this.center}`,
      `zoom=${zoom}`,
      `size=${this.size}`,
      `maptype=roadmap`,
      encodeMarkers(this.localEvents),
      `key=${this.key}`,
    ].join('&');
    const url = `https://maps.googleapis.com/maps/api/staticmap?${params}`;

    // prettier-ignore
    /* eslint-disable indent */
    return html`
      <select class="w-select--borderless" @change="${this.onChange}">
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
              <a href="${entry.link}" target="_blank">${entry.place} (${entry.country})</a>
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
