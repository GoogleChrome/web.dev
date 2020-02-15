import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

/* eslint-disable require-jsdoc */
class ResponseThinkAndCheck extends BaseElement {
  static get properties() {
    return {
      cardinality: {type: String},
      columns: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.prerenderedChildren = null;
    this.rationale = null;
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.rationale = [];

      for (const child of this.children) {
        if (child.getAttribute("data-role") === "rationale") {
          this.rationale.push(child);
        } else {
          this.prerenderedChildren.push(child);
        }
      }
    }

    return html`
      ${this.prerenderedChildren}
      <div class="web-mc__option-rationale">
        ${this.rationale}
      </div>
    `;
  }
}

customElements.define("web-response-tac", ResponseThinkAndCheck);
