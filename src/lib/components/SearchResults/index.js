/**
 * @fileoverview An Algolia search box.
 */

import {html} from 'lit';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {BaseElement} from '../BaseElement';
import {allowHtml, escapeHtml} from '../../../lib/utils/escape-html';
import 'focus-visible';

/**
 * An Algolia search box.
 * @extends {BaseElement}
 * @final
 */
export class SearchResults extends BaseElement {
  static get properties() {
    return {
      // An array of algolia results.
      hits: {type: Object},
      // An internal array of algolia results (observable).
      hits_: {type: Object},
      // Manages showing/hiding the search results element.
      showHits: {type: Boolean},
      // Indicates which search result should be highlighted.
      // Primarily used for keyboard behavior.
      cursor: {type: Number},
    };
  }

  constructor() {
    super();
    this.hits = [];
    this.hits_ = [];
    this.showHits = false;
    this.cursor = -1;
    this.query = '';
  }

  set hits(hits) {
    this.hits_ = hits;
    this.cursor = -1;
  }

  /**
   * Allows to select and navigate to a search result using keyboard keys.
   * @param {String} key Key identifier
   */
  navigate(key) {
    switch (key) {
      case 'Home':
        this.firstHit();
        return;

      case 'End':
        this.lastHit();
        return;

      case 'Up': // IE/Edge specific value
      case 'ArrowUp':
        this.prevHit();
        return;

      case 'Down': // IE/Edge specific value
      case 'ArrowDown':
        this.nextHit();
        return;

      case 'Enter':
        const hit = this.hits_[this.cursor];
        if (hit) {
          this.navigateToHit(hit);
        }
        return;
    }
  }

  firstHit() {
    this.cursor = 0;
    this.scrollHitIntoView();
  }

  lastHit() {
    this.cursor = this.hits_.length - 1;
    this.scrollHitIntoView();
  }

  nextHit() {
    this.cursor = (this.cursor + 1) % this.hits_.length;
    this.scrollHitIntoView();
  }

  prevHit() {
    if (this.cursor === -1) {
      this.cursor = this.hits_.length - 1;
    } else {
      this.cursor = (this.cursor - 1 + this.hits_.length) % this.hits_.length;
    }
    this.scrollHitIntoView();
  }

  /**
   * Waits for LitElement to render, then attempts to scroll the current active
   * link into view. This is done because focus never leaves the input field
   * since the user may still be typing their query. As a result, we need to
   * tell the browser to scroll if the user has arrowed down to a hit that has
   * overflown the container.
   */
  scrollHitIntoView() {
    this.requestUpdate();
    this.updateComplete.then(() => {
      const selected = this.renderRoot.querySelector('[aria-selected="true"]');
      selected.scrollIntoView({block: 'nearest'});
      this.dispatchEvent(new CustomEvent('resultselect', {detail: {selected}}));
    });
  }

  /**
   * Tells the page to navigate to the url.
   * @param {{url:string}} url A URL data object.
   */
  navigateToHit({url}) {
    window.location.href = url;
  }

  /* eslint-disable indent */
  render() {
    if (!this.showHits) {
      return html`
        <div id="${this.id}-list" role="listbox" aria-hidden="true"></div>
      `;
    }

    if (!this.hits_.length) {
      if (!this.query) {
        return '';
      }

      // This is intentionally NOT "site:web.dev", as users can have a broader
      // result set that way. We tend to come up first regardless.
      const query = 'web.dev ' + this.query.trim();
      const searchUrl =
        'https://google.com/search?q=' + window.encodeURIComponent(query);
      return html`
        <div class="web-search-popout">
          <div class="web-search-popout__heading">
            There are no suggestions for your query&mdash;try
            <a
              data-category="web.dev"
              data-label="search, open Google"
              data-action="click"
              target="_blank"
              tabindex="-1"
              href=${searchUrl}
            >
              Google search
            </a>
          </div>
        </div>
      `;
    }

    return html`
      <div class="web-search-popout over-scroll">
        <ul id="${this.id}-list" class="stack-nav" aria-label="search results">
          ${this.itemsTemplate}
        </ul>
      </div>
    `;
  }

  get itemsTemplate() {
    // Note that our anchors have tabindex=-1 to prevent them from
    // being focused.
    // This is intentional because focus needs to stay in the input field.
    // When the user is pressing arrow keys, we use a virtual cursor and
    // aria-activedescendant to indicate the active anchor.
    return this.hits_.map((hit, idx) => {
      if (!hit._highlightResult.title || !hit._highlightResult.title.value) {
        return html``;
      }

      const title = this.formatAlgoliaValue(hit._highlightResult.title.value);
      return html`
        <li>
          <a
            id="${this.id}-link-${idx}"
            aria-selected="${idx === this.cursor}"
            tabindex="-1"
            href="${hit.url}"
            >${unsafeHTML(title)}</a
          >
        </li>
      `;
    });
  }

  formatAlgoliaValue(value) {
    // Escape any html entities in the title except for <strong> tags.
    // Algolia sends back <strong> tags in the title which help highlight
    // the characters that match what the user has typed.
    value = allowHtml(escapeHtml(value), 'strong');
    // Strip backticks as they look a bit ugly in the results.
    return value.replace(/`/g, '');
  }

  /* eslint-enable indent */
}

customElements.define('web-search-results', SearchResults);
