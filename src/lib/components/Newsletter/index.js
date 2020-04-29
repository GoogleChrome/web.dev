/**
 * @fileoverview Element that renders copyable code.
 */

import {BaseElement} from '../BaseElement';
import {debounce} from '../../utils/debounce';

/**
 * Renders code block that can easily be copied.
 *
 * @extends {BaseElement}
 * @final
 */
class Newsletter extends BaseElement {
  constructor() {
    super();
    this.setHeight = debounce(this.setHeight.bind(this), 100);
  }

  connectedCallback() {
    super.connectedCallback();
    this.iframe = this.querySelector('iframe');
    this.iframe.scrolling = 'no';
    this.setHeight();
    window.addEventListener('resize', this.setHeight);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.setHeight);
  }

  setHeight() {
    this.iframe.height = this.iframe.contentWindow.document.body.scrollHeight;
  }
}

customElements.define('web-newsletter', Newsletter);
