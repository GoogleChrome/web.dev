/**
 * @fileoverview Element that renders codelab expandable/collapsible codelab
 * instructions and an embedded Glitch iframe.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

/** @const {string} */
const GLITCH_ORIGIN = "https://glitch.com";
/** @const {string} */
const GLITCH_EMBED = `${GLITCH_ORIGIN}/embed/#!/embed`;

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
    const container = document.createElement("div");
    container.className = "web-codelab__glitch";
    this.appendChild(container);
    return container;
  }

  get src() {
    if (!this.glitch) {
      return;
    }

    const url = new URL(`${GLITCH_EMBED}/${this.glitch}`);
    url.searchParams.append("path", this.path);
    url.searchParams.append("attributionHidden", true);
    return url.href;
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
