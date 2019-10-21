/**
 * @fileoverview Element that renders configurable per-page actions.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";

function isWebShareSupported() {
  if (!("share" in navigator)) {
    return false;
  }

  // Ensure that the user would be able to share a reference URL.
  // This is part of Web Share Level 2, so feature-detect it:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=903010
  if ("canShare" in navigator) {
    const url = `https://${window.location.hostname}`;
    return navigator.canShare({url});
  }

  return true;
}

/**
 * Renders configurable per-page actions.
 *
 * @extends {BaseElement}
 * @final
 */
class Actions extends BaseElement {
  static get properties() {
    return {
      // Space-separated list of actions to support
      actions: {type: String},
      // Whether the Web Share API is supported
      webShareSupported: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.webShareSupported = isWebShareSupported();
  }

  onWebShare() {
    navigator.share({
      url: window.location.href,
      text: document.title,
    });
  }

  onTwitterShare(e) {
    e.preventDefault();
    window.open(e.target.href, "share-twitter", "width=550,height=235");
  }

  get shareTemplate() {
    if (this.webShareSupported) {
      return html`
        <button
          class="w-actions__fab w-actions__fab--share"
          @click=${this.onWebShare}
        >
          <span>Share</span>
        </button>
      `;
    }

    // Otherwise, fall back to a Twitter popup.
    const url = new URL("https://twitter.com/share");
    url.searchParams.set("url", window.location.href);
    url.searchParams.set("text", document.title);
    return html`
      <a
        class="w-actions__fab w-actions__fab--share"
        href="${url}"
        target="_blank"
        @click=${this.onTwitterShare}
      >
        <span>Share</span>
      </a>
    `;
  }

  get subscribeTemplate() {
    return html`
      <a
        class="w-actions__fab w-actions__fab--subscribe"
        href="https://web.dev/subscribe"
      >
        <span>Subscribe</span>
      </a>
    `;
  }

  render() {
    const actions = this.actions.split(/\s+/).filter(Boolean);
    const parts = [];

    if (actions.indexOf("share") !== -1) {
      parts.push(this.shareTemplate);
    }

    if (actions.indexOf("subscribe") !== -1) {
      parts.push(this.subscribeTemplate);
    }

    return html`
      <div class="w-actions">
        ${parts}
      </div>
    `;
  }
}

customElements.define("web-actions", Actions);
