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
import {BaseStateElement} from '../BaseStateElement';
import {setLanguage} from '../../actions';
import lang from '../../utils/language';

class LanguageSelect extends BaseStateElement {
  static get properties() {
    return {
      current: {type: String},
    };
  }

  onStateChanged({currentLanguage}) {
    this.current = currentLanguage;
  }

  onChange(e) {
    setLanguage(e.target.value);
  }

  renderOption(language) {
    let languageName = lang.languageNames[language];
    if (!languageName) {
      return '';
    }
    languageName = languageName.toUpperCase();
    return this.current === language
      ? html`
          <option value="${language}" selected>
            ${languageName} (${language})
          </option>
        `
      : html`
          <option value="${language}">${languageName} (${language})</option>
        `;
  }

  render() {
    const langList = lang.supportedLanguages;
    return html`
      <div class="w-display-flex">
        <label class="w-visually-hidden" for="preferred-language">
          Choose language
        </label>
        <select id="preferred-language" @change=${this.onChange}>
          ${langList.map((language) => this.renderOption(language))}
        </select>
      </div>
    `;
  }
}

customElements.define('web-language-select', LanguageSelect);
