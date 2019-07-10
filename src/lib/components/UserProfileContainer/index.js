import {BaseElement} from '../BaseElement';
import {html} from 'lit-element';
import './ProfileSwitcher';
import './SignIn';
import {store} from '../../store';

/* eslint-disable require-jsdoc */
class UserProfileContainer extends BaseElement {
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
        <web-sign-in></web-sign-in>
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

customElements.define('web-user-profile', UserProfileContainer);
