import {html} from "lit-element";
import {BaseResponseElement} from "../BaseResponseElement";

/* eslint-disable require-jsdoc */
class ResponseThinkAndCheck extends BaseResponseElement {
  connectedCallback() {
    // Unlike other response types,
    // Think-and-checks don't have any actual response elements,
    // so they can only be answeredCorrectly (default) or completed.
    this.state = "answeredCorrectly";

    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.rationale = [];

      for (const child of this.children) {
        if (child.getAttribute("data-role") === "rationale") {
          child.className =
            "web-response__option-rationale web-response__option-rationale--standalone";
          this.rationale.push(child);
        } else {
          this.prerenderedChildren.push(child);
        }
      }
    }

    return html`
      ${this.prerenderedChildren} ${this.rationale}
    `;
  }
}

customElements.define("web-response-tac", ResponseThinkAndCheck);
