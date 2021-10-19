import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';

/**
 * @extends {BaseElement}
 * @final
 */
class LearnFilter extends BaseElement {
  static get properties() {
    return {
      active: {type: String},
      filters: {type: Array},
    };
  }

  constructor() {
    super();
    /** @type {{id?: string, title: string}[]} */
    this.filters = [];
    /** @type {string|undefined} */
    this.active = undefined;
  }

  setActive(id) {
    this.active = id;
    const children = document.getElementById('learning-paths').children;
    for (const child of children) {
      child.classList.toggle('hidden', !id || id === child.id);
    }
  }

  render() {
    const filtersMap = (filter) =>
      html`<button
        class="w-chip${this.active === filter.id ? ' w-chip__active' : ''}"
        type="button"
        @click="${() => this.setActive(filter.id)}"
      >
        ${filter.title}
      </button>`;

    return html`<div class="w-chips">${this.filters.map(filtersMap)}</div>`;
  }
}

customElements.define('web-learn-filter', LearnFilter);
