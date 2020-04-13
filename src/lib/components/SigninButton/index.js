import {html} from 'lit-element';
import {signIn} from '../../fb';
import {BaseStateElement} from '../BaseStateElement';
import './_styles.scss';

/* eslint-disable require-jsdoc */
class SigninButton extends BaseStateElement {
  static get properties() {
    return {
      checkingSignedInState: {type: Boolean},
      isSignedIn: {type: Boolean},
    };
  }

  render() {
    if (this.isSignedIn) {
      // lit-element ignores "" (prior to 2.2.2), so return an empty template.
      return html``;
    }

    // We don't set "disabled" attribute on the <button> based on this, because
    // it causes a visual transition. Just disable the action while checking.
    const action = this.checkingSignedInState ? null : signIn;

    return html`
      <button
        @click=${action}
        class="w-button w-button--secondary lh-signin-button gc-analytics-event"
        data-category="web.dev"
        data-label="measure, big sign-in"
        data-action="click"
      >
        <svg
          class="w-mr--sm"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 48 48"
          width="24"
          heigh="24"
        >
          <defs>
            <path
              id="a"
              d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
            />
          </defs>
          <clipPath id="b"><use xlink:href="#a" overflow="visible" /></clipPath>
          <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
          <path
            clip-path="url(#b)"
            fill="#EA4335"
            d="M0 11l17 13 7-6.1L48 14V0H0z"
          />
          <path
            clip-path="url(#b)"
            fill="#34A853"
            d="M0 37l30-23 7.9 1L48 0v48H0z"
          />
          <path
            clip-path="url(#b)"
            fill="#4285F4"
            d="M48 48L17 24l-4-3 35-10z"
          />
        </svg>
        Sign in with Google
      </button>
    `;
  }

  onStateChanged({checkingSignedInState, isSignedIn}) {
    this.checkingSignedInState = checkingSignedInState;
    this.isSignedIn = isSignedIn;
  }
}

customElements.define('web-signin-button', SigninButton);
