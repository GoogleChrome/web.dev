/*
 * Copyright 2020 Google LLC
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

const {html} = require('common-tags');

/* eslint-disable require-jsdoc,indent,max-len */

/**
 * Checkbox used to forms.
 * @param {Object} arg Data for the checkbox.
 */
class Checkbox {
  constructor({id, name, label, value, required = false}) {
    this.id = id;
    this.name = name;
    this.label = label;
    this.value = value;
    this.required = required;
  }

  render() {
    return html`
      <label for="${this.id}" class="w-checkbox__label">
        <input
          id="${this.id}"
          name="${this.name}"
          ${this.required && 'required'}
          ${this.value && `value="${this.value}"`}
          class="w-checkbox__input"
          type="checkbox"
        />
        <span>${this.label}</span>
      </label>
    `;
  }
}

module.exports = (args) => new Checkbox(args).render();
