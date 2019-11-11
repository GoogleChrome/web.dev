import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

class Tabs extends BaseElement {
  render() {
    return html`
      <div class="w-tabset" role="tablist">
        <button
          class="w-tabset__tab"
          active
          role="tab"
          aria-selected="true"
          id="w-tab-1"
          aria-controls="w-tab-1-pane"
        >
          <span class="w-tabset__text-label">Sample 1</span>
        </button>
        <button
          class="w-tabset__tab"
          role="tab"
          aria-selected="false"
          tabindex="-1"
          id="w-tab-2"
          aria-controls="w-tab-2-pane"
        >
          <span class="w-tabset__text-label">Sample 2</span>
        </button>
        <button
          class="w-tabset__tab"
          role="tab"
          aria-selected="false"
          tabindex="-1"
          id="w-tab-3"
          aria-controls="w-tab-3-pane"
        >
          <span class="w-tabset__text-label">Sample 3</span>
        </button>
      </div>
    `;
  }
}

customElements.define("w-tabset", Tabs);
