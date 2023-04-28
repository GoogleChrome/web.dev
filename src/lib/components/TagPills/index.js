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
 * @fileoverview Given a key-value array, renders
 * a list of tag-pills
 */
import {BaseElement} from '../BaseElement';
import {html} from 'lit-element';

import {store} from '../../store';
import {removeEntry, clearFilters} from '../../actions';

export class TagPillList extends BaseElement {
  static get properties() {
    return {
      items: {type: Array, reflect: true},
    };
  }

  constructor() {
    super();
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(this.onStoreUpdate.bind(this));
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

  _onClickPill(item) {
    removeEntry(item.name, item);
  }

  _onClickClearPills() {
    clearFilters();
  }

  render() {
    return [
      this.items.length > 0
        ? html`
            <span
              class="clear-filters tag-pill surface color-blue-medium hairline type--label display-inline-flex align-center"
              @click="${() => this._onClickClearPills()}"
            >
              Clear filters
            </span>
          `
        : '',
      this.items.map(
        (item) => html`
          <span
            class="surface color-blue-medium hairline rounded-lg tag-pill type--label display-inline-flex align-center "
            data-name="${item.name}"
            data-value="${item.value}"
            @click="${() => this._onClickPill(item)}"
          >
            ${item.label}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              />
            </svg>
          </span>
        `,
      ),
    ];
  }
}

customElements.define('tag-pill-list', TagPillList);
