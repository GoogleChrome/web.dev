import {LitElement, html} from 'lit-element';
import './ProfileSwitcher';
import './SignIn';
import {store} from '../../store';

/* eslint-disable require-jsdoc */
class UserProfile extends LitElement {
  static get properties() {
    return {
      isSignedIn: {type: Boolean},
    };
  }

  constructor() {
    super();
    store.subscribe(this.onStateChanged.bind(this));
    this.onStateChanged();
  }

  render() {
    if (this.isSignedIn) {
      return html`
        <web-profile-switcher></web-profile-switcher>
      `;
    } else {
      return html`
        <web-sign-in></web-sign-in>
      `;
    }
  }

  onStateChanged() {
    const state = store.getState();
    this.isSignedIn = state.isSignedIn;
  }
}

customElements.define('web-user-profile', UserProfile);
