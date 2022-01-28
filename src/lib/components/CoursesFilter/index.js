import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';

/**
 * @extends {BaseElement}
 * @final
 */
class CoursesFilter extends BaseElement {
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
   * @param {MouseEvent} e
   */
  selectOnChange(e) {
    const target = /** @type {HTMLOptionElement} */ (e.target);
    const id = target.value;
    this.active = id;

    const carousel = document.querySelector('web-carousel');
    const carouselTrack = carousel.querySelector('.carousel__track');
    if (!carouselTrack) {
      return;
    }

    for (const child of carouselTrack.children) {
      child.classList.toggle(
        'hidden-yes',
        !!id && id !== child.getAttribute('data-tag'),
      );
    }
  }

  render() {
    const options = [{title: this.all, id: ''}, ...this.filters];

    /** @type {(filter: {id: string, title: string}) => any} */
    const optionsMap = (filter) =>
      html`<option value="${filter.id}" ?selected=${this.active === filter.id}>
        ${filter.title}
      </option>`;

    return html`
      <select name="Courses Filter" @change="${this.selectOnChange}">
        ${options.map(optionsMap)}
      </select>
    `;
  }
}

customElements.define('web-courses-filter', CoursesFilter);
