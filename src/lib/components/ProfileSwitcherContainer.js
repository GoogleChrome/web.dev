import {BaseElement} from './BaseElement';
import {html} from 'lit-element';
import {signIn} from '../fb';
import {store} from '../store';
import './ProfileSwitcher';

/* eslint-disable require-jsdoc */
class ProfileSwitcherContainer extends BaseElement {
  static get properties() {
    return {
      checkingSignedInState: {type: Boolean},
      isSignedIn: {type: Boolean},
      user: {type: Object},
    };
  }

  constructor() {
    super();
    store.subscribe(this.onStateChanged.bind(this));
    this.onStateChanged();
  }

  render() {
    if (this.checkingSignedInState) {
      return '';
    }

    if (this.isSignedIn) {
      return html`
        <web-profile-switcher .user="${this.user}"></web-profile-switcher>
      `;
    } else {
      return html`
        <button class="w-profile-signin" @click="${signIn}">Sign in</button>
      `;
    }
  }

  onStateChanged() {
    const state = store.getState();
    this.checkingSignedInState = state.checkingSignedInState;
    this.isSignedIn = state.isSignedIn;
    this.user = state.user;
  }
}

customElements.define(
  'web-profile-switcher-container', ProfileSwitcherContainer);
