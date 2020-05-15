/**
 * @fileoverview Element that renders a time in local timezone.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import './_styles.scss';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const connected = new Set();
let timezoneCheckInterval = 0;
let previous = 0;

const checkTimezone = () => {
  const now = new Date().getTimezoneOffset();
  if (now !== previous) {
    previous = now;
    connected.forEach((node) => node.requestUpdate());
  }
};

/**
 * Renders code block that can easily be copied.
 *
 * @extends {BaseElement}
 * @final
 */
class EventTime extends BaseElement {
  static get properties() {
    return {
      datetime: {type: String},
      duration: {type: Number},
    };
  }

  constructor() {
    super();
    this._date = null;
  }

  connectedCallback() {
    super.connectedCallback();

    if (connected.size === 0) {
      // Every 10 minutes, check if we're in the same timezone.
      timezoneCheckInterval = window.setInterval(checkTimezone, 10 * 60 * 1000);
    }
    connected.add(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    connected.delete(this);
    if (connected.size === 0) {
      window.clearInterval(timezoneCheckInterval);
    }
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has('datetime')) {
      this._date = null;

      if (this.datetime) {
        const d = new Date(Date.parse(this.datetime));
        if (+d) {
          this._date = d;
        }
      }
    }

    return super.shouldUpdate(changedProperties);
  }

  render() {
    if (!this._date) {
      return html`
        <time>?</time>
      `;
    }

    const format = (d, options) => {
      return new Intl.DateTimeFormat('default', options).format(d);
    };
    const options = new Intl.DateTimeFormat().resolvedOptions();

    let durationPart = '';
    if (this.duration > 0) {
      const end = new Date(this._date);
      end.setHours(end.getHours() + this.duration);
      durationPart = html`
        &mdash; ${format(end, {hour: 'numeric', minute: '2-digit'})}
      `;
    }

    return html`
      <time datetime=${this._date.toISOString()}>
        <div class="et-date-feat">
          <div class="et-date-feat__month">
            ${months[this._date.getMonth()]}
          </div>
          <div class="et-date-feat__day">
            ${this._date.getDate()}
          </div>
        </div>
        <div class="et-time-feat">
          <div class="et-time-feat__value">
            ${format(this._date, {hour: 'numeric', minute: '2-digit'})}
            ${durationPart}
          </div>
          <div class="et-time-feat__timezone">
            ${options.timeZoneName || options.timeZone || 'Local Time'}
          </div>
        </div>
      </time>
    `;
  }
}

customElements.define('web-event-time', EventTime);
