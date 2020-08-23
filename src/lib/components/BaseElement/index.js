import {LitElement} from 'lit-element';

/* eslint-disable require-jsdoc */
export class BaseElement extends LitElement {
  constructor() {
    super();
  }

  /**
   * @param {Map<string | number | symbol, unknown>} changedProperties
   */
  firstUpdated(changedProperties) {
    this.classList.remove('unresolved');
    super.firstUpdated(changedProperties);
  }

  createRenderRoot() {
    // Disable shadow DOM.
    // Instead templates will be rendered in the light DOM.
    return this;
  }
}
