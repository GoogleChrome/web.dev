import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';

/**
 * @extends {BaseElement}
 * @final
 */
class LearnFilter extends BaseElement {
  static get properties() {
    return {
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
      child.classList.remove('hidden');
      if (!id) {
        child.classList.remove('hidden');
      } else {
        id === child.id
          ? child.classList.remove('hidden')
          : child.classList.add('hidden');
      }
    }
  }

  render() {
    const filtersMap = (filter) =>
      html`<button
        class="w-chip"
        type="button"
        @click="${() => this.setActive(filter.id)}"
      >
        ${filter.title}
      </button>`;
    return html`<div class="w-chips">${this.filters.map(filtersMap)}</div>`;
  }
}

customElements.define('web-learn-filter', LearnFilter);
