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
  static get properties() {
    return {
      code: {type: String},
    };
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");

    if (this.firstChild) {
      const copyButton = document.createElement("input");
      copyButton.setAttribute("type", "button");
      copyButton.setAttribute("tabindex", "0");
      copyButton.className = "w-copy-code-button";

      this.firstChild.prepend(copyButton);

      this.addEventListener("click", (e) => {
        if (e.target === copyButton) {
          e.preventDefault();
          this.copyCode();
        }
      });
    }
  }

  copyCode() {
    const textarea = document.createElement("textarea");
    textarea.value = decodeURIComponent(this.code);
    textarea.setAttribute("readonly", "");
    textarea.style.cssText = "position: fixed; bottom: -80px; height: 80px;";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

customElements.define("copy-code", CopyCode);
