import {html} from "lit-element";
import {store} from "../../store";
import {BaseElement} from "../BaseElement";
import {userRef, firebase} from "../../fb";

/* eslint-disable require-jsdoc */
class UrlChooser extends BaseElement {
  static get properties() {
    return {
      href: {type: String},
      switching: {type: Boolean, reflect: true},
      active: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.href = null; // when signed out or waiting for Firestore, this is null
    this.switching = true;
    this.active = false;

    // non-properties
    this.urlInput = null;
    this.runLighthouseButton = null;

    store.subscribe(this.onStateChanged.bind(this));
    this.onStateChanged();
  }

  render() {
    return html`
      <div class="report_header_enterurl">
        <div class="lh-enterurl lh-enterurl--selected">${this.href}</div>
        <div class="lh-enterurl lh-enterurl--switch">
          <input
            type="url"
            class="lh-input"
            .value="${this.href}"
            placeholder="Enter a web page URL"
            pattern="https?://.*"
            minlength="7"
            @keyup="${this.onUrlKeyup}"
          />
          <button
            class="lh-enterurl__close"
            aria-label="Remove URL"
            @click=${this.clearInput}
          ></button>
        </div>
        <div class="lh-controls">
          <button
            ?disabled=${this.active}
            class="w-button w-button--secondary"
            @click=${this.switchUrl}
          >
            Switch URL
          </button>
          <button
            ?disabled=${this.active}
            class="w-button w-button--primary"
            id="run-lh-button"
            @click=${this.runAudit}
          >
            Run Audit
          </button>
        </div>
      </div>
    `;
  }

  updated() {
    this.urlInput = this.renderRoot.querySelector('input[type="url"]');
    this.runLighthouseButton = this.renderRoot.querySelector("#run-lh-button");
  }

  onStateChanged() {
    const state = store.getState();
    const urlInputValue = this.urlInput ? this.urlInput.value : null;

    if (this.active) {
      // do nothing, the URL is being run through Lighthouse
    } else if (
      this.href == null &&
      this.switching &&
      state.userUrl &&
      !urlInputValue
    ) {
      // if the user has just signed in, the element was in an initial state,
      // AND the user hasn"t typed anything, reset element with URL
      this.href = state.userUrl;
      this.switching = false;
    } else if (state.userUrl == null && !this.switching) {
      // if the user has signed out, clear the href and enter switching mode
      this.href = null;
      this.switching = true;
    } else if (state.userUrl && !this.switching) {
      // in all other cases, only update the URL if ther user isn"t switching
      this.href = state.userUrl;
    }
  }

  runAudit() {
    if (this.switching) {
      if (!this.fixUpAndValidateUrl()) {
        return;
      }

      // write URL to firestore and local
      const url = this.urlInput.value;
      store.setState({userUrl: url});
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

      this.switching = false;
    }

    // TODO: actually run Lighthouse. Currently just freezes the page.
    this.active = true;
    console.warn("web-url-chooser in terminal state: should run Lighthouse");
  }

  switchUrl() {
    this.switching = true;

    const input = this.urlInput;
    input.setSelectionRange(0, input.value.length);
    input.focus();

    if (document.activeElement !== input) {
      // nb. will fail in Shadow DOM mode
      window.requestAnimationFrame(() => {
        input.focus();
      });
    }
  }

  onUrlKeyup(e) {
    if (e.key === "Escape") {
      this.clearInput();
    } else if (e.key === "Enter") {
      this.runLighthouseButton.click();
    }
  }

  fixUpAndValidateUrl() {
    let url = this.urlInput.value.trim();
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      url = `http://${url}`;
    }

    this.href = url;
    if (url !== this.urlInput.value) {
      // Could also call this.update() here, this just short-circuits the change.
      this.urlInput.value = url;
    }

    if (!this.urlInput.validity.valid) {
      const detail = `Invalid URL. Please enter a full URL starting with https://.`;
      const ce = new CustomEvent("web-error", {bubbles: true, detail});
      this.dispatchEvent(ce);
      return false;
    }

    return true;
  }

  clearInput() {
    this.href = "";
  }
}

customElements.define("web-url-chooser", UrlChooser);
