/**
 * @fileoverview Element that adds a share action on click.
 */

import {isWebShareSupported} from '../../utils/web-share';

/**
 * Renders share element. This simply adds behavaior to share, and does not
 * render any HTML.
 *
 * @extends {HTMLElement}
 * @final
 */
class ShareAction extends HTMLElement {
  constructor() {
    super();
    const webShareSupported = isWebShareSupported();

    // Add "share" or "twitter" to the data-label of this element, for Analytics.
    let label = this.getAttribute('data-label') || '';
    if (label) {
      label += ', ';
    }
    label += webShareSupported ? 'share' : 'twitter';
    this.setAttribute('data-label', label);

    const handler = webShareSupported ? this.onWebShare : this.onTwitterShare;
    this.addEventListener('click', handler.bind(this));
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
    window.open(url.toString(), 'share-twitter', 'width=550,height=235');
  }

  get shareUrl() {
    return window.location.href;
  }

  get shareText() {
    // Check for a custom message.
    const messageText = this.getAttribute('message');
    if (messageText && messageText.length) {
      return messageText;
    }

    // If no custom message is found, fallback to using the page title
    // plus the author's names.
    let authorText = '';
    const rawAuthors = this.getAttribute('authors') || '';
    if (rawAuthors && rawAuthors.length) {
      const authors = rawAuthors
        .split('|')
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
}

customElements.define('share-action', ShareAction);
