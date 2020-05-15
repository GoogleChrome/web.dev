/**
 * @fileoverview Element that renders configurable per-page actions.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {Share} from '../Share';
import {splitPipes} from '../../utils/split-pipes';

/**
 * Renders configurable per-page actions. This is expected to be created by
 * page content.
 *
 * @extends {BaseElement}
 * @final
 */
class Actions extends BaseElement {
  static get properties() {
    return {
      // Pipe-separated list of actions to support
      actions: {type: String},
      // Pipe-seperated handles of authors of this page, including "@" if e.g. a Twitter user
      authors: {type: String},
    };
  }

  get shareUrl() {
    return window.location.href;
  }

  get shareTemplate() {
    const element = new Share();
    element.setAttribute('authors', this.authors);
    return element.render();
  }

  get subscribeTemplate() {
    return html`
      <a
        class="w-actions__fab w-actions__fab--subscribe gc-analytics-event"
        data-category="web.dev"
        data-label="subscribe, newsletter"
        data-action="click"
        href="/newsletter/"
      >
        <span>Subscribe</span>
      </a>
    `;
  }

  render() {
    const actions = splitPipes(this.actions);
    const parts = [];

    if (actions.indexOf('share') !== -1) {
      parts.push(this.shareTemplate);
    }

    if (actions.indexOf('subscribe') !== -1) {
      parts.push(this.subscribeTemplate);
    }

    return html`
      <div class="w-actions">
        ${parts}
      </div>
    `;
  }
}

customElements.define('web-actions', Actions);
