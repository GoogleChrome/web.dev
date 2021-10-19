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
    this.filters = [];
    this.active = undefined;
  }

  setActive(id) {
    this.active = id;
    const children = document.getElementById('learning-paths').children;
    for (const child of children) {
      !id || id === child.id
        ? child.classList.remove('hidden')
        : child.classList.add('hidden');
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
