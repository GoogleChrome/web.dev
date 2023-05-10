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
import {html} from 'lit';

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

  _onKeydownPill(e, item) {
    if (e.code !== 'Tab') {
      e.preventDefault();
    }

    if (e.code === 'Enter' || e.code === 'Backspace') {
      removeEntry(item.name, item);
    }
  }

  _onClickPill(item) {
    removeEntry(item.name, item);
  }

  _onClickClearPills() {
    clearFilters();
  }

  render() {
    return [
      this.items.map(
        (item) => html`
          <span
            class="surface color-blue-medium hairline rounded-lg tag-pill type--label display-inline-flex align-center "
            data-name="${item.name}"
            data-value="${item.value}"
            tabindex="0"
            @click="${() => this._onClickPill(item)}"
            @keydown="${(e) => this._onKeydownPill(e, item)}"
          >
            ${item.label}
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 1.0575L9.4425 0L5.25 4.1925L1.0575 0L0 1.0575L4.1925 5.25L0 9.4425L1.0575 10.5L5.25 6.3075L9.4425 10.5L10.5 9.4425L6.3075 5.25L10.5 1.0575Z"
                fill="#3740FF"
              />
            </svg>
          </span>
        `,
      ),
    ];
  }
}

customElements.define('tag-pill-list', TagPillList);
