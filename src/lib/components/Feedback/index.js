/**
 * @fileoverview Element that handles feedback on posts.
 */

import {BaseElement} from '../BaseElement';

/**
 * Catches feedback submission on posts to submit to Analytics.
 *
 * @extends {BaseElement}
 * @final
 */
class Feedback extends BaseElement {
  connectedCallback() {
    super.connectedCallback();
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(e.target);
      const result = {};

      Array.from(form.entries()).forEach((entry) => {
        result[entry[0]] = entry[1];
      });
    });
  }
}

customElements.define('web-feedback', Feedback);
