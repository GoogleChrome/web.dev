import {html} from "lit-element";
import {store} from "../../store";
import {BaseElement} from "../BaseElement";
import {updateUrl} from "../../fb";
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
    };
  }

  constructor() {
    super();
    this.url = null; // when signed out or waiting for Firestore, this is null
    this.active = false;

    store.subscribe(this.onStateChanged.bind(this));
    this.onStateChanged();
  }

  render() {
    return html`
      <web-url-chooser
        .url=${this.url}
        .disabled=${this.active}
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
  }

  runAudit(e) {
    const url = e.detail;

    // We're writing the user's new URL choice to local state, but also kicking
    // off a Lighthouse run here. We store the active URL running through
    // Lighthouse as their preferred URL could change because of another
    // browser, and this prevents results being appropritioned to the wrong URL.

    // TODO(samthor): This should happen in a controller setting.
    store.setState({
      userUrl: url,
      activeLighthouseUrl: url,
    });
    updateUrl(url);

    // TODO: actually run Lighthouse. Currently just freezes the page.
    console.warn("web-url-chooser in terminal state: should run Lighthouse");
  }
}

customElements.define("web-url-chooser-container", UrlChooserContainer);
