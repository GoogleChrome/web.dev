/**
 * @fileoverview An Algolia search box.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {store} from "../../store";
import {router} from "../../router";
import algoliasearch from "algoliasearch/dist/algoliasearchLite";

// Create an algolia client so we can get search results.
// These keys are safe to be public.
const applicationID = "2JPAZHQ6K7";
const apiKey = "01ca870a3f1cad9984ed72419a12577c";
const indexName = "webdev";
const client = algoliasearch(applicationID, apiKey);
const index = client.initIndex(indexName);

/**
 * An Algolia search box.
 * @extends {BaseElement}
 * @final
 */
class Search extends BaseElement {
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

  constructor() {
    super();
    this.hits = [];
    this.showHits = false;
    this.cursor = -1;

    // On smaller screens we don't do an animation so it's ok for us to fire off
    // actions immediately. On larger screens we need to wait for the searchbox
    // to fully expand/animate before we fire off actions.
    // So we need to figure out our screen size and keep track of it if changes.
    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);
    this.onResize();
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
          role="search"
          autocomplete="off"
          aria-autocomplete="list"
          aria-controls="web-search-popout__list"
          aria-label="Search"
          placeholder="Search"
          @keyup="${this.onKeyUp}"
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
    return html`
      ${this.hits && this.hits.length && this.showHits
        ? html`
            <div class="web-search-popout">
              <div class="web-search-popout__heading">Pages</div>
              <ul
                id="web-search-popout__list"
                class="web-search-popout__list"
                role="listbox"
              >
                ${this.hits.map(
                  (hit, idx) => html`
                    <li class="web-search-popout__item">
                      <a
                        id="web-search-popout__link--${idx}"
                        class="web-search-popout__link ${idx === this.cursor
                          ? "web-search-popout__link--active"
                          : ""}"
                        aria-selected="${idx === this.cursor}"
                        href="${hit.url}"
                        >${hit.title}</a
                      >
                    </li>
                  `,
                )}
              </ul>
            </div>
          `
        : ""}
    `;
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

    const input = this.querySelector(".web-search__input");

    if (this.cursor === -1) {
      input.removeAttribute("aria-activedescendant");
      return;
    }

    input.setAttribute(
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
    const value = String(
      styles.getPropertyValue("--web-search-animation-time"),
    ).trim();
    // value will either be "200ms" or "0".
    this.animationTime = Number(value.split("ms").shift());
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

      case "ArrowUp":
        this.prevHit();
        return;

      case "ArrowDown":
        this.nextHit();
        return;

      case "Enter":
        this.navigateToHit(this.hits[this.cursor]);
        return;

      case "Escape":
        document.activeElement.blur();
        return;
    }

    // If the user is not navigating within the search popout, then assume
    // anything they type is part of their query and ping algolia.
    const query = e.target.value;
    if (query === "") {
      this.hits = [];
      return;
    }
    (async () => {
      try {
        const {hits} = await index.search({query, hitsPerPage: 10});
        this.hits = hits;
      } catch (err) {
        console.error(err);
        console.error(err.debugData);
      }
    })();
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
    if (this.cursor === -1) {
      this.cursor = 0;
      return;
    }
    this.cursor = (this.cursor + 1) % this.hits.length;
    this.scrollHitIntoView();
  }

  prevHit() {
    if (this.cursor === -1) {
      this.cursor = this.hits.length - 1;
      return;
    }
    this.cursor = (this.cursor - 1 + this.hits.length) % this.hits.length;
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
      this.querySelector(".web-search-popout__link--active").scrollIntoView();
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
    this.querySelector(".web-search__input").value = "";
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
      this.querySelector(".web-search__input").focus();
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
    document.addEventListener(this.onScroll, {passive: true, once: true});

    // Wait for the expanding animation to finish before hiding the header
    // links and allowing overflow content.
    this.timeout = setTimeout(() => {
      store.setState({isSearchExpanded: true});
      this.showHits = true;
    }, this.animationTime);
  }

  /**
   * Collapse the search box if the user scrolls while the seach box is focused.
   */
  onScroll() {
    document.activeElement.blur();
  }

  /**
   * Animate the search box closed.
   * See internal comments for side-effects.
   * @param {{relatedTarget:(Object|undefined)}} e focusout event object.
   */
  onFocusOut(e) {
    // Check if the user's focus is moving to a link they just clicked on.
    // If so, navigate to it before closing the popout.
    // Because focusout fires before click, if we try to wait for the click
    // event then lit will have already deleted the link.
    const {relatedTarget} = e;
    if (relatedTarget) {
      if (relatedTarget.classList.contains("web-search-popout__link")) {
        this.navigateToHit({url: relatedTarget.href});
      }
    }

    // If the user is tabbing quickly through the header then they may have
    // started the animation but tabbed out before it completed.
    // In that scenario, kill the animation timeout to avoid invalid state.
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    store.setState({isSearchExpanded: false});
    this.expanded = false;
    this.showHits = false;
    this.hits = [];
    this.cursor = -1;
    this.clear();
  }
}

customElements.define("web-search", Search);
