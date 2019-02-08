import {LitElement} from 'lit-element';

export class BaseElement extends LitElement {
  createRenderRoot() {
    /**
     * Render template in light DOM. Note that shadow DOM features like 
     * encapsulated CSS are unavailable.
     */
    return this;
  }
}
