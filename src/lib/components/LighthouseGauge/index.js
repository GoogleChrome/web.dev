/**
 * @fileoverview Element that shows a score in a gauge.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import './_styles.scss';

/**
 * @extends {BaseElement}
 * @final
 */
class LighthouseGauge extends BaseElement {
  static get properties() {
    return {
      score: {type: Number},
      _bootstrap: {type: Boolean}, // holds arc value at zero for hydration
    };
  }

  constructor() {
    super();
    this.score = 0;
  }

  connectedCallback() {
    super.connectedCallback();

    this._bootstrap = true;
    window.requestAnimationFrame(() => {
      this._bootstrap = false;
    });
  }

  render() {
    const clamped = Math.max(0, Math.min(1, this.score));
    const round = Math.round(clamped * 100);

    // nb. Pulled directly from report/html/renderer/util.js in Lighthouse.
    let label = 'fail';
    if (clamped >= 0.9) {
      label = 'pass';
    } else if (clamped >= 0.5) {
      label = 'average';
    }
    const className = `gauge__${label}`;

    return html`
      <div class=${className}>
        <svg viewBox="0 0 120 120" class="gauge" fill="none" stroke-width="2">
          <circle class="gauge-base" r="53" cx="60" cy="60"></circle>
          <circle
            class="gauge-arc ${this._bootstrap ? 'bootstrap' : ''}"
            transform="rotate(-90 60 60)"
            stroke-dasharray="${clamped * 329} 329"
            stroke-dashoffset="0"
            r="53"
            cx="60"
            cy="60"
          ></circle>
        </svg>
        <div class="gauge-percent">${round}</div>
      </div>
    `;
  }

  firstUpdated() {
    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', '100');
  }

  updated() {
    this.setAttribute('aria-valuenow', String(this.score * 100));
  }
}

customElements.define('web-lighthouse-gauge', LighthouseGauge);
