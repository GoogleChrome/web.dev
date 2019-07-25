import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

/**
 * @fileoverview Displays the primary URL chooser for Lighthouse.
 */

/* eslint-disable require-jsdoc */
class UrlChooser extends BaseElement {
  static get properties() {
    return {
      url: {type: String},
      active: {type: Boolean},
      switching: {type: Boolean, reflect: true}, // FIXME: internal but must reflect as [switching]
    };
  }

  constructor() {
    super();
    this.url = null; // when signed out or waiting for Firestore, this is null
    this.switching = true; // controls whether the user is editing the URL
    this.active = false; // disables buttons (because Lighthouse is active)

    // non-properties (stolen DOM nodes)
    this._urlInput = null;
    this._runLighthouseButton = null;
  }

  render() {
    return html`
      <div class="report_header_enterurl">
        <div class="lh-enterurl lh-enterurl--selected">${this.url}</div>
        <div class="lh-enterurl lh-enterurl--switch">
          <input
            type="url"
            class="lh-input"
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
            @click=${this.requestAudit}
          >
            Run Audit
          </button>
        </div>
      </div>
    `;
  }

  updated(changedProperties) {
    this._urlInput = this.renderRoot.querySelector('input[type="url"]');
    this._runLighthouseButton = this.renderRoot.querySelector("#run-lh-button");

    if (!changedProperties.has("url")) {
      return;
    }

    const inputValue = this._urlInput.value;
    const updateUrl = this.url;

    if (this.switching && updateUrl && !inputValue) {
      // if the user has just signed in, the element was in an initial state,
      // AND the user hasn't typed anything, reset element with URL
      this._urlInput.value = updateUrl;
      this.switching = false;
    } else if (updateUrl == null && !this.switching) {
      // if the user has signed out, clear the href and enter switching mode
      this._urlInput.value = null;
      this.switching = true;
    } else if (!this.switching) {
      // in all other cases, only update the URL if ther user isn't switching
      this._urlInput.value = updateUrl;
    }
  }

  requestAudit() {
    let url = this.url;

    if (this.switching) {
      this.fixUpUrl();

      if (!this._urlInput.validity.valid) {
        const detail = `Invalid URL. Please enter a full URL starting with https://.`;
        const event = new CustomEvent("web-error", {bubbles: true, detail});
        this.dispatchEvent(event);
        return;
      }

      // if Request was pressed as part of switching, "url" still reflects prior state, so request
      // audit based on the typed URL
      this.switching = false;
      url = this._urlInput.value;
    }

    const event = new CustomEvent("audit", {detail: url});
    this.dispatchEvent(event);
  }

  switchUrl() {
    this.switching = true;

    const input = this._urlInput;
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
      this._runLighthouseButton.click();
    }
  }

  fixUpUrl() {
    let url = this._urlInput.value.trim();
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      url = `http://${url}`;
    }

    this.url = url;
    if (url !== this._urlInput.value) {
      this._urlInput.value = url;
    }
  }

  clearInput() {
    this._urlInput.value = null;
  }
}

customElements.define("web-url-chooser", UrlChooser);
