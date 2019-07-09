import {LitElement, html} from 'lit-element';

/* eslint-disable require-jsdoc */
class ProfileSwitcher extends LitElement {
  render() {
    return html`
      <p>The user is signed in!</p>
    `;
  }
}

customElements.define('web-profile-switcher', ProfileSwitcher);
