/**
 * @fileoverview An Algolia search box.
 */

import {html, css, unsafeCSS, LitElement} from "lit-element";
import {store} from "../../store";
import * as router from "../../utils/router";
import {debounce} from "../../utils/debounce";
import algoliasearch from "algoliasearch/dist/algoliasearchLite";
import styles from "./_styles.scss";

// Create an algolia client so we can get search results.
// These keys are safe to be public.
const applicationID = "2JPAZHQ6K7";
const apiKey = "01ca870a3f1cad9984ed72419a12577c";
const indexName = "webdev";
const client = algoliasearch(applicationID, apiKey);
const index = client.initIndex(indexName);

/**
 * An Algolia search box.
 * @extends {LitElement}
 * @final
 */
class Search extends LitElement {
  static get properties() {
    return {
      // Manages the expanded/collapsed state of the UI.
      expanded: {type: Boolean, reflect: true},
      // An array of algolia results.
      hits: {type: Object},
      // Manages showing/hiding the search results popout.
      showHits: {type: Boolean},
      // Indicates which search result should be highlighted in the popout.
      // Primarily used for keyboard behavior.
      cursor: {type: Number},
    };
  }

  static get styles() {
    return css`
      ${unsafeCSS(styles)}
    `;
  }

  constructor() {
    super();
    this.hits = [];
    this.showHits = false;
    this.cursor = -1;
    this.query = "";
    this.timeout = 0;

    // On smaller screens we don't do an animation so it's ok for us to fire off
    // actions immediately. On larger screens we need to wait for the searchbox
    // to fully expand/animate before we fire off actions.
    // So we need to figure out our screen size and keep track of it if changes.
    // We debounce this because the handler triggers style recalc.
    this.onResize = debounce(this.onResize.bind(this), 200);

    // Debounce the method we use to search Algolia so we don't waste calls
    // while the user is typing.
    this.search = debounce(this.search.bind(this), 200);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.onResize);
  }

  render() {
    return html`
      <button
        @click="${this.onOpenSearch}"
        class="web-search__open-btn"
        aria-label="Open search"
      ></button>
      <div
        class="web-search__input-wrapper"
        role="combobox"
        aria-expanded="${this.expanded}"
        aria-owns="web-search-popout__list"
        aria-haspopup="listbox"
      >
        <input
          class="web-search__input"
          type="text"
          role="searchbox"
          autocomplete="off"
          aria-autocomplete="list"
          aria-controls="web-search-popout__list"
          aria-label="Search"
          placeholder="Search"
          @keyup="${this.onKeyUp}"
          @input="${this.onInput}"
          @focusin="${this.onFocusIn}"
          @focusout="${this.onFocusOut}"
        />
      </div>
      <button
        @click="${this.onCloseSearch}"
        class="web-search__close-btn"
        aria-label="Close search"
      ></button>
      ${this.hitsTemplate}
    `;
  }

  /* eslint-disable indent */
  get hitsTemplate() {
    if (!this.showHits) {
      return html`
        <div
          id="web-search-popout__list"
          role="listbox"
          aria-hidden="true"
        ></div>
      `;
    }

    if (!this.hits.length) {
      if (!this.query) {
        return "";
      }

      // This is intentionally NOT "site:web.dev", as users can have a broader
      // result set that way. We tend to come up first regardless.
      const query = "web.dev " + this.query.trim();
      const searchUrl =
        "https://google.com/search?q=" + window.encodeURIComponent(query);
      return html`
        <div class="web-search-popout">
          <div class="web-search-popout__heading">
            There are no suggestions for your query&mdash;try
            <a
              data-category="web.dev"
              data-label="search, open Google"
              data-action="click"
              target="_blank"
              href=${searchUrl}
            >
              Google search
            </a>
          </div>
        </div>
      `;
    }

    return html`
      <div class="web-search-popout">
        <div class="web-search-popout__heading">Pages</div>
        <ul
          id="web-search-popout__list"
          class="web-search-popout__list"
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
    return this.hits.map(
      (hit, idx) => html`
        <li class="web-search-popout__item">
          <a
            id="web-search-popout__link--${idx}"
            class="web-search-popout__link ${idx === this.cursor
              ? "web-search-popout__link--active"
              : ""}"
            aria-selected="${idx === this.cursor}"
            tabindex="-1"
            href="${hit.url}"
            >${hit.title}</a
          >
        </li>
      `,
    );
  }
  /* eslint-enable indent */

  firstUpdated() {
    this.inputEl = this.renderRoot.querySelector(".web-search__input");
  }

  /**
   * Keep track of cursor changes and reflect them to aria-activedescendant.
   * This ensures screen readers properly announce the current search result.
   * We do this because focus never leaves the search input box, so when the
   * user is arrowing through results, we have to tell the screen reader about
   * it.
   * @param {Map} changedProperties A Map of LitElement properties that changed.
   */
  updated(changedProperties) {
    if (!changedProperties.has("cursor")) {
      return;
    }

    if (this.cursor === -1) {
      this.inputEl.removeAttribute("aria-activedescendant");
      return;
    }

    this.inputEl.setAttribute(
      "aria-activedescendant",
      `web-search-popout__link--${this.cursor}`,
    );
  }

  /**
   * Grab the animation custom property to infer how long our javascript should
   * wait before doing state changes.
   */
  onResize() {
    const styles = getComputedStyle(this);
    const value = styles.getPropertyValue("--web-search-animation-time");
    // value will either be "200ms" or "0".
    this.animationTime = parseInt(value, 10);
  }

  onKeyUp(e) {
    // Check if the user is navigating within the search popout.
    switch (e.key) {
      case "Home":
        this.firstHit();
        return;

      case "End":
        this.lastHit();
        return;

      case "Up": // IE/Edge specific value
      case "ArrowUp":
        this.prevHit();
        return;

      case "Down": // IE/Edge specific value
      case "ArrowDown":
        this.nextHit();
        return;

      case "Enter":
        const hit = this.hits[this.cursor];
        if (hit) {
          this.navigateToHit(hit);
        }
        return;

      case "Esc": // IE/Edge specific value
      case "Escape":
        document.activeElement.blur();
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
    if (query === "") {
      this.hits = [];
      return;
    }
    try {
      const {hits} = await index.search({query, hitsPerPage: 10});
      if (this.query === query) {
        this.hits = hits;
      }
    } catch (err) {
      console.error(err);
      console.error(err.debugData);
    }
  }

  firstHit() {
    this.cursor = 0;
    this.scrollHitIntoView();
  }

  lastHit() {
    this.cursor = this.hits.length - 1;
    this.scrollHitIntoView();
  }

  nextHit() {
    this.cursor = (this.cursor + 1) % this.hits.length;
    this.scrollHitIntoView();
  }

  prevHit() {
    if (this.cursor === -1) {
      this.cursor = this.hits.length - 1;
    } else {
      this.cursor = (this.cursor - 1 + this.hits.length) % this.hits.length;
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
    this.requestUpdate().then(() => {
      this.renderRoot
        .querySelector(".web-search-popout__link--active")
        .scrollIntoView();
    });
  }

  /**
   * Tells the router to navigate to the specified URL.
   * Because this closes the search box, it has the side effect of blurring
   * focus.
   * @param {{url:string}} url A URL data object.
   */
  navigateToHit({url}) {
    router.route(url);
    document.activeElement.blur();
  }

  /**
   * Empty out the search field.
   */
  clear() {
    this.inputEl.value = "";
    this.query = "";
  }

  /**
   * Expand the search box.
   * Only used on mobile viewports where we hide the search box behind an icon.
   */
  onOpenSearch() {
    this.expanded = true;
    // Set state here even though it'll happen again during onFocusIn.
    // If we wait until onFocusIn the animation has a bit of jank to it.
    store.setState({isSearchExpanded: true});
    this.requestUpdate().then(() => {
      this.inputEl.focus();
    });
  }

  /**
   * Collapse the search box.
   * Only used on mobile viewports.
   */
  onCloseSearch() {
    this.expanded = false;
  }

  /**
   * Animate the search box open.
   */
  onFocusIn() {
    this.expanded = true;

    // Collapse the search box if the user scrolls while the seach box is
    // focused.
    window.addEventListener(
      "scroll",
      () => {
        document.activeElement.blur();
      },
      {passive: true, once: true},
    );

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
    const {relatedTarget} = e;
    if (relatedTarget && this.contains(relatedTarget)) {
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
    this.cursor = -1;
    this.clear();
  }
}

customElements.define("web-search", Search);
