import {LitElement, html} from 'lit-element';
import {signIn} from '../../store.js';

/* eslint-disable require-jsdoc */
class SignIn extends LitElement {
  render() {
    return html`
      <button @click="${signIn}">Sign in</button>
    `;
  }
}

// Register the new element with the browser.
customElements.define('web-sign-in', SignIn);
