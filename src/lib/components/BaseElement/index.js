import {LitElement} from 'lit-element';

/* eslint-disable require-jsdoc */
export class BaseElement extends LitElement {
  constructor() {
    super();
  }

  firstUpdated() {
    this.classList.remove('unresolved');
    super.firstUpdated();
  }

  createRenderRoot() {
    // Disable shadow DOM.
    // Instead templates will be rendered in the light DOM.
    return this;
  }
}
