/**
 * @fileoverview Element that renders copyable code.
 */

import {BaseElement} from "../BaseElement";

/**
 * Renders code block that can easily be copied.
 *
 * @extends {BaseElement}
 * @final
 */
class CopyCode extends BaseElement {
  constructor() {
    super();
    this.copyCode = this.copyCode.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this.copyButton = document.createElement("button");
    this.copyButton.className = "web-copy-code__button";
    this.copyButton.addEventListener("click", this.copyCode);

    const copyContainer = document.createElement("div");
    copyContainer.className = "web-copy-code__container";
    copyContainer.append(this.copyButton);

    this.prepend(copyContainer);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.copyButton.removeEventListener("click", this.copyCode);
  }

  copyCode() {
    window.getSelection().removeAllRanges();
    const range = document.createRange();
    range.selectNode(this.querySelector("code"));
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
}

customElements.define("web-copy-code", CopyCode);
