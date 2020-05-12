import {LitElement} from 'lit-element';

/* eslint-disable require-jsdoc */
export class BaseElement extends LitElement {
  constructor() {
    super();
  }

  createRenderRoot() {
    // Disable shadow DOM.
    // Instead templates will be rendered in the light DOM.
    return this;
  }
}
