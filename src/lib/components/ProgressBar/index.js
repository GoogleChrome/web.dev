import {BaseElement} from "../BaseElement";
import {html} from "lit-element";

/**
 * A progress indicator element.
 */
class ProgressBar extends BaseElement {
  render() {
    html`
      <div class="web-progress-bar-wrapper">
        <div class="web-progress-bar-indeterminate"></div>
      </div>
    `;
  }

  firstUpdated() {
    this.setAttribute("role", "progressbar");
  }
}

customElements.define("web-progress-bar", ProgressBar);
