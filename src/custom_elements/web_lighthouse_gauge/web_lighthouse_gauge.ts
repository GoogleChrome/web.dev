// Import the LitElement base class and html helper function
import {html, property, customElement, PropertyValues} from 'lit-element';
import {BaseElement} from '../base_element/base_element';
import './web_lighthouse_gauge.scss';

/**
 * Lighthouse gauge element.
 */
@customElement('web-lighthouse-gauge')
export class WebProgressBar extends BaseElement {
  @property({type: Number}) score = 1;

  // eslint-disable-next-line require-jsdoc
  render() {
    const score = this.score;
    this.setAttribute('aria-valuenow', `${score * 100}`);

    // nb. Pulled directly from report/html/renderer/util.js in Lighthouse.
    let label = 'fail';
    if (score >= 0.9) {
      label = 'pass';
    } else if (score >= 0.5) {
      label = 'average';
    }

    return html`
<div class="gauge__${label}">
  <svg viewBox="0 0 120 120" class="gauge" fill="none" stroke-width="2">
    <circle class="gauge-base" r="53" cx="60" cy="60"></circle>
    <circle class="gauge-arc" transform="rotate(-90 60 60)" stroke-dasharray="${score * 329} 329" stroke-dashoffset="0" r="53" cx="60" cy="60"></circle>
  </svg>
  <div class="gauge-percent">${Math.round(score * 100)}</div>
</div>
    `;
  }

  firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.setAttribute('role', 'progressbar');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', '100');

    const arc = this.renderRoot!.querySelector('.gauge-arc');
    if (arc) {
      arc.classList.add('bootstrap');
      window.requestAnimationFrame(() => arc.classList.remove('bootstrap'));
    }
  }
}
