/*
 * Copyright 2023 Google LLC
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
 * @fileoverview handles the events for a modal containing filters
 */
import {BaseElement} from '../BaseElement';

import {store} from '../../store';
import {clearFilters} from '../../actions';

export class FilterModal extends BaseElement {
  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(this.onStoreUpdate.bind(this));
    this.addEventListener('click', this.onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.onClick);
  }

  onClick(event) {
    const target = event.target;

    // Open menu button
    if (target.classList.contains('filter-modal__opener')) {
      /** @type {HTMLDialogElement|null} */
      const dialog = document.querySelector('#filter-modal');
      if (dialog) {
        dialog.showModal();
      }
    }

    // Filters reset
    if (target.id === 'filter-modal__reset') {
      this.resetFilters();
    }

    // Filters
    if (target.id === 'filter-modal__done' || target.nodeName === 'DIALOG') {
      /** @type {HTMLDialogElement|null} */
      const dialog = document.querySelector('#filter-modal');
      if (dialog) {
        dialog.close();
      }
    }
  }

  resetFilters() {
    clearFilters();
  }

  onStoreUpdate(state) {
    const filters = state.filters || {};
    const items = [];
    for (const [name, entries] of Object.entries(filters)) {
      for (const item of entries) {
        items.push({
          name: name,
          value: item.value,
          label: item.label,
        });
      }
    }
    this.items = items;
  }
}

customElements.define('filter-modal', FilterModal);
