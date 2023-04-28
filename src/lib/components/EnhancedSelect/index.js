/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Progressively enhances the select element. Supports
 * both single and multi select.
 */
import {BaseElement} from '../BaseElement';
import {html} from 'lit-element';
import {generateIdSalt} from '../../utils/generate-salt';

import {store} from '../../store';
import {setFilter} from '../../actions';

const keyReg = new RegExp('^(Key|Digit|Numpad)', 'i');

export class EnhancedSelect extends BaseElement {
  static get formAssociated() {
    return true;
  }

  constructor() {
    super();

    try {
      // @ts-ignore
      this.internals = this.attachInternals();
    } catch (e) {
      console.warn('ElementInternals not supported');
    }

    this.handleLabelClick = this.handleLabelClick.bind(this);
    this.handleLabelKeydown = this.handleLabelKeydown.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleListKeydown = this.handleListKeydown.bind(this);

    this.classList.add('enhanced-select');

    const nativeSelect = this._getSelect();

    this.name = this.name || this._getName(nativeSelect);
    this.multiple = this.multiple || nativeSelect.hasAttribute('multiple');
    this.label = '';
    this.fixedLabel = false;
    this.options = this._getOptions();
    this._dropdownId = this._generateId('dropdown');
    this._labelId = this._generateId('label');
    this._elements = {};
    this.focusedIndex = -1;

    this.setValue(this.getSelectedValues());
  }

  static get properties() {
    return {
      name: {type: String, reflect: true},
      label: {type: String, reflect: true},
      value: {type: Array, reflect: true},
      open: {type: Boolean, reflect: true},
      multiple: {type: Boolean, reflect: true},
      options: {type: Array, reflect: false},
      fixedLabel: {type: Boolean, reflect: true},
    };
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);
    this._elements.label = this.querySelector(`#${this._labelId}`);
    this._elements.list = this.querySelector(`#${this._dropdownId}`);
    this._elements.listItems = this.querySelector(`#${this._dropdownId} li`);

    this.addEventListener('focusout', this.handleFocusOut);
  }

  get displayLabel() {
    // @ts-ignore
    if (this.value.length === 0 || this.fixedLabel) return this.label;

    if (this.multiple) {
      // @ts-ignore
      return `${this.value.length} items selected`;
    }

    // @ts-ignore
    return this.options.find((option) => option.value === this.value[0]).label;
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(this.onStoreUpdate.bind(this));
  }

  /**
   * Checks if the app state contains entries for this select, and if so
   * sets the value to the entries.
   * @param {*} state
   */
  onStoreUpdate(state) {
    const filters = state.filters || {};
    const entries = filters[this.name] || [];
    this.setValue(entries.map((entry) => entry.value));
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('focusout', this.handleFocusOut);

    this._elements.label.removeEventListener('click', this.handleLabelClick);
    this._elements.label.removeEventListener(
      'keydown',
      this.handleLabelKeydown,
    );
    Array.from(this._elements.listItems).forEach((item) =>
      item.removeEventListener('click', this.handleSelection),
    );
    this._elements.list.removeEventListener('keydown', this.handleSelection);
  }

  /**
   * @param {String[]} value
   */
  setValue(value) {
    this.value = value;

    this.options.forEach((o) => (o.selected = value.includes(o.value)));

    const data = new FormData();

    value.forEach((value) => data.append(this.name, value));

    // ElementInternals are not yet supported in Safari, but would
    // also only be used in a <form> context, where we currently
    // don't use it.
    if (this.internals) {
      this.internals.setFormValue(data);
    }

    this.dispatchEvent(new Event('change', {bubbles: true, cancelable: true}));
  }

  render() {
    return html`
      <div
        class="enhanced-select__wrapper display-flex align-center"
        ?open="${this.open}"
      >
        <label
          id="${this._labelId}"
          class="display-flex align-center justify-content-between"
          aria-controls="${this._dropdownId}"
          tabindex="0"
          @click="${this.handleLabelClick}"
          @keydown="${this.handleLabelKeydown}"
        >
          <span>${this.displayLabel}</span
          ><svg
            width="10"
            height="5"
            viewBox="0 0 10 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0L5 5L10 0L0 0Z" fill="currentColor" />
          </svg>
        </label>

        <ul
          id="${this._dropdownId}"
          class="enhanced-select__options"
          @keydown="${this.handleListKeydown}"
        >
          ${this.options.map((option) => {
            const selected = this.value?.includes(option.value);

            return html`
              <li
                class="button width-full gap-bottom-100 display-flex align-center justify-content-between"
                id="${option.id}"
                tabindex="0"
                @click="${this.handleSelection}"
                ?selected="${selected}"
              >
                ${option.label}
                ${this.multiple && selected
                  ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>'
                  : ''}
              </li>
            `;
          })}
        </ul>
      </div>
    `;
  }

  /**
   * @param {HTMLSelectElement} nativeSelect
   * @returns {string}
   * @private
   */
  _getName(nativeSelect) {
    if (!nativeSelect.hasAttribute('name')) {
      throw new Error('Missing attribute: name');
    }

    // @ts-ignore
    return nativeSelect.getAttribute('name');
  }

  /**
   * @returns {HTMLSelectElement}
   * @private
   */
  _getSelect() {
    const element = this.querySelector('select');

    if (!element || !element.firstChild) {
      throw new Error('Missing element: select');
    }

    return element;
  }

  /**
   * @returns {{id:string, label: string, value: string, selected: boolean}[]}
   * @private
   */
  _getOptions() {
    const elements = this.querySelectorAll('option');

    if (elements.length === 0) {
      throw new Error('Missing element: option');
    }

    return Array.from(elements).map((option, index) => ({
      id: option.id || this._generateId(`option-${index}`),
      label: option.label,
      value: option.value,
      selected: option.hasAttribute('selected'),
    }));
  }

  /**
   * @param {string} element
   * @returns {string}
   * @private
   */
  _generateId(element) {
    const prefix = `enhanced-select-${element}`;

    return `${prefix}-${generateIdSalt(prefix)}`;
  }

  handleLabelClick() {
    this.toggleOpen();
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleLabelKeydown(e) {
    if (e.code !== 'Tab') {
      e.preventDefault();
    }

    switch (e.code) {
      case 'Enter':
      case 'Escape':
        this.toggleOpen();
        break;
      case 'ArrowDown':
        this.focusByIndex(this.focusedIndex + 1);
        break;
      case 'Tab':
        if (this.open) {
          this.focusedIndex = 0;
        }
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
          this.focusByEventKey(e.key);
        }
        break;
    }
  }

  /**
   * @param {FocusEvent} e
   */
  handleFocusOut(e) {
    // @ts-ignore
    if (this.contains(e.relatedTarget)) return;

    this.open = false;
  }

  /**
   * @param {MouseEvent} e
   */
  handleSelection(e) {
    e.preventDefault();

    // @ts-ignore
    const id = e.target.closest('li').getAttribute('id') || null;

    const option = this.options.find((option) => id === option.id);

    if (!option) {
      throw new Error(`Missing option: ${id}`);
    }

    this.selectOption(option);
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleListKeydown(e) {
    if (!this.open) {
      return;
    }

    if (e.code !== 'Tab') {
      e.preventDefault();
    }

    switch (e.code) {
      case 'Enter':
      case 'Escape':
        this.selectByIndex(this.focusedIndex);
        break;
      case 'ArrowDown':
        this.focusByIndex(this.focusedIndex + 1);
        break;
      case 'ArrowUp':
        this.focusByIndex(this.focusedIndex - 1);
        break;
      case 'Tab':
        this.incrementFocus();
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
          this.focusByEventKey(e.key);
        }
        break;
    }
  }

  /**
   * @param {String} eventKey
   */
  focusByEventKey(eventKey) {
    const normalized = String(eventKey).toLowerCase();

    const index = this.options.findIndex((option) =>
      option.label.toLowerCase().startsWith(normalized),
    );

    if (index === -1) {
      return;
    }

    this.focusByIndex(index);
  }

  toggleOpen() {
    this.open = !this.open;
  }

  /**
   * @param {number} i
   */
  focusByIndex(i) {
    if (this.open) {
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

  incrementFocus() {
    const newValue = this.focusedIndex + 1;

    if (newValue > this.options.length - 1) return;

    this.focusedIndex = newValue;
  }

  /**
   * Selects option by index and emits result.
   *
   * @param {number} i
   */
  selectByIndex(i) {
    if (i < 0) {
      i = 0;
    }

    if (i >= this.options.length) {
      i = this.options.length - 1;
    }

    this.selectOption(this.options[i]);
  }

  /**
   * @param {{id:string, label: string, value: string, selected: boolean}} option
   */
  selectOption(option) {
    if (this.multiple) {
      this.setValue(
        this.options
          .filter((o) => (o === option ? !o.selected : o.selected))
          .map((o) => o.value),
      );
    } else {
      this.setValue([option.value]);
    }

    setFilter(
      this.name,
      this.options.filter((o) => o.selected),
    );
    this.open = this.multiple;
  }

  /**
   * @returns {String[]}
   */
  getSelectedValues() {
    return this.options.filter((o) => o.selected).map((o) => o.value);
  }
}

customElements.define('enhanced-select', EnhancedSelect);
