import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

class AssessmentQuestion extends BaseElement {
  constructor() {
    super();
    this.prerenderedChildren = null;
  }

  render() {
    let responses = 0;

    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];

      for (const child of this.children) {
        // If any question components require a response,
        // disable the Check button.
        if (child.getAttribute("correct-answers")) responses++;
        this.prerenderedChildren.push(child);
      }
    }

    return html`
      <div class="web-question__content">
        ${this.prerenderedChildren}
      </div>
      <div class="web-question__footer">
        <span></span>
        <button
          class="w-button w-button--primary"
          data-role="sa-item-cta"
          data-action="check-sa-item"
          ?disabled="${responses}"
        >
          Check
        </button>
      </div>
    `;
  }
}

customElements.define("web-question", AssessmentQuestion);
