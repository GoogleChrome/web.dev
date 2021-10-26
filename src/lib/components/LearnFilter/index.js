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
      all: {type: String},
      filters: {type: Array},
    };
  }

  constructor() {
    super();
    /** @type {string|undefined} */
    this.active = undefined;
    /** @type {string} */
    this.all = 'All';
    /** @type {{id: string, title: string}[]} */
    this.filters = [];
  }

  /**
   * @param {string|undefined} id
   */
  setActive(id) {
    this.active = id;

    const learCollectionsElement =
      document.getElementById('learn__collections');
    if (!learCollectionsElement) {
      return;
    }

    for (const child of learCollectionsElement.children) {
      child.classList.toggle('visually-hidden', !!id && id !== child.id);
    }
  }

  render() {
    const filters = [{title: this.all}, ...this.filters];

    /** @type {(filter: {id?: string, title: string}) => any} */
    const filtersMap = (filter) =>
      html`<button
        class="pill"
        data-state="${this.active === filter.id ? 'active' : 'inactive'}"
        type="button"
        @click="${() => this.setActive(filter.id)}"
      >
        ${filter.title}
      </button>`;
    return html`<div class="cluster">${filters.map(filtersMap)}</div>`;
  }
}

customElements.define('web-learn-filter', LearnFilter);
