import {html} from "lit-element";
import {store} from "../../store";
import {BaseElement} from "../BaseElement";
import {requestRunLighthouse} from "../../actions";
import "../UrlChooser";

/**
 * @fileoverview Manages state interaction with UrlChooser.
 *
 * Invokes Lighthouse when the UrlChooser requests it, possibly with an updated URL.
 */

/* eslint-disable require-jsdoc */
class UrlChooserContainer extends BaseElement {
  static get properties() {
    return {
      url: {type: String},
      active: {type: Boolean},
      hasError: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.onStateChanged = this.onStateChanged.bind(this);

    this.url = null; // when signed out or waiting for Firestore, this is null
    this.active = false;
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
    return html`
      <web-url-chooser
        .url=${this.url}
        .disabled=${this.active}
        .hasError=${this.hasError}
        @audit=${this.runAudit}
      ></web-url-chooser>
    `;
  }

  onStateChanged() {
    const state = store.getState();

    // As userUrl can change (a signed-in user can modify it in another browser
    // window), _prefer_ any URL that's currently being run through Lighthouse.
    // This will prevent e.g. "foo.com" (after a user has hit "Run Audit") being
    // replaced by "bar.com" (which is run in another browser window), and then
    // results being approprtioned to the wrong URL.

    this.url = state.activeLighthouseUrl || state.userUrl;
    this.active = state.activeLighthouseUrl !== null;
    this.hasError = Boolean(state.lighthouseError);
  }

  runAudit(e) {
    const url = e.detail;
    requestRunLighthouse(url);
  }
}

customElements.define("web-url-chooser-container", UrlChooserContainer);
