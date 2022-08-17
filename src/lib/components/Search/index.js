/**
 * @fileoverview An Algolia search box.
 */

import {html} from 'lit';
import {BaseStateElement} from '../BaseStateElement';
import {store} from '../../store';
import {debounce} from '../../utils/debounce';
import {trackError} from '../../analytics';
import 'focus-visible';

let algoliaIndexPromise;

function loadAlgoliaLibrary() {
  algoliaIndexPromise = algoliaIndexPromise || internalLoadAlgoliaLibrary();
  return algoliaIndexPromise;
}

async function internalLoadAlgoliaLibrary() {
  const {default: algoliasearch} = await import(
    'algoliasearch/dist/algoliasearch-lite.esm.browser'
  );
  // Create an algolia client so we can get search results.
  // These keys are safe to be public.
  const applicationID = '2JPAZHQ6K7';
  const apiKey = 'ac32acde5503ed0ab18332e0592e9919';
  const indexName = 'prod_web_dev';
  const client = algoliasearch(applicationID, apiKey);
  const index = client.initIndex(indexName);
  return index;
}

/**
 * An Algolia search box.
 * @extends {BaseStateElement}
 * @final
 */
class Search extends BaseStateElement {
  static get properties() {
    return {
      // Manages the expanded/collapsed state of the UI.
      expanded: {type: Boolean, reflect: true},
      // An array of algolia results.
      hits: {type: Object},
      // Manages showing/hiding the search results popout.
      showHits: {type: Boolean},
      // Locale to use for search
      locale: {type: String},
      // Search query
      query: {type: String},
      // Tag to filter the search results by.
      tag: {type: String},
      // Translations for strings displayed by this component
      i18n: {type: Object},
    };
  }

  constructor() {
    super();
    this.hits = [];
    this.showHits = false;
    this.query = '';
    this.tag = '';
    this.timeout;
    this.expanded = false;
    this.locale = 'en';
    this.resultsEl;
    this.i18n = {};

    // On smaller screens we don't do an animation so it's ok for us to fire off
    // actions immediately. On larger screens we need to wait for the searchbox
    // to fully expand/animate before we fire off actions.
    // So we need to figure out our screen size and keep track of it if changes.
    // We debounce this because the handler triggers style recalc.
    this.onResize = debounce(this.onResize.bind(this), 200);

    // Debounce the method we use to search Algolia so we don't waste calls
    // while the user is typing.
    this.search = debounce(this.search.bind(this), 200);

    this.onResultSelect = this.onResultSelect.bind(this);
  }

  onStateChanged({currentLanguage}) {
    this.locale = currentLanguage;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.onResize);
    this.onResize();
    // Note: We only check for the existence of the resultsEl here in
    // connectedCalback. This means if the resultsEl is added later, or
    // if the JavaScript for the search component is inlined into the head,
    // then this will run _before_ resultsEl exists.
    this.resultsEl = document.getElementById(this.getAttribute('results-id'));
    if (this.resultsEl) {
      // ts requires us to cast the event listener if it's handling custom
      // events.
      // https://github.com/Microsoft/TypeScript/issues/28357
      this.resultsEl.addEventListener(
        'resultselect',
        /** @type {EventListener} */ (this.onResultSelect),
      );
    } else {
      console.warn(`No search results element found for ${this}`);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.onResize);
    if (this.resultsEl) {
      this.resultsEl.removeEventListener(
        'resultselect',
        /** @type {EventListener} */ (this.onResultSelect),
      );
    }
  }

  render() {
    const i18n = this.i18n;
    const locale = this.locale;
    const placeholder = i18n.search[locale] || i18n.search['en'];
    const open_search = i18n.open_search[locale] || i18n.open_search['en'];
    const all_articles = i18n.all_articles[locale] || i18n.all_articles['en'];
    return html`
      <button
        class="web-search__open-btn icon-button color-mid-text"
        @click="${this.onOpenSearch}"
        aria-label="${open_search}"
      >
        <svg
          class="web-search__search-icon"
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          width="24"
          aria-hidden="true"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          />
        </svg>
      </button>
      <div
        class="web-search__input-wrapper"
        role="combobox"
        aria-expanded="${this.expanded}"
        aria-controls="web-search__input"
        aria-owns="${this.resultsEl.id}-list"
        aria-haspopup="listbox"
      >
        <input
          id="web-search__input"
          class="web-search__input"
          type="text"
          role="searchbox"
          autocomplete="off"
          aria-autocomplete="list"
          aria-controls="${this.resultsEl.id}-list"
          aria-label="${all_articles}"
          placeholder="${placeholder}"
          @keydown="${this.onKeyDown}"
          @input="${this.onInput}"
          @focusin="${this.onFocusIn}"
          @focusout="${this.onFocusOut}"
        />
      </div>
    `;
  }

  firstUpdated() {
    /** @type HTMLInputElement */
    this.inputEl = this.renderRoot.querySelector('.web-search__input');
  }

  /**
   * Passes on updated search properties to the search results element.
   * @param {Map} changedProperties A Map of LitElement properties that changed.
   */
  updated(changedProperties) {
    // Reflect changed properties to the results el.
    const sharedProperties = ['query', 'hits', 'showHits'];
    sharedProperties.forEach((property) => {
      if (changedProperties.has(property)) {
        this.resultsEl[property] = this[property];
      }
    });
  }

  /**
   * Grab the animation custom property to infer how long our javascript should
   * wait before doing state changes.
   */
  onResize() {
    const styles = getComputedStyle(this);
    const value = styles.getPropertyValue('--web-search-animation-time');
    // value will either be "200ms" or "0".
    this.animationTime = parseInt(value, 10);
  }

  /**
   * Keep track of which result is selected in the search results element and
   * reflect them to aria-activedescendant.
   * This ensures screen readers properly announce the current search result.
   * We do this because focus never leaves the search input box, so when the
   * user is arrowing through results, we have to tell the screen reader about
   * it.
   * @param {CustomEvent} event Select event fired by search results element.
   */
  onResultSelect(event) {
    const selected = event.detail.selected;
    if (!selected || !selected.id) {
      this.inputEl.removeAttribute('aria-activedescendant');
      return;
    }
    this.inputEl.setAttribute('aria-activedescendant', selected.id);
  }

  onKeyDown(e) {
    const navigationKeys = [
      'Home',
      'End',
      'Up',
      'ArrowUp',
      'Down',
      'ArrowDown',
      'Enter',
    ];
    // Check if the user is navigating within the search popout.
    if (navigationKeys.includes(e.key)) {
      e.preventDefault();
      /** @type {WebSearchResults} */ (this.resultsEl).navigate(e.key);
    }
    if (['Esc', 'Escape'].includes(e.key)) {
      /** @type HTMLElement */ (document.activeElement).blur();
      return;
    }
  }

  onInput(e) {
    this.search(e.target.value);
  }

  /**
   * Search algolia using the provided query.
   * Note, we bind and debounce this function in the constructor to avoid
   * spamming algolia as the user types.
   * @param {string} query The text to query algolia for.
   */
  async search(query) {
    // Cache a copy of the query.
    // We'll check against this copy when results come back to ensure
    // we don't show search results for a stale query.
    this.query = query;
    if (query === '') {
      this.hits = [];
      return;
    }
    try {
      const index = await loadAlgoliaLibrary();
      const settings = {
        hitsPerPage: 10,
        attributesToHighlight: ['title'],
        attributesToRetrieve: ['url'],
        highlightPreTag: '<strong>',
        highlightPostTag: '</strong>',
        facetFilters: [`locales:${this.locale}`],
        attributesToSnippet: ['content:20'],
        snippetEllipsisText: '...',
      };
      if (this.tag) {
        settings.facetFilters.push(`tags:${this.tag}`);
      }
      const {hits} = await index.search(query, settings);
      if (this.query === query) {
        this.hits = hits;
      }
    } catch (err) {
      console.error(err);
      console.error(err.debugData);
      trackError(err, 'search');
    }
  }

  /**
   * Empty out the search field.
   */
  clear() {
    this.inputEl.value = '';
    this.inputEl.removeAttribute('aria-activedescendant');
    this.query = '';
  }

  /**
   * Expand the search box.
   */
  onOpenSearch() {
    this.expanded = true;
    // Set state here even though it'll happen again during onFocusIn.
    // If we wait until onFocusIn the animation has a bit of jank to it.
    store.setState({isSearchExpanded: true});
    this.requestUpdate();
    this.updateComplete.then(() => {
      this.inputEl.focus();
    });
  }

  /**
   * Collapse the search box.
   */
  onCloseSearch() {
    this.expanded = false;
  }

  /**
   * Animate the search box open.
   */
  onFocusIn() {
    loadAlgoliaLibrary().catch((err) => {
      console.error('failed to load Algolia', err);
      trackError(err, 'algolia load');
    });
    this.expanded = true;

    // Wait for the expanding animation to finish before hiding the header
    // links and allowing overflow content.
    // Keep a reference to the timeout in case the user tabs out quickly.
    // In that scenario, we'll use onFocusOut to kill the timeout.
    this.timeout = setTimeout(() => {
      store.setState({isSearchExpanded: true});
      this.showHits = true;
    }, this.animationTime);
  }

  /**
   * Animate the search box closed.
   * See internal comments for side-effects.
   * @param {FocusEvent} e focusout event object.
   */
  onFocusOut(e) {
    // Check if the user's focus is moving to something that they just clicked
    // on. If so, programatically click it before closing the popout.
    // Because focusout fires before click, if we try to wait for the click
    // event (~10's of ms later) then lit will have already deleted the link.
    const relatedTarget = /** @type HTMLElement */ (e.relatedTarget);
    if (relatedTarget && this.resultsEl.contains(relatedTarget)) {
      relatedTarget.click();
    }

    // If the user is tabbing quickly through the header then they may have
    // started the animation but tabbed out before it completed.
    // In that scenario, kill the animation timeout to avoid invalid state.
    clearTimeout(this.timeout);

    store.setState({isSearchExpanded: false});
    this.expanded = false;
    this.showHits = false;
    this.hits = [];
    this.clear();
  }
}

customElements.define('web-search', Search);
