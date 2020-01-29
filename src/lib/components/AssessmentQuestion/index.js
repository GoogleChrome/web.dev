import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

class AssessmentQuestion extends BaseElement {
  constructor() {
    super();
    this.prerenderedChildren = null;
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];

      for (const child of this.children) {
        this.prerenderedChildren.push(child);
      }
    }

    return html`
      ${this.prerenderedChildren}
      <div class="web-question__footer">
        <span></span>
        <button
          class="w-button w-button--primary"
          data-role="sa-item-cta"
          data-action="check-sa-item"
          disabled
        >
          Check
        </button>
      </div>
    `;
  }
}

customElements.define("web-question", AssessmentQuestion);
