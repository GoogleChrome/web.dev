/**
 * @fileoverview Element that renders share action.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {splitPipes} from '../../utils/split-pipes';
import {isWebShareSupported} from '../../utils/web-share';

/**
 * Renders share action. This is expected to be created by
 * page content.
 *
 * @extends {BaseElement}
 * @final
 */
export class Share extends BaseElement {
  static get properties() {
    return {
      // Pipe-seperated handles of authors of this page, including "@" if e.g. a Twitter user
      authors: {type: String},
      // Whether the Web Share API is supported
      _webShareSupported: {type: Boolean},
    };
  }

  constructor() {
    super();
    this._webShareSupported = isWebShareSupported();
  }

  onShare(e) {
    e.preventDefault();
    window.open(e.target.href, 'share-window', 'width=550,height=235');
  }

  onTwitterShare(e) {
    e.preventDefault();
    window.open(e.target.href, 'share-twitter', 'width=550,height=235');
  }

  onWebShare() {
    navigator.share({
      url: this.shareUrl,
      text: this.shareText,
    });
  }

  get shareUrl() {
    return window.location.href;
  }

  get shareText() {
    let authorText = '';

    const authors = splitPipes(this.authors);
    if (authors.length) {
      // ListFormat isn't widely supported; feature-detect it first
      if ('ListFormat' in Intl) {
        const il = new Intl.ListFormat('en');
        authorText = ` by ${il.format(authors)}`;
      } else {
        authorText = ` by ${authors.join(', ')}`;
      }
    }

    return document.title + authorText;
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
    return this.shareTemplate;
  }
}

customElements.define('web-share', Share);
