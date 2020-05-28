/*
 * Copyright 2019 Google LLC
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
 * @fileoverview A select for choosing language option.
 */

import {html} from 'lit-element';
import {BaseElement} from '../BaseElement';
import {store} from '../../store';
import {setLocale, checkUserPreferredLocale} from '../../actions';

class LanguageSelect extends BaseElement {
  static get properties() {
    return {
      userPreferredLocale: {type: String},
    };
  }

  constructor() {
    super();
    this.onStateChanged = this.onStateChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    checkUserPreferredLocale();
    store.subscribe(this.onStateChanged);
    this.onStateChanged();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    store.unsubscribe(this.onStateChanged);
  }

  onStateChanged() {
    const state = store.getState();
    this.userPreferredLocale = state.userPreferredLocale;
  }

  onSelect(e) {
    setLocale(e.target.value);
  }

  renderOption(locale) {
    return this.userPreferredLocale === locale
      ? html`
          <option value="${locale}" selected>${locale}</option>
        `
      : html`
          <option value="${locale}">${locale}</option>
        `;
  }

  render() {
    return html`
      <div class="w-display-flex">
        <label class="w-visually-hidden" for="preferred-language">
          Choose language
        </label>
        <select id="preferred-language" @change=${this.onSelect}>
          ${['en', 'pl'].map((locale) => this.renderOption(locale))}
        </select>
      </div>
    `;
  }
}

customElements.define('web-language-select', LanguageSelect);
