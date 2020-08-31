/**
 * @fileoverview Element that renders copyable code.
 */

import {BaseElement} from '../BaseElement';
import './_styles.scss';

/**
 * Renders code block that can easily be copied.
 *
 * @extends {BaseElement}
 * @final
 */
class CopyCode extends BaseElement {
  constructor() {
    super();
    this.onCopy = this.onCopy.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.copyButton) {
      this.copyButton = document.createElement('button');
      this.copyButton.className =
        'w-button--icon w-button--round web-copy-code__button';
      // Set aria-label because title isn't accessible to sighted keyboard users
      // and the tooltip is only visible on focus,
      // which means it isn't read reliably by screen readers.
      this.copyButton.setAttribute('aria-label', 'Copy code');
      this.copyButton.addEventListener('click', this.onCopy);

      this.tooltip = document.createElement('span');
      this.tooltip.className = 'w-tooltip w-tooltip--right';
      this.tooltip.setAttribute('role', 'tooltip');
      this.tooltip.textContent = 'Copy code';
      this.copyButton.append(this.tooltip);

      this.prepend(this.copyButton);
    }
  }

  onCopy() {
    window.getSelection().removeAllRanges();
    const range = document.createRange();
    range.selectNode(this.querySelector('code'));
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }
}

customElements.define('web-copy-code', CopyCode);
