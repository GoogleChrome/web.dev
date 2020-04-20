import {html} from 'lit-element';
import {signIn} from '../../fb';
import {BaseStateElement} from '../BaseStateElement';
import '../ProfileSwitcher';

/* eslint-disable require-jsdoc */
class ProfileSwitcherContainer extends BaseStateElement {
  static get properties() {
    return {
      checkingSignedInState: {type: Boolean},
      isSignedIn: {type: Boolean},
      user: {type: Object},
    };
  }

  render() {
    if (this.isSignedIn) {
      // nb. web-profile-switcher allows a null user
      return html`
        <web-profile-switcher .user="${this.user}"></web-profile-switcher>
      `;
    }

    return html`
      <button
        class="w-profile-signin"
        .disabled=${this.checkingSignedInState}
        @click="${signIn}"
      >
        Sign in
      </button>
    `;
  }

  onStateChanged({checkingSignedInState, isSignedIn, user}) {
    this.checkingSignedInState = checkingSignedInState;
    this.isSignedIn = isSignedIn;
    this.user = user;
  }
}

customElements.define(
  'web-profile-switcher-container',
  ProfileSwitcherContainer,
);
