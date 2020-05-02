/**
 * @fileoverview Element that renders copyable code.
 */

import {BaseElement} from '../BaseElement';
import {debounce} from '../../utils/debounce';

/**
 * Resizes newsletter iframe.
 *
 * @extends {BaseElement}
 * @final
 */
class Newsletter extends BaseElement {
  constructor() {
    super();
    this.resizeIFrame = debounce(this.resizeIFrame.bind(this), 100);
  }

  connectedCallback() {
    super.connectedCallback();
    this.iframe = this.querySelector('iframe');
    this.iframe.scrolling = 'no';
    this.iframe.contentWindow.document.querySelectorAll('a').forEach((a) => {
      a.target = a.target === '_blank' ? a.target : '_parent';
    });
    this.resizeIFrame();
    window.addEventListener('resize', this.resizeIFrame);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.resizeIFrame);
  }

  resizeIFrame() {
    this.iframe.height = this.iframe.contentWindow.document.body.scrollHeight;
  }
}

customElements.define('web-newsletter', Newsletter);
