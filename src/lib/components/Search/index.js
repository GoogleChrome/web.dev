/**
 * @fileoverview Element that manages live search. Uses existing DOM and renders
 * results with lit-html.
 */

import {html} from "lit-element";
import {BaseElement} from "../BaseElement";
import {searchDelayer} from "./api";

class WebSearch extends BaseElement {
  static get properties() {
    return {
      searchQuery: {type: String},
      results: {type: Array},
    };
  }

  constructor() {
    super();

    this.searcher_ = searchDelayer((query, results) => {
      if (this.searchQuery === query) {
        this.results = results;
      }
    });
  }

  connectedCallback() {
    super.connectedCallback();

    // TODO: cleanup
    this.searchInput_ = this.querySelector("input");
    this.searchInput_.addEventListener("input", (e) => {
      this.searchQuery = e.target.value;
      this.searcher_(this.searchQuery);
    });
  }

  createRenderRoot() {
    // Search only renders its results.
    return this.querySelector(".web-search__popout");
  }

  render() {
    const inner = (this.results || []).map((result) => {
      return html`
        <div class="result">
          <a href="${result.objectID}">${result.title}</a>
        </div>
      `;
    });
    return html`
      <div class="results">${inner}</div>
    `;
  }
}

customElements.define("web-search", WebSearch);
