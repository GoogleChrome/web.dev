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
    this.adjustIFrame = debounce(this.adjustIFrame.bind(this), 100);
  }

  connectedCallback() {
    super.connectedCallback();
    this.iframe = this.querySelector('iframe');
    this.adjustIFrame();
    window.addEventListener('resize', this.adjustIFrame);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.adjustIFrame);
  }

  adjustIFrame() {
    if (this.iframe.scrolling !== 'no') {
      this.iframe.scrolling = 'no';
    }
    this.iframe.height = this.iframe.contentWindow.document.body.scrollHeight;
  }
}

customElements.define('web-newsletter', Newsletter);
