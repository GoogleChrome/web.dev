/**
 * @fileoverview Element that wraps another element and adds a share action on click.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {isWebShareSupported} from '../../utils/web-share';

/**
 * Renders share element. It renders its children as content of the element.
 *
 * @extends {BaseElement}
 * @final
 */
class ShareAction extends BaseElement {
  static get properties() {
    return {
      // Comma-seperated handles of authors of the content to be shared, including "@" if e.g. a Twitter user
      authors: {type: String},
      // Whether the Web Share API is supported
      webShareSupported: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.webShareSupported = isWebShareSupported();
  }

  onWebShare(e) {
    e.preventDefault();
    navigator.share({
      url: this.shareUrl,
      text: this.shareText,
    });
  }

  onTwitterShare(e) {
    const url = new URL('https://twitter.com/share');
    url.searchParams.set('url', this.shareUrl);
    url.searchParams.set('text', this.shareText);
    e.preventDefault();
    window.open(url, 'share-twitter', 'width=550,height=235');
  }

  get shareUrl() {
    return window.location.href;
  }

  get shareText() {
    let authorText = '';
    if (this.authors && this.authors.length) {
      const authors = this.authors
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);
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

  // Extracting this function makes linter happy by avoiding double html`` call.
  renderChild(el) {
    return html`
      ${el}
    `;
  }

  render() {
    return html`
      <div
        @click=${this.webShareSupported ? this.onWebShare : this.onTwitterShare}
      >
        ${Array.from(this.children).map((el) => this.renderChild(el))}
      </div>
    `;
  }
}

customElements.define('share-action', ShareAction);
