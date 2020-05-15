/**
 * @fileoverview Element that renders configurable per-page actions.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {isWebShareSupported} from '../../utils/web-share';

/**
 * Renders configurable per-page actions. This is expected to be created by
 * page content.
 *
 * @extends {BaseElement}
 * @final
 */
class EventShare extends BaseElement {
  static get properties() {
    return {
      // Whether the Web Share API is supported
      _webShareSupported: {type: Boolean},
    };
  }

  constructor() {
    super();
    this._webShareSupported = isWebShareSupported();
  }

  onWebShare() {
    navigator.share({
      url: this.shareUrl,
      text: this.shareText,
    });
  }

  onShare(e) {
    e.preventDefault();
    window.open(e.target.href, 'share-window', 'width=550,height=235');
  }

  get shareUrl() {
    return window.location.href;
  }

  get shareText() {
    return document.title;
  }

  get shareTemplate() {
    if (this._webShareSupported) {
      return html`
        <button
          class="w-actions__fab w-actions__fab--share gc-analytics-event"
          data-category="web.dev"
          data-label="share, web"
          data-action="click"
          @click=${this.onWebShare}
        >
          <span>Share</span>
        </button>
      `;
    }

    // Otherwise, fall back to a Twitter popup.
    const url = new URL('https://twitter.com/share');
    url.searchParams.set('url', this.shareUrl);
    url.searchParams.set('text', this.shareText);
    return html`
      <a
        class="w-actions__fab w-actions__fab--share gc-analytics-event"
        data-category="web.dev"
        data-label="share, twitter"
        data-action="click"
        href="${url}"
        target="_blank"
        rel="noreferrer"
        @click=${this.onTwitterShare}
      >
        <span>Share</span>
      </a>
    `;
  }

  render() {
    return html`
      <div class="w-actions w-actions--inline">
        ${this.shareTemplate}
      </div>
    `;
  }
}

customElements.define('web-event-share', EventShare);
