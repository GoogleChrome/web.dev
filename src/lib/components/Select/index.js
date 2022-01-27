import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';

const keyReg = new RegExp('^(Key|Digit|Numpad)', 'i');

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
    /** If select element is open. */
    this.active = false;
    /** The index of the currently selected option. */
    this.activeIndex = -1;
    /**
     * Keeps track of first emit.
     * Designed to prevent premature emission.
     */
    this.firstEmit = true;
    /** The index of the currently focused option. */
    this.focusedIndex = -1;
    /**
     * An array of all options.
     * @type {HTMLOptionElement[]}
     */
    this.options = [];
    /**
     * An currently selected option.
     * @type HTMLOptionElement
     */
    this.selected = null;
    /**
     * The value of the currently selected option.
     * @type string
     */
    this.value = null;

    this.clickedInside = this.clickedInside.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    const select = this.querySelector('select');
    this.options = /** @type {HTMLOptionElement[]} */ (
      Array.from(select.children).filter((e) => e.nodeName === 'OPTION')
    );
    this.selectByOption(
      this.options.find((e) => e.selected) || this.options[0],
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.clickedInside);
  }

  /**
   * Closes drop down if user clicks outside of dropdown.
   *
   * @param {MouseEvent} e
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
   * Handles keyboard events on combobox (label)
   *
   * @param {KeyboardEvent} e
   */
  comboboxEvent(e) {
    if (this.active) {
      return;
    }
    switch (e.code) {
      case 'ArrowDown':
        this.selectByIndex(this.activeIndex + 1);
        break;
      case 'ArrowUp':
        this.selectByIndex(this.activeIndex - 1);
        break;
      case 'Enter':
      case 'Space':
        this.toggleState();
        break;
      case 'Home':
        this.selectByIndex(0);
        break;
      case 'End':
        this.selectByIndex(this.options.length - 1);
        break;
      default:
        if (keyReg.test(e.code)) {
          const key = String(e.key).toLowerCase();
          const index = this.options.findIndex((e) =>
            e.innerText.toLowerCase().startsWith(key),
          );
          if (index >= 0) {
            this.selectByIndex(index);
          }
        }
        break;
    }
  }

  /**
   * Focuses on option element by index.
   *
   * @param {number} i
   */
  focusByIndex(i) {
    if (this.active) {
      if (i < 0) {
        i = 0;
      } else if (i >= this.options.length) {
        i = this.options.length - 1;
      }
      const lis = this.querySelectorAll('li');
      lis[i].focus();
      this.focusedIndex = i;
    }
  }

  /**
   * Handles keyboard events on listbox (ul).
   *
   * @param {KeyboardEvent} e
   */
  listboxEvent(e) {
    if (!this.active) {
      return;
    }
    switch (e.code) {
      case 'Enter':
      case 'Tab':
      case 'Escape':
        this.selectByIndex(this.focusedIndex);
        const label = this.querySelector('label');
        if (label) {
          label.focus();
        }
        break;
      case 'ArrowDown':
        this.focusByIndex(this.focusedIndex + 1);
        break;
      case 'ArrowUp':
        this.focusByIndex(this.focusedIndex - 1);
        break;
      case 'Home':
      case 'PageUp':
        this.focusByIndex(0);
        break;
      case 'End':
      case 'PageDown':
        this.focusByIndex(this.options.length - 1);
        break;
      default:
        if (keyReg.test(e.code)) {
          const key = String(e.key).toLowerCase();
          const index = this.options.findIndex((e) =>
            e.innerText.toLowerCase().startsWith(key),
          );
          if (index >= 0) {
            this.focusByIndex(index);
          }
        }
        break;
    }
  }

  /**
   * Selects option by index and emits result.
   *
   * @param {number} i
   */
  selectByIndex(i) {
    if (i < 0) {
      i = 0;
    } else if (i >= this.options.length) {
      i = this.options.length - 1;
    }
    this.selectByOption(this.options[i]);
  }

  /**
   * Selects option by element and emits result.
   *
   * @param {HTMLOptionElement} e
   */
  selectByOption(e) {
    this.selected = e;
    this.activeIndex = this.options.findIndex((v) => v === e);
    this.value = e.value;
    if (!this.firstEmit) {
      this.dispatchEvent(new Event('change'));
    }
    if (this.active) {
      this.toggleState();
    }
    this.firstEmit = false;
  }

  /**
   * Toggles select elemenmt between active and inactive states.
   */
  toggleState() {
    this.active = !this.active;

    if (this.active) {
      this.focusByIndex(this.activeIndex);
      document.addEventListener('click', this.clickedInside);
    } else {
      document.removeEventListener('click', this.clickedInside);
    }
  }

  render() {
    return html`
      <label
        @click=${this.toggleState}
        @keydown=${this.comboboxEvent}
        tabindex="0"
      >
        <span>${this.selected?.innerText}</span>
      </label>
      <ul class="web-select__options" @keydown=${this.listboxEvent}>
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
    // eslint-disable-next-line lit-a11y/click-events-have-key-events
    return html`<li
      ?selected=${o === this.selected}
      tabindex="0"
      @click="${() => this.selectByOption(o)}"
    >
      ${o.textContent}
    </li>`;
  }
}

customElements.define('web-select', Select);
