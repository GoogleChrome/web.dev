import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {signIn, signOut} from "../../fb";

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
      <button
        class="w-profile-toggle"
        @click="${() => (this.expanded = !this.expanded)}"
      >
        <img class="w-profile-toggle__photo" src="${this.user.photoURL}" />
      </button>
      ${this.expanded ? this.expandedTemplate : ""}
    `;
  }

  firstUpdated() {
    // Close the profile switcher if it's open and the user presses escape.
    this.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        if (this.expanded) {
          this.expanded = false;
        }
      }
    });

    // Close the profile switcher if it's open and the user clicks outside.
    document.addEventListener("click", (e) => {
      if (this.expanded && !this.contains(e.target)) {
        this.expanded = false;
      }
    });
  }

  get expandedTemplate() {
    /**
     * Note, the Google One Bar will also display a blurb at the top if the
     * user is signed in with a G Suite account. It does this using the
     * hosted domain property of the Google Sign-in User object.
     * https://developers.google.com/identity/sign-in/web/reference#googleusergethosteddomain
     *
     * I don't think this data is made available by Firebase auth so we don't
     * implement this feature.
     */
    return html`
      <div class="w-profile-dialog">
        <div class="w-profile-dialog__user">
          <div class="w-profile-dialog__photo-container">
            <img class="w-profile-dialog__photo" src="${this.user.photoURL}" />
          </div>
          <div class="w-profile-dialog__details">
            <div class="w-profile-dialog__name">
              ${this.user.displayName}
            </div>
            <div class="w-profile-dialog__email">
              ${this.user.email}
            </div>
            <a
              class="w-profile-dialog__privacy"
              href="https://myaccount.google.com/privacypolicy"
              target="_blank"
            >
              Privacy
            </a>
            <a
              class="w-profile-dialog__account"
              href="https://myaccount.google.com"
              target="_blank"
            >
              Google Account
            </a>
          </div>
        </div>
        <div class="w-profile-dialog__controls">
          <button class="w-profile-dialog__button" @click="${signIn}">
            Change accounts
          </button>
          <button class="w-profile-dialog__button" @click="${signOut}">
            Sign out
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define("web-profile-switcher", ProfileSwitcher);
