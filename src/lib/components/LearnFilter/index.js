import {html} from 'lit';
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

    const learnCollectionsElement =
      document.getElementById('learn__collections') ||
      document.getElementById('learning-paths');
    if (!learnCollectionsElement) {
      return;
    }

    for (const child of learnCollectionsElement.children) {
      child.classList.toggle('hidden', !!id && id !== child.id);
      child.classList.toggle('hidden-yes', !!id && id !== child.id);
    }
  }

  render() {
    const filters = [{title: this.all}, ...this.filters];

    /** @type {(filter: {id?: string, title: string}) => any} */
    const filtersMap = (filter) =>
      html`<button
        class="pill chip${this.active === filter.id ? ' chip__active' : ''}"
        data-state="${this.active === filter.id ? 'active' : 'inactive'}"
        type="button"
        @click="${() => this.setActive(filter.id)}"
      >
        ${filter.title}
      </button>`;

    return html`<div class="chips cluster">${filters.map(filtersMap)}</div>`;
  }
}

customElements.define('web-learn-filter', LearnFilter);
