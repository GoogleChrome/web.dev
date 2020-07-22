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

/**
 * @fileoverview Filters out Q&A's based on `data-category` property.
 */

import {html} from 'lit-html';
import {BaseElement} from '../BaseElement';
import './_styles.scss';

/**
 * @extends {BaseElement}
 * @final
 */
class EventQAndA extends BaseElement {
  static get properties() {
    return {
      selected: {type: String},
    };
  }

  constructor() {
    super();
    this.closeDetail = this.closeDetail.bind(this);
    this.selectCategory = this.selectCategory.bind(this);

    this.childElements = [];
    this.categories = [];
  }

  connectedCallback() {
    super.connectedCallback();

    this.childElements = Array.from(this.children);

    const categories = new Set();
    this.childElements.forEach((element) =>
      categories.add(element.getAttribute('data-category')),
    );
    this.categories = Array.from(categories).map((c) => ({name: c, value: c}));
    this.categories.push({name: 'All categories', value: null});

    this.selected = this.categories[0].value;
    this.addEventListener('click', this.closeDetail);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.closeDetail);
  }

  render() {
    this.filterCategories();

    return html`
      <select
        class="w-select--borderless w-mb--sm"
        @change="${this.selectCategory}"
      >
        ${this.renderOptions()}
      </select>
      ${this.childElements}
    `;
  }

  renderOptions() {
    return this.categories.map((c) =>
      c.value
        ? html`<option value="${c.value}">${c.name}</option>`
        : html`<option value>${c.name}</option>`,
    );
  }

  closeDetail($event) {
    const categoryElement = $event.target.closest('[data-category]');
    if (!categoryElement) {
      return;
    }
    this.childElements.forEach((element) => {
      if (element !== categoryElement) {
        element.open = false;
      }
    });
  }

  selectCategory($event) {
    this.selected = $event.target.value;
  }

  filterCategories() {
    this.childElements.forEach((element) => {
      const show =
        !this.selected ||
        element.getAttribute('data-category') === this.selected;
      element.classList.toggle('hidden', !show);
    });
  }
}

customElements.define('web-event-q-and-a', EventQAndA);
