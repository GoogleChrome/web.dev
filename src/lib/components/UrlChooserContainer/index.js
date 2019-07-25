import {html} from "lit-element";
import {store} from "../../store";
import {BaseElement} from "../BaseElement";
import {userRef, firebase} from "../../fb";
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
        .active=${this.active}
        @audit=${this.runAudit}
      ></web-url-chooser>
    `;
  }

  onStateChanged() {
    const state = store.getState();

    // if Lighthouse is active, ignore changes to the URL from Firestore
    this.url = state.activeLighthouseUrl || state.userUrl;
    this.active = state.activeLighthouseUrl !== null;
  }

  runAudit(e) {
    const url = e.detail;

    // write URL to firestore and local
    // TODO(samthor): This should happen in a controller setting.
    store.setState({
      userUrl: url,
      activeLighthouseUrl: url,
    });
    const ref = userRef();
    if (ref) {
      const p = ref.set(
        {
          userUrl: url,
          userUrlUpdate: firebase.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true},
      );
      p.catch((err) => {
        // TODO: Firestore errors are problematic but we can still run with the new URL.
        console.warn("could not write URL", err);
      });
    }

    // TODO: actually run Lighthouse. Currently just freezes the page.
    console.warn("web-url-chooser in terminal state: should run Lighthouse");
  }
}

customElements.define("web-url-chooser-container", UrlChooserContainer);
