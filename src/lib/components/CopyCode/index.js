/**
 * @fileoverview Element that renders copyable code.
 */

import {BaseElement} from "../BaseElement";
import "./_styles.scss";

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
      this.copyButton = document.createElement("button");
      this.copyButton.setAttribute("aria-label", "Copy code");
      this.copyButton.className = "web-copy-code__button";
      this.copyButton.addEventListener("click", this.onCopy);
      this.prepend(this.copyButton);
    }
  }

  onCopy() {
    window.getSelection().removeAllRanges();
    const range = document.createRange();
    range.selectNode(this.querySelector("code"));
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
}

customElements.define("web-copy-code", CopyCode);
