/**
 * @fileoverview An Algolia search box.
 */

import {html} from 'lit-element';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';
import {SearchResults} from '../SearchResults';
import 'focus-visible';

/**
 * An Algolia search box for courses drawer.
 * @extends {SearchResults}
 * @final
 */
class CourseSearchResults extends SearchResults {
  /* eslint-disable indent */
  render() {
    if (!this.showHits) {
      return html`<div role="listbox" aria-hidden="true"></div>`;
    }

    if (!this.hits_.length) {
      if (!this.query) {
        return '';
      }

      // prettier-ignore
      return html`
        <div class="web-course-search web-course-search__no-results web-search-popout">
          <svg width="200" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="96" fill="#F8F9FA"/>
            <path fill="#F1F3F4" stroke="#fff" d="M84.5 40.5h59v79h-59z"/>
            <path fill="#F1F3F4" stroke="#fff" d="M52.5 72.5h59v79h-59z"/>
            <path fill="#fff" stroke="#212121" d="M68.5 56.5h59v79h-59z"/>
            <path stroke="#212121" d="M78 69.5h20M78 81.5h40M78 93.5h40M78 105.5h40M78 117.5h20M106 118l26 26"/>
            <path d="M131.198 143.198a2.383 2.383 0 013.371 0l12.233 12.233a2.383 2.383 0 11-3.371 3.371l-12.233-12.233a2.383 2.383 0 010-3.371z" fill="#fff" stroke="#212121"/>
            <circle cx="106" cy="118" r="32" fill="#fff"/>
            <mask id="a" maskUnits="userSpaceOnUse" x="76" y="88" width="60" height="60">
              <circle cx="106" cy="118" r="29.5" fill="#fff" stroke="#212121"/>
            </mask>
            <g mask="url(#a)" stroke="#212121" stroke-width="3">
              <path d="M76 95.5h42M76 108.5h42M76 121.5h25"/>
            </g>
            <circle cx="106" cy="118" r="29.5" fill="#fff" fill-opacity=".88" stroke="#212121"/>
            <path d="M96 116l-3 3-3 3m0-6l6 6M92 136s3.2-4 8-4 8 4 8 4M110 116l-3 3-3 3m0-6l6 6" stroke="#FF1776"/>
          </svg>
          <p>
            No results
          </p>
        </div>
      `;
    }

    return html`
      <div class="web-course-search web-search-popout">
        <ul
          id="${this.id}-list"
          class="web-search-popout__list scrollbar"
          role="listbox"
        >
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
      const snippet = this.formatAlgoliaValue(hit._snippetResult.content.value);
      return html`
        <li class="web-search-popout__item">
          <a
            id="${this.id}-link-${idx}"
            class="web-search-popout__link ${idx === this.cursor
              ? 'web-search-popout__link--active'
              : ''}"
            aria-selected="${idx === this.cursor}"
            tabindex="-1"
            href="${hit.url}"
          >
            <span class="web-search-popout__title">${unsafeHTML(title)}</span>
            <p class="web-search-popout__snippet">${unsafeHTML(snippet)}</p>
          </a>
        </li>
      `;
    });
  }
  /* eslint-enable indent */
}

customElements.define('web-course-search-results', CourseSearchResults);
