import {html} from "lit-element";
import {signIn} from "../../fb";
import {store} from "../../store";
import {BaseElement} from "../BaseElement";
import "../ProfileSwitcher";

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
    this.onStateChanged = this.onStateChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(this.onStateChanged);
    this.onStateChanged();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    store.unsubscribe(this.onStateChanged);
  }

  render() {
    if (this.checkingSignedInState) {
      return "";
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
  "web-profile-switcher-container",
  ProfileSwitcherContainer,
);
