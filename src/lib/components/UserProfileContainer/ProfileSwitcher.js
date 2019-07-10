import {BaseElement} from '../BaseElement';
import {html} from 'lit-element';
import {signIn, signOut} from '../../fb';

/* eslint-disable require-jsdoc */
class ProfileSwitcher extends BaseElement {
  static get properties() {
    return {
      expanded: {type: Boolean},
      user: {type: Object},
    };
  }

  render() {
    return html`
      <button @click="${() => this.expanded = !this.expanded}">
        <img
          style="width: 32px; height: 32px; border-radius: 50%"
          src="${this.user.photoURL}"
        >
      </button>
      ${this.expanded ? this.expandedTemplate : ''}
    `;
  }

  get expandedTemplate() {
    return html`
      <div>
        <div>
          <div>
            <img
              style="width: 92px; height: 92px; border-radius: 50%"
              src="${this.user.photoURL}"
            >
          </div>
          <div>
            <strong>${this.user.displayName}</strong>
            <div>${this.user.email}</div>
            <div>
            <a
              href="https://myaccount.google.com"
              target="_blank"
            >
              Google Account
            </a>
            </div>
          </div>
        </div>
        <div>
          <button @click="${signIn}">Change accounts</button>
          <button @click="${signOut}">Sign out</button>
        </div>
      </div>
    `;
  }
}

customElements.define('web-profile-switcher', ProfileSwitcher);
