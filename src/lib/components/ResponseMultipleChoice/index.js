import {html} from 'lit-element';
import {BaseResponseElement} from '../BaseResponseElement';
import './_styles.scss';
import {generateIdSalt} from '../../utils/generate-salt';

export class ResponseMultipleChoice extends BaseResponseElement {
  static get properties() {
    return {
      id: {type: String, reflect: true},
      cardinality: {type: String}, // Allows a range, so it's a string
      columns: {type: Boolean},
      state: {type: String, reflect: true},
      correctAnswer: {attribute: 'correct-answer', type: String},
    };
  }

  constructor() {
    super();
    this.prerenderedChildren = null;
    this.options = null;
    this.optionContents = null;
    this.rationales = null;
    this.minSelections = null;
    this.maxSelections = null;
    this.selectType = null;
    this.cardinality = null;
    this.columns = false;

    this.onOptionInput = this.onOptionInput.bind(this);
    this.deselectOption = this.deselectOption.bind(this);
    this.updateSelections = this.updateSelections.bind(this);

    // Used to ensure grouping of radio buttons. Just needs to be unique.
    this._formName = generateIdSalt('web-response-mc-form-');
  }

  render() {
    const correctArr = this.correctAnswer.split(',').map(Number);
    this.selectType = this.cardinality === '1' ? 'radio' : 'checkbox';
    const selectionRange = BaseResponseElement.getSelectionRange(
      this.cardinality,
    );

    this.minSelections = selectionRange.min;
    this.maxSelections = selectionRange.max;

    if (!this.prerenderedChildren) {
      this.prerenderedChildren = [];
      this.options = [];
      this.optionContents = [];
      this.rationales = [];

      for (const child of this.children) {
        const role = child.getAttribute('data-role');

        switch (role) {
          case 'option':
            this.optionContents.push(child);
            break;
          case 'rationale':
            this.rationales.push(child);
            break;
          default:
            this.prerenderedChildren.push(child);
        }
      }

      for (let i = 0; i < this.optionContents.length; i++) {
        const isCorrect = correctArr.includes(i);

        this.options.push(
          this.optionTemplate(
            this.optionContents[i],
            this.rationales[i],
            isCorrect,
          ),
        );
      }
    }

    /* eslint-disable indent */
    return html`
      ${this.prerenderedChildren}
      <fieldset
        class="web-select-group web-response-mc"
        ?columns="${this.columns}"
      >
        <div class="web-select-group__options-wrapper">
          ${this.options.map(
            (option, i) =>
              html`
                <label
                  class="web-select-group__option web-response-mc__option"
                  data-role="option"
                >
                  <input
                    @input=${this.onOptionInput}
                    @click=${this.onOptionClick}
                    class="web-select-group__input web-response-mc__input gc-analytics-event"
                    type="${this.selectType}"
                    name="web-response-mc-form-${this._formName}"
                    value="${i}"
                  />
                  <span
                    class="web-select-group__selector web-response-mc__selector"
                  ></span>
                  <span class="web-select-group__option-content">
                    ${option}
                  </span>
                </label>
              `,
          )}
        </div>
      </fieldset>
    `;
    /* eslint-enable indent */
  }

  optionTemplate(content, rationale, isCorrect) {
    const flag = document.createElement('div');

    flag.className = 'web-response__correctness-flag';
    if (isCorrect) {
      flag.textContent = 'Correct';
    } else {
      flag.textContent = 'Incorrect';
    }
    content.prepend(flag);
    rationale.className = 'web-response__option-rationale';
    content.append(rationale);

    // Remove data-role since it's being applied to the option label
    // in render().
    content.removeAttribute('data-role');

    return content;
  }

  firstUpdated() {
    super.firstUpdated();
  }

  onOptionInput(e) {
    this.updateSelections(e);
    this.enforceCardinality();
  }

  /**
   *
   * @param {WMouseEvent<HTMLInputElement>} e
   */
  onOptionClick(e) {
    const target = e.target;
    const index = Number(target.value);

    const ce = new CustomEvent('question-option-select', {
      detail: index,
      bubbles: true,
    });
    this.dispatchEvent(ce);
  }

  updateSelections(e) {
    const options = this.querySelectorAll('[data-role=option]');
    const currentOption = e.target.closest('[data-role=option]');

    if (e.target.checked) {
      if (this.cardinality === '1') {
        for (const option of options) {
          option.removeAttribute('data-selected');
        }
      }
      currentOption.setAttribute('data-selected', '');
    } else {
      currentOption.removeAttribute('data-selected');
    }
  }

  // Helper function to allow BaseResponseElement to deselect options as needed.
  deselectOption(option) {
    option.removeAttribute('data-selected');
    option.querySelector('input').checked = false;
  }
}

customElements.define('web-response-mc', ResponseMultipleChoice);
