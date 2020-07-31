import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import './_styles.scss';

/**
 * @fileoverview Displays the primary URL chooser for Lighthouse.
 */
class UrlChooser extends BaseElement {
  static get properties() {
    return {
      url: {type: String},
      switching: {type: Boolean, reflect: true},
      hasError: {type: Boolean},
      disabled: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.url = null; // when signed out or waiting for Firestore, this is null
    this.switching = true; // controls whether the user is editing the URL
    this.disabled = false; // disables buttons (because Lighthouse is active)

    // non-properties (stolen DOM nodes)
    /** @type HTMLInputElement | null */
    this._urlInput;
    /** @type HTMLButtonElement | null */
    this._runLighthouseButton;
    this.hasError = false;
  }

  render() {
    return html`
      <div class="lh-report-header-enterurl">
        <div class="lh-enterurl lh-enterurl--selected">${this.url}</div>
        <div class="lh-enterurl lh-enterurl--switch">
          <input
            ?disabled=${this.disabled}
            type="url"
            class="lh-input"
            name="url"
            placeholder="Enter a web page URL"
            pattern="https?://.*"
            minlength="7"
            @keyup="${this.onUrlKeyup}"
          />
          <button
            ?disabled=${this.disabled}
            class="lh-enterurl__close gc-analytics-event"
            data-category="web.dev"
            data-label="measure, remove url"
            data-action="click"
            aria-label="Remove URL"
            @click=${this.onClearInput}
          ></button>
        </div>
        <div class="lh-controls">
          <button
            ?disabled=${this.disabled}
            class="w-button w-button--secondary gc-analytics-event"
            data-category="web.dev"
            data-label="measure, switch url"
            data-action="click"
            @click=${this.onSwitchUrl}
          >
            Switch URL
          </button>
          <button
            ?disabled=${this.disabled}
            class="w-button w-button--primary gc-analytics-event"
            data-category="web.dev"
            data-label="measure, run audit"
            data-action="click"
            id="run-lh-button"
            @click=${this.onRequestAudit}
          >
            Run Audit
          </button>
        </div>
      </div>
    `;
  }

  firstUpdated() {
    this._urlInput = this.renderRoot.querySelector('input[type="url"]');
    this._runLighthouseButton = this.renderRoot.querySelector('#run-lh-button');
  }

  updated(changedProperties) {
    const input = this._urlInput;

    if (changedProperties.has('hasError')) {
      if (this.hasError) {
        // hasError false -> true implies switching, but not the other way around
        this.switching = true;
      }
    }
    if (changedProperties.has('switching') && this.switching) {
      input?.setSelectionRange(0, input?.value.length);
      input?.focus();
    }
    if (changedProperties.has('url')) {
      // Note: This behavior can't be performed in a setter as the <input /> might not have been
      // rendered yet.
      const url = this.url;
      if (this.switching && url && input && !input?.value) {
        // if the user has just signed in, the element was in an initial state,
        // AND the user hasn't typed anything, reset element with URL
        input.value = url;
        this.switching = false;
      } else if (url === null && !this.switching && input) {
        // if the user has signed out, clear the href and enter switching mode
        input.value = '';
        this.switching = true;
      } else if (!this.switching && input) {
        // in all other cases, only update the URL if ther user isn't switching
        input.value = url;
      }
    }
  }

  onRequestAudit() {
    // Even if the user isn't switching URLs, fix and verify the saved URL which is inserted into
    // the <input /> inside this element.
    this.fixUpUrl();
    if (!this._urlInput?.validity.valid) {
      const detail =
        'Invalid URL. Please enter a full URL starting with https://.';
      const event = new CustomEvent('web-error', {bubbles: true, detail});
      this.dispatchEvent(event);
      return;
    }

    // "Request Audit" finishes editing the URL.
    this.switching = false;

    const event = new CustomEvent('audit', {detail: this._urlInput.value});
    this.dispatchEvent(event);
  }

  onSwitchUrl() {
    this.switching = true;

    // Focus won't occur if switching is already true, so trigger it here too.
    this._urlInput?.focus();
  }

  onUrlKeyup(e) {
    if (e.key === 'Escape') {
      this.onClearInput();
    } else if (e.key === 'Enter') {
      this._runLighthouseButton?.click();
    }
  }

  /**
   * Performs basic sanity fixes on the URL in the <input />.
   */
  fixUpUrl() {
    let url = this._urlInput?.value.trim();
    if (!url?.startsWith('https://') && !url?.startsWith('http://')) {
      url = `http://${url}`;
    }
    if (url !== this._urlInput?.value && this._urlInput) {
      this._urlInput.value = url;
    }
  }

  onClearInput() {
    if (this._urlInput) {
      this._urlInput.value = '';
    }
  }
}

customElements.define('web-url-chooser', UrlChooser);
