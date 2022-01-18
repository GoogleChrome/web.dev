import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';

/**
 * Element that renders a Material style select element.
 *
 * @extends {BaseElement}
 */
class Select extends BaseElement {
  static get properties() {
    return {
      active: {type: Boolean, reflect: true},
      selected: {type: Object},
    };
  }

  constructor() {
    super();
    this.active = false;
    this.activeIndex = -1;
    /** @type {HTMLOptionElement[]} */
    this.options = [];
    /** @type {HTMLOptionElement} */
    this.selected = null;
    this.value = null;

    this.clickedInside = this.clickedInside.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    const select = this.querySelector('select');
    this.options = /** @type {HTMLOptionElement[]} */ (
      Array.from(select.children).filter((e) => e.nodeName === 'OPTION')
    );
    this.selected = this.options.find((e) => e.selected) || this.options[0];
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.clickedInside);
    this.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Closes drop down if user clicks outside of dropdown.
   *
   * @param {MouseEvent} e
   * @returns
   */
  clickedInside(e) {
    const ul = this.querySelector('ul');
    const label = this.querySelector('label');
    let target = /** @type {ParentNode} */ (e.target);
    do {
      if (target === ul || target === label) {
        return;
      }
      target = target?.parentNode;
    } while (target);
    this.toggleState();
  }

  /**
   * Handles key presses to navigate options.
   *
   * @param {KeyboardEvent} e
   * @returns void
   */
  handleKeyDown(e) {
    switch (e.key) {
      case 'Escape':
        this.toggleState();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        const increment = e.key === 'ArrowUp' ? -1 : 1;
        const lis = this.querySelectorAll('li');

        this.activeIndex = this.activeIndex + increment;
        if (this.activeIndex < 0) {
          this.activeIndex = 0;
        } else if (this.activeIndex >= lis.length) {
          this.activeIndex = lis.length - 1;
        }
        lis[this.activeIndex].focus();
        break;
    }
  }

  /**
   * Handles when an option is selected and emits result.
   *
   * @param {HTMLOptionElement} e
   */
  selectOption(e) {
    this.selected = e;
    this.value = e.value;
    this.dispatchEvent(new Event('change'));
    this.toggleState();
  }

  /**
   * Toggles select elemenmt between active and inactive states.
   *
   */
  toggleState() {
    this.active = !this.active;

    if (this.active) {
      document.addEventListener('click', this.clickedInside);
      this.addEventListener('keydown', this.handleKeyDown);
    } else {
      document.removeEventListener('click', this.clickedInside);
      this.removeEventListener('keydown', this.handleKeyDown);
      this.activeIndex = -1;
    }
  }

  render() {
    return html`
      <label
        @click="${this.toggleState}"
        @keypress="${this.toggleState}"
        @keyDown=${this.handleKeyDown}
        tabindex="0"
      >
        ${this.selected?.innerText}
        <span></span>
      </label>
      <ul class="web-select__options">
        ${this.options.map((o) => this.renderOptions(o))}
      </ul>
    `;
  }

  /**
   * Turns option elements into li elements.
   *
   * @param {HTMLOptionElement} o
   * @returns {TemplateResult}
   */
  renderOptions(o) {
    return html`<li
      ?selected=${o === this.selected}
      tabindex="0"
      @click=${() => this.selectOption(o)}
      @keypress=${() => this.selectOption(o)}
    >
      ${o.textContent}
    </li>`;
  }
}

customElements.define('web-select', Select);
