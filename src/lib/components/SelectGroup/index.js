import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {generateIdSalt} from '../../utils/generate-salt';
import 'focus-visible';
import './_styles.scss';

/**
 * Element that renders a radio group or checkbox group.
 *
 * @extends {BaseElement}
 */
class SelectGroup extends BaseElement {
  static get properties() {
    return {
      type: {type: String},
      prefix: {type: String},
      columns: {type: Boolean},
    };
  }

  constructor() {
    super();
    this.idSalt = generateIdSalt('web-select-group-');
    this.selectors = null;
    this.type = null;
    this.prefix = null;
    this.columns = false;
  }

  render() {
    if (!this.prefix) {
      this.prefix = '';
    }

    if (!this.selectors) {
      this.selectors = [];

      for (let i = 0; i < this.children.length; i++) {
        this.selectors.push(
          this.selectorTemplate(i, this.children[i], this.type, this.prefix),
        );
      }
    }

    return html`
      <fieldset
        class="web-select-group ${this.prefix}"
        ?columns="${this.columns}"
      >
        <div class="web-select-group__options-wrapper">${this.selectors}</div>
      </fieldset>
    `;
  }

  selectorTemplate(i, content, type, prefix) {
    let labelClass = '';
    let inputClass = '';
    let selectorClass = '';

    if (prefix) {
      labelClass = prefix + '__option';
      inputClass = prefix + '__input';
      selectorClass = prefix + '__selector';
    }

    return html`
      <label
        class="web-select-group__option ${labelClass}"
        data-category="Site-Wide Custom Events"
        data-label="${type}, web-select-group-${this.idSalt}-${i}"
      >
        <input
          @change="${this.onChange}"
          class="web-select-group__input ${inputClass}"
          type="${type}"
          name="web-select-group-${this.idSalt}"
          value="${i}"
        />
        <span class="web-select-group__selector ${selectorClass}"></span>
        <span class="web-select-group__option-content">${content}</span>
      </label>
    `;
  }

  onChange() {
    this.reportSelections();
  }

  // Tell parent components how many selections have been made.
  reportSelections() {
    const inputs = this.querySelectorAll('input');
    let count = 0;

    for (const input of inputs) {
      if (input.checked) {
        count++;
      }
    }

    const event = new CustomEvent('change-selections', {
      detail: {
        numSelections: count,
      },
    });

    this.dispatchEvent(event);
  }
}

customElements.define('web-select-group', SelectGroup);
