import {LitElement} from "lit-element";

/* eslint-disable require-jsdoc */
export class BaseElement extends LitElement {
  constructor() {
    super();
  }

  /**
   * Generates a random string that can be used to ensure uniqueness of
   * the elements id on a page.
   * @param {string} idPrefix An id prefix to be followed by the generated salt.
   *     Used to check the uniqueness of the outcome id (prefix + salt).
   * @return {string} Id salt.
   */
  static generateIdSalt(idPrefix) {
    const salt = Math.random()
      .toString(36)
      .substr(2, 9);
    return document.getElementById(idPrefix + salt)
      ? BaseElement.generateIdSalt(idPrefix)
      : salt;
  }

  createRenderRoot() {
    // Disable shadow DOM.
    // Instead templates will be rendered in the light DOM.
    return this;
  }
}
