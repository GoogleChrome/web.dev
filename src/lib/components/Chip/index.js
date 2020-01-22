/**
 * @fileoverview Chip element
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

/**
 * Chip element
 * @extends {BaseElement}
 * @final
 */
class Chip extends BaseElement {
  static get properties() {
    return {
      active: {type: Boolean},
      title: {type: String},
      href: {type: String},
    };
  }

  constructor() {
    super();
  }

  render() {
    return this.active
      ? html`
          <span active class="web-chip">${this.title}</span>
        `
      : html`
          <a class="web-chip" href="${this.href || "#"}">${this.title}</a>
        `;
  }
}

customElements.define("web-chip", Chip);
