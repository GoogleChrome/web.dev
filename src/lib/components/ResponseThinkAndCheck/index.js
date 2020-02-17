import {html} from "lit-element";
import {BaseResponseElement} from "../BaseResponseElement";

/* eslint-disable require-jsdoc */
class ResponseThinkAndCheck extends BaseResponseElement {
  render() {
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
