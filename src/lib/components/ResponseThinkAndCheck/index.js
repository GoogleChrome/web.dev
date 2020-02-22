import {html} from "lit-element";
import {BaseResponseElement} from "../BaseResponseElement";

/* eslint-disable require-jsdoc */
class ResponseThinkAndCheck extends BaseResponseElement {
  constructor() {
    super();
    this.prerenderedChildren = null;
    this.option = null;
  }

  render() {
    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.option = [];

      for (const child of this.children) {
        if (child.getAttribute("data-role") === "rationale") {
          // To avoid complicating the Assessment rendering logic,
          // change the data-role here so TACs work with
          // the BaseResponseElement's showOptions() method.
          child.setAttribute("data-role", "option");
          child.className =
            "web-response__option-rationale web-response-tac__option-rationale";
          this.option.push(child);
        } else {
          this.prerenderedChildren.push(child);
        }
      }
    }

    return html`
      ${this.prerenderedChildren} ${this.option}
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    // Unlike other response types,
    // Think-and-checks don't have any actual response elements,
    // so they can only be answeredCorrectly (default) or completed.
    this.state = "answeredCorrectly";
  }
}

customElements.define("web-response-tac", ResponseThinkAndCheck);
