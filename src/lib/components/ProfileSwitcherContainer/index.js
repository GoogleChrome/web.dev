import {html} from 'lit';
import {initialize, signIn} from '../../fb';
import {store} from '../../store';
import {BaseStateElement} from '../BaseStateElement';
import '../ProfileSwitcher';

/* eslint-disable require-jsdoc */
class ProfileSwitcherContainer extends BaseStateElement {
  static get properties() {
    return {
      isSignedIn: {type: Boolean},
      user: {type: Object},
    };
  }

  constructor() {
    super();

    // Initialize Firebase auth eagerly if the user was previously signed in.
    // Otherwise auth will be initialized when clicking the sign-in button.
    if (store.getState().isSignedIn) {
      initialize();
    }
  }

  render() {
    if (this.isSignedIn) {
      // nb. web-profile-switcher allows a null user
      return html`
        <web-profile-switcher .user="${this.user}"></web-profile-switcher>
      `;
    }

    return html`
      <button class="profile-signin" @click="${signIn}">Sign in</button>
    `;
  }

  onStateChanged({isSignedIn, user}) {
    this.isSignedIn = isSignedIn;
    this.user = user;
  }
}

customElements.define(
  'web-profile-switcher-container',
  ProfileSwitcherContainer,
);
