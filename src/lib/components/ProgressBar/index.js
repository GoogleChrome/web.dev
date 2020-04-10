/**
 * @fileoverview An indeterminate progress bar.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import './_styles.scss';

/**
 * An indeterminate progress bar.
 * @extends {BaseElement}
 * @final
 */
class ProgressBar extends BaseElement {
  render() {
    return html`
      <div class="web-progress-bar-wrapper">
        <div class="web-progress-bar-indeterminate"></div>
      </div>
    `;
  }

  firstUpdated() {
    this.setAttribute('role', 'progressbar');
  }
}

customElements.define('web-progress-bar', ProgressBar);
