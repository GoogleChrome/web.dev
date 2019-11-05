/**
 * @fileoverview Element that renders codelab expandable/collapsible codelab
 * instructions and an embedded Glitch iframe.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

/**
 * Render codelab instructions and Glitch
 * @extends {BaseElement}
 * @final
 */
class Codelab extends BaseElement {
  static get properties() {
    return {
      // Name of the glitch to render in the iframe.
      glitch: {type: String},
      // The file to show when the Glitch renders.
      path: {type: String},
    };
  }

  constructor() {
    super();

    this.glitch = "";
    this.path = "index.html";
  }

  createRenderRoot() {
    // Normally LitElement will remove any light DOM children that are not
    // slotted when we call render().
    // Because we don't use slots, and we _do_ want to preserve this element's
    // light DOM children (they hold the codelab instructions) we create a new
    // renderRoot for LitElement.
    // https://lit-element.polymer-project.org/guide/templates#renderroot
    // This will render the glitch element as a sibling to the existing light
    // DOM children.
    const container = document.createElement("div");
    container.className = "web-codelab__glitch";
    this.appendChild(container);
    return container;
  }

  get src() {
    if (!this.glitch) {
      return;
    }

    let url = `https://glitch.com/embed/?attributionHidden=true`;

    if (this.path) {
      url += `&path=${encodeURI(this.path)}`;
    }

    url += `#!/embed/${encodeURI(this.glitch)}`;

    return url;
  }

  render() {
    return html`
      <div style="height: 100%; width: 100%;">
        <iframe
          allow="geolocation; microphone; camera; midi; encrypted-media"
          src="${this.src}"
          alt="Embedded glitch ${this.glitch}"
          style="height: 100%; width: 100%; border: 0;"
        >
        </iframe>
      </div>
    `;
  }
}

customElements.define("web-codelab", Codelab);
