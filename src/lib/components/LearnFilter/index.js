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

  /**
   * @param {string|undefined} id
   */
  setActive(id) {
    this.active = id;

    const learningPathsElement = document.getElementById('learning-paths');
    if (!learningPathsElement) {
      return;
    }

    for (const child of learningPathsElement.children) {
      child.classList.toggle('hidden', id && id !== child.id);
    }
  }

  render() {
    /** @type {(filter: {id?: string, title: string}) => any} */
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
