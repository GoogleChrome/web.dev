import {html} from "lit-element";
import {BaseResponseElement} from "../BaseResponseElement";
import "./_styles.scss";

/* eslint-disable require-jsdoc */
class ResponseThinkAndCheck extends BaseResponseElement {
  constructor() {
    super();
    this.prerenderedChildren = null;
    this.option = null;

    this.reset = this.reset.bind(this);
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
    // Think-and-checks don't have any options,
    // so they can only be answeredCorrectly (default) or completed.
    this.state = "answeredCorrectly";
  }

  // Override BaseResponseElement since Think-and-checks have no options
  // and so are answeredCorrectly by default.
  reset() {
    super.reset();
    this.state = "answeredCorrectly";
  }
}

customElements.define("web-response-tac", ResponseThinkAndCheck);
