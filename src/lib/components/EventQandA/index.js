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
    this.categories = Array.from(categories);

    this.addEventListener('click', this.closeDetail);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.closeDetail);
  }

  render() {
    return html`
      <select
        class="w-select--borderless w-mb--sm"
        @change="${this.selectCategory}"
      >
        <option value>All categories</option>
        ${this.categories.map((c) => html`<option value="${c}">${c}</option>`)}
      </select>
      ${this.childElements}
    `;
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
    this.childElements.forEach((element) => {
      const show =
        !$event.target.value ||
        element.getAttribute('data-category') === $event.target.value;
      element.classList.toggle('hidden', !show);
    });
  }
}

customElements.define('web-event-q-and-a', EventQAndA);
