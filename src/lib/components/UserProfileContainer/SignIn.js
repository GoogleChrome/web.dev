import {BaseElement} from '../BaseElement';
import {html} from 'lit-element';
import {signIn} from '../../fb';

/* eslint-disable require-jsdoc */
class SignIn extends BaseElement {
  render() {
    return html`
      <button @click="${signIn}">Sign in</button>
    `;
  }
}

// Register the new element with the browser.
customElements.define('web-sign-in', SignIn);
